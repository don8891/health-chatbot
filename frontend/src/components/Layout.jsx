import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Menu, X, LayoutDashboard, MessageSquare,
  Settings, LogOut, Sun, Moon, User
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen]             = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [user, setUser]                         = useState(null)

  const navigate  = useNavigate()
  const location  = useLocation()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_info')
      if (stored) setUser(JSON.parse(stored))
    } catch (err) {
      console.error('Error loading user info:', err)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
    navigate('/')
  }

  const navItems = [
    { label: 'Dashboard',      path: '/home',     icon: LayoutDashboard },
    { label: 'Chat Assistant', path: '/chat',     icon: MessageSquare   },
    { label: 'Settings',       path: '/settings', icon: Settings        },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-[#13131f] border-r border-slate-200/80 dark:border-white/[0.06] text-slate-700 dark:text-slate-300 transition-colors duration-300">

      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100 dark:border-white/[0.06] flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-[#6C63FF] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
          <Activity size={17} className="text-white" />
        </div>
        {!desktopCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-black text-sm tracking-tight text-slate-800 dark:text-slate-100"
          >
            Health<span className="text-[#6C63FF]">Beacon</span>
          </motion.span>
        )}
      </div>

      {/* User Profile Strip */}
      <div className="px-4 py-4 border-b border-slate-100 dark:border-white/[0.06] flex items-center gap-3 flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-[#6C63FF]/10 dark:bg-[#6C63FF]/20 border-2 border-[#6C63FF]/20 dark:border-[#6C63FF]/30
                        flex items-center justify-center text-[#6C63FF] font-black text-sm flex-shrink-0">
          {user?.name ? user.name[0].toUpperCase() : <User size={16} />}
        </div>
        {!desktopCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-w-0 flex-1"
          >
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{user?.email || 'healthbeacon.ai'}</p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <button
              key={item.label}
              onClick={() => { navigate(item.path); setMobileOpen(false) }}
              title={desktopCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold
                          transition-all duration-200
                          ${isActive
                            ? 'bg-gradient-to-r from-[#6C63FF] to-[#7C3AED] text-white shadow-md shadow-[#6C63FF]/20'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-800 dark:hover:text-slate-100'}`}
            >
              <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
              {!desktopCollapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-100 dark:border-white/[0.06] space-y-1 flex-shrink-0">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold
                     text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]
                     hover:text-slate-800 dark:hover:text-slate-100 transition"
        >
          {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-400" />}
          {!desktopCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold
                     text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition"
        >
          <LogOut size={17} />
          {!desktopCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-[var(--page-bg)] font-sans transition-colors duration-300">

      {/* ─── DESKTOP SIDEBAR ─── */}
      <div
        className={`hidden md:block flex-shrink-0 border-r border-slate-200/80 dark:border-white/[0.06] transition-all duration-300
                    ${desktopCollapsed ? 'w-16' : 'w-60'}`}
      >
        <div className="h-screen sticky top-0">
          <SidebarContent />
        </div>
      </div>

      {/* ─── MAIN VIEWPORT ─── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">

        {/* Top Bar */}
        <header className="h-14 border-b border-slate-200/80 dark:border-white/[0.06]
                           bg-white/80 dark:bg-[#13131f]/90 backdrop-blur-md
                           sticky top-0 z-30 px-4 flex items-center justify-between shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-[#6C63FF] hover:bg-[#6C63FF]/10 md:hidden transition"
            >
              <Menu size={20} />
            </button>

            {/* Collapse toggle for desktop */}
            <button
              onClick={() => setDesktopCollapsed(!desktopCollapsed)}
              className="hidden md:flex p-2 -ml-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-[#6C63FF] hover:bg-[#6C63FF]/10 transition"
              title={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu size={20} />
            </button>

            {/* Mobile logo */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-7 h-7 bg-gradient-to-br from-[#6C63FF] to-[#7C3AED] rounded-lg flex items-center justify-center">
                <Activity size={14} className="text-white" />
              </div>
              <span className="font-black text-xs text-slate-800 dark:text-slate-100 tracking-tight">
                Health<span className="text-[#6C63FF]">Beacon</span>
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {children}
        </main>
      </div>

      {/* ─── MOBILE DRAWER ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-900 dark:bg-black z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-64 z-50 md:hidden shadow-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition z-10"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
