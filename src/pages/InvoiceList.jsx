import { useState, useEffect, useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../auth/AuthContext'
import '../styles/InvoiceList.css'
import { logActivity } from '../utils/activityLog'

function InvoiceList() {
  const { token } = useContext(AuthContext)
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInvoices()
  }, [token])

  async function fetchInvoices() {
    setError('')
    try {
      const res = await fetch('https://vidhividhan-2.onrender.com/api/invoices', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setInvoices(data)
      } else {
        setError('Failed to load invoices')
      }
    } catch (err) {
      console.error('Error fetching invoices:', err)
      setError('Unable to fetch invoices. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return
    try {
      const res = await fetch(`https://vidhividhan-2.onrender.com/api/invoices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const deleted = invoices.find(inv => inv._id === id)
        setInvoices(invoices.filter(inv => inv._id !== id))
        logActivity({
          action: 'Deleted invoice',
          entity: 'invoice',
          details: deleted?.invoiceNumber || id,
        })
      }
    } catch (err) {
      console.error('Error deleting invoice:', err)
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      const res = await fetch(`https://vidhividhan-2.onrender.com/api/invoices/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        const updated = await res.json()
        setInvoices(invoices.map(inv => (inv._id === id ? updated : inv)))
        logActivity({
          action: `Changed invoice status to ${newStatus}`,
          entity: 'invoice',
          details: updated.invoiceNumber,
        })
      }
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const filteredInvoices = useMemo(() => {
    const byStatus = filter === 'all' ? invoices : invoices.filter((inv) => inv.status === filter)
    if (!search.trim()) return byStatus
    const term = search.toLowerCase()
    return byStatus.filter((inv) => {
      const number = inv.invoiceNumber || ''
      const client = inv.receiver?.name || ''
      return number.toLowerCase().includes(term) || client.toLowerCase().includes(term)
    })
  }, [invoices, filter, search])

  const summary = useMemo(() => {
    const total = invoices.length
    const paid = invoices.filter((inv) => inv.status === 'paid')
    const overdue = invoices.filter((inv) => inv.status === 'overdue')
    const paidAmount = paid.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0)
    const overdueAmount = overdue.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0)

    return {
      total,
      paidCount: paid.length,
      overdueCount: overdue.length,
      paidAmount,
      overdueAmount,
    }
  }, [invoices])

  return (
    <div className="invoice-list-page">
      <div className="page-header">
        <h1>Invoices</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              if (!filteredInvoices.length) return
              const header = ['Invoice #', 'Client', 'Amount', 'Status', 'Date']
              const rows = filteredInvoices.map((inv) => [
                inv.invoiceNumber,
                inv.receiver?.name || '',
                inv.total?.toFixed(2) || '0.00',
                inv.status,
                new Date(inv.createdDate).toLocaleDateString(),
              ])
              const csv = [header, ...rows]
                .map((r) => r.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))
                .join('\n')
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'invoices.csv'
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            ⬇ Export CSV
          </button>
          <Link to="/admin/invoice-creator" className="btn btn-primary">
            + Create Invoice
          </Link>
        </div>
      </div>

      <div className="filter-bar">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Invoices</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <input
          type="text"
          placeholder="Search by invoice # or client"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.04)',
            background: 'transparent',
            color: 'var(--text)',
          }}
        />
      </div>

      {error && <p style={{ color: '#f97373', marginBottom: 12 }}>{error}</p>}

      {!loading && invoices.length > 0 && (
        <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--muted)' }}>
          <span>Total: {summary.total} | </span>
          <span>
            Paid: {summary.paidCount} (₹{summary.paidAmount.toFixed(2)}) |{' '}
          </span>
          <span>
            Overdue: {summary.overdueCount} (₹{summary.overdueAmount.toFixed(2)})
          </span>
        </div>
      )}

      {loading ? (
        <p>Loading invoices...</p>
      ) : filteredInvoices.length === 0 ? (
        <p>No invoices found. <Link to="/admin/invoice-creator">Create one</Link></p>
      ) : (
        <div className="invoices-table">
          <div className="table-header">
            <div className="col-number">Invoice #</div>
            <div className="col-client">Client</div>
            <div className="col-amount">Amount</div>
            <div className="col-status">Status</div>
            <div className="col-date">Date</div>
            <div className="col-actions">Actions</div>
          </div>
          {filteredInvoices.map((invoice) => (
            <div key={invoice._id} className="table-row">
              <div className="col-number" data-label="Invoice #">{invoice.invoiceNumber}</div>
              <div className="col-client" data-label="Client">
                <div>{invoice.receiver.name}</div>
                {invoice.note && (
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>📝 {invoice.note}</div>
                )}
              </div>
              <div className="col-amount" data-label="Amount">₹{invoice.total?.toFixed(2) || '0.00'}</div>
              <div className="col-status" data-label="Status">
                <select 
                  value={invoice.status}
                  onChange={(e) => handleStatusChange(invoice._id, e.target.value)}
                  className={`status-select status-${invoice.status}`}
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div className="col-date" data-label="Date">{new Date(invoice.createdDate).toLocaleDateString()}</div>
              <div className="col-actions" data-label="Actions">
                <Link to={`/admin/invoice-creator?id=${invoice._id}`} className="btn-action btn-edit">
                  Edit
                </Link>
                <button onClick={() => handleDelete(invoice._id)} className="btn-action btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InvoiceList
