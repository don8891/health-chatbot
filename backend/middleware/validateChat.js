// Words that mean the session is fake/test
const JUNK_WORDS = [
  'test', 'asd', 'asdf', 'hello', 'hi', 'hey',
  'abc', 'qwerty', 'zzz', '123', 'ok', 'k',
  'lol', 'hm', 'hmm', 'a', 'b', 'c', 's'
]

function isJunkMessage(text) {
  if (!text || text.trim().length === 0) return true
  if (text.trim().length <= 2) return true  // single/double letters

  const lower = text.trim().toLowerCase()
  if (JUNK_WORDS.includes(lower)) return true

  // Check if it's random keyboard smashing (too many consonants in a row)
  if (/^[^aeiou\s]{5,}$/i.test(lower)) return true

  return false
}

function validateFirstMessage(req, res, next) {
  const { message } = req.body

  if (isJunkMessage(message)) {
    return res.status(400).json({
      error: 'invalid_input',
      message: 'Please describe your symptoms clearly to start a health chat.'
    })
  }

  next()
}

module.exports = { validateFirstMessage, isJunkMessage }
