const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.json({ status: 'HealthBot Backend Running ✅' })
})

// Chat route (connects to Python RAG later)
app.post('/api/chat', async (req, res) => {
  const { message } = req.body
  
  try {
    // Will call Python RAG engine
    const axios = require('axios')
    const ragResponse = await axios.post('http://localhost:8000/query', { query: message })
    res.json({ answer: ragResponse.data.answer })
  } catch (err) {
    // Fallback response while RAG isn't ready yet
    res.json({ answer: `You asked about: "${message}". The AI engine is being connected. Check back on Day 7!` })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))