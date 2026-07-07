import { Request, Response } from "express";
import * as VipService from "../services/VipService";

interface AuthRequest extends Request {
  user?: { id: string; [key: string]: any };
  admin?: { id: string; [key: string]: any };
}
const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

const VipCtrl = {
  // user
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

      res.status(200).json({
        status: "success",
        message: "کد با موفقیت اعمال شد",
        data: {
          newExpiry: result.newExpiry,
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

  // admin
  generate: async (req: AuthRequest, res: Response) => {
    try {
      const { title, count, vipDuration, isPublic, targetUserId, maxUses} = req.body;

      if (!title || !count || !vipDuration) {
        return res.status(400).json({
          status: "error",
          message: "عنوان، تعداد و مدت الزامی هستند",
        });
      }

      if (count <= 0 || vipDuration <= 0) {
        return res.status(400).json({
          status: "error",
          message: "تعداد و مدت باید بزرگتر از صفر باشند",
        });
      }

      if (!isPublic && !targetUserId) {
        return res.status(400).json({
          status: "error",
          message: "برای کد اختصاصی، کاربر هدف مشخص شود",
        });
      }

      const result = await VipService.generateVipCodes({
        title,
        count,
        vipDuration,
        isPublic: isPublic || false,
        targetUserId,
        maxUses: maxUses,
      });

      res.status(201).json({
        status: "success",
        message: `${result.codes.length} کد با موفقیت تولید شد`,
        data: {
          codes: result.codes,
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در تولید کدها",
      });
    }
  },

  activate: async (req: AuthRequest, res: Response) => {
    try {
      const id = toStr(req.params.id);
      if (!id) {
        return res.status(400).json({
          status: "error",
          message: "شناسه کد الزامی است",
        });
      }

      const result = await VipService.activateVipCode(id);

      res.status(200).json({
        status: "success",
        message: "کد با موفقیت فعال شد",
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در فعال‌سازی کد",
      });
    }
  },
  
  deactivate: async (req: AuthRequest, res: Response) => {
    try {
      const id = toStr(req.params.id);
      if (!id) {
        return res.status(400).json({
          status: "error",
          message: "شناسه کد الزامی است",
        });
      }

      const result = await VipService.deactivateVipCode(id);

      res.status(200).json({
        status: "success",
        message: "کد با موفقیت غیرفعال شد",
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در غیرفعال‌سازی کد",
      });
    }
  },

  list: async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.query;
      const filter = status === "all" ? undefined : (status as "active" | "inactive" | undefined);

      const codes = await VipService.getVipCodes(filter);

      res.status(200).json({
        status: "success",
        data: codes,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در دریافت لیست کدها",
      });
    }
  },

  delete: async (req: AuthRequest, res: Response) => {
    try {
      const id = toStr(req.params.id);
      if (!id) {
        return res.status(400).json({
          status: "error",
          message: "شناسه کد الزامی است",
        });
      }

      const result = await VipService.deleteVipCode(id);

      res.status(200).json({
        status: "success",
        message: result.message,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در حذف کد",
      });
    }
  },

  revokeUserVip: async (req: AuthRequest, res: Response) => {
    try {
      const userId = toStr(req.params.userId);
      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "شناسه کاربر الزامی است",
        });
      }

      const result = await VipService.revokeUserVip(userId);

      res.status(200).json({
        status: "success",
        message: result.message,
        data: {
          userId: result.userId,
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در لغو VIP کاربر",
      });
    }
  },
};

export default VipCtrl;