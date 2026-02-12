import express from 'express';
const router = express.Router()
import { login, profile, updateProfile } from '../controllers/authController.js'

import auth from '../middleware/auth.js';

router.post('/login', login)
router.get('/profile', auth, profile)
router.patch('/profile', auth, updateProfile)
export default router
