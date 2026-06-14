import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, Menu, X, LayoutDashboard, MessageSquare, 
  Settings, LogOut, Sun, Moon
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [user, setUser] = useState(null)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  // Load user data
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
    { label: 'Dashboard', path: '/home', icon: LayoutDashboard },
    { label: 'Chat Assistant', path: '/chat', icon: MessageSquare },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 border-r border-white/5 text-white">
      {/* Header / Brand */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/5 flex-shrink-0">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-md">
          <Activity size={18} className="text-white" />
        </div>
        {!desktopCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="font-bold text-sm sm:text-base tracking-tight"
          >
            Health<span className="text-primary-400">Beacon</span>
          </motion.span>
        )}
      </div>

      {/* User profile section */}
      <div className="p-4 border-b border-white/5 flex items-center gap-3 flex-shrink-0">
        {user?.avatar ? (
          <img src={user.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover border border-white/10" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary-800 flex items-center justify-center text-white font-bold text-sm">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
        )}
        {!desktopCollapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="min-w-0 flex-1"
          >
            <p className="text-xs font-semibold truncate text-slate-200">{user?.name || 'User'}</p>
            <p className="text-xxs truncate text-slate-500">{user?.email || 'patient@healthbeacon.ai'}</p>
          </motion.div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path)
                setMobileOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                ${isActive 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-950/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
              title={desktopCollapsed ? item.label : undefined}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
              {!desktopCollapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-white/5 space-y-1 flex-shrink-0">
        {/* Toggle Theme button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-slate-200 transition"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {!desktopCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition"
        >
          <LogOut size={18} />
          {!desktopCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans transition-colors duration-300">
      
      {/* ─────────────────── DESKTOP SIDEBAR ─────────────────── */}
      <div 
        className={`hidden md:block flex-shrink-0 border-r border-white/5 transition-all duration-300
          ${desktopCollapsed ? 'w-16' : 'w-60'}`}
      >
        <div className="h-screen sticky top-0">
          <SidebarContent />
        </div>
      </div>

      {/* ─────────────────── MAIN VIEWPORT WRAPPER ─────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
        
        {/* TOPBAR */}
        <header className="h-16 border-b border-white/5 bg-slate-900/40 backdrop-blur-md sticky top-0 z-30 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white md:hidden transition"
            >
              <Menu size={20} />
            </button>

            {/* Collapse button for desktop */}
            <button
              onClick={() => setDesktopCollapsed(!desktopCollapsed)}
              className="hidden md:flex p-2 -ml-2 rounded-lg text-slate-400 hover:text-white transition"
              title={desktopCollapsed ? 'Expand menu' : 'Collapse menu'}
            >
              <Menu size={20} />
            </button>

            {/* Mobile-only logo */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                <Activity size={15} className="text-white" />
              </div>
              <span className="font-bold text-xs tracking-tight">HealthBeacon</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick action: Enter Chat badge/shortcut */}
            {location.pathname !== '/chat' && (
              <button
                onClick={() => navigate('/chat')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-500/20 text-xxs font-bold text-primary-400 hover:bg-primary-600 hover:text-white transition-all duration-200"
              >
                <MessageSquare size={12} />
                <span>Enter Chat</span>
              </button>
            )}
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {children}
        </main>
      </div>

      {/* ─────────────────── MOBILE SIDEBAR DRAWER ─────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 z-50 md:hidden shadow-2xl"
            >
              {/* Close Button Inside Sidebar top */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-4 p-2 rounded-lg text-slate-400 hover:text-white transition"
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
