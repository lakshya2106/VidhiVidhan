import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import { AuthContext } from '../auth/AuthContext'

export default function Login() {
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const { setToken } = useContext(AuthContext)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password }),
      })
      if (!res.ok) {
        const err = await res.json()
        setError(err.message || 'Login failed')
        return
      }
      const data = await res.json()
      setToken(data.token)
      navigate('/')
    } catch (e) {
      setError('Unable to reach server')
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        {error && <div className="error">{error}</div>}
        <label>
          Mobile number
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
