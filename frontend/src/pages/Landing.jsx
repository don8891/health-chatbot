import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Activity, Heart, ChevronRight, MessageSquare,
  ChevronDown, Sparkles, CheckCircle, Zap
} from 'lucide-react'

// ── Count-up component (IntersectionObserver driven) ──
function StatCounter({ value, suffix = '', label, desc, delay = 0 }) {
  const [count, setCount] = useState(0)
  const [triggered, setTriggered] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true) },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!triggered) return
    let start = null
    let rafId = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 2000, 1)
      const ease = 1 - Math.pow(1 - p, 3) // cubic ease-out
      setCount(Math.floor(ease * value))
      if (p < 1) rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
    return () => { if (rafId) cancelAnimationFrame(rafId) }
  }, [triggered, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay }}
      className="bg-white/80 backdrop-blur-sm border border-[#EDE9FE] p-7 rounded-3xl shadow-sm
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group"
    >
      <p className="text-4xl font-black bg-gradient-to-r from-[#6C63FF] to-[#06B6D4] bg-clip-text text-transparent mb-2">
        {count}{suffix}
      </p>
      <p className="text-sm font-bold text-slate-800 mb-1.5">{label}</p>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </motion.div>
  )
}

// ── Features data ──
const features = [
  {
    icon: MessageSquare,
    title: "AI Symptom Triage",
    desc: "Describe what you feel in simple, conversational language and receive instant, personalized health breakdowns.",
    iconBg: "bg-[#6C63FF]/10",
    iconColor: "text-[#6C63FF]"
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "We prioritize security. Your health inquiries are completely anonymous, with zero personal data tracking or profiling.",
    iconBg: "bg-[#06B6D4]/10",
    iconColor: "text-[#06B6D4]"
  },
  {
    icon: Zap,
    title: "Emergency Detection",
    desc: "Automatic clinical emergency keyword intercepts to instantly flag critical symptoms and connect you to responders.",
    iconBg: "bg-[#EF4444]/10",
    iconColor: "text-[#EF4444]"
  }
]

// ── Testimonials data ──
const testimonials = [
  {
    quote: "HealthBeacon helped me understand my migraine triggers without scrolling through terrifying forums. It's calm, simple, and reassuring.",
    author: "Elena R.",
    role: "Mother of two",
    initial: "E"
  },
  {
    quote: "The interface is perfect for my elderly father. Large text, no unnecessary boxes, and immediate answers. Exceptional accessibility.",
    author: "David K.",
    role: "Caregiver",
    initial: "D"
  }
]

// ── FAQ data ──
const faqs = [
  {
    q: "Is HealthBeacon AI a replacement for a real doctor?",
    a: "No. HealthBeacon AI is purely for educational guidance and triage support. It helps you understand what symptoms could mean, but never replaces professional clinical diagnoses. Always seek a doctor's care for diagnoses and treatment."
  },
  {
    q: "How does the app protect my privacy?",
    a: "We do not store your name, email, or chat histories on our servers unless you explicitly sign up. All guest queries are executed anonymously, keeping your sensitive health concerns completely private."
  },
  {
    q: "What happens if I type an emergency symptom?",
    a: "Our system immediately scans for critical warning signs (like severe chest pain or difficulty breathing). If triggered, the AI session flags the emergency and displays a high-contrast call-to-action banner."
  }
]

// Motion variants for smooth scroll reveals
const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }
const staggerContainer = { visible: { transition: { staggerChildren: 0.1 } } }

export default function Landing() {
  const [clicked, setClicked]     = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)
  const navigate = useNavigate()

  const handleStart = () => {
    setClicked(true)
    setTimeout(() => {
      if (localStorage.getItem('auth_token')) navigate('/home')
      else navigate('/auth')
    }, 500)
  }

  return (
    <AnimatePresence>
      {!clicked ? (
        <motion.div
          key="landing"
          exit={{ opacity: 0, scale: 0.97, y: -8 }}
          transition={{ duration: 0.35 }}
          className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#FAFBFF] text-slate-800 font-sans"
        >

          {/* ══════════════════════════════
              ANIMATED AURORA BACKGROUND
          ══════════════════════════════ */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
            {/* Primary aurora blobs */}
            <div className="absolute -top-48 -left-48 w-[800px] h-[800px] rounded-full
                            bg-[#6C63FF]/10 blur-[160px] animate-aurora-1" />
            <div className="absolute top-1/2 -right-64 w-[700px] h-[700px] rounded-full
                            bg-[#7C3AED]/8 blur-[140px] animate-aurora-2" />
            <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full
                            bg-[#06B6D4]/6 blur-[120px] animate-aurora-3" />
            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#6C63FF]/20"
                style={{
                  width:  `${4 + (i % 3) * 3}px`,
                  height: `${4 + (i % 3) * 3}px`,
                  top:    `${10 + i * 11}%`,
                  left:   `${4 + i * 12}%`,
                }}
                animate={{ y: [0, -18, 0], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 3 + i * 0.6, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
              />
            ))}
            {/* Right-side cyan particles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`c${i}`}
                className="absolute rounded-full bg-[#06B6D4]/20"
                style={{
                  width: '6px', height: '6px',
                  top:   `${20 + i * 20}%`,
                  right: `${5 + i * 8}%`,
                }}
                animate={{ y: [0, -12, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 4 + i * 0.4, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
              />
            ))}
          </div>

          {/* ══════════════════════════════
              HEADER
          ══════════════════════════════ */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6C63FF] to-[#7C3AED] rounded-2xl
                              flex items-center justify-center shadow-lg shadow-[#6C63FF]/30">
                <Activity size={20} className="text-white" />
              </div>
              <span className="font-extrabold text-xl text-slate-800 tracking-tight">
                Health<span className="text-[#6C63FF]">Beacon</span> AI
              </span>
            </div>
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-2.5 rounded-full bg-white border border-[#6C63FF]/20
                         hover:border-[#6C63FF]/50 hover:bg-[#EDE9FE]/50 text-slate-700
                         text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              Sign In
            </button>
          </motion.header>

          {/* ══════════════════════════════
              HERO SECTION
          ══════════════════════════════ */}
          <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20
                           grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left: Headlines & CTAs */}
            <div className="lg:col-span-6 space-y-8">

              {/* Animated badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-2 bg-[#6C63FF]/10 border border-[#6C63FF]/25
                           text-[#6C63FF] px-4 py-2 rounded-full text-xs font-bold shadow-sm"
              >
                <Sparkles size={13} />
                Premium SaaS Healthcare AI
              </motion.div>

              {/* Headline — stagger words */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.15 }}
                  className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900
                             leading-[1.05] tracking-tight"
                >
                  Your Personal
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.3 }}
                >
                  <span className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05]
                                   tracking-tight text-transparent bg-clip-text
                                   bg-gradient-to-r from-[#6C63FF] via-[#7C3AED] to-[#06B6D4]">
                    AI Health Guide
                  </span>
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.42 }}
                className="text-slate-500 text-lg sm:text-xl leading-relaxed max-w-lg"
              >
                Get trusted health guidance, symptom awareness, and personalized
                recommendations powered by clinical AI.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.52 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={handleStart}
                  className="flex items-center justify-center gap-2.5 text-white font-bold
                             text-base px-8 py-4 rounded-2xl
                             bg-gradient-to-r from-[#6C63FF] to-[#7C3AED]
                             hover:from-[#5B54E8] hover:to-[#6D28D9]
                             transition-all hover:scale-[1.03] active:scale-[0.97]
                             shadow-xl shadow-[#6C63FF]/30"
                >
                  Get Started <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="flex items-center justify-center gap-2 bg-white border border-slate-200
                             hover:border-[#6C63FF]/40 hover:bg-[#EDE9FE]/30
                             text-slate-700 font-bold text-base px-8 py-4 rounded-2xl
                             shadow-sm transition-all active:scale-[0.97]"
                >
                  Continue with Google
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex items-center gap-6 text-xs text-slate-400 font-semibold
                           border-t border-slate-200/60 pt-4 max-w-md"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-[#22C55E]" /> HIPAA Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-[#22C55E]" /> 100% Anonymous
                </span>
              </motion.div>
            </div>

            {/* Right: Floating Medical Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="lg:col-span-6 flex justify-center items-center relative"
            >
              <div className="w-full max-w-md relative z-10 bg-white/70 backdrop-blur-xl
                              border border-white/90 p-8 rounded-[36px]
                              shadow-2xl shadow-[#6C63FF]/10 animate-float-slow">

                {/* Animated ECG SVG */}
                <div className="bg-gradient-to-br from-[#6C63FF]/5 to-[#06B6D4]/5 rounded-2xl
                                py-6 px-4 mb-6 relative overflow-hidden border border-[#6C63FF]/10 glowing-border">
                  <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
                    <defs>
                      <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6C63FF" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 50 L40 50 L50 20 L70 80 L80 50 L120 50 L130 10 L150 90 L160 50 L200 50"
                      fill="none"
                      stroke="url(#ecgGrad)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3.5"
                    >
                      <animate attributeName="stroke-dasharray" dur="3s" from="0, 1000" to="1000, 0" repeatCount="indefinite" />
                    </path>
                    <circle cx="160" cy="50" fill="#6C63FF" r="5">
                      <animate attributeName="r" dur="1.5s" repeatCount="indefinite" values="5;9;5" />
                      <animate attributeName="opacity" dur="1.5s" repeatCount="indefinite" values="1;0.3;1" />
                    </circle>
                  </svg>
                </div>

                {/* Telemetry Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6C63FF]/10 rounded-xl flex items-center justify-center">
                      <Heart size={20} className="text-[#6C63FF]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Heart Health Index</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        Telemetry Diagnostics
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold">
                    NORMAL
                  </span>
                </div>
              </div>

              {/* Floating mini badges */}
              <div className="absolute -top-6 -right-4 bg-white border border-[#EDE9FE] p-3.5
                              rounded-2xl shadow-xl flex items-center gap-2.5 animate-float-medium z-20">
                <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center">
                  <Sparkles size={14} className="text-[#6C63FF]" />
                </div>
                <span className="text-xs font-bold text-slate-700">AI Assistant</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white border border-[#EDE9FE] p-3.5
                              rounded-2xl shadow-xl flex items-center gap-2.5 animate-float-fast z-20">
                <div className="w-7 h-7 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
                  <CheckCircle size={13} className="text-[#22C55E]" />
                </div>
                <span className="text-xs font-bold text-slate-700">Secure Session</span>
              </div>
            </motion.div>
          </main>

          {/* ══════════════════════════════
              STATS SECTION (Count-up)
          ══════════════════════════════ */}
          <section className="relative z-10 max-w-7xl mx-auto w-full px-6 py-16">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Trusted by Thousands
              </h2>
              <p className="text-slate-500 text-sm mt-2">Evidence-based AI triage built to scale</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCounter value={300} suffix="+" label="Diseases Documented"
                desc="Symptom matching from certified medical indexes." delay={0} />
              <StatCounter value={132} suffix="+" label="Symptom Profiles"
                desc="Immediate insights tailored to your descriptions." delay={0.1} />
              <StatCounter value={100} suffix="%" label="Anonymous & Free"
                desc="No profiling, no credit cards required." delay={0.2} />
            </div>
          </section>

          {/* ══════════════════════════════
              FEATURES SECTION
          ══════════════════════════════ */}
          <section className="relative z-10 max-w-7xl mx-auto w-full px-6 py-16">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto mb-14"
            >
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Enabling Access to Simple Health Insights
              </h2>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                HealthBeacon AI brings visual clarity and clean information parsing to health triage.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
              variants={staggerContainer}
            >
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm
                               hover:shadow-2xl transition-all duration-300 cursor-default group"
                  >
                    <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center
                                    justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon size={26} className={feature.iconColor} />
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-lg mb-3">{feature.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </section>

          {/* ══════════════════════════════
              TESTIMONIALS
          ══════════════════════════════ */}
          <section className="relative z-10 max-w-7xl mx-auto w-full px-6 py-16
                              bg-gradient-to-br from-[#6C63FF]/5 to-[#7C3AED]/5
                              border border-[#EDE9FE]/80 rounded-[40px] my-8">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Reassurance When You Need It Most
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((test, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  className="bg-white border border-slate-100 p-7 rounded-3xl shadow-sm
                             hover:shadow-lg transition flex flex-col justify-between"
                >
                  <p className="text-slate-600 text-sm italic leading-relaxed mb-6">"{test.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#7C3AED]
                                    flex items-center justify-center font-black text-white text-sm">
                      {test.initial}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{test.author}</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">{test.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════
              FAQ SECTION
          ══════════════════════════════ */}
          <section className="relative z-10 max-w-3xl mx-auto w-full px-6 py-16">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </motion.div>
            <div className="space-y-4">
              {faqs.map((faq, i) => {
                const isOpen = activeFaq === i
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left
                                 font-bold text-slate-800 hover:text-[#6C63FF] transition"
                    >
                      <span className="text-sm pr-4">{faq.q}</span>
                      <ChevronDown
                        size={18}
                        className={`flex-shrink-0 transition-transform duration-200 text-slate-400
                                    ${isOpen ? 'rotate-180 text-[#6C63FF]' : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="border-t border-slate-100 bg-[#FAFBFF]"
                        >
                          <p className="p-5 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </section>

          {/* ══════════════════════════════
              CTA BANNER
          ══════════════════════════════ */}
          <section className="relative z-10 max-w-5xl mx-auto w-full px-6 pb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-[#6C63FF] to-[#7C3AED] rounded-[32px] p-12 text-center
                         text-white shadow-2xl shadow-[#6C63FF]/25 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none
                              bg-[radial-gradient(circle_at_30%_30%,white,transparent)]" />
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-black mb-4 relative z-10"
              >
                Ready to Take Control of Your Health?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-sm mb-8 relative z-10 max-w-xl mx-auto"
              >
                Join thousands of users who trust HealthBeacon AI for quick, anonymous health guidance.
              </motion.p>
              <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                           bg-white text-[#6C63FF] font-bold hover:bg-slate-50 transition shadow-lg"
              >
                Get Started Free <ChevronRight size={18} />
              </motion.button>
            </motion.div>
          </section>

          {/* ══════════════════════════════
              FOOTER
          ══════════════════════════════ */}
          <footer className="relative z-10 bg-slate-900 text-white mt-4 rounded-t-[40px] pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8
                            border-b border-white/5 pb-12">
              <div className="col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#6C63FF]/20 rounded-xl flex items-center justify-center">
                    <Activity size={16} className="text-[#A78BFA]" />
                  </div>
                  <span className="font-extrabold text-lg">HealthBeacon AI</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                  Premium healthcare AI providing private, simple, and immediate symptom triage
                  and educational health guidelines.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Product</p>
                <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                  <li><button onClick={() => navigate('/auth')} className="hover:text-white transition">Get Started</button></li>
                  <li><button onClick={() => navigate('/auth')} className="hover:text-white transition">Sign In</button></li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Safety</p>
                <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                  <li><a href="#triage" className="hover:text-white transition">Triage Standards</a></li>
                  <li><a href="#emergency" className="hover:text-white transition">Emergency Signs</a></li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Legal</p>
                <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                  <li><a href="#privacy" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#terms" className="hover:text-white transition">Terms of Use</a></li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-slate-500">
                © {new Date().getFullYear()} HealthBeacon AI. All rights reserved.
              </p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Heart size={10} className="text-[#EF4444] animate-pulse" />
                For educational guidance only. Always consult a qualified doctor.
              </p>
            </div>
          </footer>
        </motion.div>

      ) : (
        // Transition spinner
        <motion.div
          key="transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center bg-[#FAFBFF]"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}
              className="w-12 h-12 rounded-full mx-auto mb-4 border-[3px] border-[#6C63FF] border-t-transparent"
            />
            <p className="text-slate-500 text-sm font-semibold animate-pulse">Opening HealthBeacon AI...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
