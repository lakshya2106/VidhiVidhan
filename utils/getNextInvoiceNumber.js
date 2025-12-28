import Counter from '../models/Counter.js'

export async function getNextInvoiceNumber() {
  const counter = await Counter.findOneAndUpdate(
    { name: 'invoice' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )

  // Format however you want
  // INV-0001, INV-0002 ...
  return `INV-${String(counter.seq).padStart(4, '0')}`
}
