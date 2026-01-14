import { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../auth/AuthContext'

function Clients() {
  const { token } = useContext(AuthContext)
  const [events, setEvents] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchData() {
      if (!token) return
      setError('')
      setLoading(true)
      try {
        const headers = { Authorization: `Bearer ${token}` }

        const [eventsRes, invoicesRes] = await Promise.all([
          fetch('https://vidhividhan-2.onrender.com/api/events', { headers }),
          fetch('https://vidhividhan-2.onrender.com/api/invoices', { headers }),
        ])

        if (eventsRes.ok) {
          const ev = await eventsRes.json()
          setEvents(ev)
        }
        if (invoicesRes.ok) {
          const inv = await invoicesRes.json()
          setInvoices(inv)
        }
      } catch (err) {
        console.error('Clients fetch error:', err)
        setError('Unable to load clients. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const clients = useMemo(() => {
    const map = new Map()

    events.forEach((e) => {
      const key = e.clientName?.trim()
      if (!key) return
      if (!map.has(key)) {
        map.set(key, {
          name: key,
          phone: e.clientPhone || '',
          email: e.clientEmail || '',
          invoices: [],
          events: [],
          totalSpent: 0,
          lastActivity: null,
        })
      }
      const entry = map.get(key)
      entry.events.push(e)
      const dt = new Date(e.date)
      if (!entry.lastActivity || dt > entry.lastActivity) {
        entry.lastActivity = dt
      }
    })

    invoices.forEach((inv) => {
      const key = inv.receiver?.name?.trim()
      if (!key) return
      if (!map.has(key)) {
        map.set(key, {
          name: key,
          phone: inv.receiver?.phoneNumber || '',
          email: '',
          invoices: [],
          events: [],
          totalSpent: 0,
          lastActivity: null,
        })
      }
      const entry = map.get(key)
      entry.invoices.push(inv)
      entry.totalSpent += Number(inv.total) || 0
      const dt = new Date(inv.createdDate)
      if (!entry.lastActivity || dt > entry.lastActivity) {
        entry.lastActivity = dt
      }
    })

    let list = Array.from(map.values())
    if (search.trim()) {
      const term = search.toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(term))
    }
    list.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
    return list
  }, [events, invoices, search])

  return (
    <div className="invoice-list-page">
      <div className="page-header">
        <h1>Clients</h1>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search clients"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.04)',
            background: 'transparent',
            color: 'var(--text)',
          }}
        />
      </div>

      {error && <p style={{ color: '#f97373', marginBottom: 12 }}>{error}</p>}

      {loading ? (
        <p>Loading clients...</p>
      ) : clients.length === 0 ? (
        <p>No clients found yet. Create events or invoices to see clients here.</p>
      ) : (
        <div className="invoices-table">
          <div className="table-header">
            <div className="col-client">Client</div>
            <div className="col-amount">Total Spent</div>
            <div className="col-status">Invoices</div>
            <div className="col-date">Events</div>
            <div className="col-actions">Last Activity</div>
          </div>
          {clients.map((c) => (
            <div key={c.name} className="table-row">
              <div className="col-client" data-label="Client">
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                {(c.phone || c.email) && (
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {c.phone && <span>{c.phone}</span>}
                    {c.phone && c.email && ' • '}
                    {c.email && <span>{c.email}</span>}
                  </div>
                )}
              </div>
              <div className="col-amount" data-label="Total Spent">
                ₹{c.totalSpent.toFixed(2)}
              </div>
              <div className="col-status" data-label="Invoices">
                {c.invoices.length}
              </div>
              <div className="col-date" data-label="Events">
                {c.events.length}
              </div>
              <div className="col-actions" data-label="Last Activity">
                {c.lastActivity
                  ? new Date(c.lastActivity).toLocaleDateString()
                  : '—'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Clients

