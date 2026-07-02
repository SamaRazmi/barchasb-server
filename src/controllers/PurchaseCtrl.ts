import { Request, Response } from "express";
import * as PurchaseService from "../services/PurchaseService";
import { AdType, PaymentMethod } from "@prisma/client";

interface AuthRequest extends Request {
  user?: { id: string; [key: string]: any };
}

const PurchaseCtrl = {
  processAdPayment: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "احراز هویت نشده",
        });
      }

      const {
        adId,
        adType,
        isSpecial,
        isLadder,
        ladderOption,
        paymentMethod,
      } = req.body;

      // اعتبارسنجی
      if (!adId || !adType || !paymentMethod) {
        return res.status(400).json({
          status: "error",
          message: "فیلدهای adId, adType و paymentMethod الزامی هستند",
        });
      }

      if (!Object.values(AdType).includes(adType)) {
        return res.status(400).json({
          status: "error",
          message: "نوع آگهی معتبر نیست",
        });
      }

      if (!Object.values(PaymentMethod).includes(paymentMethod)) {
        return res.status(400).json({
          status: "error",
          message: "روش پرداخت معتبر نیست",
        });
      }

      if (ladderOption && !["24h", "72h", "7d"].includes(ladderOption)) {
        return res.status(400).json({
          status: "error",
          message: "گزینه پله باید یکی از مقادیر 24h, 72h یا 7d باشد",
        });
      }
      const result = await PurchaseService.processAdPayment({
        adId,
        adType,
        userId,
        isSpecial: isSpecial || false,
        isLadder: isLadder || false,
        ladderOption,
        paymentMethod,
      });

      if (!result.success) {
        return res.status(400).json({
          status: "error",
          message: result.message,
        });
      }

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در پردازش پرداخت",
      });
    }
  },

  // Purchase a separate plugin
  purchaseEnhancement: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "احراز هویت نشده",
        });
      }

      const {
        adId,
        adType,
        enhancementType,
        ladderSchedule,
        ladderOption,
        paymentMethod,
      } = req.body;

      // validate
      if (!adId || !adType || !enhancementType || !paymentMethod) {
        return res.status(400).json({
          status: "error",
          message: "تمام فیلدها الزامی هستند",
        });
      }

      if (!Object.values(AdType).includes(adType)) {
        return res.status(400).json({
          status: "error",
          message: "نوع آگهی معتبر نیست",
        });
      }

      if (!["SPECIAL", "LADDER", "RENEWAL"].includes(enhancementType)) {
        return res.status(400).json({
          status: "error",
          message: "نوع افزونه معتبر نیست",
        });
      }
      if (ladderOption && !["now", "24h", "72h", "7d"].includes(ladderOption)) {
        return res.status(400).json({
          status: "error",
          message: "گزینه پله باید یکی از مقادیر now, 24h, 72h یا 7d باشد",
        });
      }

      const result = await PurchaseService.purchaseEnhancement({
        adId,
        adType,
        enhancementType: enhancementType as any,
        ladderSchedule: ladderSchedule ? new Date(ladderSchedule) : undefined,
        ladderOption,
        userId,
        paymentMethod,
      });

      if (!result.success) {
        return res.status(400).json({
          status: "error",
          message: result.message,
        });
      }

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در خرید افزونه",
      });
    }
  },
};

export default PurchaseCtrl;