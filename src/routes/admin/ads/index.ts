import { Router } from 'express'
import { authorizeAdmin } from '../../../middleware/authAdmin'
import { AdsCount } from '../../../controllers/admin/ads/count'
import { AllAdsChart } from '../../../controllers/admin/ads/chart'

const router = Router()

/**
 * @swagger
 * /ads/count:
 *   get:
 *     summary: Get Ads Count
 *     description: Returns the total count of ads across all categories (digital, seller, employer, jobSeeker), optionally filtered by status.
 *     tags: [Admin backend]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: adStatus
 *         schema:
 *           type: string
 *           enum: [approved, rejected, pending]
 *         required: false
 *         description: Filter ads by their status. If omitted, returns the count for all ads.
 *     responses:
 *       200:
 *         description: Successful operation. Returns the total count of ads.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 adStatus:
 *                   type: string
 *                   description: The status filtered, or 'all' if no filter was provided.
 *                   example: "all"
 *                 total:
 *                   type: integer
 *                   description: Total number of ads.
 *                   example: 42
 *       400:
 *         description: Bad Request - Invalid adStatus parameter provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid adStatus parameter"
 *                 message:
 *                   type: string
 *                   example: "The value 'invalid_status' is not a valid ad status."
 *                 validOptions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["approved", "rejected", "pending"]
 *       401:
 *         description: Unauthorized - Admin authorization failed.
 */
router.get('/count', authorizeAdmin(), AdsCount)

/**
 * @swagger
 * /ads/chart/all:
 *   get:
 *     summary: Get All Ads Chart Data
 *     description: Generates chart data for all ads grouped by date. Returns daily counts for digital, employer, seller, and job seeker ads.
 *     tags: [Admin backend]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation. Returns an array of daily ad counts sorted by date.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date in YYYY-MM-DD format.
 *                     example: "2023-10-25"
 *                   digital:
 *                     type: integer
 *                     description: Number of digital ads created on this date.
 *                     example: 5
 *                   employer:
 *                     type: integer
 *                     description: Number of employer ads created on this date.
 *                     example: 2
 *                   seller:
 *                     type: integer
 *                     description: Number of seller ads created on this date.
 *                     example: 1
 *                   job_seeker:
 *                     type: integer
 *                     description: Number of job seeker ads created on this date.
 *                     example: 3
 *       401:
 *         description: Unauthorized - Admin authorization failed.
 *       500:
 *         description: Internal Server Error - Failed to generate chart data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to generate chart data"
 */
router.get('/chart/all', authorizeAdmin(), AllAdsChart)

export default router