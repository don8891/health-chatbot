import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, Bell, Search, User, Menu, X, MessageSquare } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Activity size={18} className="text-white" />
          </div>
          <span className="font-bold text-slate-800">HealthBot <span className="text-primary-600">AI</span></span>
        </div>

        {/* Search — hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2 w-72">
          <Search size={16} className="text-slate-400" />
          <input
            placeholder="Search health topics..."
            className="bg-transparent text-sm outline-none text-slate-600 placeholder-slate-400 w-full"
          />
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/chat')}
            className="hidden md:flex items-center gap-2 btn-primary py-2 px-4 text-sm"
          >
            <MessageSquare size={15} />
            Chat
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
              <Bell size={17} className="text-slate-600" />
            </button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </div>

          {/* Avatar */}
          <button className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center">
            <User size={17} className="text-white" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"
          >
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-2"
        >
          <button onClick={() => navigate('/chat')} className="btn-primary w-full text-center">
            Start Chat
          </button>
        </motion.div>
      )}
    </motion.nav>
  )
}
