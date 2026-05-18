import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

export default function LoadingSpinner({ message = 'Loading conversation...' }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">

      {/* Spinning ring */}
      <div className="relative w-14 h-14">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-transparent 
                     border-t-primary-500 border-r-primary-300"
        />
        <div className="absolute inset-2 bg-primary-50 rounded-full 
                        flex items-center justify-center">
          <Bot size={16} className="text-primary-600" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-slate-600">{message}</p>
        <p className="text-xs text-slate-400 mt-1">Please wait a moment</p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary-400"
          />
        ))}
      </div>
    </div>
  )
}
