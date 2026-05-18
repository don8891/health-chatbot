const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const Chat = require('../models/Chat')
const { validateFirstMessage, isJunkMessage } = require('../middleware/validateChat')

// ─────────────────────────────────────────
// GET /api/chats — fetch valid history only
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({ isValid: true })
      .select('sessionId title createdAt messages')
      .sort({ createdAt: -1 })
      .limit(20)

    res.json({ chats })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chats' })
  }
})

// ─────────────────────────────────────────
// GET /api/chats/clean — preview fake chats
// ─────────────────────────────────────────
router.get('/clean', async (req, res) => {
  try {
    const fakeSessions = await Chat.find({
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
// DELETE /api/chats/clean — delete fake chats
// ─────────────────────────────────────────
router.delete('/clean', async (req, res) => {
  try {
    const result = await Chat.deleteMany({
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
  const { message, sessionId } = req.body

  try {
    // Call Python RAG engine
    const ragResponse = await axios.post('http://localhost:8000/query', {
      query: message
    })
    const answer = ragResponse.data.answer

    // Generate title from first message (max 30 chars)
    const title = message.length > 30
      ? message.substring(0, 30) + '...'
      : message

    if (sessionId) {
      // Add to existing session
      await Chat.findOneAndUpdate(
        { sessionId },
        {
          $push: {
            messages: [
              { role: 'user', text: message },
              { role: 'bot', text: answer }
            ]
          },
          $set: { isValid: true }
        }
      )
    } else {
      // Create new valid session
      const newSession = new Chat({
        sessionId: uuidv4(),
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
    // RAG not connected yet — return fallback
    res.json({
      answer: `⚠️ AI engine not connected yet. Your message: "${message}"`,
      sessionId: sessionId || uuidv4()
    })
  }
})

module.exports = router
