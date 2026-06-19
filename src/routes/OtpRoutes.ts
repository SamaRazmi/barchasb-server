// src/routes/OtpRoutes.ts
import { Router } from "express";
import OtpCtrl from "../controllers/OtpCtrl";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: OTP
 *   description: مدیریت OTP (ارسال و تایید)
 */

/**
 * @swagger
 * /api/otp/send:
 *   post:
 *     summary: ارسال کد OTP به شماره تلفن
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "09123456789"
 *               purpose:
 *                 type: string
 *                 enum: [default, reset]
 *                 default: default
 *                 description: "هدف از ارسال OTP (reset برای فراموشی رمز)"
 *     responses:
 *       200:
 *         description: کد OTP ارسال شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       400:
 *         description: شماره موبایل الزامی است
 *       404:
 *         description: کاربری با این شماره یافت نشد (برای reset)
 *       500:
 *         description: خطای سرور
 */
router.post("/otp/send", OtpCtrl.sendOTP);

/**
 * @swagger
 * /api/otp/verify:
 *   post:
 *     summary: تایید کد OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - code
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "09123456789"
 *               code:
 *                 type: string
 *                 example: "12345"
 *               purpose:
 *                 type: string
 *                 enum: [default, reset]
 *                 default: default
 *                 description: "هدف از تایید OTP (reset برای فراموشی رمز)"
 *     responses:
 *       200:
 *         description: کد OTP تایید شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 resetToken:
 *                   type: string
 *                   description: "توکن reset (فقط در صورت purpose=reset صادر می‌شود)"
 *       400:
 *         description: شماره و کد الزامی است یا کد نامعتبر است
 *       500:
 *         description: خطای سرور
 */
router.post("/otp/verify", OtpCtrl.verifyOTP);

export default router;
