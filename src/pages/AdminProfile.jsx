import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../auth/AuthContext'

function AdminProfile() {
  const { token } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')

  const lastLogin = localStorage.getItem('vv_last_login')

  useEffect(() => {
    async function fetchProfile() {
      if (!token) return
      setError('')
      try {
        const res = await fetch('https://vidhividhan-2.onrender.com/api/admin/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          setError('Failed to load admin profile')
          return
        }
        const data = await res.json()
        setProfile(data)
      } catch (err) {
        console.error('Profile load error:', err)
        setError('Unable to load profile')
      }
    }

    fetchProfile()
  }, [token])

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Profile</h1>
        <p>Account information and security</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-info">
            <h3>Mobile</h3>
            <p className="stat-value">{profile?.mobile || '—'}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛡️</div>
          <div className="stat-info">
            <h3>Role</h3>
            <p className="stat-value">{profile?.role || 'admin'}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <h3>Last Login</h3>
            <p className="stat-value">{lastLogin || 'This session'}</p>
          </div>
        </div>
      </div>

      {error && <p style={{ color: '#f97373' }}>{error}</p>}

      <div className="recent-section">
        <h2>Security</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 12 }}>
          For now, password changes are handled by the system administrator.
        </p>
        <ul style={{ color: 'var(--muted)', fontSize: 14, paddingLeft: 18 }}>
          <li>Keep your admin credentials private.</li>
          <li>Log out when using shared devices.</li>
          <li>Contact support to rotate your password.</li>
        </ul>
      </div>
    </div>
  )
}

export default AdminProfile

