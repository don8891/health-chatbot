import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2, Check, X, AlertTriangle } from 'lucide-react'

// ── Delete confirmation tooltip ──
function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -4 }}
      className="absolute right-0 top-full mt-1 z-50 w-52 bg-white border border-slate-200 
                 rounded-xl shadow-xl p-3"
    >
      {/* Arrow pointer */}
      <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white border-l border-t 
                      border-slate-200 rotate-45" />

      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={12} className="text-red-500" />
        </div>
        <p className="text-xs font-semibold text-slate-700">Delete this chat?</p>
      </div>
      <p className="text-xs text-slate-400 mb-3">This action cannot be undone.</p>

      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs 
                     text-slate-600 hover:bg-slate-50 transition font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-1.5 rounded-lg bg-red-500 text-white text-xs 
                     hover:bg-red-600 transition font-medium"
        >
          Delete
        </button>
      </div>
    </motion.div>
  )
}

// ── Main ChatHistoryItem ──
export default function ChatHistoryItem({
  chat,
  isActive,
  onClick,
  onRenameChat,   // (sessionId, newTitle) => Promise
  onDeleteChat,   // (sessionId) => void  — optimistic, already removed from list
}) {
  const [isHovered, setIsHovered]       = useState(false)
  const [isEditing, setIsEditing]       = useState(false)
  const [editValue, setEditValue]       = useState(chat.title)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [saving, setSaving]             = useState(false)

  const inputRef    = useRef(null)
  const containerRef = useRef(null)

  // Auto-focus input when editing starts
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  // Close delete confirm when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDeleteConfirm(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── Save rename ──
  const handleSave = async () => {
    const trimmed = editValue.trim()
    if (!trimmed || trimmed === chat.title) {
      setIsEditing(false)
      setEditValue(chat.title)
      return
    }
    setSaving(true)
    try {
      await onRenameChat(chat.sessionId, trimmed)
    } catch {
      setEditValue(chat.title) // revert on error
    }
    setSaving(false)
    setIsEditing(false)
  }

  // ── Cancel rename ──
  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(chat.title)
  }

  // ── Keyboard shortcuts ──
  const handleKeyDown = (e) => {
    if (e.key === 'Enter')  handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  // ── Confirm delete ──
  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false)
    onDeleteChat(chat.sessionId) // optimistic — parent removes immediately
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        if (!showDeleteConfirm) setShowDeleteConfirm(false)
      }}
    >
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-150 group
          ${isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}
      >

        {/* ── EDIT MODE ── */}
        {isEditing ? (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={saving}
              className="flex-1 min-w-0 text-sm bg-white border border-primary-300 
                         rounded-lg px-2 py-1 outline-none text-slate-800
                         focus:ring-2 focus:ring-primary-400 focus:border-transparent
                         disabled:opacity-50"
            />

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              title="Save (Enter)"
              className="w-6 h-6 flex items-center justify-center rounded-md 
                         bg-health-500 text-white hover:bg-health-600 
                         transition flex-shrink-0 disabled:opacity-50"
            >
              <Check size={12} />
            </button>

            {/* Cancel button */}
            <button
              onClick={handleCancel}
              title="Cancel (Escape)"
              className="w-6 h-6 flex items-center justify-center rounded-md 
                         bg-slate-200 text-slate-600 hover:bg-slate-300 
                         transition flex-shrink-0"
            >
              <X size={12} />
            </button>
          </div>

        ) : (

          /* ── DEFAULT MODE ── */
          <>
            {/* Title — clickable */}
            <button
              onClick={onClick}
              className="flex-1 text-left text-sm truncate min-w-0"
            >
              {chat.title}
            </button>

            {/* Action icons:
                - Desktop: visible only on hover (opacity transition)
                - Mobile:  always visible (no hover on touch screens)        */}
            <div className={`flex items-center gap-1 flex-shrink-0
                             transition-opacity duration-150
                             md:opacity-0 md:group-hover:opacity-100
                             opacity-100`}>

              {/* Edit / Pencil */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                  setShowDeleteConfirm(false)
                }}
                title="Rename chat"
                className="w-6 h-6 flex items-center justify-center rounded-md
                           text-slate-400 hover:text-primary-600 hover:bg-primary-50
                           transition"
              >
                <Pencil size={13} />
              </button>

              {/* Delete / Trash */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteConfirm(prev => !prev)
                }}
                title="Delete chat"
                className="w-6 h-6 flex items-center justify-center rounded-md
                           text-slate-400 hover:text-red-500 hover:bg-red-50
                           transition"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Delete confirmation tooltip ── */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <DeleteConfirm
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
