import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  Activity, BookOpen, Phone,
  ArrowRight, ShieldAlert, TrendingUp,
  MessageSquare, Heart, Thermometer,
  Wind, Droplets, Sun, Search, X,
  ChevronRight, Clock, Sparkles
} from 'lucide-react'

// ── Animated counter ──
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0
        const step = target / 60
        const timer = setInterval(() => {
          start += step
          if (start >= target) { setCount(target); clearInterval(timer) }
          else setCount(Math.floor(start))
        }, 16)
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count}{suffix}</span>
}

// ── Health tip of the day ──
const healthTips = [
  { tip: 'Drink at least 8 glasses of water daily to stay hydrated.', icon: Droplets, color: 'text-blue-400' },
  { tip: 'Walk for 30 minutes a day to improve heart health.', icon: Activity, color: 'text-green-400' },
  { tip: 'Sleep 7-8 hours every night for better immunity.', icon: Heart, color: 'text-red-400' },
  { tip: 'Eat 5 servings of fruits and vegetables daily.', icon: Sun, color: 'text-yellow-400' },
  { tip: 'Wash hands for 20 seconds to prevent infections.', icon: Wind, color: 'text-teal-400' },
  { tip: 'Avoid skipping breakfast — it fuels your brain.', icon: Sparkles, color: 'text-purple-400' },
  { tip: 'Limit screen time before bed for better sleep.', icon: Thermometer, color: 'text-orange-400' },
]

// ── Quick actions ──
const quickActions = [
  {
    icon: Activity,
    label: 'Symptom Tracker',
    desc: 'Check what your symptoms mean',
    iconBg: 'bg-blue-500',
    route: '/chat',
    // Don't auto-send — just set a placeholder prompt
    prefill: '',
    welcome: '🩺 Please describe your symptoms in detail.\n\nFor example: "I have fever, headache and body pain for 2 days"\n\nThe more details you give, the better I can help!'
  },
  {
    icon: BookOpen,
    label: 'Disease Info',
    desc: 'Learn about any disease',
    iconBg: 'bg-green-500',
    route: '/chat',
    prefill: 'Tell me about ',
    welcome: '📚 Which disease would you like to learn about?\n\nType the disease name — for example:\n• "Tell me about diabetes"\n• "Tell me about dengue fever"\n• "Tell me about tuberculosis"'
  },
  {
    icon: ShieldAlert,
    label: 'Prevention Tips',
    desc: 'How to stay healthy',
    iconBg: 'bg-purple-500',
    route: '/chat',
    prefill: 'How can I prevent ',
    welcome: '🛡️ What would you like to prevent?\n\nAsk me anything like:\n• "How can I prevent diabetes?"\n• "How to avoid getting dengue?"\n• "Tips to boost my immunity"'
  },
  {
    icon: Phone,
    label: 'Emergency Info',
    desc: 'When to see a doctor',
    iconBg: 'bg-red-500',
    route: '/chat',
    // This one we CAN auto-send — it's a general question
    autoSend: true,
    prefill: 'When should I go to the emergency room and what are danger signs that need immediate doctor attention?',
    welcome: ''
  },
]

// ── Trending topics ──
const trendingTopics = [
  {
    title: 'Understanding Diabetes',
    tag: 'Prevention',
    desc: 'Learn about blood sugar, symptoms and lifestyle changes.',
    tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-900/30',
    query: 'Tell me about diabetes symptoms and prevention'
  },
  {
    title: 'Managing Hypertension',
    tag: 'Awareness',
    desc: 'High blood pressure — silent killer. Know the signs.',
    tagColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    border: 'border-green-100 dark:border-green-900/30',
    query: 'What is hypertension and how to manage it'
  },
  {
    title: 'Dengue Fever Warning',
    tag: '🚨 Alert',
    desc: 'Recognize early dengue symptoms. Act fast.',
    tagColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    border: 'border-red-100 dark:border-red-900/30',
    query: 'What are dengue fever symptoms and precautions'
  },
  {
    title: 'Mental Health Basics',
    tag: 'Wellness',
    desc: 'Stress, anxiety and depression — you are not alone.',
    tagColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    border: 'border-purple-100 dark:border-purple-900/30',
    query: 'Tell me about mental health and stress management'
  },
]

// ── Common symptom quick buttons ──
const quickSymptoms = [
  '🤒 Fever', '🤕 Headache', '😮‍💨 Cough',
  '🤢 Nausea', '😴 Fatigue', '🤧 Cold',
  '💊 Body Pain', '😰 Sweating'
]

export default function Home() {
  const navigate  = useNavigate()
  const [searchQuery, setSearchQuery]   = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [todayTip] = useState(
    () => healthTips[new Date().getDay() % healthTips.length]
  )
  const TipIcon = todayTip.icon

  const handleSearch = (query) => {
    if (!query.trim()) return
    // Auto-send search queries — user typed it intentionally
    navigate('/chat', {
      state: {
        autoSend: true,
        autoSendMessage: query,
        prefillInput: query
      }
    })
  }

  const handleQuickSymptom = (symptom) => {
    const clean = symptom.replace(/^\S+\s/, '')
    // Pre-fill but don't send — user should confirm/add more details
    navigate('/chat', {
      state: {
        prefillInput: `I have ${clean.toLowerCase()} `,
        welcomeOverride: `🩺 You selected **${clean}**.\n\nPlease add more details for a better response:\n• How many days have you had this?\n• Any other symptoms along with it?\n• Your age group (child/adult/elderly)?\n\nThen press Send!`
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 
                    transition-colors duration-300">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-16">

        {/* ── Hero Search Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-8 p-8 md:p-12"
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #1d4ed8 100%)'
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-64 h-64 
                            border-2 border-white rounded-full" />
            <div className="absolute top-8 right-8 w-48 h-48 
                            border-2 border-white rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 
                            border-2 border-white rounded-full" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/20 
                         text-white px-3 py-1 rounded-full text-sm mb-4"
            >
              <Sparkles size={13} />
              AI-Powered Health Awareness
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              What health concern can
              <span className="block">we help you with today?</span>
            </h1>
            <p className="text-blue-100 mb-8 max-w-lg">
              Describe symptoms, ask about diseases, or get prevention tips — 
              instantly, anonymously, for free.
            </p>

            {/* Search bar */}
            <div className="relative max-w-2xl">
              <div className={`flex items-center gap-3 bg-white dark:bg-slate-800 
                               rounded-2xl px-4 py-3 shadow-xl transition-all duration-200
                               ${searchFocused ? 'ring-2 ring-white/50' : ''}`}>
                <Search size={18} className="text-slate-400 flex-shrink-0" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch(searchQuery)}
                  placeholder="Search symptoms, diseases, medicines..."
                  className="flex-1 bg-transparent text-slate-700 dark:text-slate-200
                             placeholder-slate-400 outline-none text-sm"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}>
                    <X size={16} className="text-slate-400 hover:text-slate-600" />
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearch(searchQuery)}
                  className="bg-primary-600 text-white px-5 py-2 rounded-xl 
                             text-sm font-semibold hover:bg-primary-700 
                             transition flex-shrink-0"
                >
                  Ask AI
                </motion.button>
              </div>

              {/* Quick symptom pills */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {quickSymptoms.map(symptom => (
                  <motion.button
                    key={symptom}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickSymptom(symptom)}
                    className="bg-white/20 hover:bg-white/30 text-white 
                               text-xs px-3 py-1.5 rounded-full transition
                               backdrop-blur-sm border border-white/20"
                  >
                    {symptom}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: 'Diseases Covered', target: 300, suffix: '+' },
            { label: 'Symptoms Known',   target: 132, suffix: '+' },
            { label: 'Always Free',      target: 100, suffix: '%' },
          ].map((stat, i) => (
            <div key={stat.label}
                 className="bg-white dark:bg-slate-800 rounded-2xl p-4 
                            text-center border border-slate-100 dark:border-slate-700
                            shadow-sm">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Health Tip of the Day ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-health-500/10 to-health-600/5
                     dark:from-health-500/20 dark:to-health-600/10
                     border border-health-500/20 rounded-2xl p-5 mb-8
                     flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-health-500/20 rounded-2xl 
                          flex items-center justify-center flex-shrink-0">
            <TipIcon size={22} className={todayTip.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-health-600 
                               dark:text-health-400 uppercase tracking-wide">
                Health Tip of the Day
              </span>
              <Clock size={11} className="text-health-500" />
            </div>
            <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">
              {todayTip.tip}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/chat', {
              state: {
                prefillInput: todayTip.tip,
                autoSend: true,
                autoSendMessage: todayTip.tip
              }
            })}
            className="flex-shrink-0 text-xs text-health-600 dark:text-health-400 
                       font-semibold flex items-center gap-1 
                       hover:text-health-700 transition"
          >
            Learn more <ChevronRight size={14} />
          </motion.button>
        </motion.div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Quick Actions — left column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h2 className="font-bold text-slate-800 dark:text-slate-100 
                           mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-600" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(action.route, {
                      state: {
                        prefillInput: action.prefill,
                        welcomeOverride: action.welcome,
                        autoSend: action.autoSend || false,
                        autoSendMessage: action.prefill
                      }
                    })}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl
                               border bg-white dark:bg-slate-800
                               border-slate-100 dark:border-slate-700 shadow-sm
                               hover:shadow-md transition-all text-left"
                  >
                    <div className={`w-10 h-10 ${action.iconBg} rounded-xl 
                                    flex items-center justify-center flex-shrink-0`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                        {action.label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {action.desc}
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-slate-400 flex-shrink-0" />
                  </motion.button>
                )
              })}
            </div>

            {/* Start Chat CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/chat')}
              className="w-full mt-4 flex items-center justify-center gap-2
                         bg-primary-600 hover:bg-primary-700 text-white
                         font-semibold py-4 rounded-2xl transition shadow-md
                         hover:shadow-lg"
            >
              <MessageSquare size={18} />
              Start Health Chat
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>

          {/* Trending Topics — right columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2"
          >
            <h2 className="font-bold text-slate-800 dark:text-slate-100 
                           mb-4 flex items-center gap-2">
              <ShieldAlert size={18} className="text-health-500" />
              Trending Health Topics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingTopics.map((topic) => (
                <motion.div
                  key={topic.title}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/chat', {
                    state: {
                      prefillInput: topic.query,
                      autoSend: true,
                      autoSendMessage: topic.query
                    }
                  })}
                  className={`p-5 rounded-2xl border bg-white dark:bg-slate-800
                               ${topic.border} cursor-pointer
                               shadow-sm hover:shadow-md transition-all`}
                >
                  <span className={`text-xs font-bold px-2 py-1 rounded-full 
                                    ${topic.tagColor}`}>
                    {topic.tag}
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 
                                mt-3 mb-2">
                    {topic.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 
                                mb-3 leading-relaxed">
                    {topic.desc}
                  </p>
                  <div className="flex items-center gap-1 text-primary-600 
                                  dark:text-primary-400 text-sm font-medium">
                    Ask AI about this
                    <ArrowRight size={14} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Disclaimer card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 
                         border border-amber-200 dark:border-amber-800 
                         rounded-2xl flex items-start gap-3"
            >
              <ShieldAlert size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-700 
                               dark:text-amber-400 mb-1">
                  Medical Disclaimer
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-500 
                               leading-relaxed">
                  HealthBot AI is for awareness and education only. 
                  It does not replace professional medical advice. 
                  Always consult a qualified doctor for diagnosis and treatment.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Emergency Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 
                     dark:border-red-800 rounded-3xl p-6 
                     flex flex-col md:flex-row items-center 
                     justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 
                            rounded-2xl flex items-center justify-center">
              <Phone size={22} className="text-red-500" />
            </div>
            <div>
              <p className="font-bold text-red-700 dark:text-red-400">
                Medical Emergency?
              </p>
              <p className="text-sm text-red-500 dark:text-red-500">
                Don't use this app — call emergency services immediately
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="bg-red-100 dark:bg-red-900/50 px-5 py-3 
                            rounded-xl text-center">
              <p className="text-xs text-red-500 font-medium">India Emergency</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-400">
                108
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/50 px-5 py-3 
                            rounded-xl text-center">
              <p className="text-xs text-red-500 font-medium">Ambulance</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-400">
                102
              </p>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  )
}