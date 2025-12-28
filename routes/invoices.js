import express from 'express'
import auth from '../middleware/auth.js'
import { createInvoice, getInvoices, getInvoice, updateInvoice, deleteInvoice, updateInvoiceStatus } from '../controllers/invoiceController.js'

const router = express.Router()

router.post('/', auth, createInvoice)
router.get('/', auth, getInvoices)
router.get('/:id', auth, getInvoice)
router.put('/:id', auth, updateInvoice)
router.delete('/:id', auth, deleteInvoice)
router.patch('/:id/status', auth, updateInvoiceStatus)

export default router
