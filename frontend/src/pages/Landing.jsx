import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Activity, Heart, Lock,
  Zap, Users, ChevronRight, Eye, Sparkles
} from 'lucide-react'

const features = [
  {
    icon: Lock,
    title: 'No Account Needed',
    desc: 'Zero registration. Start instantly.',
    borderColor: 'glowing-border-cyan',
    floatClass: 'animate-float-slow'
  },
  {
    icon: Eye,
    title: 'Completely Anonymous',
    desc: 'No tracking. No data collection.',
    borderColor: 'glowing-border-pink',
    floatClass: 'animate-float-medium'
  },
  {
    icon: Zap,
    title: 'Instant AI Responses',
    desc: 'Powered by medical datasets.',
    borderColor: 'glowing-border-cyan',
    floatClass: 'animate-float-medium'
  },
  {
    icon: Users,
    title: 'For Everyone',
    desc: 'Simple language. All ages.',
    borderColor: 'glowing-border-pink',
    floatClass: 'animate-float-slow'
  },
]

export default function Landing() {
  const [clicked, setClicked] = useState(false)
  const navigate = useNavigate()

  const handleStart = () => {
    setClicked(true)
    setTimeout(() => navigate('/home'), 500)
  }

  return (
    <AnimatePresence>
      {!clicked ? (
        <motion.div
          key="landing"
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen flex flex-col relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FDFBF7 0%, #F5F3FF 50%, #ECE9F6 100%)'
          }}
        >
          {/* Antigravity floating background glow blobs */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-12 left-10 w-96 h-96 
                            bg-cyan-300/35 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-10 right-10 w-96 h-96 
                            bg-pink-300/35 rounded-full blur-3xl animate-float-medium" />
            <div className="absolute top-1/2 left-1/3 w-80 h-80 
                            bg-purple-300/25 rounded-full blur-3xl animate-float-slow" />
          </div>

          {/* Glassmorphic Navbar */}
          <nav className="relative z-10 flex justify-between items-center px-6 py-5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-tr from-cyan-400 to-pink-400 rounded-xl 
                              flex items-center justify-center shadow-md">
                <Activity size={18} className="text-white" />
              </div>
              <span className="font-bold text-slate-800 text-lg tracking-tight">
                Health<span className="text-cyan-600">Beacon</span>
              </span>
            </div>
            <button
              onClick={() => navigate('/auth')}
              className="px-5 py-2 rounded-full liquid-glass text-slate-700 text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow-sm border border-white/60 hover:bg-white/60"
            >
              Sign In
            </button>
          </nav>

          {/* Hero Section */}
          <main className="relative z-10 flex-1 flex flex-col items-center 
                           justify-center px-4 sm:px-6 py-10 text-center max-w-4xl mx-auto">

            {/* Pulsing Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="inline-flex items-center gap-2 liquid-glass glowing-border glowing-border-cyan
                         text-cyan-700 px-5 py-2.5 rounded-full text-xs font-bold mb-8 shadow-sm animate-float-fast"
            >
              <Shield size={13} className="text-cyan-500" />
              <span>Instant · Anonymous · Free Forever</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-800 mb-6 
                         leading-tight max-w-3xl tracking-tight"
            >
              Understand Your
              <span className="block text-transparent bg-clip-text 
                               bg-gradient-to-r from-cyan-500 via-primary-500 to-pink-500">
                Health Symptoms
              </span>
              Instantly
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg mb-2 max-w-xl leading-relaxed"
            >
              AI-powered health awareness for everyone. Simple language. Safety-first triage assistant.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 text-xs sm:text-sm mb-10 font-medium"
            >
              No account. No tracking. Just accurate medical literacy.
            </motion.p>

            {/* CTA Button Wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="relative group animate-float-medium"
            >
              {/* Outer pulsing glow ring */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 
                              opacity-40 blur-md group-hover:opacity-75 transition-all duration-300 animate-pulse" />

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleStart}
                className="relative flex items-center justify-center gap-3 text-white font-bold 
                           text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 rounded-2xl shadow-xl
                           w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-primary-600
                           hover:from-cyan-400 hover:to-primary-500 transition-all border border-white/20"
              >
                <Activity size={20} className="animate-pulse" />
                Start Anonymous Chat
                <ChevronRight size={18} />
              </motion.button>
            </motion.div>

            {/* Weightless Floating Feature Cards Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16 max-w-3xl w-full"
            >
              {features.map(({ icon: Icon, title, desc, borderColor, floatClass }) => (
                <motion.div
                  key={title}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`liquid-glass glowing-border ${borderColor} rounded-3xl p-5 text-left transition-all ${floatClass}`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-100 to-pink-100 
                                  flex items-center justify-center mb-3 shadow-inner">
                    <Icon size={18} className="text-slate-700" />
                  </div>
                  <p className="text-slate-800 text-sm font-bold mb-1 flex items-center gap-1.5">
                    {title} <Sparkles size={12} className="text-cyan-500" />
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Stats Panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-12 sm:gap-20 mt-16 px-6 py-4 liquid-glass glowing-border rounded-2xl shadow-sm animate-float-slow"
            >
              {[
                { value: '300+', label: 'Diseases' },
                { value: '130+', label: 'Symptom Profiles' },
                { value: '100%', label: 'Free' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-black text-slate-800">{stat.value}</div>
                  <div className="text-slate-400 text-xxs font-semibold uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="relative z-10 text-center py-6 mt-12 border-t border-slate-200/40">
            <p className="text-slate-400 text-xs flex items-center justify-center gap-1.5 font-medium">
              <Heart size={11} className="text-pink-500 animate-pulse" />
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
          style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #ECE9F6 100%)' }}
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}
              className="w-12 h-12 border-2 border-cyan-500 border-t-transparent 
                         rounded-full mx-auto mb-4"
            />
            <p className="text-slate-500 text-sm font-semibold animate-pulse">Starting your chat session...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
