import { Router } from 'express'
import { AdminAuthCtrl } from '../controllers/AdminAuthCtrl'
import { authenticateAdmin } from '../../middleware/authMidleware'

const router = Router()

/**
 * @swagger
 * /api/admin/auth/setup-owner:
 *   post:
 *     tags: [Admin-Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - username
 *               - phone
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: نام کامل
 *               username:
 *                 type: string
 *                 description: نام کاربری
 *               phone:
 *                 type: string
 *                 description: شماره تماس
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: رمز عبور (حداقل ۸ کاراکتر)
 *     responses:
 *       201:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     username:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: OWNER
 *                     status:
 *                       type: string
 *                       example: ACTIVE
 *                     platforms:
 *                       type: array
 *                       items:
 *                         type: string
 *                         enum: [SHOP, EDUCATION, CLUB, MAIN]
 *       400:
 *         description: خطای ورودی
 *       403:
 *         description: فقط در محیط توسعه فعال است
 */
router.post('/setup-owner', AdminAuthCtrl.setupOwner)

/**
 * @swagger
 * /api/admin/auth/login:
 *   post:
 *     tags: [Admin-Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: نام کاربری ادمین
 *                 example: owner
 *               password:
 *                 type: string
 *                 description: رمز عبور
 *                 example: Owner@123
 *     responses:
 *       200:
 *         description: ورود موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     admin:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         username:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         role:
 *                           type: string
 *                         status:
 *                           type: string
 *                         platforms:
 *                           type: array
 *                           items:
 *                             type: string
 *                         permissions:
 *                           type: object
 *       400:
 *         description: خطا در ورودی
 *       401:
 *         description: نام کاربری یا رمز عبور اشتباه است
 */
router.post('/login', AdminAuthCtrl.login)

/**
 * @swagger
 * /api/admin/auth/me:
 *   get:
 *     tags: [Admin-Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     username:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     role:
 *                       type: string
 *                     status:
 *                       type: string
 *                     platforms:
 *                       type: array
 *                       items:
 *                         type: string
 *                     permissions:
 *                       type: object
 *                     lastLoginAt:
 *                       type: string
 *                       format: date-time
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     createdBy:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         fullName:
 *                           type: string
 *                         username:
 *                           type: string
 *       401:
 *         description: احراز هویت نشده
 */
router.get('/me', authenticateAdmin, AdminAuthCtrl.me)

export default router