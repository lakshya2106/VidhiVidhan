import Invoice from '../models/Invoice.js'
import mongoose from 'mongoose'

export async function createInvoice(req, res) {
  const { invoice, totals } = req.body
  const mobile = req.user.mobile

  try {
    const newInvoice = await Invoice.create({
      invoiceNumber: invoice.invoiceNumber,
      createdDate: invoice.createdDate,
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
      status: 'draft',
      createdBy: mobile,
    })
    res.status(201).json(newInvoice)
  } catch (err) {
    console.error('Create invoice error:', err)
    res.status(500).json({ message: 'Error creating invoice' })
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
