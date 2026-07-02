import { Request, Response } from "express";
import * as WalletService from "../services/WalletService";
import * as PaymentGatewayService from "../services/PaymentGatewayService";
import { PaymentMethod } from "@prisma/client";

const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

interface AuthRequest extends Request {
  user?: { id: string; [key: string]: any };
}

const WalletCtrl = {
  getBalance: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "احراز هویت نشده",
        });
      }

      const balance = await WalletService.getAvailableBalance(userId);

      res.status(200).json({
        status: "success",
        data: balance,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در دریافت موجودی",
      });
    }
  },

deposit: async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "احراز هویت نشده",
      });
    }

    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: "error",
        message: "مبلغ شارژ معتبر نیست",
      });
    }
    const paymentResult = await PaymentGatewayService.createPayment({
      userId,
      amount,
      paymentMethod: PaymentMethod.Bank_card,
      description: `شارژ کیف پول به مبلغ ${amount} تومان`,
      referenceId: userId,
      referenceType: "WALLET_DEPOSIT", 
      metadata: { amount, userId },
    });

    res.status(200).json({
      status: "success",
      message: "لطفاً برای تکمیل شارژ به درگاه هدایت شوید",
      data: {
        paymentId: paymentResult.paymentId,
        paymentUrl: paymentResult.paymentUrl,
        authority: paymentResult.authority,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message || "خطا در شارژ کیف پول",
    });
  }
},

  // use in admin approve
  releaseHold: async (req: AuthRequest, res: Response) => {
    try {
      const transactionId = toStr(req.params.transactionId);
      if (!transactionId) {
        return res.status(400).json({
          status: "error",
          message: "شناسه تراکنش معتبر نیست",
        });
      }

      const result = await WalletService.releaseHold(
        transactionId,
        req.body.metadata || {}
      );

      res.status(200).json({
        status: "success",
        message: "تراکنش با موفقیت تکمیل شد",
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در تکمیل تراکنش",
      });
    }
  },

  // use in admin reject
  refundHold: async (req: AuthRequest, res: Response) => {
    try {
      const transactionId = toStr(req.params.transactionId);
      if (!transactionId) {
        return res.status(400).json({
          status: "error",
          message: "شناسه تراکنش معتبر نیست",
        });
      }

      const { reason } = req.body;
      if (!reason) {
        return res.status(400).json({
          status: "error",
          message: "دلیل برگشت وجه الزامی است",
        });
      }

      const result = await WalletService.refundHold(
        transactionId,
        reason,
        req.body.metadata || {}
      );

      res.status(200).json({
        status: "success",
        message: "وجه با موفقیت برگشت داده شد",
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در برگشت وجه",
      });
    }
  },
};

export default WalletCtrl;