const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const chatRoutes = require('./routes/chatRoutes')

const app = express()
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'    // ← update after Vercel deploy
  ],
  credentials: true
}))
app.use(express.json())

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.log('MongoDB Error:', err))

// Routes
app.use('/api/chats', chatRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'HealthBot Backend Running ✅' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`))