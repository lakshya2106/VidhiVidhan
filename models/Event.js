import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    clientName: { type: String, required: true },
    clientPhone: String,
    clientEmail: String,
    location: String,
    description: String,
    status: { type: String, enum: ['upcoming', 'in-progress', 'completed', 'cancelled'], default: 'upcoming' },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Event || mongoose.model('Event', eventSchema)
