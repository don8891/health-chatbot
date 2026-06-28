import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Type, Globe, Trash2, Shield, AlertTriangle, Check
} from 'lucide-react'
import { useSettings, useLocalHistory } from '../hooks/useLocalHistory'
import Layout from '../components/Layout'

function OptionButton({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200
        ${selected
          ? 'bg-primary-600 text-white shadow-md shadow-primary-950/20'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
    >
      {children}
    </button>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const { settings, updateSetting } = useSettings()
  const { chatHistory, wipeAllData } = useLocalHistory()
  const [showWipeConfirm, setShowWipeConfirm] = useState(false)
  const [wiped, setWiped] = useState(false)

  const handleWipe = () => {
    wipeAllData()
    setWiped(true)
    setShowWipeConfirm(false)
    setTimeout(() => {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_info')
      navigate('/')
    }, 1500)
  }

  const textSizeClass = {
    small:  'text-sm',
    medium: 'text-base',
    large:  'text-lg'
  }[settings.textSize]

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className={`max-w-lg mx-auto px-4 py-8 space-y-6 ${textSizeClass}`}>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">App Settings</h1>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xxs font-bold uppercase tracking-wider">
              <Shield size={11} />
              Secure Session
            </div>
          </div>

          {/* ── Text Size ── */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-white/5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex items-center justify-center">
                <Type size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Text Size</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Adjust for better readability
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {['small', 'medium', 'large'].map(size => (
                <OptionButton
                  key={size}
                  selected={settings.textSize === size}
                  onClick={() => updateSetting('textSize', size)}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </OptionButton>
              ))}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Preview:{' '}
              <span className={textSizeClass}>
                This is how your text will look.
              </span>
            </p>
          </div>

          {/* ── Language ── */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-white/5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-50 dark:bg-purple-950/40 rounded-xl flex items-center justify-center">
                <Globe size={18} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Language</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Choose your preferred language
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['english', 'malayalam'].map(lang => (
                <OptionButton
                  key={lang}
                  selected={settings.language === lang}
                  onClick={() => updateSetting('language', lang)}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </OptionButton>
              ))}
            </div>
          </div>

          {/* ── Storage info ── */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-white/5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-50 dark:bg-green-950/40 rounded-xl flex items-center justify-center">
                <Shield size={18} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Your Privacy</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Secure encryption for private session data
                </p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <div className="flex justify-between">
                <span>Saved chats</span>
                <span className="font-bold text-slate-850 dark:text-slate-200">{chatHistory.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Sync</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Authenticated</span>
              </div>
              <div className="flex justify-between">
                <span>Data Protection</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">JWT Encrypted</span>
              </div>
            </div>
          </div>

          {/* ── Wipe Data ── */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-red-100 dark:border-red-950/20 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-50 dark:bg-red-950/40 rounded-xl flex items-center justify-center">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Wipe All App Data</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Clears all chats, settings, and logs out instantly
                </p>
              </div>
            </div>

            {wiped ? (
              <div className="flex items-center gap-2 text-green-600 text-xs font-semibold">
                <Check size={16} />
                All data cleared! Redirecting...
              </div>
            ) : (
              <button
                onClick={() => setShowWipeConfirm(true)}
                className="w-full py-3 rounded-xl bg-red-50 dark:bg-red-950/10 text-red-650 dark:text-red-400 border border-red-200 dark:border-red-900/30 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-950/25 transition duration-200"
              >
                🗑️ Clear All Data & Reset App
              </button>
            )}
          </div>

          <p className="text-center text-xxs text-slate-500 dark:text-slate-600 pb-4">
            HealthBeacon · Secure Triage Client
          </p>
        </div>
      </div>

      {/* ── Wipe confirmation modal ── */}
      <AnimatePresence>
        {showWipeConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWipeConfirm(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 bottom-8 md:inset-x-auto md:left-1/2 
                         md:-translate-x-1/2 md:w-96 z-50
                         bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-950/40 rounded-full flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-150">Wipe All Data?</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    This cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                This will permanently delete all{' '}
                <strong>{chatHistory.length} saved chats</strong> and 
                reset all settings. Are you sure?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWipeConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWipe}
                  className="flex-1 py-3 rounded-xl bg-red-650 hover:bg-red-700 text-white text-xs font-bold transition shadow-md shadow-red-950/20"
                >
                  Yes, Wipe Everything
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  )
}
