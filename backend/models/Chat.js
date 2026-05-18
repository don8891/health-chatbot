const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
})

const chatSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  title: { type: String, default: 'New Chat' },
  messages: [messageSchema],
  isValid: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Chat', chatSchema)