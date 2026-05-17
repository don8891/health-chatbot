import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Shield, Activity, Heart } from 'lucide-react'

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-health-500/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 py-12 gap-12">
        
        {/* LEFT — Hero */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left max-w-xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-400/30 
                       text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-8"
          >
            <Shield size={14} />
            AI-Powered Health Awareness
          </motion.div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Know Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-health-400">
              {' '}Health{' '}
            </span>
            Better
          </h1>

          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Describe your symptoms and get instant disease awareness, precautions, 
            and guidance — powered by advanced AI trained on medical data.
          </p>

          {/* Stats */}
          <div className="flex gap-8 justify-center lg:justify-start mb-10">
            {[
              { label: 'Diseases Covered', value: '300+' },
              { label: 'Symptoms Analyzed', value: '132+' },
              { label: 'Accuracy', value: '94%' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-400 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogin(true)}
            className="relative btn-primary text-lg px-10 py-4 group"
          >
            <span className="absolute inset-0 rounded-xl bg-primary-400/30 animate-ping group-hover:hidden" />
            Start Free Assessment →
          </motion.button>

          {/* Feature icons */}
          <div className="flex gap-6 mt-10 justify-center lg:justify-start">
            {[
              { icon: Activity, label: 'Symptom Check' },
              { icon: Heart, label: 'Health Tips' },
              { icon: Shield, label: 'Disease Info' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-slate-400 text-sm">
                <Icon size={16} className="text-health-400" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — Auth Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8"
               style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
            
            {/* Tabs */}
            <div className="flex bg-white/10 rounded-xl p-1 mb-8">
              {['Login', 'Sign Up'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setIsLogin(tab === 'Login')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${(isLogin && tab === 'Login') || (!isLogin && tab === 'Sign Up')
                      ? 'bg-white text-slate-800 shadow'
                      : 'text-slate-300 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <h2 className="text-white text-2xl font-bold mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              {isLogin ? 'Sign in to your health dashboard' : 'Start your health journey today'}
            </p>

            {/* Social Login */}
            <button className="w-full flex items-center justify-center gap-3 bg-white text-slate-700 
                               py-3 rounded-xl font-medium text-sm hover:bg-slate-50 transition mb-4">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-slate-400 text-xs">or continue with email</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* Form */}
            <div className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input-field"
                  style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              )}
              <input
                type="email"
                placeholder="Email address"
                className="input-field"
                style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="input-field pr-12"
                  style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/home')}
                className="w-full btn-primary py-3 text-center"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
