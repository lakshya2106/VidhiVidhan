import { Link, useNavigate } from 'react-router-dom'
import './Sidebar.css'
import { useContext } from 'react'
import { AuthContext } from '../auth/AuthContext'

function Sidebar() {
  const navigate = useNavigate()
  const { setToken } = useContext(AuthContext)

  function handleLogout() {
    setToken(null)
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Vidhi Vidhan</h1>
        <p className="subtitle">Event Management</p>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className="nav-item">
          <span className="icon">📊</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/invoice-creator" className="nav-item">
          <span className="icon">📄</span>
          <span>Create Invoice</span>
        </Link>
        <Link to="/invoices" className="nav-item">
          <span className="icon">📋</span>
          <span>Invoice List</span>
        </Link>
        <Link to="/events" className="nav-item">
          <span className="icon">🎉</span>
          <span>Events Manager</span>
        </Link>
      </nav>
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
