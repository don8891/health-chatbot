import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Activity, Heart, Lock,
  Zap, Users, ChevronRight, Eye
} from 'lucide-react'

const features = [
  {
    icon: Lock,
    title: 'No Account Needed',
    desc: 'Zero registration. Start instantly.',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: Eye,
    title: 'Completely Anonymous',
    desc: 'No tracking. No data collection.',
    color: 'bg-green-50 text-green-600'
  },
  {
    icon: Zap,
    title: 'Instant AI Responses',
    desc: 'Powered by medical datasets.',
    color: 'bg-amber-50 text-amber-600'
  },
  {
    icon: Users,
    title: 'For Everyone',
    desc: 'Simple language. All ages.',
    color: 'bg-purple-50 text-purple-600'
  },
]

export default function Landing() {
  const [clicked, setClicked] = useState(false)
  const navigate = useNavigate()

  const handleStart = () => {
    setClicked(true)
    setTimeout(() => navigate('/chat'), 500)
  }

  return (
    <AnimatePresence>
      {!clicked ? (
        <motion.div
          key="landing"
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen flex flex-col"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #0c2d48 50%, #0f172a 100%)'
          }}
        >
          {/* Background glow blobs */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 
                            bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 
                            bg-health-500/10 rounded-full blur-3xl animate-pulse-slow" />
          </div>

          {/* Navbar */}
          <nav className="relative z-10 flex justify-between items-center px-6 py-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg 
                              flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                HealthBot <span className="text-primary-400">AI</span>
              </span>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="text-slate-400 hover:text-white text-sm transition"
            >
              Settings
            </button>
          </nav>

          {/* Hero */}
          <main className="relative z-10 flex-1 flex flex-col items-center 
                           justify-center px-6 py-12 text-center">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-health-500/15 
                         border border-health-500/30 text-health-400 
                         px-4 py-2 rounded-full text-sm font-medium mb-8"
            >
              <Shield size={14} />
              Instant · Anonymous · Free Forever
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 
                         leading-tight max-w-3xl"
            >
              Understand Your
              <span className="block text-transparent bg-clip-text 
                               bg-gradient-to-r from-primary-400 to-health-400">
                Health Symptoms
              </span>
              Instantly
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-300 text-xl mb-4 max-w-xl leading-relaxed"
            >
              AI-powered health awareness for everyone.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-500 text-base mb-12"
            >
              No account. No signup. No tracking. Just answers.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-2xl bg-primary-500/30 
                              animate-ping" />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="relative flex items-center gap-3 text-white font-bold 
                           text-lg px-10 py-5 rounded-2xl shadow-2xl
                           bg-gradient-to-r from-primary-600 to-primary-500
                           hover:from-primary-500 hover:to-primary-400 transition-all"
              >
                <Activity size={22} />
                Start Anonymous Chat Now
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-slate-600 text-xs mt-6 flex items-center gap-2"
            >
              <Lock size={11} />
              Your conversation stays on your device. Never sent to any server.
            </motion.p>

            {/* Feature cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl w-full"
            >
              {features.map(({ icon: Icon, title, desc, color }) => (
                <div
                  key={title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left"
                >
                  <div className={`w-9 h-9 ${color} rounded-xl 
                                  flex items-center justify-center mb-3`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-white text-sm font-semibold mb-1">{title}</p>
                  <p className="text-slate-400 text-xs">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-10 mt-12"
            >
              {[
                { value: '300+', label: 'Diseases' },
                { value: '132+', label: 'Symptoms' },
                { value: '100%', label: 'Free' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="relative z-10 text-center py-4">
            <p className="text-slate-600 text-xs flex items-center justify-center gap-1">
              <Heart size={10} className="text-red-400" />
              For awareness only. Always consult a qualified doctor.
            </p>
          </footer>
        </motion.div>
      ) : (
        <motion.div
          key="transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center"
          style={{ background: '#0f172a' }}
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: 'linear' }}
              className="w-12 h-12 border-2 border-primary-500 border-t-transparent 
                         rounded-full mx-auto mb-4"
            />
            <p className="text-slate-400 text-sm">Starting your chat...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
