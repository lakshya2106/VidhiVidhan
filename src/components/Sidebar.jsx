import { Link, useNavigate } from 'react-router-dom'
import './Sidebar.css'
import { useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { AuthContext } from '../auth/AuthContext'

function Sidebar() {
  const navigate = useNavigate()
  const { setToken } = useContext(AuthContext)

  const [showConfirm, setShowConfirm] = useState(false)
  const [showToast, setShowToast] = useState(false)

  function handleLogout() {
    // open confirmation modal
    setShowConfirm(true)
  }

  function confirmLogout() {
    setShowConfirm(false)
    setToken(null)
    navigate('/login')
    // show toast briefly
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  function cancelLogout() {
    setShowConfirm(false)
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
        <button className="logout-button" onClick={handleLogout} aria-label="Logout">
          <span className="icon">🔒</span>
          <span>Logout</span>
        </button>
      </div>

      {showConfirm && createPortal(
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="confirm-actions">
              <button className="btn btn-primary" onClick={confirmLogout}>Yes, log out</button>
              <button className="btn btn-reset" onClick={cancelLogout}>Cancel</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showToast && createPortal(
        <div className="logout-toast">Logged out</div>,
        document.body
      )}
    </aside>
  )
}

export default Sidebar
