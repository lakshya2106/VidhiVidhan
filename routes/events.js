import express from 'express'
import auth from '../middleware/auth.js'
import { createEvent, getEvents, getEvent, updateEvent, deleteEvent, getStats } from '../controllers/eventController.js'

const router = express.Router()

router.post('/', auth, createEvent)
router.get('/', auth, getEvents)
router.get('/stats', auth, getStats)
router.get('/:id', auth, getEvent)
router.put('/:id', auth, updateEvent)
router.delete('/:id', auth, deleteEvent)

export default router
