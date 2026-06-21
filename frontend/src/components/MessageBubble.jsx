import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Bot, User, ShieldAlert, Activity, AlertTriangle, Eye, ShieldCheck, CheckCircle } from 'lucide-react'
import { useSettings } from '../hooks/useLocalHistory'

function formatTime(timestamp) {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Custom parser to split medical AI markdown responses into card-based blocks
function parseMedicalSections(text) {
  if (!text) return []
  const sections = []
  const lines = text.split('\n')
  let currentSection = { header: '', content: [] }

  for (let line of lines) {
    if (line.trim().startsWith('###') || line.trim().startsWith('##')) {
      if (currentSection.header || currentSection.content.length > 0) {
        sections.push(currentSection)
      }
      currentSection = { header: line.trim(), content: [] }
    } else {
      currentSection.content.push(line)
    }
  }
  if (currentSection.header || currentSection.content.length > 0) {
    sections.push(currentSection)
  }
  return sections
}

export default function MessageBubble({ msg, index, onPromptClick }) {
  const isUser = msg.role === 'user'
  const { settings } = useSettings()

  const textSizeClass = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }[settings?.textSize || 'medium']

  const headingSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }[settings?.textSize || 'medium']

  // Parse markdown section blocks for bot responses
  const sections = !isUser ? parseMedicalSections(msg.text) : []

  const renderSectionCard = (section, idx) => {
    const headerText = section.header.replace(/^[#\s\W]+/, '').trim()
    const contentText = section.content.join('\n').trim()

    // Determine layout/card styles based on header keywords
    let containerStyle = "p-5 rounded-3xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#1a1a2e] text-slate-700 dark:text-slate-300 shadow-sm flex flex-col gap-3"
    let iconHeader = <Bot size={16} />
    let headerStyle = "font-extrabold text-slate-800 dark:text-slate-100"

    const lowerHeader = headerText.toLowerCase()

    if (lowerHeader.includes("disclaimer") || lowerHeader.includes("warning")) {
      containerStyle = "p-5 rounded-3xl border border-[#F4A300]/20 bg-[#F4A300]/5 dark:bg-[#F4A300]/10 text-[#c28200] dark:text-[#f4a300]"
      iconHeader = <ShieldAlert size={16} className="text-[#F4A300] flex-shrink-0 mt-0.5" />
      headerStyle = "font-extrabold text-[#F4A300]"
    } else if (lowerHeader.includes("what this could mean") || lowerHeader.includes("possible causes") || lowerHeader.includes("potential")) {
      containerStyle = "p-5 rounded-3xl border border-[#4A90E2]/20 bg-[#4A90E2]/5 dark:bg-[#4A90E2]/10 text-slate-700 dark:text-slate-200"
      iconHeader = <Activity size={16} className="text-[#4A90E2] flex-shrink-0 mt-0.5" />
      headerStyle = "font-extrabold text-[#4A90E2]"
    } else if (lowerHeader.includes("self-care") || lowerHeader.includes("suggestions") || lowerHeader.includes("prevention")) {
      containerStyle = "p-5 rounded-3xl border border-[#34C759]/20 bg-[#34C759]/5 dark:bg-[#34C759]/10 text-slate-700 dark:text-slate-200"
      iconHeader = <CheckCircle size={16} className="text-[#34C759] flex-shrink-0 mt-0.5" />
      headerStyle = "font-extrabold text-[#34C759]"
    } else if (lowerHeader.includes("see a doctor") || lowerHeader.includes("when to see") || lowerHeader.includes("danger signs")) {
      containerStyle = "p-5 rounded-3xl border border-[#D9534F]/25 bg-[#D9534F]/5 dark:bg-[#D9534F]/10 text-[#a8322e] dark:text-[#ef4444]"
      iconHeader = <AlertTriangle size={16} className="text-[#D9534F] flex-shrink-0 mt-0.5" />
      headerStyle = "font-extrabold text-[#D9534F]"
    } else if (lowerHeader.includes("privacy") || lowerHeader.includes("security")) {
      containerStyle = "p-4 rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-[#1a1a2e] text-slate-500 dark:text-slate-400"
      iconHeader = <ShieldCheck size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
      headerStyle = "font-bold text-slate-600 dark:text-slate-300"
    }

    // Special behavior for follow-up question blocks: turn bullet items into clickable buttons
    if (lowerHeader.includes("follow-up") || lowerHeader.includes("question")) {
      const questions = section.content
        .map(line => line.replace(/^[\s•\-*]+/, '').trim())
        .filter(Boolean)

      return (
        <div key={idx} className="p-5 rounded-3xl border border-[#4A90E2]/15 bg-[#4A90E2]/5 dark:bg-[#4A90E2]/10 space-y-4">
          <div className="flex items-start gap-2">
            <Eye size={16} className="text-[#4A90E2] flex-shrink-0 mt-0.5" />
            <span className={`font-extrabold text-[#4A90E2] ${headingSizeClass}`}>{headerText}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, qidx) => (
              <button
                key={qidx}
                onClick={() => onPromptClick && onPromptClick(q)}
                className="text-xs bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-white/[0.08]
                           hover:border-[#6C63FF] hover:bg-[#6C63FF]/5
                           text-slate-700 dark:text-slate-200 font-bold px-4 py-2.5
                           rounded-full transition shadow-sm active:scale-95 text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div key={idx} className={containerStyle}>
        {section.header && (
          <div className="flex items-start gap-2 border-b border-slate-200/30 dark:border-white/[0.06] pb-2 mb-2">
            {iconHeader}
            <span className={`${headerStyle} ${headingSizeClass}`}>{headerText}</span>
          </div>
        )}
        <div className={textSizeClass}>
          <ReactMarkdown
            components={{
              h4: ({ children }) => <h4 className="font-bold text-xs mt-2 mb-1 uppercase tracking-wider">{children}</h4>,
              p: ({ children }) => <p className="leading-relaxed mb-2 font-medium">{children}</p>,
              ul: ({ children }) => <ul className="space-y-1.5 list-disc pl-4 my-2">{children}</ul>,
              li: ({ children }) => <li className="leading-relaxed font-medium">{children}</li>,
              strong: ({ children }) => <strong className="font-extrabold">{children}</strong>
            }}
          >
            {contentText}
          </ReactMarkdown>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`flex items-start gap-3 w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Bot Icon */}
      {!isUser && (
        <div className="w-10 h-10 rounded-2xl bg-[#6C63FF]/10 dark:bg-[#6C63FF]/20 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
          <Bot size={20} className="text-[#6C63FF]" />
        </div>
      )}

      {/* Bubble / Cards Container */}
      <div className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-stretch'}`}>
        {isUser ? (
          <div className={`px-5 py-3.5 bg-[#6C63FF] text-white rounded-3xl rounded-tr-none shadow-md ${textSizeClass} font-semibold`}>
            {msg.text}
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {/* If bot response split into structured cards, map them; otherwise render unified */}
            {sections.length > 0 ? (
              sections.map((section, sidx) => renderSectionCard(section, sidx))
            ) : (
              <div className={`p-5 bg-white dark:bg-[#1a1a2e] border border-slate-200/80 dark:border-white/[0.07]
                               rounded-3xl shadow-sm text-slate-700 dark:text-slate-200
                               leading-relaxed ${textSizeClass}`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        {msg.timestamp && (
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 px-2 tracking-wide uppercase">
            {formatTime(msg.timestamp)}
          </span>
        )}
      </div>

      {/* User Icon */}
      {isUser && (
        <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
          <User size={20} className="text-slate-600 dark:text-slate-300" />
        </div>
      )}
    </motion.div>
  )
}
