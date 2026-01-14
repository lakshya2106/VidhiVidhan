export function logActivity(entry) {
  try {
    const existing = JSON.parse(localStorage.getItem('vv_activity_log') || '[]')
    const now = new Date().toLocaleString()
    const next = [
      ...existing,
      {
        time: now,
        ...entry,
      },
    ].slice(-200) // keep last 200
    localStorage.setItem('vv_activity_log', JSON.stringify(next))
  } catch {
    // ignore logging errors
  }
}

