import { Router } from 'express'
import { register, login, getMe } from '../controllers/authController'
import { protect } from '../middleware/auth'
import { registerValidator, loginValidator, validate } from '../middleware/validators'

const router = Router()

router.post('/register', registerValidator, validate, register)
router.post('/login', loginValidator, validate, login)
router.get('/me', protect, getMe)

export default router
