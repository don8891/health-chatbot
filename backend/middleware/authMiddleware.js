const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization')
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' })
  }

  // Token format: "Bearer <token>"
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token format is invalid' })
  }

  const token = parts[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'healthbeacon_default_secret')
    req.userId = decoded.id
    next()
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' })
  }
}
