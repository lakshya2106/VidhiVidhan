import express from 'express';
const router = express.Router()
import { login, profile } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

router.post('/login', login)
router.get('/profile', auth, profile)

export default router
