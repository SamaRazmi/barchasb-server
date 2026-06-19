// src/routes/ticketRoutes.ts
import { Router } from "express";
import ticketController from "../controllers/ticketController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Ticket
 *   description: مدیریت تیکت‌ها
 */

/**
 * @swagger
 * /api/create-ticket:
 *   post:
 *     summary: ایجاد تیکت جدید
 *     tags: [Ticket]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - title
 *               - description
 *             properties:
 *               email:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: تیکت ایجاد شد
 *       400:
 *         description: خطا در اطلاعات
 *       403:
 *         description: ایمیل یا تلفن تایید نشده
 */
router.post("/create-ticket", ticketController.createTicket);

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: دریافت تمام تیکت‌ها
 *     tags: [Ticket]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: لیست تیکت‌ها
 */
router.get("/tickets", ticketController.getAllTickets);

/**
 * @swagger
 * /api/ticket/{id}:
 *   get:
 *     summary: دریافت یک تیکت با شناسه
 *     tags: [Ticket]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: اطلاعات تیکت
 *       404:
 *         description: تیکت پیدا نشد
 */
router.get("/ticket/:id", ticketController.getTicketById);

/**
 * @swagger
 * /api/ticket/{id}/status:
 *   put:
 *     summary: تغییر وضعیت تیکت
 *     tags: [Ticket]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, closed]
 *     responses:
 *       200:
 *         description: وضعیت تغییر کرد
 *       404:
 *         description: تیکت پیدا نشد
 */
router.put("/ticket/:id/status", ticketController.updateTicketStatus);

export default router;
