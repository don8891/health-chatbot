import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import ChatHistoryItem from '../components/ChatHistoryItem'
import {
  Send, Paperclip, Mic, Plus,
  Activity, ChevronLeft, Bot,
  Trash2, CheckCircle, AlertCircle,
  MessageSquare, Settings
} from 'lucide-react'

const API = 'http://localhost:5000'

// ── Toast notification component ──
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
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 
                  rounded-xl shadow-lg text-white text-sm font-medium
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
    <div className="flex items-center gap-1 px-4 py-3 bg-slate-100 rounded-2xl rounded-tl-none w-fit">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
          className="w-2 h-2 bg-slate-400 rounded-full"
        />
      ))}
    </div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState([{
    role: 'bot',
    text: "👋 Hello! I'm your AI Health Assistant. Describe your symptoms and I'll help with awareness. Always consult a doctor for diagnosis."
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [toast, setToast] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [cleaning, setCleaning] = useState(false)
  const bottomRef = useRef(null)
  const navigate = useNavigate()

  // Load chat history on mount
  useEffect(() => {
    fetchHistory()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/api/chats`)
      setChatHistory(res.data.chats || [])
    } catch {
      setChatHistory([])
    }
  }

  const cleanHistory = async () => {
    setCleaning(true)
    try {
      // First preview how many will be deleted
      const preview = await axios.get(`${API}/api/chats/clean`)
      const count = preview.data.count

      // Then delete them
      await axios.delete(`${API}/api/chats/clean`)

      // Refresh list
      await fetchHistory()

      setToast({
        message: count > 0
          ? `Successfully removed ${count} invalid chat sessions!`
          : 'No invalid sessions found. History is clean!',
        type: 'success'
      })
    } catch {
      setToast({ message: 'Cleanup failed. Try again.', type: 'error' })
    }
    setCleaning(false)
    setShowSettings(false)
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post(`${API}/api/chats`, {
        message: input,
        sessionId
      })

      setMessages(prev => [...prev, { role: 'bot', text: res.data.answer }])

      // Save session ID from first message
      if (res.data.sessionId && !sessionId) {
        setSessionId(res.data.sessionId)
        await fetchHistory()  // refresh sidebar
      }

    } catch (err) {
      if (err.response?.data?.error === 'invalid_input') {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: '⚠️ Please describe your symptoms more clearly. For example: "I have fever and headache for 2 days"'
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: '⚠️ Backend not connected yet. Complete Day 4-7 setup!'
        }])
      }
    }
    setLoading(false)
  }

  const startNewChat = () => {
    setMessages([{
      role: 'bot',
      text: "👋 New chat started! Describe your symptoms and I'll help with awareness."
    }])
    setSessionId(null)
    setInput('')
  }

  // ── Rename a chat (optimistic update) ──
  const onRenameChat = async (targetSessionId, newTitle) => {
    // Update locally first (instant UI)
    setChatHistory(prev =>
      prev.map(c => c.sessionId === targetSessionId ? { ...c, title: newTitle } : c)
    )
    // Then sync to backend
    try {
      await axios.patch(`${API}/api/chats/${targetSessionId}/rename`, { title: newTitle })
    } catch {
      // If backend fails, revert by re-fetching
      fetchHistory()
      setToast({ message: 'Rename failed. Please try again.', type: 'error' })
    }
  }

  // ── Delete a chat (optimistic update) ──
  const onDeleteChat = async (targetSessionId) => {
    // Remove locally first (instant UI)
    setChatHistory(prev => prev.filter(c => c.sessionId !== targetSessionId))

    // If deleted chat was active, reset chat window
    if (sessionId === targetSessionId) {
      startNewChat()
    }

    // Then sync to backend
    try {
      await axios.delete(`${API}/api/chats/${targetSessionId}`)
      setToast({ message: 'Chat deleted successfully.', type: 'success' })
    } catch {
      // Revert if backend fails
      fetchHistory()
      setToast({ message: 'Delete failed. Please try again.', type: 'error' })
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Sidebar ── */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed md:relative z-40 w-72 h-full bg-white border-r border-slate-200 flex flex-col"
          >
            {/* Top */}
            <div className="p-4 border-b border-slate-100">
              <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-4"
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
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                Recent
              </p>

              {chatHistory.length === 0 ? (
                // ── Empty state ──
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <MessageSquare size={20} className="text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">No recent health chats</p>
                  <p className="text-xs text-slate-400 mt-1">Start a new conversation above!</p>
                </div>
              ) : (
                chatHistory.map((chat) => (
                  <ChatHistoryItem
                    key={chat.sessionId}
                    chat={chat}
                    isActive={sessionId === chat.sessionId}
                    onClick={() => setSessionId(chat.sessionId)}
                    onRenameChat={onRenameChat}
                    onDeleteChat={onDeleteChat}
                  />
                ))
              )}
            </div>

            {/* Bottom settings */}
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-xs w-full"
              >
                <Settings size={14} />
                Settings & Cleanup
              </button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3"
                  >
                    <button
                      onClick={cleanHistory}
                      disabled={cleaning}
                      className="w-full flex items-center justify-center gap-2 
                                 bg-red-50 text-red-600 border border-red-200
                                 px-4 py-2 rounded-xl text-xs font-medium
                                 hover:bg-red-100 transition disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                      {cleaning ? 'Cleaning...' : 'Clean Invalid History'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main Chat Area ── */}
      <div className="flex-1 flex flex-col h-full">

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"
          >
            <Activity size={16} className="text-primary-600" />
          </button>
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
            <Bot size={18} className="text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Health Assistant AI</p>
            <p className="text-xs text-health-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-health-500 rounded-full inline-block animate-pulse" />
              Online
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-primary-600" />
                  </div>
                )}
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-none'}`}
                >
                  {msg.role === 'bot' ? (
                    <ReactMarkdown
                      components={{
                        h3: ({children}) => (
                          <h3 className="font-bold text-primary-700 text-sm mt-3 mb-1 first:mt-0">
                            {children}
                          </h3>
                        ),
                        ul: ({children}) => <ul className="space-y-1 my-1">{children}</ul>,
                        li: ({children}) => (
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-primary-400 mt-0.5 flex-shrink-0">•</span>
                            <span>{children}</span>
                          </li>
                        ),
                        strong: ({children}) => (
                          <strong className="font-semibold text-slate-800">{children}</strong>
                        ),
                        p: ({children}) => <p className="text-sm leading-relaxed mb-1">{children}</p>,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                <Bot size={14} className="text-primary-600" />
              </div>
              <TypingIndicator />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="bg-white border-t border-slate-200 px-4 py-4">
          <div className="flex items-end gap-3 bg-slate-50 rounded-2xl border border-slate-200 px-4 py-3">
            <button className="text-slate-400 hover:text-primary-600 transition flex-shrink-0">
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
              placeholder="Describe your symptoms..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-slate-700 
                         placeholder-slate-400 outline-none resize-none max-h-32"
            />
            <button className="text-slate-400 hover:text-primary-600 transition flex-shrink-0">
              <Mic size={18} />
            </button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={sendMessage}
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition
                ${input.trim() ? 'bg-primary-600 text-white shadow-md' : 'bg-slate-200 text-slate-400'}`}
            >
              <Send size={16} />
            </motion.button>
          </div>
          <p className="text-xs text-slate-400 text-center mt-2">
            For awareness only. Always consult a qualified doctor.
          </p>
        </div>
      </div>

      {/* Toast notification */}
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
