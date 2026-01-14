import { useState, useEffect, useContext } from 'react'
import '../styles/Dashboard.css'
import { AuthContext } from '../auth/AuthContext'

function Dashboard() {
  const { token } = useContext(AuthContext)
  const [eventStats, setEventStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
  })
  const [invoiceStats, setInvoiceStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    overdueInvoices: 0,
    totalRevenue: 0,
  })
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      setError('')
      try {
        const commonHeaders = { Authorization: `Bearer ${token}` }

        // Fetch event stats
        const statsRes = await fetch('https://vidhividhan-2.onrender.com/api/events/stats', {
          headers: commonHeaders,
        })
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setEventStats(statsData)
        }

        // Fetch recent events
        const eventsRes = await fetch('https://vidhividhan-2.onrender.com/api/events', {
          headers: commonHeaders,
        })
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json()
          setRecentEvents(eventsData.slice(0, 5))
        }

        // Fetch invoices for dashboard stats
        const invoicesRes = await fetch('https://vidhividhan-2.onrender.com/api/invoices', {
          headers: commonHeaders,
        })
        if (invoicesRes.ok) {
          const invoicesData = await invoicesRes.json()

          const totalInvoices = invoicesData.length
          const paidInvoices = invoicesData.filter((inv) => inv.status === 'paid').length
          const overdueInvoices = invoicesData.filter((inv) => inv.status === 'overdue').length
          const totalRevenue = invoicesData
            .filter((inv) => inv.status === 'paid')
            .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0)

          setInvoiceStats({
            totalInvoices,
            paidInvoices,
            overdueInvoices,
            totalRevenue,
          })
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Unable to load dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchData()
    }
  }, [token])

  const statCards = [
    { title: 'Total Events', value: eventStats.totalEvents, icon: '📅' },
    { title: 'Upcoming Events', value: eventStats.upcomingEvents, icon: '🔜' },
    { title: 'Completed Events', value: eventStats.completedEvents, icon: '✅' },
    { title: 'Total Invoices', value: invoiceStats.totalInvoices, icon: '📄' },
    { title: 'Paid Revenue (₹)', value: invoiceStats.totalRevenue.toFixed(2), icon: '💰' },
    { title: 'Overdue Invoices', value: invoiceStats.overdueInvoices, icon: '⚠️' },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your events and invoices</p>
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

      {error && <p style={{ color: '#f97373', marginBottom: 12 }}>{error}</p>}

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
