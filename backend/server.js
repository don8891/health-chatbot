const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const Chat = require('./models/Chat')

const app = express()
app.use(cors())
app.use(express.json())

// Connect MongoDB with options to fix DNS issues
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Stop trying after 5 seconds
  family: 4 // Force IPv4 (fixes many Windows DNS issues)
})
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => {
    console.log('MongoDB Connection Error ❌');
    console.log('Reason:', err.message);
    console.log('>>> SERVER RUNNING IN OFFLINE MODE (Messages won\'t be saved)');
  })

// Chat route
app.post('/api/chat', async (req, res) => {
  const { message, sessionId = 'default-session' } = req.body
  
  try {
    const axios = require('axios')
    const ragResponse = await axios.post('http://localhost:8000/query', { query: message })
    const botAnswer = ragResponse.data.answer

    // Find or create session and push messages
    await Chat.findOneAndUpdate(
      { sessionId },
      { $push: { messages: [
        { role: 'user', text: message },
        { role: 'bot', text: botAnswer }
      ]}},
      { upsert: true }
    )

    res.json({ answer: botAnswer })
  } catch (err) {
    const fallbackAnswer = `You asked about: "${message}". The AI engine is being connected.`
    
    await Chat.findOneAndUpdate(
      { sessionId },
      { $push: { messages: [
        { role: 'user', text: message },
        { role: 'bot', text: fallbackAnswer }
      ]}},
      { upsert: true }
    )

    res.json({ answer: fallbackAnswer })
  }
})

// Get chat history
app.get('/api/chat/history/:sessionId', async (req, res) => {
  try {
    const chat = await Chat.findOne({ sessionId: req.params.sessionId })
    res.json(chat ? chat.messages : [])
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch history' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))