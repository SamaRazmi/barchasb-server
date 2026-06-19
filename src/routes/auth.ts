// src/routes/AuthRoutes.ts
import { Router } from "express";
import LoginCtrl from "../controllers/LoginCtrl";
import LogoutCtrl from "../controllers/LogoutCtrl";
import { getMe } from "../controllers/AuthCtrl";
import { authenticateToken } from "../middleware/authMidleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: مدیریت احراز هویت
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: ورود کاربر
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "09123456789"
 *               password:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: ورود موفق، کوکی و Bearer Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ورود موفق ✅
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: شماره یا رمز اشتباه
 *       500:
 *         description: خطا در سرور
 */
router.post("/auth/login", LoginCtrl.loginUser);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: دریافت اطلاعات کاربر لاگین شده
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: اطلاعات کاربر
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: توکن معتبر نیست
 */
router.get("/auth/me", authenticateToken, getMe);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: خروج از حساب کاربری
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: خروج موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: خروج با موفقیت انجام شد
 *       500:
 *         description: خطا در خروج
 */
router.post("/auth/logout", authenticateToken, LogoutCtrl.logoutUser);

export default router;
