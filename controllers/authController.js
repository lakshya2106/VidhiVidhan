import Admin from '../models/Admin.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }
  return process.env.JWT_SECRET
}

export async function login(req, res) {
  const { mobile, password } = req.body
  if (!mobile || !password) {
    return res.status(400).json({ message: 'Missing fields' })
  }

  try {
    const JWT_SECRET = getJwtSecret()

    if (req.app.locals.dbConnected) {
      const admin = await Admin.findOne({ mobile })
      if (!admin) return res.status(401).json({ message: 'Invalid credentials' })

      const match = await bcrypt.compare(password, admin.password)
      if (!match) return res.status(401).json({ message: 'Invalid credentials' })

      const token = jwt.sign(
        { mobile: admin.mobile, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '8h' }
      )

      return res.json({ token })
    }

    // Env fallback
    if (
      mobile === process.env.ADMIN_MOBILE &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { mobile, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '8h' }
      )
      return res.json({ token })
    }

    return res.status(401).json({ message: 'Invalid credentials' })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: err.message })
  }
}

export function profile(req, res) {
  res.json({
    mobile: req.user.mobile,
    role: req.user.role
  })
}
