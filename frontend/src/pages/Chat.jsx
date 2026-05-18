import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Send, Paperclip, Mic, Plus,
  Activity, ChevronLeft, Bot,
  Trash2, CheckCircle, AlertCircle,
  MessageSquare, Settings
} from 'lucide-react'

import { useLocalHistory } from '../hooks/useLocalHistory'

import ChatHistoryItem from '../components/ChatHistoryItem'
import MessageBubble   from '../components/MessageBubble'
import LoadingSpinner  from '../components/LoadingSpinner'
import SessionHeader   from '../components/SessionHeader'

const API = 'http://localhost:5000'

// ── Toast ──
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 
                  px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium
                  ${type === 'success' ? 'bg-health-500' : 'bg-red-500'}`}
    >
      {type === 'success'
        ? <CheckCircle size={18} />
        : <AlertCircle size={18} />}
      {message}
    </motion.div>
  )
}

// ── Typing indicator ──
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 bg-primary-100 rounded-full 
                      flex items-center justify-center flex-shrink-0">
        <Bot size={14} className="text-primary-600" />
      </div>
      <div className="flex items-center gap-1 px-4 py-3 bg-white border 
                      border-slate-100 shadow-sm rounded-2xl rounded-bl-none">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
            className="w-2 h-2 bg-slate-400 rounded-full"
          />
        ))}
      </div>
    </div>
  )
}

// ── Main Chat Component ──
export default function Chat() {
  const [messages, setMessages]               = useState([{
    role: 'bot',
    text: "👋 Hello! I'm your AI Health Assistant. Describe your symptoms and I'll help with awareness. Always consult a doctor for diagnosis."
  }])
  const [input, setInput]                     = useState('')
  const [loading, setLoading]                 = useState(false)
  const [sessionLoading, setSessionLoading]   = useState(false)  // loading old session
  const [sidebarOpen, setSidebarOpen]         = useState(false)
  const {
    chatHistory,
    createSession,
    addMessage,
    renameSession,
    deleteSession,
    getSession
  } = useLocalHistory()
  const [activeSessionId, setActiveSessionId] = useState(null)   // ← active session
  const [activeSessionMeta, setActiveSessionMeta] = useState(null)
  const [toast, setToast]                     = useState(null)
  const [isNewChat, setIsNewChat]             = useState(true)   // true = fresh chat

  const bottomRef = useRef(null)
  const navigate  = useNavigate()

  // ── Scroll to bottom ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ── Load session when activeSessionId changes ──
  useEffect(() => {
    if (!activeSessionId) return
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadChatSession(activeSessionId)
  }, [activeSessionId])

  // ── Load a past session into the chat window ──
  const loadChatSession = (sessionId) => {
    setSessionLoading(true)
    setIsNewChat(false)

    const session = getSession(sessionId)  // reads from localStorage

    if (session) {
      setMessages(session.messages)
      setActiveSessionMeta({
        title:     session.title,
        createdAt: session.createdAt,
        messages:  session.messages
      })
    } else {
      setToast({ message: 'Session not found.', type: 'error' })
      startNewChat()
    }

    setSessionLoading(false)
  }

  // ── Start a brand new chat ──
  const startNewChat = () => {
    setMessages([{
      role: 'bot',
      text: "👋 New chat started! Describe your symptoms and I'll help with awareness."
    }])
    setActiveSessionId(null)
    setActiveSessionMeta(null)
    setIsNewChat(true)
    setInput('')
  }

  // ── Send message ──
  const sendMessage = async () => {
    if (!input.trim() || sessionLoading) return

    const userText = input
    setInput('')
    setLoading(true)

    // Optimistically show user message
    const userMsg = { role: 'user', text: userText, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])

    try {
      const res = await axios.post(`${API}/api/chats`, { message: userText })
      const botText = res.data.answer

      const botMsg = { role: 'bot', text: botText, timestamp: new Date().toISOString() }
      setMessages(prev => [...prev, botMsg])

      if (!activeSessionId) {
        // First message — create new local session
        const newId = createSession(userText, botText)
        setActiveSessionId(newId)
      } else {
        // Add to existing local session
        addMessage(activeSessionId, userText, botText)
      }

    } catch (err) {
      const errText = err.response?.data?.error === 'invalid_input'
        ? '⚠️ Please describe symptoms more clearly. Example: "I have fever and body pain"'
        : '⚠️ Could not connect to AI. Make sure the backend is running!'

      setMessages(prev => [...prev, { role: 'bot', text: errText }])
    }

    setLoading(false)
  }

  // ── Rename chat (optimistic) ──
  const onRenameChat = (sessionId, newTitle) => {
    renameSession(sessionId, newTitle)  // updates localStorage instantly
  }

  // ── Delete chat (optimistic) ──
  const onDeleteChat = (sessionId) => {
    deleteSession(sessionId)             // removes from localStorage instantly
    if (activeSessionId === sessionId) startNewChat()
  }



  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">

      {/* ════════════════════════════════
          SIDEBAR
      ════════════════════════════════ */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed md:relative z-40 w-72 h-full bg-white dark:bg-slate-800 
                       border-r border-slate-200 dark:border-slate-700 flex flex-col"
          >
            {/* Top */}
            <div className="p-4 border-b border-slate-100">
              <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 
                           hover:text-slate-700 dark:hover:text-slate-200 text-sm mb-4"
              >
                <ChevronLeft size={16} /> Back to Home
              </button>
              <button
                onClick={startNewChat}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2"
              >
                <Plus size={16} /> New Chat
              </button>
            </div>

            {/* History list */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs font-semibold text-slate-400 
                            uppercase tracking-wide mb-3">
                Recent
              </p>

              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center 
                                py-10 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full 
                                  flex items-center justify-center mb-3">
                    <MessageSquare size={20} className="text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    No recent health chats
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Start a new conversation above!
                  </p>
                </div>
              ) : (
                chatHistory.map(chat => (
                  <ChatHistoryItem
                    key={chat.sessionId}
                    chat={chat}
                    isActive={activeSessionId === chat.sessionId}
                    onClick={() => {
                      setActiveSessionId(chat.sessionId)
                      setSidebarOpen(false) // close on mobile
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

      {/* ════════════════════════════════
          MAIN CHAT AREA
      ════════════════════════════════ */}
      <div className="flex-1 flex flex-col h-full min-w-0">

        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 
                        flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 
                       flex items-center justify-center"
          >
            <Activity size={16} className="text-primary-600" />
          </button>
          <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/50 rounded-full 
                          flex items-center justify-center">
            <Bot size={18} className="text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">
              {activeSessionMeta?.title || 'Health Assistant AI'}
            </p>
            <p className="text-xs text-health-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-health-500 rounded-full 
                               inline-block animate-pulse" />
              {sessionLoading ? 'Loading...' : 'Online'}
            </p>
          </div>
        </div>

        {/* ── Messages area ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Session loading spinner */}
          {sessionLoading ? (
            <div className="h-full flex">
              <LoadingSpinner message="Loading your previous conversation..." />
            </div>
          ) : (
            <>
              {/* History banner — shown when viewing old session */}
              {!isNewChat && activeSessionMeta && (
                <SessionHeader chat={activeSessionMeta} />
              )}

              {/* Messages */}
              <div className="px-4 py-6 space-y-4">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <MessageBubble key={i} msg={msg} index={i} />
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {loading && <TypingIndicator />}

                <div ref={bottomRef} />
              </div>
            </>
          )}
        </div>

        {/* ── Input bar ── */}
        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-4 flex-shrink-0">
          <div className="flex items-end gap-3 bg-slate-50 dark:bg-slate-700 rounded-2xl 
                          border border-slate-200 dark:border-slate-600 px-4 py-3">
            <button className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 
                               transition flex-shrink-0">
              <Paperclip size={18} />
            </button>

            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder={
                sessionLoading
                  ? 'Loading conversation...'
                  : 'Describe your symptoms...'
              }
              disabled={sessionLoading}
              rows={1}
              className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 
                         placeholder-slate-400 dark:placeholder-slate-500 outline-none resize-none 
                         max-h-32 disabled:opacity-50"
            />

            <button className="text-slate-400 hover:text-primary-600 
                               transition flex-shrink-0">
              <Mic size={18} />
            </button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={sendMessage}
              disabled={sessionLoading}
              className={`w-9 h-9 rounded-xl flex items-center justify-center 
                          flex-shrink-0 transition
                          ${input.trim() && !sessionLoading
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-slate-200 text-slate-400'}`}
            >
              <Send size={16} />
            </motion.button>
          </div>

          <p className="text-xs text-slate-400 text-center mt-2">
            For awareness only. Always consult a qualified doctor.
          </p>
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
  )
}
