import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  Activity, ShieldAlert,
  BookOpen, MapPin, Phone, TrendingUp, ArrowRight
} from 'lucide-react'

const quickActions = [
  { icon: Activity,     label: 'Symptom\nTracker',    color: 'bg-blue-100 text-blue-600',   route: '/chat' },
  { icon: BookOpen,     label: 'Medical\nDictionary', color: 'bg-green-100 text-green-600', route: '/chat' },
  { icon: MapPin,       label: 'Find a\nClinic',      color: 'bg-purple-100 text-purple-600', route: '/chat' },
  { icon: Phone,        label: 'Emergency\nContacts', color: 'bg-red-100 text-red-600',     route: '/chat' },
]

const trendingTopics = [
  { title: 'Understanding Diabetes', tag: 'Prevention',  color: 'bg-blue-50  border-blue-200' },
  { title: 'Managing Hypertension',  tag: 'Awareness',   color: 'bg-green-50 border-green-200' },
  { title: 'Dengue Fever Signs',     tag: 'Alert',       color: 'bg-red-50   border-red-200' },
  { title: 'Mental Health Basics',   tag: 'Wellness',    color: 'bg-purple-50 border-purple-200' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-12">

        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-64 h-full opacity-10">
            <Activity size={200} className="absolute -right-8 -top-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Good day! 👋</h2>
          <p className="text-primary-100 mb-6 max-w-md">
            How are you feeling today? Describe your symptoms and get instant AI-powered health awareness.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/chat')}
            className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-xl 
                       flex items-center gap-2 hover:bg-primary-50 transition"
          >
            Check Symptoms Now <ArrowRight size={16} />
          </motion.button>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
          >
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-600" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(({ icon: Icon, label, color, route }) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(route)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 transition"
                >
                  <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-xs text-slate-600 font-medium text-center whitespace-pre-line">
                    {label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Trending Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 lg:col-span-2"
          >
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
              <ShieldAlert size={18} className="text-health-500" />
              Trending Health Topics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trendingTopics.map((topic) => (
                <motion.div
                  key={topic.title}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate('/chat')}
                  className={`p-4 rounded-xl border ${topic.color} cursor-pointer transition`}
                >
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {topic.tag}
                  </span>
                  <p className="font-medium text-slate-700 dark:text-slate-200 mt-1">{topic.title}</p>
                  <div className="flex items-center gap-1 mt-2 text-primary-600 text-sm">
                    Learn more <ArrowRight size={12} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  )
}
