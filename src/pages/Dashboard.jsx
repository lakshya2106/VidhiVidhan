import '../styles/Dashboard.css'

function Dashboard() {
  const stats = [
    { title: 'Total Events', value: '12', icon: '📅' },
    { title: 'Total Invoices', value: '45', icon: '📄' },
    { title: 'Pending Payments', value: '8', icon: '💰' },
    { title: 'Completed', value: '37', icon: '✅' },
  ]

  const recentEvents = [
    { id: 1, name: 'Wedding Ceremony', date: '2025-01-20', status: 'Upcoming' },
    { id: 2, name: 'Corporate Event', date: '2025-01-15', status: 'In Progress' },
    { id: 3, name: 'Birthday Party', date: '2025-01-10', status: 'Completed' },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to Event Management Dashboard</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
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
        <div className="events-table">
          <div className="table-header">
            <div className="col-name">Event Name</div>
            <div className="col-date">Date</div>
            <div className="col-status">Status</div>
          </div>
          {recentEvents.map((event) => (
            <div key={event.id} className="table-row">
              <div className="col-name">{event.name}</div>
              <div className="col-date">{event.date}</div>
              <div className="col-status">
                <span className={`status ${event.status.toLowerCase().replace(' ', '-')}`}>
                  {event.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
