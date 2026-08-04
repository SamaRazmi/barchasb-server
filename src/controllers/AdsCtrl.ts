import { Request, Response } from "express";
import * as AdsService from "../services/AdsService";
import { toJalali } from "../utils/dateFormatter"; // برای تبدیل تاریخ (اختیاری)

interface AuthRequest extends Request {
  user?: { id: string; [key: string]: any };
}

const AdsCtrl = {
  /**
   * دریافت همه آگهی‌های تأیید شده و معتبر (عمومی)
   * مسیر: GET /api/ads/all
   */
  getAll: async (req: Request, res: Response) => {
    try {
      // دریافت پارامترهای کوئری
      const {
        page = 1,
        limit = 10,
        adType,
        category,
        province,
        city,
        search,
        minBudget,
        maxBudget,
      } = req.query;

      // تبدیل مقادیر به نوع مناسب
      const filters = {
        page: parseInt(page as string, 10) || 1,
        limit: parseInt(limit as string, 10) || 10,
        adType: adType ? (adType as string).split(",") : undefined,
        category: category as string,
        province: province as string,
        city: city as string,
        search: search as string,
        minBudget: minBudget as string,
        maxBudget: maxBudget as string,
      };

      const result = await AdsService.getAllAds(filters);

      res.status(200).json({
        status: "success",
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        status: "error",
        message: error.message || "خطا در دریافت آگهی‌ها",
      });
    }
  },

  /**
   * دریافت آگهی‌های تأیید شده کاربر جاری + (اختیاری) آگهی‌های عمومی دیگران
   * مسیر: GET /api/ads/user
   */
  getUserAds: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "احراز هویت نشده",
        });
      }

      const { includeOthers = "false", page = 1, limit = 10 } = req.query;

      const params = {
        userId,
        includeOthers: includeOthers === "true",
        page: parseInt(page as string, 10) || 1,
        limit: parseInt(limit as string, 10) || 10,
      };

      const result = await AdsService.getUserAds(params);

      // (اختیاری) تبدیل تاریخ‌ها به شمسی
      const convertDates = (items: any[]) =>
        items.map((item) => ({
          ...item,
          createdAt: toJalali(item.createdAt),
          ...(item.expiresAt && { expiresAt: toJalali(item.expiresAt) }),
        }));

      const response: any = {
        status: "success",
        userAds: {
          data: convertDates(result.userAds.data),
          total: result.userAds.total,
          page: result.userAds.page,
          limit: result.userAds.limit,
        },
      };

      if (result.publicAds) {
        response.publicAds = {
          data: convertDates(result.publicAds.data),
          total: result.publicAds.total,
          page: result.publicAds.page,
          limit: result.publicAds.limit,
        };
      }

      res.status(200).json(response);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        status: "error",
        message: error.message || "خطا در دریافت آگهی‌های کاربر",
      });
    }
  },

  /**
   * دریافت آمار تعداد کل و فعال آگهی‌های کاربر جاری (به تفکیک نوع)
   * مسیر: GET /api/ads/user/stats
   */
  getUserStats: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "احراز هویت نشده",
        });
      }

      const stats = await AdsService.getUserAdsStats({ userId });

      res.status(200).json({
        status: "success",
        data: stats,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({
        status: "error",
        message: error.message || "خطا در دریافت آمار آگهی‌ها",
      });
    }
  },
};

export default AdsCtrl;
