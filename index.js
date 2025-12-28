import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'

import connectDB from './config/db.js'
import seedAdmin from './utils/seedAdmin.js'
import adminRoutes from './routes/admin.js'
import invoiceRoutes from './routes/invoices.js'
import eventRoutes from './routes/events.js'

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// 🔑 MUST be before routes
app.options('*', cors())


// Allow slightly larger JSON payloads (in case small images or larger invoices are sent)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// Routes
app.use('/api/admin', adminRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/events', eventRoutes)

async function start() {
  const connected = await connectDB(MONGODB_URI)
  app.locals.dbConnected = connected

  if (connected) {
    await seedAdmin(
      process.env.ADMIN_MOBILE,
      process.env.ADMIN_PASSWORD
    )
  } else {
    console.warn('Running without DB — using environment fallback')
  }

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
