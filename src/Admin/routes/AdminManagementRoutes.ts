import { Router } from 'express'
import AdminManagementCtrl from '../controllers/AdminManagementCtrl'
import { authenticateAdmin } from '../../middleware/authMidleware'

const router = Router()

router.use(authenticateAdmin)

/**
 * @swagger
 * /api/admin/admins:
 *   post:
 *     tags: [Admin-Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, phone, password, role, platforms, permissions]
 *             properties:
 *               fullName: { type: string }
 *               phone: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [ADMIN, SUPPORTER] }
 *               platforms: { type: array, items: { type: string, enum: [SHOP, EDUCATION, CLUB, MAIN] } }
 *               permissions:
 *                 type: object
 *                 properties:
 *                   users: { type: boolean }
 *                   ads: { type: boolean }
 *                   stories: { type: boolean }
 *                   tickets: { type: boolean }
 *                   costs: { type: boolean }
 *                   articles: { type: boolean }
 *                   advertisements: { type: boolean }
 *     responses:
 *       201: { description: موفق }
 */
router.post('/admins', AdminManagementCtrl.create)

/**
 * @swagger
 * /api/admin/admins:
 *   get:
 *     tags: [Admin-Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: platform
 *         schema: { type: string, enum: [SHOP, EDUCATION, CLUB, MAIN] }
 *     responses:
 *       200: { description: موفق }
 */
router.get('/admins', AdminManagementCtrl.list)

/**
 * @swagger
 * /api/admin/admins/{id}:
 *   get:
 *     tags: [Admin-Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: موفق }
 */
router.get('/admins/:id', AdminManagementCtrl.getOne)

/**
 * @swagger
 * /api/admin/admins/{id}:
 *   put:
 *     tags: [Admin-Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: { type: string }
 *               phone: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [ADMIN, SUPPORTER] }
 *               status: { type: string, enum: [PENDING, ACTIVE, INACTIVE] }
 *               platforms: { type: array, items: { type: string, enum: [SHOP, EDUCATION, CLUB, MAIN] } }
 *               permissions: { type: object }
 *     responses:
 *       200: { description: موفق }
 */
router.put('/admins/:id', AdminManagementCtrl.update)

/**
 * @swagger
 * /api/admin/admins/{id}:
 *   delete:
 *     tags: [Admin-Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: موفق }
 */
router.delete('/admins/:id', AdminManagementCtrl.delete)

export default router