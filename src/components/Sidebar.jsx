import { NavLink, useNavigate } from 'react-router-dom'
import './Sidebar.css'
import { useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { AuthContext } from '../auth/AuthContext'

const NAV = [
  { to: '/admin',                end: true,  icon: '📊', label: 'Dashboard' },
  { to: '/admin/events',                     icon: '📅', label: 'Events' },
  { to: '/admin/invoice-creator',             icon: '✏️', label: 'Create Invoice' },
  { to: '/admin/invoices',                    icon: '📄', label: 'Invoices' },
  { to: '/admin/clients',                     icon: '👥', label: 'Clients' },
  { to: '/admin/activity',                    icon: '🕐', label: 'Activity Log' },
  { to: '/admin/profile',                     icon: '⚙️', label: 'Profile' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { setToken } = useContext(AuthContext)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showToast,   setShowToast]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  function confirmLogout() {
    setShowConfirm(false)
    setToken(null)
    setMobileOpen(false)
    navigate('/login')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button className="mobile-hamburger" onClick={() => setMobileOpen(s => !s)}>
        {mobileOpen ? '✕' : '☰'}
      </button>

      {mobileOpen && <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo-row">
            <div className="sidebar-logo-icon">✦</div>
            <div>
              <h1>Vidhi Vidhan</h1>
              <p className="subtitle">Event Management</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-admin-row">
            <div className="admin-avatar">👑</div>
            <div>
              <div className="admin-name">Admin</div>
              <div className="admin-role">Super Admin</div>
            </div>
          </div>
          <button className="logout-button" onClick={() => setShowConfirm(true)}>
            <span className="icon">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Confirm Modal */}
      {showConfirm && createPortal(
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Logout?</h3>
            <p>You will be signed out of your admin session. You can log back in anytime.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn-confirm" onClick={confirmLogout}>Yes, Logout</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showToast && createPortal(
        <div className="logout-toast">✓ Logged out successfully</div>,
        document.body
      )}
    </>
  )
}
