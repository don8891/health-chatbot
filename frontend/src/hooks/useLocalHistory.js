import { useState, useEffect } from 'react'

const STORAGE_KEY = 'healthbot_chats'
const SETTINGS_KEY = 'healthbot_settings'

// ── Local history hook ──
export function useLocalHistory() {
  const [chatHistory, setChatHistory] = useState([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setChatHistory(JSON.parse(stored))
    } catch {
      setChatHistory([])
    }
  }, [])

  // Save to localStorage whenever history changes
  const saveHistory = (updated) => {
    setChatHistory(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      console.warn('LocalStorage full or unavailable')
    }
  }

  // Create new session
  const createSession = (firstMessage, firstAnswer) => {
    const sessionId = crypto.randomUUID()
    const title = firstMessage.length > 35
      ? firstMessage.substring(0, 35) + '...'
      : firstMessage

    const newSession = {
      sessionId,
      title,
      createdAt: new Date().toISOString(),
      messages: [
        { role: 'user', text: firstMessage, timestamp: new Date().toISOString() },
        { role: 'bot',  text: firstAnswer,  timestamp: new Date().toISOString() }
      ]
    }

    saveHistory([newSession, ...chatHistory])
    return sessionId
  }

  // Add message to existing session
  const addMessage = (sessionId, userText, botText) => {
    const updated = chatHistory.map(session => {
      if (session.sessionId !== sessionId) return session
      return {
        ...session,
        messages: [
          ...session.messages,
          { role: 'user', text: userText, timestamp: new Date().toISOString() },
          { role: 'bot',  text: botText,  timestamp: new Date().toISOString() }
        ]
      }
    })
    saveHistory(updated)
  }

  // Rename session
  const renameSession = (sessionId, newTitle) => {
    const updated = chatHistory.map(s =>
      s.sessionId === sessionId ? { ...s, title: newTitle } : s
    )
    saveHistory(updated)
  }

  // Delete session
  const deleteSession = (sessionId) => {
    saveHistory(chatHistory.filter(s => s.sessionId !== sessionId))
  }

  // Get one session
  const getSession = (sessionId) => {
    return chatHistory.find(s => s.sessionId === sessionId) || null
  }

  // Wipe everything
  const wipeAllData = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(SETTINGS_KEY)
    setChatHistory([])
  }

  return {
    chatHistory,
    createSession,
    addMessage,
    renameSession,
    deleteSession,
    getSession,
    wipeAllData
  }
}

// ── Settings hook ──
export function useSettings() {
  const defaultSettings = {
    textSize: 'medium',    // small | medium | large
    language: 'english',
  }

  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY)
      return stored ? JSON.parse(stored) : defaultSettings
    } catch {
      return defaultSettings
    }
  })

  const updateSetting = (key, value) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated))
    } catch {}
  }

  return { settings, updateSetting }
}
