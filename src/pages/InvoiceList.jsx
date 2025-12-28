import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../auth/AuthContext'
import '../styles/InvoiceList.css'

function InvoiceList() {
  const { token } = useContext(AuthContext)
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchInvoices()
  }, [token])

  async function fetchInvoices() {
    try {
      const res = await fetch('https://vidhividhan-2.onrender.com/api/invoices', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setInvoices(data)
      }
    } catch (err) {
      console.error('Error fetching invoices:', err)
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
        setInvoices(invoices.filter(inv => inv._id !== id))
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
      }
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const filteredInvoices = filter === 'all' ? invoices : invoices.filter(inv => inv.status === filter)

  return (
    <div className="invoice-list-page">
      <div className="page-header">
        <h1>Invoices</h1>
        <Link to="/invoice-creator" className="btn btn-primary">
          + Create Invoice
        </Link>
      </div>

      <div className="filter-bar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="all">All Invoices</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {loading ? (
        <p>Loading invoices...</p>
      ) : filteredInvoices.length === 0 ? (
        <p>No invoices found. <Link to="/invoice-creator">Create one</Link></p>
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
              <div className="col-client" data-label="Client">{invoice.receiver.name}</div>
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
                <Link to={`/invoice-creator?id=${invoice._id}`} className="btn-action btn-edit">
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
