import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! 👋 Tell me your symptoms (e.g. "I have fever and headache") and I will help you understand what might be happening.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load history on startup
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chat/history/default-session')
        if (res.data.length > 0) {
          setMessages(res.data)
        }
      } catch (err) {
        console.error('History failed to load', err)
      }
    }
    fetchHistory()
  }, [])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message: input })
      setMessages(prev => [...prev, { role: 'bot', text: res.data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: '⚠️ Could not connect. Make sure the server is running.' }])
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: '#0a0f0d' }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: '#1D9E7530' }}>
        <h2 className="text-center text-lg font-semibold" style={{ color: '#9FDEC8' }}>🩺 Health Assistant</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed"
                style={msg.role === 'user'
                  ? { background: 'linear-gradient(135deg, #0F6E56, #1D9E75)', color: 'white' }
                  : { background: '#0d2018', border: '1px solid #1D9E7540', color: '#9FDEC8' }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 p-3">
            {[0,1,2].map(i => (
              <motion.div key={i} animate={{ y: [0,-8,0] }}
                transition={{ duration: 0.6, delay: i*0.15, repeat: Infinity }}
                className="w-2 h-2 rounded-full" style={{ background: '#1D9E75' }}
              />
            ))}
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 flex gap-3" style={{ borderTop: '1px solid #1D9E7530' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Describe your symptoms..."
          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
          style={{ background: '#0d2018', border: '1px solid #1D9E7540', color: '#e8f5f0' }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={sendMessage}
          className="px-6 py-3 rounded-xl font-semibold text-white"
          style={{ background: 'linear-gradient(90deg, #0F6E56, #1D9E75)' }}
        >
          Send
        </motion.button>
      </div>
    </div>
  )
}
