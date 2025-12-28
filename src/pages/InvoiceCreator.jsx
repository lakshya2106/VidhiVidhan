import { useEffect, useState, useContext } from 'react'
import generateInvoicePDF from './generateInvoicePDF'
import { AuthContext } from '../auth/AuthContext'
import '../styles/InvoiceCreator.css'

import companyLogo from '../assets/logoBase64'
import bgimage from '../assets/bgBase64'

function InvoiceCreator() {

  const { token } = useContext(AuthContext)

  const [invoice, setInvoice] = useState({
    invoiceNumber: '',
    createdDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    companyLogo: companyLogo,
    bgimage: bgimage,
    sender: {
      name: 'Vidhi Vidhan',
      address1: '',
      address2: '',
      acc: '',
      iban: '',
      bic: '',
    },
    receiver: {
      name: '',
      address1: '',
      address2: '',
      phoneNumber: '',
      events: [],
    },
    items: [{ description: '', price: '', qty: 1 }],
    taxRate: 18,
    footerText: 'Thank you for your business!',
    footerText2: '',
  })

useEffect(() => {
  if (!token || typeof token !== 'string' || token.length < 10) return

  async function fetchPreviewNumber() {
    try {
      const res = await fetch('/api/invoices/next-number', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('Preview fetch failed:', res.status, text)
        return
      }

      const data = await res.json()
      setInvoice(prev => ({
        ...prev,
        invoiceNumber: data.invoiceNumber,
      }))
    } catch (err) {
      console.error('Failed to fetch invoice preview number', err)
    }
  }

  fetchPreviewNumber()
}, [token])

  const handleSenderChange = (field, value) => {
    setInvoice({
      ...invoice,
      sender: { ...invoice.sender, [field]: value },
    })
  }

  const handleReceiverChange = (field, value) => {
    setInvoice({
      ...invoice,
      receiver: { ...invoice.receiver, [field]: value },
    })
  }

  const handleEventDateChange = (index, value) => {
    const newEvents = [...(invoice.receiver.events || [])]
    newEvents[index] = value
    setInvoice({ ...invoice, receiver: { ...invoice.receiver, events: newEvents } })
  }

  const addEventDate = () => {
    const newEvents = [...(invoice.receiver.events || []), '']
    setInvoice({ ...invoice, receiver: { ...invoice.receiver, events: newEvents } })
  }

  const removeEventDate = (index) => {
    const newEvents = (invoice.receiver.events || []).filter((_, i) => i !== index)
    setInvoice({ ...invoice, receiver: { ...invoice.receiver, events: newEvents } })
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items]
    newItems[index][field] = value
    setInvoice({ ...invoice, items: newItems })
  }

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: '', price: '', qty: '' }],
    })
  }

  const removeItem = (index) => {
    const newItems = invoice.items.filter((_, i) => i !== index)
    setInvoice({ ...invoice, items: newItems })
  }

  const calculateTotals = () => {
    const subTotal = invoice.items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0
      const qty = parseInt(item.qty) || 1
      return sum + price * qty
    }, 0)

    const taxAmount = (subTotal * invoice.taxRate) / 100

    return {
      subTotal: subTotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: (subTotal + taxAmount).toFixed(2),
    }
  }

  const totals = calculateTotals()


  const handleSave = async () => {
    if (!invoice.receiver.name.trim()) {
      alert('Client name is required')
      return
    }

    if (!invoice.items.length || !invoice.items[0].description.trim()) {
      alert('At least one item with description is required')
      return
    }


    if (!token) {
      alert('You must be logged in to save invoices')
      return
    }

    try {
      // Deep-clone and sanitize invoice to avoid sending large base64 images
      const payloadInvoice = JSON.parse(JSON.stringify(invoice))
      // Remove potentially large embedded images
      delete payloadInvoice.companyLogo
      delete payloadInvoice.bgimage

      // Normalize items: ensure numeric prices/qty
      payloadInvoice.items = (payloadInvoice.items || []).map((it) => ({
        description: it.description || '',
        price: parseFloat(it.price) || 0,
        qty: parseInt(it.qty) || 1,
      }))

      const payloadTotals = {
        subTotal: parseFloat(totals.subTotal) || 0,
        taxAmount: parseFloat(totals.taxAmount) || 0,
        total: parseFloat(totals.total) || 0,
      }

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ invoice: payloadInvoice, totals: payloadTotals }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to save invoice')
      }

      const saved = await res.json()
      alert('Invoice saved successfully')
      console.log('Saved invoice:', saved)
    } catch (err) {
      console.error('Save invoice error:', err)
      alert('Error saving invoice: ' + (err.message || 'Unknown error'))
    }
  }

  const handleDownloadPDF = () => {
    if (!invoice.sender.name) {
      alert('Please enter sender company name first')
      return
    }
    try {
      generateInvoicePDF(invoice, totals)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="invoice-creator">
      <div className="invoice-header">
        <h1>Create Invoice</h1>
        <div className="invoice-actions">
          <button onClick={handlePrint} className="btn btn-print">
            🖨️ Print
          </button>
          <button onClick={handleDownloadPDF} className="btn btn-download">
            📥 Download PDF
          </button>
        </div>
      </div>

      <div className="invoice-container">
        {/* Basic Info Section */}
        <section className="form-section">
          <h3>Invoice Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Invoice Number</label>
              <input
                type="text"
                value={invoice.invoiceNumber || 'Generating...'}
                readOnly
                className="readonly-input"
              />
            </div>

            <div className="form-group">
              <label>Created Date</label>
              <input type="date" value={invoice.createdDate} readOnly />
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={invoice.dueDate}
                onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Sender Info */}
        <section className="form-section">
          <h3>From (Your Company)</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                placeholder="Your Company Name"
                value={invoice.sender.name}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Address Line 1</label>
              <input
                type="text"
                placeholder="Street Address"
                value={invoice.sender.address1}
                onChange={(e) => handleSenderChange('address1', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Address Line 2</label>
              <input
                type="text"
                placeholder="City, State ZIP"
                value={invoice.sender.address2}
                onChange={(e) => handleSenderChange('address2', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="Phone Number"
                value={invoice.sender.acc}
                onChange={(e) => handleSenderChange('acc', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>IBAN</label>
              <input
                type="text"
                placeholder="Bank IBAN"
                value={invoice.sender.iban}
                onChange={(e) => handleSenderChange('iban', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>BIC/SWIFT Code</label>
              <input
                type="text"
                placeholder="Bank BIC Code"
                value={invoice.sender.bic}
                onChange={(e) => handleSenderChange('bic', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Receiver Info */}
        <section className="form-section">
          <h3>To (Client)</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Company Name / Client Name</label>
              <input
                type="text"
                placeholder="Client Company Name"
                value={invoice.receiver.name}
                onChange={(e) => handleReceiverChange('name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Address Line 1</label>
              <input
                type="text"
                placeholder="Street Address"
                value={invoice.receiver.address1}
                onChange={(e) => handleReceiverChange('address1', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Address Line 2</label>
              <input
                type="text"
                placeholder="City, State ZIP"
                value={invoice.receiver.address2}
                onChange={(e) => handleReceiverChange('address2', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="Mobile Number"
                value={invoice.receiver.phoneNumber}
                onChange={(e) => handleReceiverChange('phoneNumber', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Event Dates</label>
              <div className="event-dates-list">
                {(invoice.receiver.events || []).map((d, i) => (
                  <div key={i} className="event-date-row">
                    <input
                      type="date"
                      value={d}
                      onChange={(e) => handleEventDateChange(i, e.target.value)}
                    />
                    <button
                      className="btn-remove"
                      onClick={() => removeEventDate(i)}
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button type="button" className="btn-add-item" onClick={addEventDate}>
                  + Add Event Date
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Items Section */}
        <section className="form-section">
          <h3>Invoice Items</h3>
          <div className="items-table">
            <div className="table-header">
              <div className="col-description">Description</div>
              <div className="col-price">Amount (₹)</div>
              <div className="col-qty">Qty</div>
              <div className="col-total">Total (₹)</div>
              <div className="col-action">Action</div>
            </div>
            {invoice.items.map((item, index) => (
              <div key={index} className="table-row">
                <input
                  type="text"
                  className="col-description"
                  placeholder="Service description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                />

                <input
                  type="number"
                  className="col-price"
                  placeholder="0.00"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                />

                <input
                  type="number"
                  className="col-qty"
                  min="1"
                  value={item.qty}
                  onChange={(e) =>
                    handleItemChange(index, 'qty', parseInt(e.target.value) || 1)
                  }
                />

                <div className="col-total">
                  ₹ {(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}
                </div>

                <button
                  className="col-action btn-remove"
                  onClick={() => removeItem(index)}
                  disabled={invoice.items.length === 1}
                >
                  ✕
                </button>
              </div>

            ))}
          </div>
          <button onClick={addItem} className="btn btn-add-item">
            + Add Item
          </button>
        </section>

        {/* Totals Section */}
        <section className="form-section totals-section">
          <div className="totals-grid">
            <div className="total-item">
              <label>Subtotal</label>
              <p>₹ {totals.subTotal}</p>
            </div>
            <div className="total-item">
              <label>Tax ({invoice.taxRate}%)</label>
              <p>₹ {totals.taxAmount}</p>
            </div>
            <div className="total-item total-final">
              <label>Total Amount Due</label>
              <p>₹ {totals.total}</p>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <section className="form-section">
          <h3>Footer Message</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Message Line 1</label>
              <input
                type="text"
                placeholder="e.g., Thank you for your business!"
                value={invoice.footerText}
                onChange={(e) => setInvoice({ ...invoice, footerText: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Message Line 2</label>
              <input
                type="text"
                placeholder="e.g., Payment due within 30 days"
                value={invoice.footerText2}
                onChange={(e) => setInvoice({ ...invoice, footerText2: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="form-actions">
          <button className="btn btn-save" onClick={handleSave} type="button">💾 Save Invoice</button>
          <button className="btn btn-reset" onClick={() => window.location.reload()}>
            🔄 Reset Form
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoiceCreator
