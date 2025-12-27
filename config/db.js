import mongoose from 'mongoose'

async function connectDB(uri) {
  if (!uri) {
    console.warn('MONGODB_URI not provided — skipping DB connection')
    return false
  }

  try {
    mongoose.set('strictQuery', false)
   await mongoose.connect(uri)

    console.log('Connected to MongoDB')
    return true
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    return false
  }
}

export default connectDB
