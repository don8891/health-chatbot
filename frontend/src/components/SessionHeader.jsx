import { Bot, Clock, MessageSquare } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString([], {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export default function SessionHeader({ chat }) {
  if (!chat) return null

  return (
    <div className="mx-4 my-3 px-4 py-3 bg-primary-50 border border-primary-100 
                    rounded-xl flex items-center gap-3">

      <div className="w-8 h-8 bg-primary-100 rounded-full 
                      flex items-center justify-center flex-shrink-0">
        <Bot size={16} className="text-primary-600" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700 truncate">
          {chat.title}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={10} />
            {formatDate(chat.createdAt)}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <MessageSquare size={10} />
            {chat.messages?.length || 0} messages
          </span>
        </div>
      </div>

      {/* History badge */}
      <span className="text-xs bg-primary-100 text-primary-600 
                       px-2 py-1 rounded-full font-medium flex-shrink-0">
        History
      </span>
    </div>
  )
}
