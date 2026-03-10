import { useState, useEffect } from 'react'
import { registerToastSetter } from '../utils/toast'
import '../styles/Dashboard.css'

const ICONS = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' }

export default function ToastProvider() {
  const [toasts, setToasts] = useState([])
  useEffect(() => { registerToastSetter(setToasts) }, [])

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="toast-icon">{ICONS[t.type]}</span>
          <span className="toast-msg">{t.message}</span>
        </div>
      ))}
    </div>
  )
}
