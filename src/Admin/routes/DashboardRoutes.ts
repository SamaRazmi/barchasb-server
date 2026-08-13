import { Router } from "express";
import { authenticateAdmin } from "../../middleware/authMidleware";
import DashboardCtrl from "../controllers/DashboardCtrl";

const router = Router();

/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     tags: [Admin-Dashboard]
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
 *                     users:
 *                       type: object
 *                       properties:
 *                         totalUsers:
 *                           type: integer
 *                         onlineUsers:
 *                           type: integer
 *                         activeUsers:
 *                           type: integer
 *                         inactiveUsers:
 *                           type: integer
 *                     userDistribution:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           platform:
 *                             type: string
 *                           count:
 *                             type: integer
 *                           percentage:
 *                             type: number
 *                     adDistribution:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           count:
 *                             type: integer
 *                           percentage:
 *                             type: number
 *                     totalResumes:
 *                       type: integer
 *                     totalCompletedTests:
 *                       type: integer
 *                     totalAds:
 *                       type: integer
 *                     totalRevenue:
 *                       type: string
 *                     availableYears:
 *                       type: array
 *                       items:
 *                         type: integer
 *                     monthlyRevenue:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: integer
 *                           monthName:
 *                             type: string
 *                           revenue:
 *                             type: integer
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       500:
 *         description: خطای سرور
 */
router.get("/dashboard/stats", authenticateAdmin, DashboardCtrl.stats);

/**
 * @swagger
 * /api/admin/dashboard/monthly-revenue:
 *   get:
 *     tags: [Admin-Dashboard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: year
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1405
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: integer
 *                       monthName:
 *                         type: string
 *                       revenue:
 *                         type: integer
 *       400:
 *         description: سال نامعتبر
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       500:
 *         description: خطای سرور
 */
router.get("/dashboard/monthly-revenue", authenticateAdmin, DashboardCtrl.monthlyRevenue);

export default router;