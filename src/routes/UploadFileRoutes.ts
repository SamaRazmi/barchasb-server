import express from "express";
import { fileUpload } from "../middleware/upload";
import UploadFileCtrl from "../controllers/UploadFileCtrl";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: آپلود فایل
 */

/**
 * @swagger
 * /api/upload/file:
 *   post:
 *     summary: آپلود یک فایل PDF/Word
 *     tags: [Upload]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: فایل PDF یا Word
 *     responses:
 *       200:
 *         description: فایل آپلود شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: فایل با موفقیت آپلود شد
 *                 fileUrl:
 *                   type: string
 *                   example: https://storage.liara.space/bucket/file.pdf
 *                 originalName:
 *                   type: string
 *                   example: resume.pdf
 *       400:
 *         description: فایلی ارسال نشده
 *       500:
 *         description: خطای سرور
 */
router.post(
  "/upload/file",
  fileUpload.single("file"),
  UploadFileCtrl.uploadSingleFile,
);

/**
 * @swagger
 * /api/upload/files:
 *   post:
 *     summary: آپلود چند فایل PDF/Word (حداکثر ۵ فایل)
 *     tags: [Upload]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: لیست فایل‌های PDF یا Word (حداکثر ۵ عدد)
 *     responses:
 *       200:
 *         description: فایل‌ها آپلود شدند
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: فایل‌ها با موفقیت آپلود شدند
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fileUrl:
 *                         type: string
 *                       originalName:
 *                         type: string
 *       400:
 *         description: فایلی ارسال نشده
 *       500:
 *         description: خطای سرور
 */
router.post(
  "/upload/files",
  fileUpload.array("files", 5),
  UploadFileCtrl.uploadMultipleFiles,
);

export default router;
