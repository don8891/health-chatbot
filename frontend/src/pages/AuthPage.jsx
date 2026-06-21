import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Check, AlertCircle, Activity, ShieldCheck, HeartPulse } from 'lucide-react'

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  
  // Validation / dirty states
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('auth_token')) {
      navigate('/home')
    }
  }, [navigate])

  // Real-time validations
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPasswordValid = (pw) => pw.length >= 6
  const isNameValid = (name) => name.trim().length >= 2
  const isConfirmPasswordValid = (pw, cpw) => pw === cpw && cpw.length >= 6

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
  }

  // Password strength checker helper
  const getPasswordStrength = (pw) => {
    if (!pw) return { score: 0, label: '', color: 'bg-slate-200' }
    let score = 0
    if (pw.length >= 6) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    
    if (score === 1) return { score: 25, label: 'Weak', color: 'bg-[#D9534F]' }
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-[#F4A300]' }
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-[#4A90E2]' }
    if (score === 4) return { score: 100, label: 'Strong', color: 'bg-[#34C759]' }
    return { score: 12, label: 'Very Weak', color: 'bg-[#D9534F]' }
  }

  const strength = getPasswordStrength(formData.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    // Mark all as touched
    setTouched({ name: true, email: true, password: true, confirmPassword: true })

    // Final checks
    if (isRegister && !isNameValid(formData.name)) {
      setError('Please enter a valid name (min 2 characters)')
      return
    }
    if (!isEmailValid(formData.email)) {
      setError('Please enter a valid email address')
      return
    }
    if (!isPasswordValid(formData.password)) {
      setError('Password must be at least 6 characters')
      return
    }
    if (isRegister && !isConfirmPasswordValid(formData.password, formData.confirmPassword)) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
    
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user_info', JSON.stringify(response.data.user))
      
      setSuccess(isRegister ? 'Registration successful! Redirecting...' : 'Login successful! Redirecting...')
      
      setTimeout(() => {
        navigate('/home')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setSuccess('')
    setLoading(true)
    
    try {
      const response = await axios.post(`${API_URL}/api/auth/google`, {
        credential: credentialResponse.credential,
      })
      
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user_info', JSON.stringify(response.data.user))
      
      setSuccess('Google sign-in successful! Redirecting...')
      
      setTimeout(() => {
        navigate('/home')
      }, 1500)
    } catch (err) {
      setError('Google Sign-in validation failed on backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[var(--page-bg)] font-sans transition-colors duration-300">
      
      {/* ── Left Column: Healthcare Trust Illustration (Desktop Only) ── */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-tr from-[#6C63FF] to-[#7C3AED] p-12 flex-col justify-between relative overflow-hidden">
        {/* Background orbits */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-96 h-96 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-80 h-80 border border-white rounded-full" />
        </div>

        <div className="relative z-10 flex items-center gap-2.5 text-white">
          <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Activity size={20} className="text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">HealthBeacon AI</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-sm">
          <HeartPulse size={48} className="text-white opacity-90 animate-pulse" />
          <h2 className="text-3xl font-black text-white leading-tight">
            Step Into Secure <br />
            Health Guidance.
          </h2>
          <p className="text-slate-100/80 text-sm leading-relaxed">
            Register or log in to manage your medical chat logs, adjust custom guidelines, and connect safely with clinical AI feedback.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-white/70 text-xs font-semibold">
          <ShieldCheck size={16} className="text-white" />
          <span>HIPAA-Compliant Encrypted Channel</span>
        </div>
      </div>

      {/* ── Right Column: Authentication Card Forms ── */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#4A90E2]/5 rounded-full blur-[80px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white dark:bg-[#13131f] border border-slate-200/80 dark:border-white/[0.06] p-8 rounded-[32px] shadow-xl relative z-10"
        >
          {/* Form Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-[#6C63FF]/10 rounded-2xl flex items-center justify-center mb-4">
              <Activity size={24} className="text-[#6C63FF]" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-50 tracking-tight">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-semibold">
              {isRegister ? 'Start your journey with HealthBeacon AI' : 'Sign in to access your dashboard'}
            </p>
          </div>

          {/* Switcher Tabs */}
          <div className="grid grid-cols-2 bg-slate-100 dark:bg-[#1a1a2e] p-1.5 rounded-2xl mb-6 border border-slate-200/40 dark:border-white/[0.06]">
            <button
              onClick={() => { setIsRegister(false); setError(''); setSuccess('') }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${!isRegister ? 'bg-white dark:bg-[#13131f] text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsRegister(true); setError(''); setSuccess('') }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${isRegister ? 'bg-white dark:bg-[#13131f] text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Register
            </button>
          </div>

          {/* Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-xs px-4 py-3 rounded-xl mb-4 flex items-center gap-2"
              >
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-xs px-4 py-3 rounded-xl mb-4 flex items-center gap-2"
              >
                <Check size={15} className="flex-shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name (Register Only) */}
            {isRegister && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('name')}
                  required
                  className={`w-full bg-slate-50 dark:bg-[#1a1a2e] border text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl py-3.5 pl-12 pr-10 text-sm focus:outline-none focus:ring-2 transition duration-200
                    ${!touched.name ? 'border-slate-200 dark:border-white/10 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]' : isNameValid(formData.name) ? 'border-[#6C63FF]/30 focus:ring-[#6C63FF]/30' : 'border-[#EF4444]/30 focus:ring-[#EF4444]/30'}`}
                />
                {touched.name && isNameValid(formData.name) && (
                  <Check size={16} className="text-[#34C759] absolute right-4 top-1/2 -translate-y-1/2" />
                )}
              </div>
            )}

            {/* Email Address */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                required
                className={`w-full bg-slate-50 dark:bg-[#1a1a2e] border text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl py-3.5 pl-12 pr-10 text-sm focus:outline-none focus:ring-2 transition duration-200
                  ${!touched.email ? 'border-slate-200 dark:border-white/10 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]' : isEmailValid(formData.email) ? 'border-[#6C63FF]/30 focus:ring-[#6C63FF]/30' : 'border-[#EF4444]/30 focus:ring-[#EF4444]/30'}`}
              />
              {touched.email && isEmailValid(formData.email) && (
                <Check size={16} className="text-[#34C759] absolute right-4 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password (min 6 chars)"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleBlur('password')}
                required
                className={`w-full bg-slate-50 dark:bg-[#1a1a2e] border text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 transition duration-200
                  ${!touched.password ? 'border-slate-200 dark:border-white/10 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]' : isPasswordValid(formData.password) ? 'border-[#6C63FF]/30 focus:ring-[#6C63FF]/30' : 'border-[#EF4444]/30 focus:ring-[#EF4444]/30'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Strength Meter (Register Only) */}
            {isRegister && formData.password && (
              <div className="space-y-1.5 pt-1 px-1">
                <div className="flex items-center justify-between text-xxs font-bold text-slate-400 uppercase tracking-wide">
                  <span>Password Strength</span>
                  <span className={strength.score >= 75 ? 'text-[#34C759]' : strength.score >= 50 ? 'text-[#4A90E2]' : 'text-[#D9534F]'}>{strength.label}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.score}%` }} />
                </div>
              </div>
            )}

            {/* Confirm Password (Register Only) */}
            {isRegister && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  required
                  className={`w-full bg-slate-50 dark:bg-[#1a1a2e] border text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl py-3.5 pl-12 pr-10 text-sm focus:outline-none focus:ring-2 transition duration-200
                    ${!touched.confirmPassword ? 'border-slate-200 dark:border-white/10 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]' : isConfirmPasswordValid(formData.password, formData.confirmPassword) ? 'border-[#6C63FF]/30 focus:ring-[#6C63FF]/30' : 'border-[#EF4444]/30 focus:ring-[#EF4444]/30'}`}
                />
                {touched.confirmPassword && isConfirmPasswordValid(formData.password, formData.confirmPassword) && (
                  <Check size={16} className="text-[#34C759] absolute right-4 top-1/2 -translate-y-1/2" />
                )}
              </div>
            )}

            {/* Remember Me & Forgot Password (Login Only) */}
            {!isRegister && (
              <div className="flex items-center justify-between text-xs px-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#6C63FF] focus:ring-[#6C63FF]/30"
                  />
                  <span>Remember Me</span>
                </label>
                <button
                  type="button"
                  className="text-[#06B6D4] hover:text-[#0891B2] font-bold"
                  onClick={() => setError('Password reset instructions will be sent if configured.')}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#7C3AED] hover:from-[#5B54E8] hover:to-[#6D28D9] text-white font-bold transition-all shadow-md shadow-[#6C63FF]/15 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-white/[0.06]"></div>
            </div>
            <span className="relative px-3 bg-white dark:bg-[#13131f] text-xxs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Or authenticate via</span>
          </div>

          {/* Google SSO Login */}
          <div className="flex justify-center w-full">
            <div className="w-full flex justify-center [&>div]:w-full [&_iframe]:w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Sign-in authentication failed')}
                theme="filled_blue"
                shape="pill"
                text="continue_with"
                width="100%"
              />
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 dark:text-slate-500 font-semibold mt-6 leading-relaxed">
            By accessing HealthBeacon AI, you consent to our anonymous medical query processing guidelines.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
