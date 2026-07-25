const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const Chat = require('../models/Chat')
const { validateFirstMessage, isJunkMessage } = require('../middleware/validateChat')
const auth = require('../middleware/authMiddleware')

// Protect all chat routes
router.use(auth)

// ─────────────────────────────────────────
// GET /api/chats — fetch valid history only for user
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({ isValid: true, userId: req.userId })
      .select('sessionId title createdAt messages')
      .sort({ createdAt: -1 })
      .limit(20)

    res.json({ chats })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chats' })
  }
})

// ─────────────────────────────────────────
// GET /api/chats/clean — preview fake chats for user
// ─────────────────────────────────────────
router.get('/clean', async (req, res) => {
  try {
    const fakeSessions = await Chat.find({
      userId: req.userId,
      $or: [
        { messages: { $size: 0 } },
        { messages: { $size: 1 } },
        { isValid: false },
        { title: { $exists: false } },
        { createdAt: { $exists: false } }
      ]
    })

    res.json({
      count: fakeSessions.length,
      preview: fakeSessions.map(s => ({
        id: s.sessionId,
        title: s.title,
        messages: s.messages.length,
        created: s.createdAt
      }))
    })
  } catch (err) {
    res.status(500).json({ error: 'Preview failed' })
  }
})

// ─────────────────────────────────────────
// DELETE /api/chats/clean — delete fake chats for user
// ─────────────────────────────────────────
router.delete('/clean', async (req, res) => {
  try {
    const result = await Chat.deleteMany({
      userId: req.userId,
      $or: [
        { messages: { $size: 0 } },
        { messages: { $size: 1 } },
        { isValid: false },
        { title: { $exists: false } },
        { createdAt: { $exists: false } }
      ]
    })

    res.json({
      success: true,
      deleted: result.deletedCount,
      message: `Successfully removed ${result.deletedCount} invalid chat sessions.`
    })
  } catch (err) {
    res.status(500).json({ error: 'Cleanup failed' })
  }
})

// ─────────────────────────────────────────
// POST /api/chat — main chat endpoint
// ─────────────────────────────────────────
router.post('/', validateFirstMessage, async (req, res) => {
  const { message, sessionId, language } = req.body

  try {
    // Call Python RAG engine
    const RAG_URL = process.env.RAG_URL || 'http://127.0.0.1:8000'
    const ragResponse = await axios.post(`${RAG_URL}/query`, {
      query: message,
      language: language || 'english'
    })
    const answer = ragResponse.data.answer

    // Generate title from first message (max 30 chars)
    const title = message.length > 30
      ? message.substring(0, 30) + '...'
      : message

    if (sessionId) {
      // Add to existing session belonging to user
      const updatedChat = await Chat.findOneAndUpdate(
        { sessionId, userId: req.userId },
        {
          $push: {
            messages: [
              { role: 'user', text: message },
              { role: 'bot', text: answer }
            ]
          },
          $set: { isValid: true }
        },
        { new: true }
      )
      if (!updatedChat) {
        return res.status(404).json({ error: 'Chat session not found or access denied' })
      }
    } else {
      // Create new valid session
      const newSession = new Chat({
        sessionId: uuidv4(),
        userId: req.userId,
        title,
        isValid: true,
        messages: [
          { role: 'user', text: message },
          { role: 'bot', text: answer }
        ]
      })
      await newSession.save()

      return res.json({
        answer,
        sessionId: newSession.sessionId,
        title: newSession.title
      })
    }

    res.json({ answer, sessionId })

  } catch (err) {
    console.error('Error contacting RAG Engine:', err.message || err)
    if (err.response) {
      console.error('RAG response status:', err.response.status)
      console.error('RAG response data:', err.response.data)
    }
    // RAG not connected yet — return fallback
    res.json({
      answer: `⚠️ AI engine not connected yet. Your message: "${message}"`,
      sessionId: sessionId || uuidv4()
    })
  }
})

// ─────────────────────────────────────────
// POST /api/chats/analyze-image — vision analysis
// ─────────────────────────────────────────
router.post('/analyze-image', async (req, res) => {
  const { imageBase64, mimeType, message, sessionId, language } = req.body

  if (!imageBase64) {
    return res.status(400).json({ error: 'imageBase64 is required' })
  }

  try {
    const RAG_URL = process.env.RAG_URL || 'http://127.0.0.1:8000'
    const ragResponse = await axios.post(`${RAG_URL}/analyze-image`, {
      imageBase64,
      mimeType: mimeType || 'image/jpeg',
      message: message || 'Please analyze this image and provide health information.',
      language: language || 'english'
    })

    const answer = ragResponse.data.answer
    const userText = message || '📷 Shared an image for analysis'
    const title = userText.length > 30 ? userText.substring(0, 30) + '...' : userText

    if (sessionId) {
      const updatedChat = await Chat.findOneAndUpdate(
        { sessionId, userId: req.userId },
        {
          $push: {
            messages: [
              { role: 'user', text: userText },
              { role: 'bot', text: answer }
            ]
          },
          $set: { isValid: true }
        },
        { new: true }
      )
      if (!updatedChat) {
        return res.status(404).json({ error: 'Chat session not found or access denied' })
      }
      return res.json({ answer, sessionId })
    } else {
      const newSession = new Chat({
        sessionId: uuidv4(),
        userId: req.userId,
        title,
        isValid: true,
        messages: [
          { role: 'user', text: userText },
          { role: 'bot', text: answer }
        ]
      })
      await newSession.save()
      return res.json({ answer, sessionId: newSession.sessionId, title: newSession.title })
    }

  } catch (err) {
    console.error('Error in image analysis:', err.message || err)
    res.status(500).json({ error: 'Image analysis failed. Please try again.' })
  }
})

// PATCH /api/chats/:sessionId/rename — rename a chat
router.patch('/:sessionId/rename', async (req, res) => {
  const { title } = req.body
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title cannot be empty' })
  }
  try {
    const chat = await Chat.findOneAndUpdate(
      { sessionId: req.params.sessionId, userId: req.userId },
      { $set: { title: title.trim() } },
      { new: true }
    )
    if (!chat) {
      console.log(`[Rename] Chat not found or access denied for sessionId: ${req.params.sessionId}`)
      return res.status(404).json({ error: 'Chat not found or access denied' })
    }
    res.json({ success: true, title: title.trim() })
  } catch (err) {
    console.error('Rename route error:', err)
    res.status(500).json({ error: 'Rename failed' })
  }
})

// DELETE /api/chats/:sessionId — delete one chat session
router.delete('/:sessionId', async (req, res) => {
  try {
    const deleted = await Chat.findOneAndDelete({ sessionId: req.params.sessionId, userId: req.userId })
    if (!deleted) {
      console.log(`[Delete] Chat not found or access denied for sessionId: ${req.params.sessionId}`)
      return res.status(404).json({ error: 'Chat not found or access denied' })
    }
    res.json({ success: true })
  } catch (err) {
    console.error('Delete route error:', err)
    res.status(500).json({ error: 'Delete failed' })
  }
})

// GET /api/chats/:sessionId — fetch single chat session with all messages
router.get('/:sessionId', async (req, res) => {
  try {
    const chat = await Chat.findOne({ sessionId: req.params.sessionId, userId: req.userId }).lean()

    if (!chat) {
      return res.status(404).json({ error: 'Chat session not found or access denied' })
    }

    // Safely sort messages by timestamp
    const messages = chat.messages ? [...chat.messages].sort(
      (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
    ) : []

    res.json({
      sessionId: chat.sessionId,
      title: chat.title,
      messages: messages.map(m => ({
        role: m.role,
        text: m.text,
        timestamp: m.timestamp
      }))
    })
  } catch (err) {
    console.error('Fetch session error:', err)
    res.status(500).json({ error: 'Failed to fetch session' })
  }
})

module.exports = router
