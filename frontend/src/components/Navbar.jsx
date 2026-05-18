import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Search, MessageSquare,
  Sun, Moon, User, ChevronDown,
  Type, Trash2, Shield, Check
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

// ── Text size option button ──
function SizeButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all
        ${active
          ? 'bg-primary-600 text-white shadow-sm'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
        }`}
    >
      {children}
    </button>
  )
}

export default function Navbar() {
  const navigate               = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [textSize, setTextSize]         = useState(
    () => localStorage.getItem('healthbot_textsize') || 'medium'
  )
  const [wipeSuccess, setWipeSuccess]   = useState(false)
  const dropdownRef = useRef(null)

  // Apply text size to <html> root
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('text-sm-global', 'text-md-global', 'text-lg-global')

    const map = { small: '14px', medium: '16px', large: '19px' }
    root.style.fontSize = map[textSize]
    localStorage.setItem('healthbot_textsize', textSize)
  }, [textSize])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
        setWipeSuccess(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Wipe all localStorage data
  const handleWipeData = () => {
    const confirmed = window.confirm(
      'Permanently wipe all chat and search histories?\n\nThis cannot be undone.'
    )
    if (confirmed) {
      localStorage.clear()
      setWipeSuccess(true)
      setTimeout(() => {
        setWipeSuccess(false)
        setDropdownOpen(false)
        navigate('/')
      }, 1500)
    }
  }

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 h-16
                 bg-white/90 dark:bg-slate-900/90
                 backdrop-blur-md
                 border-b border-slate-200 dark:border-slate-700
                 shadow-sm transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <div className="w-8 h-8 bg-primary-600 rounded-lg
                          flex items-center justify-center shadow-sm">
            <Activity size={18} className="text-white" />
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-100 text-base">
            HealthBot{' '}
            <span className="text-primary-600 dark:text-primary-400">AI</span>
          </span>
        </div>

        {/* ── Search Bar (hidden on mobile) ── */}
        <div className="hidden md:flex items-center gap-2
                        bg-slate-100 dark:bg-slate-800
                        border border-transparent dark:border-slate-700
                        hover:border-primary-300 dark:hover:border-primary-600
                        rounded-xl px-4 py-2 flex-1 max-w-sm
                        transition-all duration-200 group">
          <Search
            size={15}
            className="text-slate-400 dark:text-slate-500 group-hover:text-primary-500 transition"
          />
          <input
            placeholder="Search health topics..."
            className="bg-transparent text-sm outline-none
                       text-slate-600 dark:text-slate-300
                       placeholder-slate-400 dark:placeholder-slate-500 w-full"
          />
        </div>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Chat button */}
          <button
            onClick={() => navigate('/chat')}
            className="hidden md:flex items-center gap-2
                       bg-primary-600 hover:bg-primary-700
                       text-white text-sm font-semibold
                       px-4 py-2 rounded-xl transition-all duration-200
                       hover:scale-105 active:scale-95 shadow-sm"
          >
            <MessageSquare size={15} />
            Chat
          </button>

          {/* ── Dark / Light Mode Toggle ── */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 rounded-xl flex items-center justify-center
                       bg-slate-100 dark:bg-slate-800
                       hover:bg-slate-200 dark:hover:bg-slate-700
                       border border-slate-200 dark:border-slate-600
                       text-slate-600 dark:text-slate-300
                       transition-all duration-200"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate:  90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={17} className="text-amber-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90,  opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={17} className="text-slate-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* ── Profile / Settings Dropdown ── */}
          <div className="relative" ref={dropdownRef}>

            {/* Avatar trigger button */}
            <motion.button
              onClick={() => {
                setDropdownOpen(prev => !prev)
                setWipeSuccess(false)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 h-9 pl-2 pr-2 rounded-xl
                          border transition-all duration-200
                          ${dropdownOpen
                            ? 'bg-primary-50 border-primary-300 dark:bg-primary-900/30 dark:border-primary-600'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
            >
              {/* Avatar circle */}
              <div className="w-6 h-6 bg-primary-600 rounded-lg
                              flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>

              <motion.div
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown
                  size={13}
                  className="text-slate-500 dark:text-slate-400"
                />
              </motion.div>
            </motion.button>

            {/* ── Dropdown Menu ── */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1,    y: 0  }}
                  exit={{   opacity: 0, scale: 0.95, y: -8  }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-2 w-72
                             bg-white dark:bg-slate-800
                             border border-slate-200 dark:border-slate-700
                             rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  {/* Dropdown header */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700
                                  bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Quick Settings
                    </p>
                  </div>

                  <div className="p-3 space-y-1">

                    {/* ── Text Size ── */}
                    <div className="px-3 py-3 rounded-xl hover:bg-slate-50
                                    dark:hover:bg-slate-700/50 transition">
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="w-7 h-7 bg-blue-50 dark:bg-blue-900/30
                                        rounded-lg flex items-center justify-center">
                          <Type size={14} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          Text Size
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {['small', 'medium', 'large'].map(size => (
                          <SizeButton
                            key={size}
                            active={textSize === size}
                            onClick={() => setTextSize(size)}
                          >
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </SizeButton>
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 dark:bg-slate-700 mx-1" />

                    {/* ── Clear App Data ── */}
                    <button
                      onClick={handleWipeData}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl
                                 text-left transition-all duration-200
                                 hover:bg-red-50 dark:hover:bg-red-900/20 group"
                    >
                      <div className="w-7 h-7 bg-red-50 dark:bg-red-900/30
                                      group-hover:bg-red-100 dark:group-hover:bg-red-900/50
                                      rounded-lg flex items-center justify-center transition">
                        {wipeSuccess
                          ? <Check size={14} className="text-green-500" />
                          : <Trash2 size={14} className="text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium transition
                          ${wipeSuccess
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-slate-700 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-red-400'
                          }`}>
                          {wipeSuccess ? 'Data Cleared!' : 'Clear App Data'}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                          {wipeSuccess
                            ? 'Redirecting to home...'
                            : 'Wipe all chat history & settings'}
                        </p>
                      </div>
                    </button>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 dark:bg-slate-700 mx-1" />

                    {/* ── Privacy Notice ── */}
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <Shield size={13} className="text-green-500 flex-shrink-0" />
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Anonymous Guest Session
                      </p>
                      <span className="ml-auto w-2 h-2 rounded-full bg-green-400
                                       animate-pulse flex-shrink-0" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
