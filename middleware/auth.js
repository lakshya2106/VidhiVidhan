

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

export default function authMiddleware(req, res, next) {

    if (req.method === 'OPTIONS') {
    return next()
  }
  
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ message: 'Missing token' })

  const parts = auth.split(' ')
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Bad token format' })
  }

  const token = parts[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    // 🔑 Normalize user object
    req.user = {
      id: decoded.id || decoded._id,
      mobile: decoded.mobile, // MUST exist
      email: decoded.email,
    }

    if (!req.user.mobile) {
      return res.status(401).json({ message: 'Invalid token: mobile missing' })
    }

    next()
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

