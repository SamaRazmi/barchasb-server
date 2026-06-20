import { Router } from "express";
import testController from "../controllers/TestCtrl";

const router = Router();

/**
 * @swagger
 * /api/tests/categories:
 *   get:
 *     summary: Get all active categories
 *     tags: [Tests]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestCategory'
 */
router.get("/categories", testController.getCategories);

/**
 * @swagger
 * /api/tests/categories/{categoryId}/types:
 *   get:
 *     summary: Get test types (blueprints) for a category
 *     tags: [Tests]
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/categories/:categoryId/types", testController.getTypesByCategory);

/**
 * @swagger
 * /api/tests/start:
 *   post:
 *     summary: Initialize a new test session
 *     tags: [Tests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - typeId
 *             properties:
 *               typeId:
 *                 type: string
 *                 example: ID of MBTI test
 *     responses:
 *       201:
 *         description: Session created with questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                 questions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 */
router.post("/start", testController.startTest);

/**
 * @swagger
 * /api/tests/submit:
 *   post:
 *     summary: Submit answers and get results (Language or Psych)
 *     tags: [Tests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - answers
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: Session ID
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     selectedOptionId:
 *                       type: string
 *     responses:
 *       200:
 *         description: Scoring results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 assignedLevel:
 *                   type: string
 *                   description: Only for Language tests (e.g., A1, B2)
 *                 score:
 *                   type: string
 *                   description: Percentage score for Language
 *                 totalScore:
 *                   type: number
 *                   description: Raw sum score for Psych
 *                 results:
 *                   type: object
 *                   description: Contains Summary/LevelBreakdown for Language OR AnalysisProfile for Psych
 */
router.post("/submit", testController.submitTest);

export default router;
