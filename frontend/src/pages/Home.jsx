import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import {
  ArrowRight,
  MessageSquare, BookOpen, Sparkles
} from 'lucide-react'
import { useLocalHistory } from '../hooks/useLocalHistory'

const healthTips = [
  { text: "Hydration is key: Aim to drink 2-3 liters of water daily to support metabolic activity.", cat: "HYDRATION" },
  { text: "Aim for 30 minutes of moderate aerobic exercise (like brisk walking) five days a week.", cat: "EXERCISE" },
  { text: "Quality sleep (7-8 hours) is vital for cognitive function and immune system repair.", cat: "SLEEP" },
  { text: "Practice mindful breathing or meditation for 5 minutes to regulate stress hormones.", cat: "MENTAL WELLNESS" }
]

const aiRecommendations = [
  { title: "Hypertension Awareness", desc: "Monitor salt intake and complete daily activity tracking.", tag: "PREVENTATIVE" },
]

function formatChatDate(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 1 && date.getDate() === now.getDate()) {
    return 'Today'
  } else if (diffDays <= 2 && date.getDate() === now.getDate() - 1) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

export default function Home() {
  const navigate = useNavigate()
  const { chatHistory } = useLocalHistory()
  const [user, setUser] = useState(null)
  const [activeTip, setActiveTip] = useState(0)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_info')
      if (stored) setUser(JSON.parse(stored))
    } catch (err) {
      console.error('Error loading user info:', err)
    }
  }, [])

  // Rotate health tips automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % healthTips.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto bg-[#FAFBFF] text-slate-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

          {/* ── Welcome Greeting Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Hello, {user?.name || 'User'} 👋
              </h1>
              <p className="text-slate-500 text-sm font-semibold mt-1">
                Your HealthBeacon AI guide is active. Let's optimize your wellness today.
              </p>
            </div>
          </motion.div>

          {/* ── Primary CTA Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Health Chat Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="md:col-span-2 bg-gradient-to-tr from-[#6C63FF] to-[#7C3AED] p-7
                         rounded-[32px] text-white flex flex-col justify-between shadow-xl
                         shadow-[#6C63FF]/20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none
                              bg-[radial-gradient(circle_at_30%_30%,white,transparent)]" />
              {/* Animated orb */}
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full
                              bg-white/10 blur-2xl group-hover:scale-125 transition-transform duration-500" />

              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <MessageSquare size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-black tracking-tight leading-tight">
                  Connect to Health Chat <br />
                  Get AI Symptom Guidance
                </h2>
                <p className="text-white/75 text-xs max-w-md font-medium leading-relaxed">
                  Start a secure health assessment. Describe what you feel and get safe,
                  non-diagnostic insights and daily self-care suggestions.
                </p>
              </div>
              <button
                onClick={() => navigate('/chat')}
                className="relative z-10 mt-8 self-start flex items-center gap-2 px-6 py-3.5
                           rounded-full bg-white text-[#6C63FF] font-bold text-sm
                           hover:bg-slate-50 transition active:scale-95 shadow-lg"
              >
                💬 Start Health Chat <ArrowRight size={15} />
              </button>
            </motion.div>

            {/* Daily Wellness Tip Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-slate-200/80 p-6 rounded-[32px] shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-[#6C63FF] uppercase tracking-widest
                                 bg-[#6C63FF]/10 px-3 py-1 rounded-full">
                  DAILY WELLNESS
                </span>
                <h3 className="font-extrabold text-slate-800 mt-4 text-base">Wellness Tip of the Day</h3>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTip}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.35 }}
                    className="mt-3"
                  >
                    <span className="text-[10px] font-extrabold text-slate-400 block tracking-wider uppercase mb-1">
                      {healthTips[activeTip].cat}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                      "{healthTips[activeTip].text}"
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Progress dots */}
              <div className="flex gap-1.5 mt-6">
                {healthTips.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTip(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300
                                ${activeTip === idx ? 'w-6 bg-[#6C63FF]' : 'w-1.5 bg-slate-200'}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Recent Chats & AI Recommendations ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Recent Chats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <BookOpen size={18} className="text-[#06B6D4]" /> Recent Chats
              </h2>
              <div className="space-y-3">
                {chatHistory.length === 0 ? (
                  <div className="p-6 bg-white border border-slate-200/80 rounded-[20px] text-center space-y-2 shadow-sm">
                    <p className="text-xs text-slate-400 font-semibold">No recent chats yet</p>
                    <button
                      onClick={() => navigate('/chat')}
                      className="text-xs font-bold text-[#6C63FF] hover:underline"
                    >
                      Start your first assessment
                    </button>
                  </div>
                ) : (
                  chatHistory.slice(0, 4).map((chat) => (
                    <div
                      key={chat.sessionId}
                      onClick={() => navigate('/chat', { state: { sessionId: chat.sessionId } })}
                      className="flex items-center justify-between p-4 bg-white border border-slate-200/80
                                 rounded-2xl shadow-sm hover:shadow-md hover:border-[#6C63FF]/30 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#6C63FF]/10 border border-[#6C63FF]/15 rounded-xl
                                        flex items-center justify-center text-[#6C63FF] group-hover:bg-[#6C63FF]/15 transition">
                          <MessageSquare size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[180px] sm:max-w-[280px]">
                          {chat.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {formatChatDate(chat.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Sparkles size={18} className="text-[#6C63FF]" /> AI Recommendations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aiRecommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm
                               hover:shadow-md hover:border-[#6C63FF]/30 transition flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full
                                       bg-[#6C63FF]/10 text-[#6C63FF] uppercase tracking-wider">
                        {rec.tag}
                      </span>
                      <p className="font-extrabold text-slate-800 text-xs mt-3">{rec.title}</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-1 font-semibold">{rec.desc}</p>
                    </div>
                    <button
                      onClick={() => navigate('/chat')}
                      className="mt-4 text-xxs font-bold text-[#6C63FF] hover:text-[#4338CA]
                                 flex items-center gap-1 self-start transition"
                    >
                      Ask AI Guide <ArrowRight size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </Layout>
  )
}