import { Request, Response } from "express";
import * as VipService from "../services/VipService";
import { toJalali } from "../utils/dateFormatter";

interface AuthRequest extends Request {
  user?: { id: string; [key: string]: any };
}

const VipCtrl = {
  apply: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "احراز هویت نشده",
        });
      }

      const { code } = req.body;
      if (!code) {
        return res.status(400).json({
          status: "error",
          message: "کد الزامی است",
        });
      }

      const result = await VipService.applyVipCode(userId, code);
      const newExpiryJalali = toJalali(result.newExpiry);

      res.status(200).json({
        status: "success",
        message: "کد با موفقیت اعمال شد",
        data: {
          newExpiry: newExpiryJalali,
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        status: "error",
        message: error.message || "خطا در اعمال کد",
      });
    }
  },
};

export default VipCtrl;