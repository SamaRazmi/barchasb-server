import { Router } from 'express'
import AdManagementCtrl from '../controllers/AdManagementCtrl'
import { authenticateAdmin } from '../../middleware/authMidleware'

const router = Router()

router.use(authenticateAdmin)

/**
 * @swagger
 * /api/admin/ads:
 *   get:
 *     tags: [Admin-Ads]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, expired]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [DigitalAd, EmployerAd, JobSeekerAd, SellerAd]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: موفق
 */
router.get('', AdManagementCtrl.list)

/**
 * @swagger
 * /api/admin/ads/{id}:
 *   get:
 *     tags: [Admin-Ads]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [DigitalAd, EmployerAd, JobSeekerAd, SellerAd]
 *     responses:
 *       200:
 *         description: موفق
 */
router.get('/:id', AdManagementCtrl.details)

/**
 * @swagger
 * /api/admin/ads/{id}/approve:
 *   put:
 *     tags: [Admin-Ads]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [DigitalAd, EmployerAd, JobSeekerAd, SellerAd]
 *     responses:
 *       200:
 *         description: موفق
 */
router.put('/:id/approve', AdManagementCtrl.approve)

/**
 * @swagger
 * /api/admin/ads/{id}/reject:
 *   put:
 *     tags: [Admin-Ads]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [DigitalAd, EmployerAd, JobSeekerAd, SellerAd]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: موفق
 */
router.put('/:id/reject', AdManagementCtrl.reject)

export default router