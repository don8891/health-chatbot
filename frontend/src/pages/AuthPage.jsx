import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Check, AlertCircle, Sparkles, Activity } from 'lucide-react'

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  
  // Validation / dirty states
  const [touched, setTouched] = useState({ name: false, email: false, password: false })
  const [showPassword, setShowPassword] = useState(false)
  
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
  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email)
  const isPasswordValid = (pw) => pw.length >= 6
  const isNameValid = (name) => name.trim().length >= 2

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    // Mark all as touched
    setTouched({ name: true, email: true, password: true })

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

    setLoading(true)
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
    
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, formData)
      
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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden relative px-4 py-8">
      {/* Background colorful blur blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary-600/10 filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-teal-600/10 filter blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel w-full max-w-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10 backdrop-blur-xl bg-slate-900/60"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 mb-3">
            <Activity size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5">
            Health<span className="text-primary-400">Beacon</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister ? 'Join us to secure your medical triage helper' : 'Access your private health checker'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 bg-slate-950/50 p-1 rounded-xl mb-6 border border-white/5">
          <button
            onClick={() => { setIsRegister(false); setError(''); setSuccess('') }}
            className={`py-2 rounded-lg text-xs font-semibold transition ${!isRegister ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(''); setSuccess('') }}
            className={`py-2 rounded-lg text-xs font-semibold transition ${isRegister ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Register
          </button>
        </div>

        {/* Status Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs px-4 py-3 rounded-xl mb-4 flex items-center gap-2"
            >
              <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs px-4 py-3 rounded-xl mb-4 flex items-center gap-2"
            >
              <Check size={15} className="text-emerald-400 flex-shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className={`w-full bg-slate-950/30 border text-white rounded-xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:ring-1 transition
                  ${!touched.name ? 'border-white/10 focus:border-primary-500 focus:ring-primary-500' : isNameValid(formData.name) ? 'border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500' : 'border-red-500/30 focus:border-red-500 focus:ring-red-500'}`}
              />
              {touched.name && isNameValid(formData.name) && (
                <Check size={16} className="text-emerald-400 absolute right-4 top-1/2 -translate-y-1/2" />
              )}
            </div>
          )}

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
              className={`w-full bg-slate-950/30 border text-white rounded-xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:ring-1 transition
                ${!touched.email ? 'border-white/10 focus:border-primary-500 focus:ring-primary-500' : isEmailValid(formData.email) ? 'border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500' : 'border-red-500/30 focus:border-red-500 focus:ring-red-500'}`}
            />
            {touched.email && isEmailValid(formData.email) && (
              <Check size={16} className="text-emerald-400 absolute right-4 top-1/2 -translate-y-1/2" />
            )}
          </div>

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
              className={`w-full bg-slate-950/30 border text-white rounded-xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:ring-1 transition
                ${!touched.password ? 'border-white/10 focus:border-primary-500 focus:ring-primary-500' : isPasswordValid(formData.password) ? 'border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500' : 'border-red-500/30 focus:border-red-500 focus:ring-red-500'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition shadow-md shadow-primary-950/30 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative px-3 bg-slate-900 text-xxs text-slate-500 uppercase tracking-widest">Or authenticate via</span>
        </div>

        {/* Single-click Google login wrapper */}
        <div className="flex justify-center w-full">
          <div className="w-full flex justify-center [&>div]:w-full [&_iframe]:w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-in authentication failed')}
              theme="filled_dark"
              shape="pill"
              text="continue_with"
              width="100%"
            />
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          By signing in, you consent to our anonymous medical query processing guidelines.
        </p>
      </motion.div>
    </div>
  )
}
