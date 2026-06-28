import { Router } from 'express'
import { AdminLogin } from '../../../controllers/admin/auth/login'

const router = Router()

router.post('/login', AdminLogin)

export default router