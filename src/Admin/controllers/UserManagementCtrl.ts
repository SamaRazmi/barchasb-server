import { Request, Response } from "express";
import * as UserManagementService from "../services/UserManagementService";
import { checkUserPermission } from "../utils/permissionCheck";
import { AdminRole } from "@prisma/client";

interface AuthRequest extends Request {
  admin?: {
    id: string;
    role: AdminRole;
    permissions?: any;
  };
}

const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

const UserManagementCtrl = {
  stats: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }
      checkUserPermission(admin);

      const stats = await UserManagementService.getUserStats();

      res.status(200).json({
        status: "success",
        data: stats,
      });
    } catch (error: any) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  list: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }
      checkUserPermission(admin);

      const search = req.query.search as string | undefined;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await UserManagementService.getUsersList({
        search,
        page,
        limit,
      });

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error: any) {
      console.error("Error fetching users list:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  profile: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }
      checkUserPermission(admin);

      const userId = toStr(req.params.id);
      if (!userId) {
        return res.status(400).json({ status: "error", message: "شناسه کاربر ارسال نشده" });
      }

      const profile = await UserManagementService.getUserProfileById(userId);
      if (!profile) {
        return res.status(404).json({ status: "error", message: "کاربر یافت نشد" });
      }

      res.status(200).json({
        status: "success",
        data: profile,
      });
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  ads: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }
      checkUserPermission(admin);

      const userId = toStr(req.params.id);
      if (!userId) {
        return res.status(400).json({ status: "error", message: "شناسه کاربر ارسال نشده" });
      }

      const ads = await UserManagementService.getUserAds(userId);
      res.status(200).json({
        status: "success",
        data: ads,
      });
    } catch (error: any) {
      console.error("Error fetching user ads:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  financial: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }
      checkUserPermission(admin);

      const userId = toStr(req.params.id);
      if (!userId) {
        return res.status(400).json({ status: "error", message: "شناسه کاربر ارسال نشده" });
      }

      const financialInfo = await UserManagementService.getUserFinancialInfo(userId);
      res.status(200).json({
        status: "success",
        data: financialInfo,
      });
    } catch (error: any) {
      console.error("Error fetching user financial info:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  sessions: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }
      checkUserPermission(admin);

      const userId = toStr(req.params.id);
      if (!userId) {
        return res.status(400).json({ status: "error", message: "شناسه کاربر ارسال نشده" });
      }

      const sessions = await UserManagementService.getUserSessions(userId);
      res.status(200).json({
        status: "success",
        data: sessions,
      });
    } catch (error: any) {
      console.error("Error fetching user sessions:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  testSummary: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const userId = toStr(req.params.id);
      if (!userId) return res.status(400).json({ status: "error", message: "شناسه کاربر نامعتبر" });

      const summary = await UserManagementService.getUserTestsSummary(userId);
      res.status(200).json({ status: "success", data: summary });
    } catch (error: any) {
      console.error("Error fetching user test summary:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  testDetail: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const userId = toStr(req.params.id);
      const sessionId = toStr(req.params.sessionId);
      if (!userId || !sessionId) {
        return res.status(400).json({ status: "error", message: "شناسه کاربر یا جلسه نامعتبر" });
      }

      const detail = await UserManagementService.getUserTestDetail(userId, sessionId);
      if (!detail) return res.status(404).json({ status: "error", message: "جلسه آزمون یافت نشد" });

      res.status(200).json({ status: "success", data: detail });
    } catch (error: any) {
      console.error("Error fetching user test detail:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  resume: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const userId = toStr(req.params.id);
      if (!userId) return res.status(400).json({ status: "error", message: "شناسه کاربر نامعتبر" });

      const resume = await UserManagementService.getUserResume(userId);
      if (!resume) return res.status(404).json({ status: "error", message: "رزومه‌ای برای این کاربر یافت نشد" });

      res.status(200).json({ status: "success", data: resume });
    } catch (error: any) {
      console.error("Error fetching user resume:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  converterUsage: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const userId = toStr(req.params.id);
      if (!userId) return res.status(400).json({ status: "error", message: "شناسه کاربر نامعتبر" });

      const usage = await UserManagementService.getUserConverterUsage(userId);
      res.status(200).json({ status: "success", data: usage });
    } catch (error: any) {
      console.error("Error fetching user converter usage:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },
};

export default UserManagementCtrl;