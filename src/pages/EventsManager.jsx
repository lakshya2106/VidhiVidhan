import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../auth/AuthContext'
import '../styles/EventsManager.css'

function EventsManager() {
  const { token } = useContext(AuthContext)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('upcoming')
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    location: '',
    description: '',
    status: 'upcoming',
  })

  useEffect(() => {
    fetchEvents()
  }, [token])

  async function fetchEvents() {
    try {
      const res = await fetch('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
      }
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const url = editingId 
        ? `http://localhost:5000/api/events/${editingId}`
        : 'http://localhost:5000/api/events'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const result = await res.json()
        if (editingId) {
          setEvents(events.map(e => (e._id === editingId ? result : e)))
        } else {
          setEvents([...events, result])
        }
        resetForm()
      }
    } catch (err) {
      console.error('Error saving event:', err)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this event?')) return
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setEvents(events.filter(e => e._id !== id))
      }
    } catch (err) {
      console.error('Error deleting event:', err)
    }
  }

  function handleEdit(event) {
    setFormData(event)
    setEditingId(event._id)
    setShowForm(true)
  }

  function resetForm() {
    setFormData({
      name: '',
      date: '',
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      location: '',
      description: '',
      status: 'upcoming',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.status === filter)

  return (
    <div className="events-manager">
      <div className="page-header">
        <h1>Events Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? '✕ Cancel' : '+ New Event'}
        </button>
      </div>

      {showForm && (
        <div className="event-form-container">
          <form onSubmit={handleSubmit} className="event-form">
            <h3>{editingId ? 'Edit Event' : 'Create New Event'}</h3>
            <div className="form-row">
              <input
                type="text"
                placeholder="Event Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="Client Name *"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              />
            </div>
            <div className="form-row">
              <input
                type="email"
                placeholder="Email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
            <div className="form-row">
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="upcoming">Upcoming</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? 'Update Event' : 'Create Event'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filter-bar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p>No events found. Create one to get started!</p>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-header">
                <h3>{event.name}</h3>
                <span className={`status status-${event.status}`}>{event.status}</span>
              </div>
              <div className="event-details">
                <p><strong>Client:</strong> {event.clientName}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                {event.clientPhone && <p><strong>Phone:</strong> {event.clientPhone}</p>}
                {event.location && <p><strong>Location:</strong> {event.location}</p>}
                {event.description && <p><strong>Description:</strong> {event.description}</p>}
              </div>
              <div className="event-actions">
                <button onClick={() => handleEdit(event)} className="btn-action btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(event._id)} className="btn-action btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EventsManager
