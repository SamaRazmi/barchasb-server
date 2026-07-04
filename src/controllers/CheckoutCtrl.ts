import { Request, Response } from "express";
import * as CostCalculator from "../services/CostCalculator";
import { AdType, PaymentMethod } from "@prisma/client";

interface AuthRequest extends Request {
  user?: { id: string; [key: string]: any };
}

const CheckoutCtrl = {
  calculate: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "احراز هویت نشده",
        });
      }

      const {
        adType,
        isNewAd,
        isSpecial,
        isLadder,
        isRenewal,
        paymentMethod,
      } = req.body;

      // validate inputs
      if (!adType || !Object.values(AdType).includes(adType)) {
        return res.status(400).json({
          status: "error",
          message: "نوع آگهی معتبر نیست",
        });
      }

      if (!paymentMethod || !Object.values(PaymentMethod).includes(paymentMethod)) {
        return res.status(400).json({
          status: "error",
          message: "روش پرداخت معتبر نیست",
        });
      }

      const result = await CostCalculator.calculateCost({
        adType,
        isNewAd: isNewAd ?? true, 
        isSpecial: isSpecial ?? false,
        isLadder: isLadder ?? false,
        isRenewal: isRenewal ?? false,
        paymentMethod,
        userId,
      });

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در محاسبه هزینه",
      });
    }
  },
};

export default CheckoutCtrl;