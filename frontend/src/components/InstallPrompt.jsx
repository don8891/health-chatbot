import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'

export default function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showBanner, setShowBanner]       = useState(false)
  const [installed, setInstalled]         = useState(false)

  useEffect(() => {
    // Catch browser's install prompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowBanner(true)
    })

    // Hide if already installed
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setShowBanner(false)
    })
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      setShowBanner(false)
    }
  }

  if (installed) return null

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{   y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 
                     md:w-96 z-50"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl
                          border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-start gap-3">

              {/* Icon */}
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30
                              rounded-xl flex items-center justify-center flex-shrink-0">
                <Smartphone size={20} className="text-primary-600" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                  Install HealthBot AI
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Add to your home screen for instant access. Works offline too!
                </p>

                {/* Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleInstall}
                    className="flex items-center gap-1.5 bg-primary-600 text-white
                               text-xs font-semibold px-4 py-2 rounded-xl
                               hover:bg-primary-700 transition"
                  >
                    <Download size={13} />
                    Install App
                  </button>
                  <button
                    onClick={() => setShowBanner(false)}
                    className="text-xs text-slate-500 px-3 py-2 rounded-xl
                               hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    Not now
                  </button>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={() => setShowBanner(false)}
                className="text-slate-400 hover:text-slate-600 flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
