import { Router } from "express";
import testController from "../controllers/TestCtrl";
import resumeController from "../controllers/ResumeCtrl";
import converterController from "../controllers/converterCtrl";

const router = Router();

/**
 * @swagger
 * /api/admin/tests/summaryResult/{userId}:
 *   get:
 *     summary: Get a summary list of all completed tests for a specific user
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of test summaries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sessionId:
 *                     type: string
 *                   testName:
 *                     type: string
 *                   category:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   result:
 *                     type: string
 *                   score:
 *                     type: string
 *       404:
 *         description: User not found or no completed sessions
 */
router.get("/tests/summaryResult/:userId", testController.getUserTestsSummary);

/**
 * @swagger
 * /api/admin/tests/detailedResult/{sessionId}:
 *   get:
 *     summary: Get full detailed analytics of a specific test session
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detailed test analysis retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 baseInfo:
 *                   type: object
 *                   properties:
 *                     testName:
 *                       type: string
 *                     category:
 *                       type: string
 *                     summary:
 *                       type: string
 *                     score:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         correct:
 *                           type: integer
 *                         wrong:
 *                           type: integer
 *                         unanswered:
 *                           type: integer
 *                 analysis:
 *                   type: object
 *                   description: Dynamic object containing formatted results.
 *       404:
 *         description: Session not found
 */
router.get(
  "/tests/detailedResult/:sessionId",
  testController.getTestResultDetail,
);

// categories
/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: categories list
 */
router.route("/categories").get(testController.getCategories);

// test types
/**
 * @swagger
 * /api/admin/test-types:
 *   get:
 *     summary: Get all test types
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: categoryId
 *         in: query
 *         schema:
 *           type: string
 *         description: filter based on category(optional)
 *     responses:
 *       200:
 *         description: test types list
 */
router.get("/test-types", testController.getTypes);

// user's test reporting
/**
 * @swagger
 * /api/admin/users-with-sessions:
 *   get:
 *     summary: Get all users id that has test session
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: users id list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["user123", "user456"]
 *       500:
 *         description: server error
 */
router.get("/users-with-sessions", testController.getUsersWithSessions);

/**
 * @swagger
 * /api/admin/all-sessions-info:
 *   get:
 *     summary: Get all info of test sessions
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: all test sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sessionId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [in-progress, completed]
 *                   startedAt:
 *                     type: string
 *                     example: 1405/02/03 14:30
 *                   testName:
 *                     type: string
 *                   testTags:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: server error
 */
router.get("/all-sessions-info", testController.getAllTestSessionsInfo);

// resume reporting
/**
 * @swagger
 * /api/admin/resume-users:
 *   get:
 *     summary: Get list of users that have resume(with detail)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: user list received successfully
 *       500:
 *         description: server error
 */
router.get("/resume-users", resumeController.getUsersWithResumes);

// converter tools reporting
// ---------------------------------------------
/**
 * @swagger
 * /api/admin/converter-tools/users-tool-usage:
 *   get:
 *     summary: User usage report of tools
 *     tags: [Admin]
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
router.get(
  "/converter-tools/users-tool-usage",
  converterController.getUsersToolUsage,
);

/**
 * @swagger
 * /api/admin/converter-tools/tool-popularity:
 *   get:
 *     summary: Popularity of tools based on frequency of use
 *     tags: [Admin]
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
router.get(
  "/converter-tools/tool-popularity",
  converterController.getToolPopularity,
);

/**
 * @swagger
 * /api/admin/converter-tools/tool-performance:
 *   get:
 *     summary: Performance of tools
 *     tags: [Admin]
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
router.get(
  "/converter-tools/tool-performance",
  converterController.getToolPerformance,
);

export default router;
