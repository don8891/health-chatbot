import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Bot } from 'lucide-react'

function formatTime(timestamp) {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function MessageBubble({ msg, index }) {
  const isUser = msg.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }} // stagger effect when loading history
      className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className="w-7 h-7 bg-primary-100 rounded-full 
                        flex items-center justify-center flex-shrink-0 mb-4">
          <Bot size={14} className="text-primary-600" />
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-xs md:max-w-md lg:max-w-lg
                       ${isUser ? 'items-end' : 'items-start'}`}>

        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
            ${isUser
              ? 'bg-primary-600 text-white rounded-br-none'
              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-600 shadow-sm rounded-bl-none'}`}
        >
          {!isUser ? (
            <ReactMarkdown
              components={{
                h3: ({ children }) => (
                  <h3 className="font-bold text-primary-700 dark:text-primary-400 text-sm mt-3 mb-1 first:mt-0">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-1 my-1">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-primary-400 mt-0.5 flex-shrink-0">•</span>
                    <span>{children}</span>
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-slate-800 dark:text-slate-100">{children}</strong>
                ),
                p: ({ children }) => (
                  <p className="text-sm leading-relaxed mb-1">{children}</p>
                ),
              }}
            >
              {msg.text}
            </ReactMarkdown>
          ) : (
            msg.text
          )}
        </div>

        {/* Timestamp */}
        {msg.timestamp && (
          <span className="text-xs text-slate-400 px-1">
            {formatTime(msg.timestamp)}
          </span>
        )}
      </div>
    </motion.div>
  )
}
