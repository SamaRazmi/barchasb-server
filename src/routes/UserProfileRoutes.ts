import express from "express";
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} from "../controllers/UserProfileCtrl";
import { imagesUpload } from "../middleware/upload";
import { authenticateToken } from "../middleware/authMidleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         lastName:
 *           type: string
 *         username:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         birthDate:
 *           type: string
 *         province:
 *           type: string
 *         city:
 *           type: string
 *         nationalCode:
 *           type: string
 *         email_confirmed:
 *           type: boolean
 *         phone_confirmed:
 *           type: boolean
 *         role:
 *           type: string
 *           enum: [USER, EMPLOYER, JOB_SEEKER, SELLER]
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user:
 *           type: string
 *         profileImage:
 *           type: string
 *         address:
 *           type: string
 *         educationLevel:
 *           type: string
 *         aboutMe:
 *           type: string
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *         resumeFile:
 *           type: string
 *         portfolioFiles:
 *           type: array
 *           items:
 *             type: string
 *         documents:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               file:
 *                 type: string
 *         completed:
 *           type: boolean
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         walletId:
 *           type: string
 */

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
 *     summary: دریافت پروفایل کاربر (شناسه کاربر از توکن یا query)
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: (اختیاری) شناسه کاربر – در صورت عدم ارسال، از توکن استفاده می‌شود
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
 *       401:
 *         description: احراز هویت نشده
 *       404:
 *         description: کاربر پیدا نشد
 *       500:
 *         description: خطای سرور
 */
router.get("/profile", authenticateToken, getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: بروزرسانی پروفایل کاربر (شناسه کاربر از توکن گرفته می‌شود)
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *       401:
 *         description: احراز هویت نشده
 *       404:
 *         description: کاربر پیدا نشد
 *       500:
 *         description: خطای سرور
 */
router.put("/profile", authenticateToken, updateProfile);

/**
 * @swagger
 * /api/profile/upload-photo:
 *   post:
 *     summary: آپلود عکس پروفایل (شناسه کاربر از توکن گرفته می‌شود)
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
 *               - profileImage
 *             properties:
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
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.post(
  "/profile/upload-photo",
  authenticateToken,
  imagesUpload.single("profileImage"),
  uploadProfilePhoto,
);

export default router;
