import Invoice from '../models/Invoice.js'
import Counter from '../models/Counter.js'
import { getNextInvoiceNumber } from '../utils/getNextInvoiceNumber.js'
import mongoose from 'mongoose'


export async function getNextInvoicePreview(req, res) {
  try {
    let counter
    try {
      counter = await Counter.findOne({ name: 'invoice' })
    } catch (dbErr) {
      console.warn('Counter fetch warning:', dbErr.message)
      counter = null
    }
    
    const nextSeq = (counter?.seq || 0) + 1
    const invoiceNumber = `INV-${String(nextSeq).padStart(4, '0')}`
    res.json({ invoiceNumber })
  } catch (err) {
    console.error('Preview invoice number error:', err)
    res.status(500).json({ message: 'Failed to get invoice preview', error: err.message })
  }
}

export async function createInvoice(req, res) {
  const { invoice, totals } = req.body
  const mobile = req.user && req.user.mobile

  if (!invoice || !totals) {
    return res.status(400).json({ message: 'Missing invoice or totals in request body' })
  }

  try {
     const invoiceNumber = await getNextInvoiceNumber()
    const newInvoice = await Invoice.create({
      invoiceNumber,
      createdDate: invoice.createdDate,
      dueDate: invoice.dueDate,
      sender: invoice.sender,
      receiver: invoice.receiver,
      items: invoice.items,
      taxRate: invoice.taxRate,
      subTotal: Number.isFinite(parseFloat(totals.subTotal)) ? parseFloat(totals.subTotal) : 0,
      taxAmount: Number.isFinite(parseFloat(totals.taxAmount)) ? parseFloat(totals.taxAmount) : 0,
      total: Number.isFinite(parseFloat(totals.total)) ? parseFloat(totals.total) : 0,
      footerText: invoice.footerText,
      footerText2: invoice.footerText2,
      status: 'draft',
      createdBy: mobile || 'unknown',
    })
    res.status(201).json(newInvoice)
  } catch (err) {
    console.error('Create invoice error:', err)
    // Duplicate key (unique invoiceNumber)
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Invoice number already exists' })
    }
    // Mongoose validation errors
    if (err && err.name === 'ValidationError') {
      const details = Object.values(err.errors || {}).map((e) => e.message)
      return res.status(400).json({ message: 'Validation error', details })
    }

    res.status(500).json({ message: err.message || 'Error creating invoice' })
  }
}

export async function getInvoices(req, res) {
  const mobile = req.user.mobile
  try {
    const invoices = await Invoice.find({ createdBy: mobile }).sort({ createdDate: -1 })
    res.json(invoices)
  } catch (err) {
    console.error('Get invoices error:', err)
    res.status(500).json({ message: 'Error fetching invoices' })
  }
}

export async function getInvoice(req, res) {
  const { id } = req.params
  const mobile = req.user.mobile

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid invoice ID' })
  }

  try {
    const invoice = await Invoice.findOne({ _id: id, createdBy: mobile })
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' })
    res.json(invoice)
  } catch (err) {
    console.error('Get invoice error:', err)
    res.status(500).json({ message: 'Error fetching invoice' })
  }
}

export async function updateInvoice(req, res) {
  const { id } = req.params
  const { invoice, totals } = req.body
  const mobile = req.user.mobile

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid invoice ID' })
  }

  try {
    const updated = await Invoice.findOneAndUpdate(
      { _id: id, createdBy: mobile },
      {
        invoiceNumber: invoice.invoiceNumber,
        dueDate: invoice.dueDate,
        sender: invoice.sender,
        receiver: invoice.receiver,
        items: invoice.items,
        taxRate: invoice.taxRate,
        subTotal: parseFloat(totals.subTotal),
        taxAmount: parseFloat(totals.taxAmount),
        total: parseFloat(totals.total),
        footerText: invoice.footerText,
        footerText2: invoice.footerText2,
      },
      { new: true }
    )
    if (!updated) return res.status(404).json({ message: 'Invoice not found' })
    res.json(updated)
  } catch (err) {
    console.error('Update invoice error:', err)
    res.status(500).json({ message: 'Error updating invoice' })
  }
}

export async function deleteInvoice(req, res) {
  const { id } = req.params
  const mobile = req.user.mobile

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid invoice ID' })
  }

  try {
    const deleted = await Invoice.findOneAndDelete({ _id: id, createdBy: mobile })
    if (!deleted) return res.status(404).json({ message: 'Invoice not found' })
    res.json({ message: 'Invoice deleted' })
  } catch (err) {
    console.error('Delete invoice error:', err)
    res.status(500).json({ message: 'Error deleting invoice' })
  }
}

export async function updateInvoiceStatus(req, res) {
  const { id } = req.params
  const { status } = req.body
  const mobile = req.user.mobile

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid invoice ID' })
  }

  if (!['draft', 'sent', 'paid', 'overdue'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }

  try {
    const updated = await Invoice.findOneAndUpdate(
      { _id: id, createdBy: mobile },
      { status },
      { new: true }
    )
    if (!updated) return res.status(404).json({ message: 'Invoice not found' })
    res.json(updated)
  } catch (err) {
    console.error('Update status error:', err)
    res.status(500).json({ message: 'Error updating status' })
  }
}
