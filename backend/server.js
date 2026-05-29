const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const chatRoutes = require('./routes/chatRoutes')

const app = express()
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: allowedOrigins,
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