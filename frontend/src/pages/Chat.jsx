import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import {
  Send, Mic, Plus,
  ChevronLeft, Bot,
  CheckCircle, AlertCircle,
  MessageSquare, Sparkles, Paperclip
} from 'lucide-react'

import { useLocalHistory } from '../hooks/useLocalHistory'
import ChatHistoryItem from '../components/ChatHistoryItem'
import MessageBubble   from '../components/MessageBubble'
import LoadingSpinner  from '../components/LoadingSpinner'
import Layout          from '../components/Layout'

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000'

// Suggested quick-start prompts shown when chat is empty
const SYMPTOM_CHIPS = [
  '😴 I feel tired all the time',
  '🤧 Runny nose and sore throat',
  '💊 Frequent headaches',
  '🫀 Chest tightness',
  '🌡️ I have a fever',
  '🤢 Nausea after eating',
]

// ── Toast Notification ──
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 60, scale: 0.9 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3
                  px-6 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold
                  ${type === 'success' ? 'bg-[#6C63FF]' : 'bg-[#D9534F]'}`}
    >
      {type === 'success' ? <CheckCircle size={17} /> : <AlertCircle size={17} />}
      {message}
    </motion.div>
  )
}

// ── Typing Indicator ──
function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="w-10 h-10 rounded-2xl bg-[#6C63FF]/10 flex items-center justify-center flex-shrink-0">
        <Bot size={18} className="text-[#6C63FF]" />
      </div>
      <div className="flex items-center gap-1.5 px-5 py-3.5 bg-[#6C63FF] text-white rounded-3xl rounded-bl-none shadow-md">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.55, delay: i * 0.14, repeat: Infinity }}
            className="w-2 h-2 bg-white rounded-full"
          />
        ))}
      </div>
    </div>
  )
}

// ── Main Chat Component ──
export default function Chat() {
  const [messages, setMessages] = useState([{
    role: 'bot',
    text: "👋 Hello! I'm your AI Health Assistant. Describe your symptoms and I'll help with awareness. Always consult a doctor for diagnosis.",
    timestamp: new Date().toISOString()
  }])
  const [input, setInput]                     = useState('')
  const [loading, setLoading]                 = useState(false)
  const [sessionLoading, setSessionLoading]   = useState(false)
  const [sidebarOpen, setSidebarOpen]         = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()

  const {
    chatHistory,
    createSession,
    addMessage,
    renameSession,
    deleteSession,
    getSession
  } = useLocalHistory()

  const [activeSessionId, setActiveSessionId] = useState(location.state?.sessionId || null)
  const [activeSessionMeta, setActiveSessionMeta] = useState(null)
  const [toast, setToast]                     = useState(null)

  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  // ── Scroll to bottom ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ── Load session when activeSessionId changes ──
  useEffect(() => {
    if (!activeSessionId) return
    loadChatSession(activeSessionId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId])

  // ── Handle Pre-filled Messages from Home page cards ──
  useEffect(() => {
    const state = location.state
    if (!state) return

    if (state.welcomeOverride) {
      setMessages([{ role: 'bot', text: state.welcomeOverride, timestamp: new Date().toISOString() }])
      if (state.prefillInput) setInput(state.prefillInput)
    } else if (state.autoSend && state.autoSendMessage) {
      setMessages([{ role: 'bot', text: "👋 Hello! I'm your AI Health Assistant. Let me help you with that...", timestamp: new Date().toISOString() }])
      setTimeout(() => sendMessageWithText(state.autoSendMessage), 600)
    } else if (state.initialMessage) {
      setInput(state.initialMessage)
      setTimeout(() => sendMessageWithText(state.initialMessage), 500)
    }

    window.history.replaceState({}, document.title)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Load a past session ──
  const loadChatSession = (sessionId) => {
    setSessionLoading(true)
    const session = getSession(sessionId)
    if (session) {
      setMessages(session.messages)
      setActiveSessionMeta({ title: session.title, createdAt: session.createdAt, messages: session.messages })
    } else {
      setToast({ message: 'Session not found.', type: 'error' })
      startNewChat()
    }
    setSessionLoading(false)
  }

  // ── New Chat ──
  const startNewChat = () => {
    setMessages([{ role: 'bot', text: "👋 New chat started! Describe your symptoms and I'll help with awareness.", timestamp: new Date().toISOString() }])
    setActiveSessionId(null)
    setActiveSessionMeta(null)
    setInput('')
  }

  // ── Core send logic ──
  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || sessionLoading) return
    setInput('')
    setLoading(true)
    const userMsg = { role: 'user', text: trimmed, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])

    try {
      const token = localStorage.getItem('auth_token')
      const res = await axios.post(
        `${API}/api/chats`,
        { message: trimmed },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const botMsg = { role: 'bot', text: res.data.answer, timestamp: new Date().toISOString() }
      setMessages(prev => [...prev, botMsg])
      if (!activeSessionId) {
        const newId = createSession(trimmed, res.data.answer)
        setActiveSessionId(newId)
      } else {
        addMessage(activeSessionId, trimmed, res.data.answer)
      }
    } catch (err) {
      const errText = err.response?.data?.error === 'invalid_input'
        ? '⚠️ Please describe symptoms more clearly. Example: "I have fever and body pain"'
        : '⚠️ Could not connect to AI. Make sure the backend is running!'
      setMessages(prev => [...prev, { role: 'bot', text: errText, timestamp: new Date().toISOString() }])
    }
    setLoading(false)
  }

  // ── Send with pre-filled text ──
  const sendMessageWithText = async (text) => {
    if (!text?.trim()) return
    const userMsg = { role: 'user', text, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      const res = await axios.post(
        `${API}/api/chats`,
        { message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const botMsg = { role: 'bot', text: res.data.answer, timestamp: new Date().toISOString() }
      setMessages(prev => [...prev, botMsg])
      if (!activeSessionId) {
        const newId = createSession(text, res.data.answer)
        setActiveSessionId(newId)
      } else {
        addMessage(activeSessionId, text, res.data.answer)
      }
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: '⚠️ Could not connect to AI.', timestamp: new Date().toISOString() }])
    }
    setLoading(false)
  }

  // ── Chip click → prefill input and focus ──
  const handleChipClick = (chip) => {
    const text = chip.replace(/^[\p{Emoji}\s]+/u, '').trim()
    setInput(text)
    textareaRef.current?.focus()
  }

  // ── Prompt click from MessageBubble follow-up buttons ──
  const handlePromptClick = (text) => {
    sendMessageWithText(text)
  }

  // ── History handlers ──
  const onRenameChat = (sessionId, newTitle) => renameSession(sessionId, newTitle)
  const onDeleteChat = (sessionId) => {
    deleteSession(sessionId)
    if (activeSessionId === sessionId) startNewChat()
  }

  const isOnlyWelcome = messages.length === 1 && messages[0].role === 'bot'

  return (
    <Layout>
      <div className="flex-1 flex overflow-hidden bg-[var(--page-bg)] transition-colors duration-300">

        {/* Mobile backdrop overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ════ CHAT HISTORY SIDEBAR ════ */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 768) && (
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed md:relative z-40 w-72 h-full
                         bg-white dark:bg-[#13131f] border-r border-slate-200/80 dark:border-white/[0.06]
                         flex flex-col shadow-xl md:shadow-none transition-colors duration-300"
            >
              {/* Sidebar Top */}
              <div className="p-4 border-b border-slate-100 dark:border-white/[0.06]">
                <button
                  onClick={() => navigate('/home')}
                  className="flex items-center gap-2 text-[#6C63FF] hover:text-[#4338CA] text-sm font-semibold mb-4 transition"
                >
                  <ChevronLeft size={16} /> Back to Home
                </button>
                <button
                  onClick={startNewChat}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                             bg-[#6C63FF] hover:bg-[#4338CA] text-white text-sm font-bold
                             rounded-xl transition hover:scale-[1.02] active:scale-[0.98] shadow-md"
                >
                  <Plus size={16} /> New Chat
                </button>
              </div>

              {/* History List */}
              <div className="flex-1 overflow-y-auto p-3">
                <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-2">
                  Recent Conversations
                </p>

                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <div className="w-14 h-14 bg-[#6C63FF]/8 dark:bg-[#6C63FF]/10 rounded-2xl flex items-center justify-center mb-4">
                      <MessageSquare size={22} className="text-[#6C63FF]/60" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No chats yet</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Start your first health conversation above</p>
                  </div>
                ) : (
                  chatHistory.map(chat => (
                    <ChatHistoryItem
                      key={chat.sessionId}
                      chat={chat}
                      isActive={activeSessionId === chat.sessionId}
                      onClick={() => {
                        setActiveSessionId(chat.sessionId)
                        setSidebarOpen(false)
                      }}
                      onRenameChat={onRenameChat}
                      onDeleteChat={onDeleteChat}
                    />
                  ))
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ════ MAIN CHAT AREA ════ */}
        <div className="flex-1 flex flex-col h-full min-w-0">

          {/* Chat Header */}
          <div className="bg-white dark:bg-[#13131f] border-b border-slate-200/80 dark:border-white/[0.06]
                          px-4 sm:px-6 py-3.5
                          flex items-center gap-3 flex-shrink-0 shadow-sm transition-colors duration-300">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.06]
                         hover:bg-slate-200 dark:hover:bg-white/10
                         flex items-center justify-center transition"
            >
              <MessageSquare size={16} className="text-[#6C63FF]" />
            </button>

            {/* Bot avatar */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#7C3AED]
                            flex items-center justify-center shadow-md flex-shrink-0">
              <Bot size={20} className="text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">
                {activeSessionMeta?.title || 'HealthBeacon AI Assistant'}
              </p>
              <p className="text-[11px] text-[#6C63FF] flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 bg-[#6C63FF] rounded-full inline-block animate-pulse" />
                {sessionLoading ? 'Loading session...' : 'Online · Medical AI'}
              </p>
            </div>

            {/* Sparkle badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] px-3 py-1.5 rounded-full">
              <Sparkles size={12} />
              <span className="text-[11px] font-bold">AI Powered</span>
            </div>
          </div>

          {/* ── Messages area ── */}
          <div className="flex-1 overflow-y-auto">
            {sessionLoading ? (
              <div className="h-full flex">
                <LoadingSpinner message="Loading your previous conversation..." />
              </div>
            ) : (
              <div className="px-4 sm:px-6 py-6 space-y-5 max-w-4xl mx-auto w-full">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <MessageBubble
                      key={i}
                      msg={msg}
                      index={i}
                      onPromptClick={handlePromptClick}
                    />
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {loading && <TypingIndicator />}

                {/* ── Symptom Chips — shown only on empty new chat ── */}
                {isOnlyWelcome && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-2"
                  >
                    <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                      Quick Start — tap a symptom below:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SYMPTOM_CHIPS.map((chip, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleChipClick(chip)}
                          className="px-4 py-2.5 bg-white dark:bg-[#1a1a2e]
                                     border border-slate-200 dark:border-white/[0.08]
                                     hover:border-[#6C63FF] hover:bg-[#6C63FF]/5
                                     text-slate-700 dark:text-slate-300 hover:text-[#6C63FF]
                                     text-xs font-bold rounded-full shadow-sm transition"
                        >
                          {chip}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* ── Premium Input Bar ── */}
          <div
            className="bg-white dark:bg-[#13131f] border-t border-slate-200/80 dark:border-white/[0.06]
                       px-4 sm:px-6 py-4 flex-shrink-0 shadow-lg transition-colors duration-300"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            {/* Input wrapper */}
            <div className="max-w-4xl mx-auto w-full">
              <div className="flex items-end gap-3 bg-slate-50 dark:bg-[#1a1a2e]
                              border border-slate-200 dark:border-white/[0.08]
                              hover:border-slate-300 dark:hover:border-white/[0.15]
                              focus-within:border-[#6C63FF] dark:focus-within:border-[#6C63FF]
                              focus-within:ring-2 focus-within:ring-[#6C63FF]/15
                              rounded-2xl px-4 py-3 transition-all duration-200 shadow-sm">

                {/* File attach mock button */}
                <button
                  title="Attach file (coming soon)"
                  className="text-slate-400 hover:text-[#6C63FF] transition flex-shrink-0 p-1 rounded-lg hover:bg-[#6C63FF]/8"
                >
                  <Paperclip size={18} />
                </button>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder={sessionLoading ? 'Loading conversation...' : 'Describe your symptoms or ask a health question...'}
                  disabled={sessionLoading}
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200
                             placeholder-slate-400 dark:placeholder-slate-500
                             outline-none resize-none
                             max-h-32 disabled:opacity-50 py-1 leading-relaxed"
                />

                {/* Voice mock button */}
                <button
                  title="Voice input (coming soon)"
                  className="text-slate-400 hover:text-[#6C63FF] transition flex-shrink-0 p-1 rounded-lg hover:bg-[#6C63FF]/8"
                >
                  <Mic size={18} />
                </button>

                {/* Send button */}
                <motion.button
                  whileHover={{ scale: input.trim() ? 1.08 : 1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={sendMessage}
                  disabled={sessionLoading || !input.trim()}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center
                              flex-shrink-0 transition-all duration-200
                              ${input.trim() && !sessionLoading
                                ? 'bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/25 hover:bg-[#4338CA]'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'}`}
                >
                  <Send size={16} />
                </motion.button>
              </div>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-2.5 font-medium">
                For awareness only · Always consult a qualified healthcare professional
              </p>
            </div>
          </div>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}
