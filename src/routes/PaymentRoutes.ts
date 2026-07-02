import { Router } from "express";
import PaymentCtrl from "../controllers/PaymentCtrl";
import { authenticateUser } from "../middleware/authMidleware";

const router = Router();

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: ایجاد درخواست پرداخت جدید
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - paymentMethod
 *             properties:
 *               amount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *                 enum: [Wallet, Bank_card, Subscription]
 *               description:
 *                 type: string
 *               referenceId:
 *                 type: string
 *               referenceType:
 *                 type: string
 *                 enum: [AD, ENHANCEMENT]
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: موفق
 */
router.post("/payments/create", authenticateUser, PaymentCtrl.create);

/**
 * @swagger
 * /api/payments/verify:
 *   get:
 *     summary: تایید پرداخت (Callback از درگاه)
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: authority
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [OK, NOK]
 *     responses:
 *       302:
 *         description: هدایت به صفحه نتیجه در فرانت
 */
router.get("/payments/verify", PaymentCtrl.verify);

/**
 * @swagger
 * /api/payments/pay-mock:
 *   get:
 *     summary: صفحه شبیه‌سازی درگاه پرداخت
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: authority
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: صفحه HTML پرداخت
 */
router.get("/payments/pay-mock", PaymentCtrl.payMock);

/**
 * @swagger
 * /api/payments/result:
 *   get:
 *     summary: نمایش نتیجه پرداخت (Mock)
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [success, failed, error]
 *       - in: query
 *         name: paymentId
 *         schema:
 *           type: string
 *       - in: query
 *         name: refId
 *         schema:
 *           type: string
 *       - in: query
 *         name: message
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: صفحه HTML نتیجه پرداخت
 */
router.get("/payments/result", PaymentCtrl.showResult);

export default router;