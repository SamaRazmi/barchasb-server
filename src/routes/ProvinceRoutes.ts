import { Router } from "express";
import ProvinceCtrl from "../controllers/ProvinceCtrl";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Province
 *   description: مدیریت استان‌ها و شهرها
 */

/**
 * @swagger
 * /api/provinces:
 *   get:
 *     summary: دریافت لیست تمام استان‌ها
 *     tags: [Province]
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Province'
 *       500:
 *         description: خطای سرور
 */
router.get("/provinces", ProvinceCtrl.getAllProvinces);

/**
 * @swagger
 * /api/cities/{province}:
 *   get:
 *     summary: دریافت شهرهای یک استان خاص
 *     tags: [Province]
 *     parameters:
 *       - in: path
 *         name: province
 *         required: true
 *         schema:
 *           type: string
 *         description: نام استان
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       404:
 *         description: استان پیدا نشد
 *       500:
 *         description: خطای سرور
 */
router.get("/cities/:province", ProvinceCtrl.getCitiesByProvince);

/**
 * @swagger
 * /api/all-cities:
 *   get:
 *     summary: دریافت لیست تمام شهرها (تکراری‌ها حذف شده)
 *     tags: [Province]
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: خطای سرور
 */
router.get("/all-cities", ProvinceCtrl.getAllCities);

export default router;
