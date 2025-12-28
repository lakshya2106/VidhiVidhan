import Event from '../models/Event.js'
import mongoose from 'mongoose'

export async function createEvent(req, res) {
  const { name, date, clientName, clientPhone, clientEmail, location, description } = req.body
  const mobile = req.user.mobile

  if (!name || !date || !clientName) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const newEvent = await Event.create({
      name,
      date,
      clientName,
      clientPhone,
      clientEmail,
      location,
      description,
      status: 'upcoming',
      createdBy: mobile,
    })
    res.status(201).json(newEvent)
  } catch (err) {
    console.error('Create event error:', err)
    res.status(500).json({ message: 'Error creating event' })
  }
}

export async function getEvents(req, res) {
  const mobile = req.user.mobile
  try {
    const events = await Event.find({ createdBy: mobile }).sort({ date: 1 })
    res.json(events)
  } catch (err) {
    console.error('Get events error:', err)
    res.status(500).json({ message: 'Error fetching events' })
  }
}

export async function getEvent(req, res) {
  const { id } = req.params
  const mobile = req.user.mobile

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid event ID' })
  }

  try {
    const event = await Event.findOne({ _id: id, createdBy: mobile })
    if (!event) return res.status(404).json({ message: 'Event not found' })
    res.json(event)
  } catch (err) {
    console.error('Get event error:', err)
    res.status(500).json({ message: 'Error fetching event' })
  }
}

export async function updateEvent(req, res) {
  const { id } = req.params
  const { name, date, clientName, clientPhone, clientEmail, location, description, status } = req.body
  const mobile = req.user.mobile

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid event ID' })
  }

  try {
    const updated = await Event.findOneAndUpdate(
      { _id: id, createdBy: mobile },
      { name, date, clientName, clientPhone, clientEmail, location, description, status },
      { new: true }
    )
    if (!updated) return res.status(404).json({ message: 'Event not found' })
    res.json(updated)
  } catch (err) {
    console.error('Update event error:', err)
    res.status(500).json({ message: 'Error updating event' })
  }
}

export async function deleteEvent(req, res) {
  const { id } = req.params
  const mobile = req.user.mobile

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid event ID' })
  }

  try {
    const deleted = await Event.findOneAndDelete({ _id: id, createdBy: mobile })
    if (!deleted) return res.status(404).json({ message: 'Event not found' })
    res.json({ message: 'Event deleted' })
  } catch (err) {
    console.error('Delete event error:', err)
    res.status(500).json({ message: 'Error deleting event' })
  }
}

export async function getStats(req, res) {
  const mobile = req.user.mobile

  try {
    const totalEvents = await Event.countDocuments({ createdBy: mobile })
    const upcomingEvents = await Event.countDocuments({ createdBy: mobile, status: 'upcoming' })
    const completedEvents = await Event.countDocuments({ createdBy: mobile, status: 'completed' })

    res.json({
      totalEvents,
      upcomingEvents,
      completedEvents,
    })
  } catch (err) {
    console.error('Get stats error:', err)
    res.status(500).json({ message: 'Error fetching stats' })
  }
}
