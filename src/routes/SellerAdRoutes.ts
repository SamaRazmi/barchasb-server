import express from "express";
import { imagesUpload } from "../middleware/upload";
import SellerAdCtrl from "../controllers/SellerAdCtrl";
import { authenticateToken } from "../middleware/authMidleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SellerAds
 *   description: مدیریت آگهی‌های فروشنده
 */

/* =======================
   CREATE
======================= */
/**
 * @swagger
 * /api/ads/seller:
 *   post:
 *     summary: ایجاد آگهی فروشنده
 *     tags: [SellerAds]
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
 *               category:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               priceIRT:
 *                 type: string
 *               isFixedPrice:
 *                 type: boolean
 *               isNegotiable:
 *                 type: boolean
 *               hasWarranty:
 *                 type: boolean
 *               isShippable:
 *                 type: boolean
 *               extraFeatures:
 *                 type: object
 *               mainImageIndex:
 *                 type: number
 *               person:
 *                 type: string
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
  "/ads/seller",
  authenticateToken,
  imagesUpload.array("images", 9),
  SellerAdCtrl.createSellerAd,
);

/* =======================
   GET
======================= */
/**
 * @swagger
 * /api/ads/seller:
 *   get:
 *     summary: دریافت همه آگهی‌های فروشنده (عمومی)
 *     tags: [SellerAds]
 *     responses:
 *       200:
 *         description: موفق
 *       500:
 *         description: خطای سرور
 */
router.get("/ads/seller", SellerAdCtrl.getAllSellerAds);

/**
 * @swagger
 * /api/ads/seller/owner/{ownerId}:
 *   get:
 *     summary: دریافت همه آگهی‌های یک کاربر خاص (عمومی)
 *     tags: [SellerAds]
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: موفق
 *       500:
 *         description: خطای سرور
 */
router.get("/ads/seller/owner/:ownerId", SellerAdCtrl.getAdsByOwner);

/**
 * @swagger
 * /api/ads/seller/:id:
 *   get:
 *     summary: دریافت یک آگهی تک فروشنده (عمومی)
 *     tags: [SellerAds]
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
router.get("/ads/seller/:id", SellerAdCtrl.getSellerAdById);

/**
 * @swagger
 * /api/ads/seller/owner/{ownerId}/{adId}:
 *   get:
 *     summary: دریافت یک آگهی مشخص از یک کاربر مشخص (عمومی)
 *     tags: [SellerAds]
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: adId
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
router.get(
  "/ads/seller/owner/:ownerId/:adId",
  SellerAdCtrl.getSellerAdByOwnerAndId,
);

/* =======================
   UPDATE
======================= */
/**
 * @swagger
 * /api/ads/seller/owner/{ownerId}/{adId}:
 *   put:
 *     summary: ویرایش یک آگهی مشخص
 *     tags: [SellerAds]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: ownerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: adId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
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
 *               category:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               priceIRT:
 *                 type: string
 *               isFixedPrice:
 *                 type: boolean
 *               isNegotiable:
 *                 type: boolean
 *               hasWarranty:
 *                 type: boolean
 *               isShippable:
 *                 type: boolean
 *               extraFeatures:
 *                 type: object
 *               mainImageIndex:
 *                 type: number
 *               person:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: آگهی با موفقیت ویرایش شد
 *       401:
 *         description: توکن معتبر نیست
 *       404:
 *         description: آگهی یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.put(
  "/ads/seller/owner/:ownerId/:adId",
  authenticateToken,
  imagesUpload.array("images", 9),
  SellerAdCtrl.updateSellerAd,
);

/* =======================
   DELETE
======================= */
/**
 * @swagger
 * /api/ads/seller/{adId}:
 *   delete:
 *     summary: حذف آگهی فروشنده (فقط مالک)
 *     tags: [SellerAds]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: adId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه آگهی
 *     responses:
 *       200:
 *         description: آگهی با موفقیت حذف شد
 *       401:
 *         description: توکن معتبر نیست
 *       404:
 *         description: آگهی یافت نشد
 *       500:
 *         description: خطای سرور
 */
router.delete(
  "/ads/seller/:adId",
  authenticateToken,
  SellerAdCtrl.deleteSellerAd,
);

export default router;
