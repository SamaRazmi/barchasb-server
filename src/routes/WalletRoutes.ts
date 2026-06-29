import { Router } from "express";
import WalletCtrl from "../controllers/WalletCtrl";

const router = Router();

import { authenticateUser } from "../middleware/authMidleware";
// import { authenticateAdmin } from "../middleware/authMidleware"


/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: مدیریت کیف پول کاربر
 */

/**
 * @swagger
 * /api/wallet/balance:
 *   get:
 *     summary: دریافت موجودی کیف پول
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     available:
 *                       type: number
 *                       example: 850000
 *                     total:
 *                       type: number
 *                       example: 1000000
 *                     held:
 *                       type: number
 *                       example: 150000
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.get("/wallet/balance", authenticateUser , WalletCtrl.getBalance);

/**
 * @swagger
 * /api/wallet/deposit:
 *   post:
 *     summary: شارژ کیف پول (ماک درگاه)
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50000
 *               metadata:
 *                 type: object
 *                 example: { gateway: "mock", trackingCode: "12345" }
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     newBalance:
 *                       type: number
 *                     transaction:
 *                       type: object
 *       400:
 *         description: مبلغ نامعتبر
 *       401:
 *         description: احراز هویت نشده
 *       500:
 *         description: خطای سرور
 */
router.post("/wallet/deposit", authenticateUser , WalletCtrl.deposit);

// /**
//  * @swagger
//  * /api/wallet/admin/release/{transactionId}:
//  *   put:
//  *     summary: آزادسازی تراکنش فریز شده
//  *     tags: [Wallet]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: transactionId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               metadata:
//  *                 type: object
//  *     responses:
//  *       200:
//  *         description: موفق
//  *       400:
//  *         description: شناسه نامعتبر
//  *       401:
//  *         description: احراز هویت نشده
//  *       500:
//  *         description: خطای سرور
//  */
// router.put("/wallet/admin/release/:transactionId", authenticateAdmin , WalletCtrl.releaseHold);

// /**
//  * @swagger
//  * /api/wallet/admin/refund/{transactionId}:
//  *   put:
//  *     summary: برگشت وجه تراکنش فریز شده
//  *     tags: [Wallet]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: transactionId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - reason
//  *             properties:
//  *               reason:
//  *                 type: string
//  *               metadata:
//  *                 type: object
//  *     responses:
//  *       200:
//  *         description: موفق
//  *       400:
//  *         description: شناسه یا دلیل نامعتبر
//  *       401:
//  *         description: احراز هویت نشده
//  *       500:
//  *         description: خطای سرور
//  */
// router.put("/wallet/admin/refund/:transactionId", authenticateAdmin,  WalletCtrl.refundHold);

export default router;