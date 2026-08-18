import { Router } from "express";
import { authenticateAdmin } from "../../middleware/authMidleware";
import ExtensionManagementCtrl from "../controllers/ExtensionManagementCtrl";

const router = Router();

// test section 
/**
 * @swagger
 * /api/admin/extensions/tests/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Admin-Extensions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200: { description: موفق }
 */
router.get("/tests/categories", authenticateAdmin, ExtensionManagementCtrl.testCategories);

/**
 * @swagger
 * /api/admin/extensions/tests/categories/{categoryId}/types-with-stats:
 *   get:
 *     tags: [Admin-Extensions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   category:
 *                     type: string
 *                   totalQuestions:
 *                     type: integer
 *                   timeLimit:
 *                     type: integer
 *                   totalSessions:
 *                     type: integer
 *                   completedSessions:
 *                     type: integer
 *       400:
 *         description: شناسه دسته‌بندی ارسال نشده
 *       401:
 *         description: احراز هویت نشده
 *       403:
 *         description: دسترسی غیرمجاز
 *       500:
 *         description: خطای سرور
 */
router.get(
  "/tests/categories/:categoryId/types-with-stats",
  authenticateAdmin,
  ExtensionManagementCtrl.testTypesWithStats
);

/**
 * @swagger
 * /api/admin/extensions/tests/{typeId}/sessions:
 *   get:
 *     tags: [Admin-Extensions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: typeId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: موفق }
 *       404: { description: نوع تست یافت نشد }
 */
router.get("/tests/:typeId/sessions", authenticateAdmin, ExtensionManagementCtrl.testSessions);

/**
 * @swagger
 * /api/admin/extensions/tests/sessions/{sessionId}/detail:
 *   get:
 *     tags: [Admin-Extensions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: موفق }
 *       404: { description: جلسه یافت نشد }
 */
router.get("/tests/sessions/:sessionId/detail", authenticateAdmin, ExtensionManagementCtrl.testSessionDetail);

// resume section 
/**
 * @swagger
 * /api/admin/extensions/resumes:
 *   get:
 *     summary: Get list of users that have resume(with detail)
 *     tags: [Admin-Extensions]
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
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       totalResumes:
 *                         type: integer
 *                       lastUserUpdate:
 *                         type: string
 *                       resumes:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             resumeId:
 *                               type: string
 *                             updateCount:
 *                               type: integer
 *                             updatedAt:
 *                               type: string
 *                       userInfo:
 *                         type: object
 *                         properties:
 *                           fullName:
 *                             type: string
 *                           phone:
 *                             type: string
 *                           email:
 *                             type: string
 *                           province:
 *                             type: string
 *                           city:
 *                             type: string
 */
router.get("/resumes", authenticateAdmin, ExtensionManagementCtrl.resumes);

// converter section 
/**
 * @swagger
 * /api/admin/extensions/converter/users-usage:
 *   get:
 *     summary: User usage report of tools
 *     tags: [Admin-Extensions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Report received successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         example: "user-id"
 *                       usage:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             toolName:
 *                               type: string
 *                               enum: ['convert-image', 'merge-pdf', 'compress-pdf', 'extract-pages', 'images-to-pdf']
 *                               example: "convert-image"
 *                             toolNameFa:
 *                               type: string
 *                               example: "تبدیل و فشرده‌سازی تصویر"
 *                             count:
 *                               type: integer
 *                               example: 3
 *       401:
 *         description: Not authenticated (invalid token or not sent)
 *       500:
 *         description: Server Error
 */
router.get("/converter/users-usage", authenticateAdmin, ExtensionManagementCtrl.converterUserUsage);

/**
 * @swagger
 * /api/admin/extensions/converter/popularity:
 *   get:
 *     summary: Popularity of tools based on frequency of use
 *     tags: [Admin-Extensions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Tool popularity statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalUsage:
 *                   type: integer
 *                   description: Total number of times all tools are used
 *                   example: 7
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       toolName:
 *                         type: string
 *                         example: "convert-image"
 *                       toolNameFa:
 *                         type: string
 *                         example: "تبدیل و فشرده‌سازی تصویر"
 *                       count:
 *                         type: integer
 *                         example: 3
 *                       percent:
 *                         type: number
 *                         format: float
 *                         example: 42.86
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server Error
 */
router.get("/converter/popularity", authenticateAdmin, ExtensionManagementCtrl.converterPopularity);

/**
 * @swagger
 * /api/admin/extensions/converter/performance:
 *   get:
 *     summary: Performance of tools
 *     tags: [Admin-Extensions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Reporting tools performance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       toolName:
 *                         type: string
 *                         example: "convert-image"
 *                       toolNameFa:
 *                         type: string
 *                         example: "تبدیل و فشرده‌سازی تصویر"
 *                       totalInputSize:
 *                         type: integer
 *                         description: Total size of input files(bytes)
 *                         example: 1524000
 *                       totalOutputSize:
 *                         type: integer
 *                         description: Total size of output files(bytes)
 *                         example: 380000
 *                       totalDurationMs:
 *                         type: integer
 *                         description: Total processing time (milliseconds)
 *                         example: 1250
 *                       successCount:
 *                         type: integer
 *                         example: 3
 *                       failedCount:
 *                         type: integer
 *                         example: 0
 *                       totalCalls:
 *                         type: integer
 *                         example: 3
 *                       successRate:
 *                         type: number
 *                         format: float
 *                         example: 100
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get("/converter/performance", authenticateAdmin, ExtensionManagementCtrl.converterPerformance);
export default router;