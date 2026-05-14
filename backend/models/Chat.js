const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  sessionId: String,
  messages: [{
    role: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
  }]
})

module.exports = mongoose.model('Chat', chatSchema)