import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import {
  Search, ArrowRight,
  MessageSquare, BookOpen, Sparkles, AlertTriangle, Plus
} from 'lucide-react'

const healthTips = [
  { text: "Hydration is key: Aim to drink 2-3 liters of water daily to support metabolic activity.", cat: "HYDRATION" },
  { text: "Aim for 30 minutes of moderate aerobic exercise (like brisk walking) five days a week.", cat: "EXERCISE" },
  { text: "Quality sleep (7-8 hours) is vital for cognitive function and immune system repair.", cat: "SLEEP" },
  { text: "Practice mindful breathing or meditation for 5 minutes to regulate stress hormones.", cat: "MENTAL WELLNESS" }
]

const aiRecommendations = [
  { title: "Hypertension Awareness", desc: "Monitor salt intake and complete daily activity tracking.", tag: "PREVENTATIVE" },
  { title: "Post-Activity Hydration", desc: "Replenish electrolytes after heavy workouts.", tag: "FITNESS" }
]

const recentChats = [
  { id: 1, title: "Mild head congestion checks", date: "Today" },
  { id: 2, title: "Anxiety triggers and breathing guidelines", date: "Yesterday" }
]

export default function Home() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState(null)
  const [activeTip, setActiveTip] = useState(0)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_info')
      if (stored) {
        setUser(JSON.parse(stored))
      }
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

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    navigate('/chat', {
      state: {
        autoSend: true,
        autoSendMessage: searchQuery,
        prefillInput: searchQuery
      }
    })
  }

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto bg-[#F7FAF9] text-slate-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

          {/* ── Welcome Greeting Header ── */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Hello, {user?.name || 'User'} 👋
              </h1>
              <p className="text-slate-500 text-sm font-semibold mt-1">
                Your HealthBeacon AI guide is active. Let's optimize your wellness today.
              </p>
            </div>
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#0F6E56] hover:bg-[#0b5240] text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95"
            >
              <Plus size={16} /> New Checkup
            </button>
          </div>

          {/* ── Large Emergency Warning Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#D9534F]/10 border border-[#D9534F]/25 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D9534F]/20 flex items-center justify-center flex-shrink-0 text-[#D9534F] animate-pulse">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[#D9534F] text-lg flex items-center gap-1.5">
                  🚨 Emergency Symptoms?
                </h3>
                <p className="text-xs text-[#D9534F] font-semibold leading-relaxed max-w-xl">
                  If you are experiencing severe chest pressure, sudden numbness, or shortness of breath, call professional emergency responders immediately. Do not rely on AI assessment.
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <a href="tel:108" className="flex-1 md:flex-initial text-center bg-white hover:bg-slate-50 border border-[#D9534F]/30 text-[#D9534F] font-bold text-sm px-5 py-3 rounded-xl transition active:scale-95">
                Call 108 (India)
              </a>
              <a href="tel:102" className="flex-1 md:flex-initial text-center bg-[#D9534F] hover:bg-[#b03d3a] text-white font-bold text-sm px-5 py-3 rounded-xl transition active:scale-95">
                Ambulance 102
              </a>
            </div>
          </motion.div>

          {/* ── Hero Search Widget ── */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-[28px] shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search symptoms, diseases, preventive care..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl py-3.5 pl-12 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/30 focus:border-[#0F6E56] transition"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full md:w-auto px-8 py-3.5 bg-[#0F6E56] hover:bg-[#0b5240] text-white font-bold rounded-2xl transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Ask AI Guide
            </button>
          </div>

          {/* ── Primary CTA Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Health Chat Card */}
            <div className="md:col-span-2 bg-gradient-to-tr from-[#0F6E56] to-[#1D9E75] p-6 rounded-[32px] text-white flex flex-col justify-between shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,white,transparent)]" />
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <MessageSquare size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-black tracking-tight leading-tight">
                  Connect to Health Chat <br />
                  Get AI Symptom Guidance
                </h2>
                <p className="text-slate-100/80 text-xs max-w-md font-medium leading-relaxed">
                  Start a secure health assessment conversation. Describe what you feel and get safe, non-diagnostic insights and daily self-care suggestions.
                </p>
              </div>
              <button
                onClick={() => navigate('/chat')}
                className="mt-8 self-start flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#0F6E56] font-bold text-sm hover:bg-slate-50 transition active:scale-95 shadow-md"
              >
                💬 Start Health Chat <ArrowRight size={15} />
              </button>
            </div>

            {/* Daily Wellness Card */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-[32px] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xxs font-bold text-[#1D9E75] uppercase tracking-widest bg-[#1D9E75]/10 px-3 py-1 rounded-full">DAILY WELLNESS</span>
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
                    <span className="text-[10px] font-extrabold text-slate-400 block tracking-wider uppercase mb-1">{healthTips[activeTip].cat}</span>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">"{healthTips[activeTip].text}"</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex gap-1.5 mt-6">
                {healthTips.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTip(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeTip === idx ? 'w-6 bg-[#0F6E56]' : 'w-1.5 bg-slate-200'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Recent Chats & Recommendations Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Chats Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <BookOpen size={18} className="text-[#4A90E2]" /> Recent Chats
              </h2>
              <div className="space-y-3">
                {recentChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => navigate('/chat')}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        <MessageSquare size={16} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{chat.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{chat.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Sparkles size={18} className="text-[#1D9E75]" /> AI Recommendations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aiRecommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#1D9E75]/10 text-[#1D9E75] uppercase tracking-wider">{rec.tag}</span>
                      <p className="font-extrabold text-slate-800 text-xs mt-3">{rec.title}</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-1 font-semibold">{rec.desc}</p>
                    </div>
                    <button
                      onClick={() => navigate('/chat')}
                      className="mt-4 text-xxs font-bold text-[#0F6E56] hover:text-[#0b5240] flex items-center gap-1 self-start"
                    >
                      Ask AI Guide <ArrowRight size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}