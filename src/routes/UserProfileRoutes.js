// src/routes/UserProfileRoutes.ts
import express from "express";
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} from "../controllers/UserProfileCtrl";
import { imagesUpload } from "../middleware/upload"; // middleware آپلود فایل

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: مدیریت پروفایل کاربر
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: دریافت پروفایل کاربر
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *     responses:
 *       200:
 *         description: اطلاعات پروفایل
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: ok
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 profile:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: شناسه کاربر ارسال نشده
 *       404:
 *         description: کاربر پیدا نشد
 *       500:
 *         description: خطای سرور
 */
router.get("/profile", getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: بروزرسانی پروفایل کاربر
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *               user:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   username:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *                   birthDate:
 *                     type: string
 *                   province:
 *                     type: string
 *                   city:
 *                     type: string
 *               profile:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   educationLevel:
 *                     type: string
 *                   aboutMe:
 *                     type: string
 *                   interests:
 *                     type: array
 *                     items:
 *                       type: string
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *                   resumeFile:
 *                     type: string
 *                   portfolioFiles:
 *                     type: array
 *                     items:
 *                       type: string
 *                   documents:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                         file:
 *                           type: string
 *     responses:
 *       200:
 *         description: پروفایل بروزرسانی شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: پروفایل با موفقیت بروزرسانی شد
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 profile:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: خطا در داده‌ها
 *       500:
 *         description: خطای سرور
 */
router.put("/profile", updateProfile);

/**
 * @swagger
 * /api/profile/upload-photo:
 *   post:
 *     summary: آپلود عکس پروفایل
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - profileImage
 *             properties:
 *               userId:
 *                 type: string
 *                 description: شناسه کاربر
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: فایل عکس
 *     responses:
 *       200:
 *         description: عکس آپلود شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: عکس پروفایل با موفقیت آپلود شد
 *                 profile:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: خطا در ارسال داده‌ها
 *       500:
 *         description: خطای سرور
 */
router.post(
  "/profile/upload-photo",
  imagesUpload.single("profileImage"),
  uploadProfilePhoto,
);

export default router;
