import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4"
      style={{ background: 'rgba(10,15,13,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1D9E7520' }}
    >
      <Link to="/" className="font-bold text-lg" style={{ color: '#1D9E75' }}>🏥 HealthBot</Link>
      <div className="flex gap-6 text-sm" style={{ color: '#9FDEC8' }}>
        <Link to="/" className="hover:text-white transition">Home</Link>
        <Link to="/chat" className="hover:text-white transition">Chat</Link>
      </div>
    </motion.nav>
  )
}
