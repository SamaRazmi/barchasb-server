import { Request, Response } from "express";
import * as PricingService from "../services/PricingService";

const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

const PricingCtrl = {
  getAll: async (req: Request, res: Response) => {
    try {
      const pricing = await PricingService.getAllPricing();
      res.status(200).json({
        status: "success",
        data: pricing,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در دریافت قیمت‌ها",
      });
    }
  },

  getByKey: async (req: Request, res: Response) => {
    try {
      const key = toStr(req.params.key);
      if (!key) {
        return res.status(400).json({
          status: "error",
          message: "کلید قیمت معتبر نیست",
        });
      }

      const value = await PricingService.getPricingValue(
        key as PricingService.PricingKey
      );

      res.status(200).json({
        status: "success",
        data: { key, value },
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در دریافت قیمت",
      });
    }
  },
};

export default PricingCtrl;