// src/routes/DigitalAdRoutes.ts
import express from "express";
import { imagesUpload } from "../middleware/upload";
import DigitalAdCtrl from "../controllers/DigitalAdCtrl";
import { authenticateToken } from "../middleware/authMidleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DigitalAds
 *   description: مدیریت آگهی‌های دیجیتال
 */

/* =======================
   CREATE
======================= */
/**
 * @swagger
 * /api/ads/digital:
 *   post:
 *     summary: ایجاد آگهی دیجیتال
 *     tags: [DigitalAds]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               digitalTotalDesc:
 *                 type: string
 *               projectNames:
 *                 type: array
 *                 items:
 *                   type: string
 *               projectDescriptions:
 *                 type: array
 *                 items:
 *                   type: string
 *               minBudget:
 *                 type: string
 *               maxBudget:
 *                 type: string
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *               person:
 *                 type: string
 *               remote:
 *                 type: boolean
 *               thursdayHalf:
 *                 type: boolean
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: آگهی با موفقیت ایجاد شد
 *       400:
 *         description: خطای اعتبارسنجی یا درخواست نامعتبر
 *       401:
 *         description: توکن معتبر نیست
 *       500:
 *         description: خطای سرور
 */
router.post(
  "/ads/digital",
  authenticateToken,
  imagesUpload.array("images", 9),
  DigitalAdCtrl.createDigitalAd,
);

/* =======================
   GET
======================= */
/**
 * @swagger
 * /api/ads/digital:
 *   get:
 *     summary: دریافت همه آگهی‌های دیجیتال (عمومی)
 *     tags: [DigitalAds]
 *     responses:
 *       200:
 *         description: موفق
 *       500:
 *         description: خطای سرور
 */
router.get("/ads/digital", DigitalAdCtrl.getAllDigitalAds);

/**
 * @swagger
 * /api/ads/digital/{id}:
 *   get:
 *     summary: دریافت یک آگهی دیجیتال (عمومی)
 *     tags: [DigitalAds]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: موفق
 *       404:
 *         description: آگهی یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.get("/ads/digital/:id", DigitalAdCtrl.getDigitalAdById);

export default router;
