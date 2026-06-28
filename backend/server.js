const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const chatRoutes = require('./routes/chatRoutes')
const authRoutes = require('./routes/auth')

const app = express()
const allowedOrigins = [
  'http://localhost:3000',
  'https://healthbeacon.net.in',
  'https://www.healthbeacon.net.in',
  process.env.FRONTEND_URL
].filter(Boolean)

// Health check (placed before CORS so ping services like cron-job.org don't get blocked)
app.get('/', (req, res) => {
  res.json({ status: 'HealthBeacon Backend Running ✅' })
})

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}))
app.use(express.json())

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.log('MongoDB Error:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/chats', chatRoutes)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`))