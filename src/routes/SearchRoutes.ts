import express from "express";
import { searchAllAds } from "../controllers/SearchCtrl";

const router = express.Router();

/**
 * @swagger
 * /api/ads/search:
 *   get:
 *     summary: جستجوی یکپارچه در همه آگهی‌ها
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: کلمه کلیدی برای جستجو در عنوان، توضیحات، نام و ...
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: نام استان
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [employer, jobseeker, seller, digital]
 *         description: نوع آگهی (می‌تواند چند مقدار با کاما باشد)
 *     responses:
 *       200:
 *         description: آرایه‌ای از آگهی‌های یافت‌شده
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   type:
 *                     type: string
 *                   title:
 *                     type: string
 *                   category:
 *                     type: string
 *                   state:
 *                     type: string
 *                   city:
 *                     type: string
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                   adStatus:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   owner:
 *                     type: string
 *       500:
 *         description: خطای سرور
 */
router.get("/ads/search", searchAllAds);

export default router;
