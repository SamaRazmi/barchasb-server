import { Request, Response } from "express";
import * as PaymentGatewayService from "../services/PaymentGatewayService";
import { PaymentMethod } from "@prisma/client";

interface AuthRequest extends Request {
  user?: { id: string; [key: string]: any };
}

const PaymentCtrl = {
  // Create a new payment (Front calls this)
  // ================================================================
  create: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "احراز هویت نشده",
        });
      }

      const {
        amount,
        paymentMethod,
        description,
        referenceId,
        referenceType,
        metadata,
      } = req.body;

      // validate
      if (!amount || amount <= 0) {
        return res.status(400).json({
          status: "error",
          message: "مبلغ پرداخت معتبر نیست",
        });
      }

      if (!paymentMethod || !Object.values(PaymentMethod).includes(paymentMethod)) {
        return res.status(400).json({
          status: "error",
          message: "روش پرداخت معتبر نیست",
        });
      }

      // create payment
      const result = await PaymentGatewayService.createPayment({
        userId,
        amount,
        paymentMethod,
        description: description || "پرداخت از طریق درگاه",
        referenceId,
        referenceType,
        metadata,
      });

      res.status(201).json({
        status: "success",
        data: {
          paymentId: result.paymentId,
          authority: result.authority,
          paymentUrl: result.paymentUrl,
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در ایجاد پرداخت",
      });
    }
  },

  // Payment confirmation (the gateway calls this as a Callback)
  // ================================================================
  verify: async (req: Request, res: Response) => {
    try {
      const { authority, status } = req.query;

      if (!authority) {
        return res.status(400).json({
          status: "error",
          message: "کد Authority ارسال نشده است",
        });
      }

      const result = await PaymentGatewayService.verifyPayment({
        authority: authority as string,
        status: status as string,
      });

      // Redirect the user to the frontend with the result
    const frontendUrl = process.env.RESULT_PAYMENT_FRONTEND_URL || "/api/payments/result";
    const redirectUrl = result.success
      ? `${frontendUrl}?status=success&paymentId=${result.paymentId}&refId=${result.refId}`
      : `${frontendUrl}?status=failed&message=${encodeURIComponent(result.message)}`;

      return res.redirect(redirectUrl);
    } catch (error: any) {
      console.error(error);
      // In case of error, redirect the user to the error page
      const redirectUrl = `${process.env.RESULT_PAYMENT_FRONTEND_URL || "http://localhost:3000"}/payment-result?status=error&message=${encodeURIComponent(error.message)}`;
      return res.redirect(redirectUrl);
    }
  },

  // Mock Portal Page (for testing)
  // ================================================================
  payMock: async (req: Request, res: Response) => {
    const { authority, amount } = req.query;

    if (!authority) {
      return res.status(400).send("کد Authority ارسال نشده است");
    }

    res.send(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>درگاه پرداخت آزمایشی</title>
          <style>
            body { font-family: sans-serif; max-width: 600px; margin: 100px auto; text-align: center; padding: 20px; background-color: #f8f9fa; }
            .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            .info { background: #e8f4fd; color: #1d4ed8; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 15px; }
            .btn { display: inline-block; padding: 12px 30px; margin: 10px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold; text-decoration: none; transition: 0.2s; }
            .btn-success { background: #16a34a; color: white; }
            .btn-success:hover { background: #15803d; }
            .btn-failed { background: #dc2626; color: white; }
            .btn-failed:hover { background: #b91c1c; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>💳 درگاه پرداخت آزمایشی</h1>
            <div class="info">
              <p>🔑 کد ارجاع (Authority): <strong>${authority}</strong></p>
              <p>💰 مبلغ تراکنش: <strong>${amount || "ناشناخته"}</strong> تومان</p>
            </div>
            <p>این یک شبیه‌سازی درگاه بانکی برای تست امکانات برنامه است.</p>
            <div style="margin-top: 30px;">
              <a href="/api/payments/verify?authority=${authority}&status=OK" class="btn btn-success">✅ پرداخت موفق</a>
              <a href="/api/payments/verify?authority=${authority}&status=NOK" class="btn btn-failed">❌ انصراف</a>
            </div>
          </div>
        </body>
      </html>
    `);
  },

  // Mock Result page (for testing)
  showResult: async (req: Request, res: Response) => {
    const { status, paymentId, refId, message } = req.query;

    let title = "نامشخص";
    let color = "#6c757d";
    let icon = "❓";
    let description = "";

    if (status === "success") {
      title = "پرداخت با موفقیت انجام شد ✅";
      color = "#28a745";
      icon = "✅";
      description = `شماره پیگیری: ${refId || "نامشخص"}<br>شناسه پرداخت: ${paymentId || "نامشخص"}`;
    } else if (status === "failed") {
      title = "پرداخت ناموفق ❌";
      color = "#dc3545";
      icon = "❌";
      description = `دلیل: ${message || "خطای ناشناخته"}`;
    } else if (status === "error") {
      title = "خطا در پردازش پرداخت ⚠️";
      color = "#ffc107";
      icon = "⚠️";
      description = `خطا: ${message || "خطای ناشناخته"}`;
    }

    // صفحه HTML
    res.send(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>نتیجه پرداخت</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, sans-serif;
              background: #f8f9fa;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              direction: rtl;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 16px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.1);
              max-width: 500px;
              width: 90%;
              text-align: center;
            }
            .icon {
              font-size: 64px;
              margin-bottom: 20px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              color: ${color};
              margin-bottom: 16px;
            }
            .description {
              font-size: 16px;
              color: #555;
              line-height: 1.8;
              margin-bottom: 24px;
              padding: 16px;
              background: #f8f9fa;
              border-radius: 8px;
            }
            .btn {
              display: inline-block;
              padding: 12px 32px;
              background: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              transition: 0.2s;
            }
            .btn:hover {
              background: #0056b3;
            }
            .btn-secondary {
              background: #6c757d;
              margin-right: 10px;
            }
            .btn-secondary:hover {
              background: #5a6268;
            }
            .debug {
              margin-top: 20px;
              padding: 12px;
              background: #f1f3f5;
              border-radius: 8px;
              font-size: 12px;
              color: #888;
              text-align: left;
              direction: ltr;
              overflow-wrap: break-word;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">${icon}</div>
            <div class="title">${title}</div>
            <div class="description">${description}</div>
            <div>
              <a href="/" class="btn">🏠 بازگشت به صفحه اصلی</a>
              <a href="/api-docs" class="btn btn-secondary">📄 مستندات API</a>
            </div>
            <div class="debug">
              <strong>اطلاعات تکمیلی:</strong><br>
              Status: ${status || "نامشخص"}<br>
              Payment ID: ${paymentId || "نامشخص"}<br>
              Reference ID: ${refId || "نامشخص"}<br>
              Time: ${new Date().toLocaleString("fa-IR")}
            </div>
          </div>
        </body>
      </html>
    `);
  },
};

export default PaymentCtrl;