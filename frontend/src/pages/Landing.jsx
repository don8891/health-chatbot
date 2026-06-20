import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Shield, Activity, Heart, ChevronRight, MessageSquare,
  ChevronDown, Sparkles, CheckCircle 
} from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: "AI Symptom Triage",
    desc: "Describe what you feel in simple, conversational language and receive instant, personalized health breakdowns.",
    color: "bg-[#0F6E56]/10 text-[#0F6E56]"
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "We prioritize security. Your health inquiries are completely anonymous, with zero personal data tracking or profiling.",
    color: "bg-[#4A90E2]/10 text-[#4A90E2]"
  },
  {
    icon: Activity,
    title: "Emergency Safety Net",
    desc: "Equipped with automatic clinical emergency keyword intercepts to instantly connect you to ambulance services.",
    color: "bg-[#D9534F]/10 text-[#D9534F]"
  }
]

const testimonials = [
  {
    quote: "HealthBeacon helped me understand my migraine triggers without scrolling through terrifying WebMD forums. It's calm, simple, and reassuring.",
    author: "Elena R.",
    role: "Mother of two"
  },
  {
    quote: "The interface is perfect for my elderly father. Large text, no unnecessary boxes, and immediate answers. Exceptional accessibility.",
    author: "David K.",
    role: "Caregiver"
  }
]

const faqs = [
  {
    q: "Is HealthBeacon AI a replacement for a real doctor?",
    a: "No. HealthBeacon AI is purely for educational guidance and triage support. It helps you understand what symptoms could mean, but never replaces professional clinical diagnoses. Always seek a doctor's care for diagnoses and treatment."
  },
  {
    q: "How does the app protect my privacy?",
    a: "We do not store your name, email, or chat histories on our servers unless you explicitly sign up for a secure account. All guest triage queries are executed anonymously, keeping your sensitive health concerns completely private."
  },
  {
    q: "What happens if I type an emergency symptom?",
    a: "Our system immediately scans for critical warning signs (like severe chest pain or difficulty breathing). If triggered, the AI session pauses and displays a high-contrast emergency phone banner to call services instantly."
  }
]

export default function Landing() {
  const [clicked, setClicked] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)
  const navigate = useNavigate()

  const handleStart = () => {
    setClicked(true)
    setTimeout(() => {
      // Check if logged in, otherwise go to auth
      if (localStorage.getItem('auth_token')) {
        navigate('/home')
      } else {
        navigate('/auth')
      }
    }, 500)
  }

  return (
    <AnimatePresence>
      {!clicked ? (
        <motion.div
          key="landing"
          exit={{ opacity: 0, scale: 0.97, y: -8 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#F7FAF9] text-slate-800 font-sans"
        >
          {/* Decorative Aurora Glow Blobs */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#1D9E75]/5 blur-[120px] animate-pulse-slow" />
            <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-[#4A90E2]/5 blur-[100px] animate-pulse-slow" />
          </div>

          {/* ── Header ── */}
          <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#0F6E56] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0F6E56]/10">
                <Activity size={20} className="text-white" />
              </div>
              <span className="font-extrabold text-xl text-slate-800 tracking-tight">
                Health<span className="text-[#1D9E75]">Beacon</span> AI
              </span>
            </div>
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-2.5 rounded-full bg-white border border-slate-200/80 hover:border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              Sign In
            </button>
          </header>

          {/* ── Hero Section ── */}
          <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Headings & CTA */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 bg-[#0F6E56]/8 border border-[#0F6E56]/20 text-[#0F6E56] px-4 py-2 rounded-full text-xs font-bold shadow-sm">
                <Sparkles size={14} className="text-[#1D9E75]" />
                Premium SaaS Healthcare AI
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Your Personal <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F6E56] to-[#1D9E75]">
                  AI Health Guide
                </span>
              </h1>

              <p className="text-slate-600 text-lg sm:text-xl leading-relaxed max-w-xl">
                Get trusted health guidance, symptom awareness, and personalized recommendations powered by AI.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={handleStart}
                  className="flex items-center justify-center gap-2.5 text-white font-bold text-base px-8 py-4.5 rounded-2xl shadow-lg bg-[#0F6E56] hover:bg-[#0b5240] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[#0F6E56]/20"
                >
                  Get Started <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="flex items-center justify-center gap-2 bg-white border border-slate-200/80 hover:border-slate-300 text-slate-700 font-bold text-base px-8 py-4.5 rounded-2xl shadow-sm hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                  Continue with Google
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4 text-xs text-slate-400 font-semibold border-t border-slate-200/60 max-w-md">
                <span className="flex items-center gap-1"><CheckCircle size={14} className="text-[#34C759]" /> HIPAA Compliant</span>
                <span className="flex items-center gap-1"><CheckCircle size={14} className="text-[#34C759]" /> 100% Anonymous</span>
              </div>
            </div>

            {/* Right Col: Premium Stethoscope/ECG Floating Illustration */}
            <div className="lg:col-span-6 flex justify-center items-center relative">
              <div className="w-full max-w-md relative z-10 bg-white/60 backdrop-blur-xl border border-white/80 p-8 rounded-[32px] shadow-2xl shadow-slate-200/40 animate-float-slow">
                
                {/* Embedded Heartbeat ECG SVG */}
                <div className="bg-[#0F6E56]/5 rounded-2xl py-6 px-4 mb-6 relative overflow-hidden glowing-border glowing-border-cyan">
                  <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
                    <path 
                      d="M0 50 L40 50 L50 20 L70 80 L80 50 L120 50 L130 10 L150 90 L160 50 L200 50" 
                      fill="none" 
                      stroke="#1D9E75" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="3.5"
                    >
                      <animate attributeName="stroke-dasharray" dur="3s" from="0, 1000" to="1000, 0" repeatCount="indefinite" />
                    </path>
                    <circle cx="160" cy="50" fill="#4A90E2" r="5">
                      <animate attributeName="r" dur="1.5s" repeatCount="indefinite" values="5;9;5" />
                      <animate attributeName="opacity" dur="1.5s" repeatCount="indefinite" values="1;0.4;1" />
                    </circle>
                  </svg>
                </div>

                {/* Floating Telemetry Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0F6E56]/10 rounded-xl flex items-center justify-center">
                      <Heart size={20} className="text-[#0F6E56]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Heart Health Index</p>
                      <p className="text-xxs text-slate-400 font-semibold uppercase tracking-wider">Telemetry Diagnostics</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#34C759]/10 text-[#34C759] text-xs font-bold">NORMAL</span>
                </div>
              </div>

              {/* Decorative mini cards */}
              <div className="absolute -top-6 -right-6 bg-white border border-slate-100 p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-float-medium z-20">
                <div className="w-8 h-8 rounded-lg bg-[#4A90E2]/15 flex items-center justify-center">
                  <Sparkles size={16} className="text-[#4A90E2]" />
                </div>
                <span className="text-xs font-bold text-slate-700">Floating AI Assistant</span>
              </div>
            </div>
          </main>

          {/* ── Statistics Cards ── */}
          <section className="relative z-10 max-w-7xl mx-auto w-full px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { value: '300+', label: 'Diseases Documented', desc: 'Symptom matching from certified medical indexes.' },
                { value: '132+', label: 'Symptom Profiles', desc: 'Immediate insights tailored to your descriptions.' },
                { value: '100%', label: 'Anonymous & Free', desc: 'No profiling, no credit cards required.' }
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all">
                  <p className="text-3xl font-black text-[#0F6E56] mb-1">{stat.value}</p>
                  <p className="text-sm font-bold text-slate-800 mb-2">{stat.label}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{stat.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Feature Showcase ── */}
          <section className="relative z-10 max-w-7xl mx-auto w-full px-6 py-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Enabling Access to Simple Health Insights</h2>
              <p className="text-slate-500 text-sm mt-3">HealthBeacon AI brings visual clarity and clean information parsing to triage.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all">
                    <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center mb-5`}>
                      <Icon size={22} />
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-lg mb-3">{feature.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{feature.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── Testimonials ── */}
          <section className="relative z-10 max-w-7xl mx-auto w-full px-6 py-16 bg-white/40 border border-slate-100/60 rounded-[40px] my-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reassurance When You Need It Most</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((test, i) => (
                <div key={i} className="bg-white border border-slate-100/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                  <p className="text-slate-600 text-sm italic leading-relaxed mb-6">"{test.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#0F6E56]">
                      {test.author[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{test.author}</p>
                      <p className="text-xxs text-slate-400 font-semibold uppercase">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ Section ── */}
          <section className="relative z-10 max-w-3xl mx-auto w-full px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => {
                const isOpen = activeFaq === i
                return (
                  <div key={i} className="bg-white border border-slate-150 rounded-2xl overflow-hidden transition-all shadow-sm">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-[#0F6E56] transition"
                    >
                      <span className="text-sm">{faq.q}</span>
                      <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-100 bg-slate-50/50"
                        >
                          <p className="p-5 text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── Beautiful Footer ── */}
          <footer className="relative z-10 bg-slate-900 text-white mt-16 rounded-t-[40px] pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-white/5 pb-12">
              <div className="col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                    <Activity size={16} className="text-white" />
                  </div>
                  <span className="font-extrabold text-lg text-white">HealthBeacon AI</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                  Apple & Stripe-inspired health awareness interface providing private, simple, and immediate symptom triage and educational guidelines.
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
                  <li><a href="#emergency" className="hover:text-white transition">Emergency Warning Signs</a></li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Legal</p>
                <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                  <li><a href="#privacy" className="hover:text-white transition">Privacy Guidelines</a></li>
                  <li><a href="#terms" className="hover:text-white transition">Usage Terms</a></li>
                </ul>
              </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xxs text-slate-500">
                &copy; {new Date().getFullYear()} HealthBeacon AI. All rights reserved. Registered PWA.
              </p>
              <p className="text-xxs text-slate-500 flex items-center gap-1">
                <Heart size={10} className="text-[#D9534F] animate-pulse" />
                For educational guidance only. Always consult a qualified doctor.
              </p>
            </div>
          </footer>
        </motion.div>
      ) : (
        <motion.div
          key="transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center bg-[#F7FAF9]"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}
              className="w-12 h-12 border-2 border-[#0F6E56] border-t-transparent 
                         rounded-full mx-auto mb-4"
            />
            <p className="text-slate-500 text-sm font-semibold animate-pulse">Opening HealthBeacon AI...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
