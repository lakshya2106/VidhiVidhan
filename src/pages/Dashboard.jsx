import { useState, useEffect, useContext } from 'react'
import '../styles/Dashboard.css'
import { AuthContext } from '../auth/AuthContext'

function Dashboard() {
  const { token } = useContext(AuthContext)
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
  })
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch stats
        const statsRes = await fetch('https://vidhividhan-2.onrender.com/api/events/stats', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        // Fetch recent events
        const eventsRes = await fetch('https://vidhividhan-2.onrender.com/api/events', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json()
          setRecentEvents(eventsData.slice(0, 5))
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchData()
    }
  }, [token])

  const statCards = [
    { title: 'Total Events', value: stats.totalEvents, icon: '📅' },
    { title: 'Upcoming', value: stats.upcomingEvents, icon: '🔜' },
    { title: 'Completed', value: stats.completedEvents, icon: '✅' },
    { title: 'Pending Invoices', value: 0, icon: '💰' },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to Event Management Dashboard</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-section">
        <h2>Recent Events</h2>
        {loading ? (
          <p>Loading...</p>
        ) : recentEvents.length === 0 ? (
          <p>No events yet. Create one to get started!</p>
        ) : (
          <div className="events-table">
            <div className="table-header">
              <div className="col-name">Event Name</div>
              <div className="col-date">Date</div>
              <div className="col-client">Client</div>
              <div className="col-status">Status</div>
            </div>
            {recentEvents.map((event) => (
              <div key={event._id} className="table-row">
                <div className="col-name">{event.name}</div>
                <div className="col-date">{new Date(event.date).toLocaleDateString()}</div>
                <div className="col-client">{event.clientName}</div>
                <div className="col-status">
                  <span className={`status ${event.status.toLowerCase().replace(' ', '-')}`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
