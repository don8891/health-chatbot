import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
         style={{ background: 'linear-gradient(135deg, #0a0f0d 0%, #0d2018 50%, #0a0f0d 100%)' }}>
      
      {/* Animated pulse circle */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, #1D9E75 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center z-10"
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          🏥
        </motion.div>

        <h1 className="text-5xl font-bold mb-4"
            style={{ color: '#e8f5f0', textShadow: '0 0 40px #1D9E75' }}>
          HealthBot AI
        </h1>
        
        <p className="text-xl mb-2" style={{ color: '#9FDEC8' }}>
          AI-Driven Public Health Awareness
        </p>
        
        <p className="text-base mb-10 max-w-md mx-auto" style={{ color: '#5DCAA5' }}>
          Describe your symptoms. Get instant disease awareness, precautions, and doctor guidance — powered by AI.
        </p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px #1D9E75' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/chat')}
          className="px-10 py-4 rounded-2xl text-lg font-semibold text-white"
          style={{ background: 'linear-gradient(90deg, #0F6E56, #1D9E75)' }}
        >
          Check Symptoms →
        </motion.button>

        {/* Feature pills */}
        <div className="flex gap-3 mt-8 justify-center flex-wrap">
          {['Disease Awareness', 'Precautions', 'Doctor Tips', 'RAG AI'].map((tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="px-4 py-1 rounded-full text-sm"
              style={{ border: '1px solid #1D9E75', color: '#9FDEC8', background: 'rgba(29,158,117,0.1)' }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
