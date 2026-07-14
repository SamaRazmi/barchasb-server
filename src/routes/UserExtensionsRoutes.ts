const express = require('express');
const router = express.Router();
const testController = require('../controllers/TestCtrl');
const resumeController = require('../controllers/ResumeCtrl');
import { authenticateUser } from "../middleware/authMidleware";

/**
 * @swagger
 * /api/user/my-tests:
 *   get:
 *     summary: Get the current user's test history
 *     tags: [User Profile]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of test summaries for the logged-in user
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
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get('/my-tests', authenticateUser, testController.getMyTestsSummary);

/**
 * @swagger
 * /api/user/my-tests/{sessionId}:
 *   get:
 *     summary: Get specific test results for the current user
 *     tags: [User Profile]
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
 *         description: Detailed test results retrieved successfully
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
 *       403:
 *         description: Forbidden - This test does not belong to the user
 *       404:
 *         description: Session not found
 */
router.get('/my-tests/:sessionId', authenticateUser, testController.getMyTestDetail);

/**
 * @swagger
 * /api/user/my-resumes:
 *   get:
 *     summary: Get all user's resumes
 *     tags: [User Profile]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: resume list received successfully
 *       401:
 *         description: unsuccessful Auth
 *       500:
 *         description: server error
 */
router.get('/my-resumes', authenticateUser, resumeController.getMyResumes);

/**
 * @swagger
 * /api/user/my-resume/preview/{id}:
 *   get:
 *     summary: Get resume url
 *     tags: [User Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: resume url received successfully
 *       401:
 *         description: unsuccessful Auth
 *       500:
 *         description: server error
 */
router.get('/my-resume/preview/:id', authenticateUser, resumeController.getResumeUrl);

export default router;