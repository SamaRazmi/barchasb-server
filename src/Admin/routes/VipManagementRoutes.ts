import { Router } from 'express'
import AdminVipCtrl from '../controllers/VipManagmentCtrl'
import { authenticateAdmin } from '../../middleware/authMidleware'

const router = Router()

/**
 * @swagger
 * /api/admin/vip-codes/generate:
 *   post:
 *     tags: [Admin-VIP]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, count, vipDuration]
 *             properties:
 *               title:
 *                 type: string
 *               count:
 *                 type: integer
 *               maxUses:
 *                 type: integer
 *               vipDuration:
 *                 type: integer
 *               isPublic:
 *                 type: boolean
 *               targetUserId:
 *                 type: string
 *     responses:
 *       201: { description: موفق }
 *       403: { description: فقط OWNER }
 */
router.post('/generate', authenticateAdmin, AdminVipCtrl.generate)

/**
 * @swagger
 * /api/admin/vip-codes/{id}/activate:
 *   put:
 *     tags: [Admin-VIP]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200: { description: موفق }
 *       403: { description: فقط OWNER }
 */
router.put('/:id/activate', authenticateAdmin, AdminVipCtrl.activate)

/**
 * @swagger
 * /api/admin/vip-codes/{id}/deactivate:
 *   put:
 *     tags: [Admin-VIP]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200: { description: موفق }
 *       403: { description: فقط OWNER }
 */
router.put('/:id/deactivate', authenticateAdmin, AdminVipCtrl.deactivate)

/**
 * @swagger
 * /api/admin/vip-codes:
 *   get:
 *     tags: [Admin-VIP]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, all]
 *     responses:
 *       200: { description: موفق }
 *       403: { description: فقط OWNER }
 */
router.get('', authenticateAdmin, AdminVipCtrl.list)

/**
 * @swagger
 * /api/admin/vip-codes/{id}:
 *   delete:
 *     tags: [Admin-VIP]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200: { description: موفق }
 *       403: { description: فقط OWNER }
 */
router.delete('/:id', authenticateAdmin, AdminVipCtrl.delete)

/**
 * @swagger
 * /api/admin/vip-codes/revoke/{userId}:
 *   put:
 *     tags: [Admin-VIP]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200: { description: موفق }
 *       403: { description: فقط OWNER }
 */
router.put('/revoke/:userId', authenticateAdmin, AdminVipCtrl.revokeUserVip)

/**
 * @swagger
 * /api/admin/vip-codes/unrevoke/{userId}:
 *   put:
 *     tags: [Admin-VIP]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200: { description: موفق }
 *       403: { description: فقط OWNER }
 */
router.put('/unrevoke/:userId', authenticateAdmin, AdminVipCtrl.unrevokeUserVip);

export default router