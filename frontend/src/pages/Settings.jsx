import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Type, Globe, Trash2,
  Shield, AlertTriangle, Check
} from 'lucide-react'
import { useSettings, useLocalHistory } from '../hooks/useLocalHistory'

function OptionButton({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
        ${selected
          ? 'bg-primary-600 text-white shadow-md'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
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
    setTimeout(() => navigate('/'), 1500)
  }

  const textSizeClass = {
    small:  'text-sm',
    medium: 'text-base',
    large:  'text-lg'
  }[settings.textSize]

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 
                      flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center 
                     justify-center hover:bg-slate-200 transition"
        >
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <h1 className="font-bold text-slate-800 text-lg">App Settings</h1>
        <div className="ml-auto flex items-center gap-1 bg-green-50 
                        border border-green-200 text-green-600 
                        px-3 py-1 rounded-full text-xs font-medium">
          <Shield size={11} />
          Anonymous Mode
        </div>
      </div>

      <div className={`max-w-lg mx-auto px-4 py-6 space-y-4 ${textSizeClass}`}>

        {/* ── Text Size ── */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-blue-50 rounded-xl 
                            flex items-center justify-center">
              <Type size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Text Size</p>
              <p className="text-xs text-slate-400">
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
          <p className="text-xs text-slate-400 mt-3">
            Preview:{' '}
            <span className={textSizeClass}>
              This is how your text will look.
            </span>
          </p>
        </div>

        {/* ── Language ── */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-purple-50 rounded-xl 
                            flex items-center justify-center">
              <Globe size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Language</p>
              <p className="text-xs text-slate-400">
                Choose your preferred language
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['english', 'hindi', 'malayalam', 'tamil'].map(lang => (
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
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-green-50 rounded-xl 
                            flex items-center justify-center">
              <Shield size={18} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Your Privacy</p>
              <p className="text-xs text-slate-400">
                All data stays on this device
              </p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600">
            <div className="flex justify-between py-1">
              <span>Saved chats</span>
              <span className="font-semibold">{chatHistory.length}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Account required</span>
              <span className="font-semibold text-green-600">None</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Data sent to server</span>
              <span className="font-semibold text-green-600">Never</span>
            </div>
          </div>
        </div>

        {/* ── Wipe Data ── */}
        <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-red-50 rounded-xl 
                            flex items-center justify-center">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Wipe All App Data</p>
              <p className="text-xs text-slate-400">
                Clears all chats and settings instantly
              </p>
            </div>
          </div>

          {wiped ? (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <Check size={16} />
              All data cleared! Redirecting...
            </div>
          ) : (
            <button
              onClick={() => setShowWipeConfirm(true)}
              className="w-full py-3 rounded-xl bg-red-50 text-red-600 
                         border border-red-200 text-sm font-semibold
                         hover:bg-red-100 transition"
            >
              🗑️ Clear All Data & Reset App
            </button>
          )}
        </div>

        {/* App version */}
        <p className="text-center text-xs text-slate-400 pb-4">
          HealthBot AI · Free & Open · No accounts ever
        </p>
      </div>

      {/* ── Wipe confirmation modal ── */}
      <AnimatePresence>
        {showWipeConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWipeConfirm(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 bottom-8 md:inset-x-auto md:left-1/2 
                         md:-translate-x-1/2 md:w-96 z-50
                         bg-white rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full 
                                flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Wipe All Data?</p>
                  <p className="text-xs text-slate-400">
                    This cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-6">
                This will permanently delete all{' '}
                <strong>{chatHistory.length} saved chats</strong> and 
                reset all settings. Are you sure?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWipeConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 
                             text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWipe}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white 
                             text-sm font-bold hover:bg-red-600 transition"
                >
                  Yes, Wipe Everything
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
