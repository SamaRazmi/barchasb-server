import { Router } from 'express'
import { AdminLogin } from '../../../controllers/admin/auth/login'

const router = Router()

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Admin Login
 *     description: Authenticates an admin user using phone and password, and returns a JWT access token.
 *     tags: [Admin backend]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The admin's phone number
 *                 example: "09123456789"
 *               password:
 *                 type: string
 *                 description: The admin's password
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful. Returns a JWT token based on the admin's role (ADMIN or SUPER_ADMIN).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad Request - Missing phone or password in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["password or phone is not entered"]
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized - Admin not found, account not verified, or invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message (Returns Persian text if not found/unverified, English if password is wrong)
 *                   example: "ادمین با این مشخصات وجود ندارد"
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 */
router.post('/login', AdminLogin)

export default router