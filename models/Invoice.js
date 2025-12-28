import mongoose from 'mongoose'

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    createdDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    sender: {
      name: { type: String, required: true },
      address1: String,
      address2: String,
      acc: String,
      iban: String,
      bic: String,
    },
    receiver: {
      name: { type: String, required: true },
      address1: String,
      address2: String,
      phoneNumber: String,
      events: [String],
    },
    items: [
      {
        description: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, default: 1 },
      },
    ],
    taxRate: { type: Number, default: 18 },
    subTotal: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    footerText: String,
    footerText2: String,
    status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue'], default: 'draft' },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema)
