const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const User = require('../models/User')

// Setup Google OAuth2 client (will fail verify if Client ID is missing, handled gracefully)
const googleClientId = process.env.GOOGLE_CLIENT_ID || ''
const client = googleClientId ? new OAuth2Client(googleClientId) : null

// ── Helpers ──
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'healthbeacon_default_secret',
    { expiresIn: '7d' }
  )
}

// ── 1. REGISTER ──
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    // Check existing
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'A user with this email already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    const token = generateToken(user)
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ message: 'Server error during registration' })
  }
})

// ── 2. LOGIN ──
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // If Google user has no password
    if (!user.password && user.googleId) {
      return res.status(400).json({ message: 'This email is linked to a Google account. Please use Continue with Google.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error during login' })
  }
})

// ── 3. GOOGLE OAUTH ──
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body
    if (!credential) {
      return res.status(400).json({ message: 'Google credential token is required' })
    }

    if (!client) {
      // Fallback decode for development/testing if client ID is missing
      console.warn('GOOGLE_CLIENT_ID is not configured in backend .env. Parsing token without strict verification.')
      const decodedToken = jwt.decode(credential)
      if (!decodedToken) {
        return res.status(400).json({ message: 'Invalid Google credential token' })
      }

      const { name, email, sub: googleId, picture } = decodedToken
      let user = await User.findOne({ email })
      if (!user) {
        user = new User({ name, email, googleId, avatar: picture })
        await user.save()
      } else if (!user.googleId) {
        user.googleId = googleId
        user.avatar = picture
        await user.save()
      }

      const token = generateToken(user)
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
      })
    }

    // Strict Google verification
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId
    })
    const { name, email, sub: googleId, picture } = ticket.getPayload()

    let user = await User.findOne({ email })
    if (!user) {
      user = new User({ name, email, googleId, avatar: picture })
      await user.save()
    } else if (!user.googleId) {
      user.googleId = googleId
      user.avatar = picture
      await user.save()
    }

    const token = generateToken(user)
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
    })
  } catch (err) {
    console.error('Google OAuth error:', err)
    res.status(400).json({ message: 'Google authentication failed', error: err.message })
  }
})

module.exports = router
