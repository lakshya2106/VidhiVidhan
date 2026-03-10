import { useState, useEffect, useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'
import { AuthContext } from '../auth/AuthContext'

/* ── Animated Counter ── */
function Counter({ target, prefix = '', suffix = '', duration = 1800 }) {
  const [val, setVal] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    const num = parseFloat(target)
    if (isNaN(num) || num === 0) { setVal(0); return }
    let start = null
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setVal(num % 1 === 0 ? Math.floor(ease * num) : parseFloat((ease * num).toFixed(2)))
      if (p < 1) requestAnimationFrame(step)
      else setVal(num)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return <>{prefix}{typeof val === 'number' && val % 1 !== 0 ? val.toFixed(2) : val}{suffix}</>
}

/* ── Skeleton Card ── */
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-value" />
      <div className="skeleton skeleton-line" style={{ width: '50%' }} />
      <div className="skeleton skeleton-sub" />
    </div>
  )
}

/* ── Bar Chart ── */
function BarChart({ data, label }) {
  const max = Math.max(...data.map(d => d.value), 1)
  const COLORS = ['#7c5cff','#6d4fef','#5a3bfe','#8b6fff','#9d82ff','#a78bfa','#b49dff','#c4b0ff','#d0c0ff','#e0d5ff','#a78bfa','#9d82ff']
  return (
    <div className="bar-chart">
      {data.map((d, i) => {
        const h = Math.max((d.value / max) * 132, d.value > 0 ? 8 : 2)
        return (
          <div key={i} className="bar-group">
            <div className="bar-wrap">
              <div
                className="bar"
                style={{
                  height: h,
                  background: `linear-gradient(180deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i+3) % COLORS.length]}80)`,
                  boxShadow: `0 0 12px ${COLORS[i % COLORS.length]}40`
                }}
              >
                <span className="bar-tooltip">₹{d.value.toLocaleString()}</span>
              </div>
            </div>
            <div className="bar-label">{d.label}</div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Donut Chart ── */
function DonutChart({ segments, total, centerLabel }) {
  const R = 60, C = 2 * Math.PI * R
  let offset = 0
  const COLORS = ['#7c5cff', '#00c2a8', '#fb923c', '#f87171']
  const paths = segments.map((seg, i) => {
    const pct = total > 0 ? seg.value / total : 0
    const dash = pct * C
    const path = { color: COLORS[i], offset: C - offset * C / total, dasharray: `${dash} ${C - dash}` }
    offset += seg.value
    return path
  })

  return (
    <div className="donut-wrap">
      <div className="donut-svg-wrap">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="14" />
          {paths.map((p, i) => (
            <circle key={i} cx="80" cy="80" r={R} fill="none"
              stroke={p.color} strokeWidth="14"
              strokeDasharray={p.dasharray}
              strokeDashoffset={p.offset}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px', transition: 'stroke-dasharray 1.5s cubic-bezier(0.16,1,0.3,1)', filter: `drop-shadow(0 0 6px ${p.color}60)` }}
            />
          ))}
        </svg>
        <div className="donut-center">
          <div className="donut-center-val">{total}</div>
          <div className="donut-center-label">{centerLabel}</div>
        </div>
      </div>
      <div className="donut-legend">
        {segments.map((seg, i) => (
          <div key={i} className="legend-item">
            <div className="legend-left">
              <div className="legend-dot" style={{ background: ['#7c5cff','#00c2a8','#fb923c','#f87171'][i] }} />
              <span className="legend-name">{seg.label}</span>
            </div>
            <span className="legend-val">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Global Search ── */
function GlobalSearch({ events, invoices, onClose }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef(null)
  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const results = q.trim().length < 2 ? [] : [
    ...events.filter(ev => ev.name?.toLowerCase().includes(q.toLowerCase()) || ev.clientName?.toLowerCase().includes(q.toLowerCase()))
      .slice(0,4).map(ev => ({ type: 'event', icon: '📅', title: ev.name, sub: ev.clientName + ' · ' + new Date(ev.date).toLocaleDateString(), link: '/admin/events' })),
    ...invoices.filter(inv => inv.clientName?.toLowerCase().includes(q.toLowerCase()) || String(inv.invoiceNumber).includes(q))
      .slice(0,4).map(inv => ({ type: 'invoice', icon: '📄', title: `Invoice #${inv.invoiceNumber}`, sub: inv.clientName + ' · ₹' + (inv.total || 0), link: '/admin/invoices' })),
  ]

  const bg = { event: 'rgba(124,92,255,0.15)', invoice: 'rgba(0,194,168,0.15)' }

  return (
    <div className="global-search-overlay" onClick={onClose}>
      <div className="global-search-box" onClick={e => e.stopPropagation()}>
        <div className="global-search-input-wrap">
          <span className="search-icon">🔍</span>
          <input ref={inputRef} className="global-search-input" placeholder="Search events, invoices, clients…" value={q} onChange={e => setQ(e.target.value)} />
          <span className="search-shortcut">ESC</span>
        </div>
        <div className="search-results">
          {q.trim().length < 2
            ? <div className="search-empty">Start typing to search…</div>
            : results.length === 0
            ? <div className="search-empty">No results for "{q}"</div>
            : results.map((r, i) => (
              <div key={i} className="search-result-item" onClick={() => { navigate(r.link); onClose() }}>
                <div className="search-result-icon" style={{ background: bg[r.type] }}>{r.icon}</div>
                <div>
                  <div className="search-result-title">{r.title}</div>
                  <div className="search-result-sub">{r.sub}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

/* ══════════════ MAIN DASHBOARD ══════════════ */
export default function Dashboard() {
  const { token } = useContext(AuthContext)
  const [eventStats, setEventStats]   = useState({ totalEvents: 0, upcomingEvents: 0, completedEvents: 0 })
  const [invoiceStats, setInvoiceStats] = useState({ totalInvoices: 0, paidInvoices: 0, overdueInvoices: 0, totalRevenue: 0 })
  const [recentEvents, setRecentEvents] = useState([])
  const [allEvents,    setAllEvents]    = useState([])
  const [allInvoices,  setAllInvoices]  = useState([])
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState('')
  const [showSearch, setShowSearch] = useState(false)

  /* Keyboard shortcut ⌘K / Ctrl+K */
  useEffect(() => {
    const h = e => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(s => !s) } }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  useEffect(() => {
    if (!token) return
    async function fetchData() {
      setError('')
      try {
        const hdr = { Authorization: `Bearer ${token}` }
        const [statsRes, eventsRes, invoicesRes] = await Promise.all([
          fetch('https://vidhividhan-2.onrender.com/api/events/stats', { headers: hdr }),
          fetch('https://vidhividhan-2.onrender.com/api/events',       { headers: hdr }),
          fetch('https://vidhividhan-2.onrender.com/api/invoices',     { headers: hdr }),
        ])
        if (statsRes.ok) setEventStats(await statsRes.json())
        if (eventsRes.ok) {
          const d = await eventsRes.json()
          setAllEvents(d)
          setRecentEvents(d.slice(0, 6))
        }
        if (invoicesRes.ok) {
          const d = await invoicesRes.json()
          setAllInvoices(d)
          const paid     = d.filter(i => i.status === 'paid')
          const overdue  = d.filter(i => i.status === 'overdue')
          const revenue  = paid.reduce((s, i) => s + (Number(i.total) || 0), 0)
          setInvoiceStats({ totalInvoices: d.length, paidInvoices: paid.length, overdueInvoices: overdue.length, totalRevenue: revenue })
        }
      } catch (e) {
        setError('Unable to load dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  /* Build monthly revenue chart (last 6 months) */
  const monthlyRevenue = (() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i)
      months.push({ label: d.toLocaleString('default', { month: 'short' }), month: d.getMonth(), year: d.getFullYear(), value: 0 })
    }
    allInvoices.filter(i => i.status === 'paid').forEach(inv => {
      const d = new Date(inv.createdAt || inv.date)
      const m = months.find(x => x.month === d.getMonth() && x.year === d.getFullYear())
      if (m) m.value += Number(inv.total) || 0
    })
    return months
  })()

  /* Event type donut */
  const eventTypes = (() => {
    const types = { Wedding: 0, Corporate: 0, Party: 0, Other: 0 }
    allEvents.forEach(ev => {
      const n = (ev.name || ev.eventType || '').toLowerCase()
      if (n.includes('wedding')) types.Wedding++
      else if (n.includes('corporate') || n.includes('corp')) types.Corporate++
      else if (n.includes('party') || n.includes('birthday')) types.Party++
      else types.Other++
    })
    return [
      { label: 'Weddings',    value: types.Wedding },
      { label: 'Corporate',   value: types.Corporate },
      { label: 'Parties',     value: types.Party },
      { label: 'Other',       value: types.Other },
    ]
  })()

  /* Stat card config */
  const statCards = [
    {
      title: 'Total Events', value: eventStats.totalEvents,
      icon: '📅', glowColor: '#7c5cff', iconBg: 'rgba(124,92,255,0.15)',
      trend: 'up', trendVal: '+12%',
      barColor: 'linear-gradient(90deg,#7c5cff,#a78bfa)',
      barPct: Math.min((eventStats.totalEvents / 50) * 100, 100),
    },
    {
      title: 'Upcoming Events', value: eventStats.upcomingEvents,
      icon: '🔜', glowColor: '#00c2a8', iconBg: 'rgba(0,194,168,0.15)',
      trend: 'up', trendVal: 'Active',
      barColor: 'linear-gradient(90deg,#00c2a8,#34d399)',
      barPct: eventStats.totalEvents > 0 ? (eventStats.upcomingEvents / eventStats.totalEvents) * 100 : 0,
    },
    {
      title: 'Completed', value: eventStats.completedEvents,
      icon: '✅', glowColor: '#4ade80', iconBg: 'rgba(74,222,128,0.15)',
      trend: 'up', trendVal: 'Done',
      barColor: 'linear-gradient(90deg,#4ade80,#86efac)',
      barPct: eventStats.totalEvents > 0 ? (eventStats.completedEvents / eventStats.totalEvents) * 100 : 0,
    },
    {
      title: 'Total Invoices', value: invoiceStats.totalInvoices,
      icon: '📄', glowColor: '#fb923c', iconBg: 'rgba(251,146,60,0.15)',
      trend: 'neutral', trendVal: 'All',
      barColor: 'linear-gradient(90deg,#fb923c,#fdba74)',
      barPct: Math.min((invoiceStats.totalInvoices / 30) * 100, 100),
    },
    {
      title: 'Revenue (₹)', value: invoiceStats.totalRevenue.toFixed(0),
      prefix: '₹', icon: '💰', glowColor: '#ffd700', iconBg: 'rgba(255,215,0,0.12)',
      trend: 'up', trendVal: '+8%',
      barColor: 'linear-gradient(90deg,#ffd700,#fbbf24)',
      barPct: Math.min((invoiceStats.totalRevenue / 500000) * 100, 100),
    },
    {
      title: 'Overdue', value: invoiceStats.overdueInvoices,
      icon: '⚠️', glowColor: '#f87171', iconBg: 'rgba(248,113,113,0.15)',
      trend: invoiceStats.overdueInvoices > 0 ? 'down' : 'up',
      trendVal: invoiceStats.overdueInvoices > 0 ? 'Action needed' : 'All clear',
      barColor: 'linear-gradient(90deg,#f87171,#fca5a5)',
      barPct: invoiceStats.totalInvoices > 0 ? (invoiceStats.overdueInvoices / invoiceStats.totalInvoices) * 100 : 0,
    },
  ]

  const quickActions = [
    { icon: '➕', label: 'New Event',   bg: 'rgba(124,92,255,0.15)', link: '/admin/events' },
    { icon: '📄', label: 'New Invoice', bg: 'rgba(0,194,168,0.15)',  link: '/admin/invoice-creator' },
    { icon: '👥', label: 'Clients',     bg: 'rgba(251,146,60,0.15)', link: '/admin/clients' },
    { icon: '📋', label: 'Activity',    bg: 'rgba(74,222,128,0.15)', link: '/admin/activity' },
  ]

  return (
    <div className="dashboard">
      {/* Global Search */}
      {showSearch && <GlobalSearch events={allEvents} invoices={allInvoices} onClose={() => setShowSearch(false)} />}

      {/* Top Bar */}
      <div className="dash-topbar">
        <div className="dash-topbar-left">
          <h1>Dashboard</h1>
          <p>Welcome back — here's what's happening today</p>
        </div>
        <div className="dash-topbar-right">
          <button className="dash-quick-btn secondary" onClick={() => setShowSearch(true)}>
            🔍 Search <span style={{fontSize:11,opacity:0.5}}>⌘K</span>
          </button>
          <Link className="dash-quick-btn primary" to="/admin/events">+ New Event</Link>
        </div>
      </div>

      {/* Overdue alert */}
      {!loading && invoiceStats.overdueInvoices > 0 && (
        <div className="dash-alert">
          <span className="dash-alert-icon">⚠️</span>
          <span>You have <strong>{invoiceStats.overdueInvoices} overdue invoice{invoiceStats.overdueInvoices > 1 ? 's' : ''}</strong> that need attention.</span>
          <Link to="/admin/invoices" style={{ marginLeft: 'auto', color: '#f87171', textDecoration: 'none', fontWeight: 700, fontSize: 12 }}>View →</Link>
        </div>
      )}

      {error && <div className="dash-error">⚠ {error}</div>}

      {/* Stat Cards */}
      <div className="stats-grid">
        {loading
          ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : statCards.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-card-glow" style={{ background: s.glowColor }} />
              <div className="stat-card-top">
                <div className="stat-icon-wrap" style={{ background: s.iconBg }}>{s.icon}</div>
                <div className={`stat-trend ${s.trend}`}>
                  {s.trend === 'up' ? '↑' : s.trend === 'down' ? '↓' : '–'} {s.trendVal}
                </div>
              </div>
              <div className="stat-value">
                <Counter target={s.value} prefix={s.prefix || ''} />
              </div>
              <div className="stat-label">{s.title}</div>
              <div className="stat-bar-track">
                <div className="stat-bar-fill" style={{ width: `${s.barPct}%`, background: s.barColor }} />
              </div>
            </div>
          ))
        }
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        {quickActions.map((a, i) => (
          <Link key={i} className="quick-action-card" to={a.link}>
            <div className="quick-action-icon" style={{ background: a.bg }}>{a.icon}</div>
            {a.label}
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      {!loading && (
        <div className="charts-row">
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>Revenue — Last 6 Months</h3>
              <span className="chart-badge">₹ {invoiceStats.totalRevenue.toLocaleString()}</span>
            </div>
            <BarChart data={monthlyRevenue} />
          </div>
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>Event Breakdown</h3>
              <span className="chart-badge">{eventStats.totalEvents} Total</span>
            </div>
            <DonutChart
              segments={eventTypes}
              total={eventStats.totalEvents}
              centerLabel="Events"
            />
          </div>
        </div>
      )}

      {/* Recent Events */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Events</h2>
          <Link className="section-link" to="/admin/events">View all →</Link>
        </div>
        {loading ? (
          <div>{Array(4).fill(0).map((_, i) => <div key={i} className="skeleton skeleton-row" />)}</div>
        ) : recentEvents.length === 0 ? (
          <p style={{ color: '#475569', fontSize: 14 }}>No events yet. <Link to="/admin/events" style={{ color: '#7c5cff' }}>Create your first →</Link></p>
        ) : (
          <div className="events-table">
            <div className="table-header">
              <div>Event Name</div>
              <div>Date</div>
              <div>Client</div>
              <div>Status</div>
            </div>
            {recentEvents.map(ev => (
              <div key={ev._id} className="table-row">
                <div className="col-name">{ev.name}</div>
                <div>{new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</div>
                <div>{ev.clientName}</div>
                <div>
                  <span className={`status ${(ev.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                    {ev.status}
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
