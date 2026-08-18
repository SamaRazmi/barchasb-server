import { Request, Response } from "express";
import * as ExtensionManagementService from "../services/ExtensionManagementService";
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

const ExtensionManagementCtrl = {
  // test section 
  testCategories: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const categories = await ExtensionManagementService.getAllCategories();
      res.status(200).json({ status: "success", data: categories });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  testTypesWithStats: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const categoryId = toStr(req.params.categoryId);
      if (!categoryId) {
        return res.status(400).json({ status: "error", message: "شناسه دسته‌بندی ارسال نشده" });
      }

      const types = await ExtensionManagementService.getTestTypesWithStats(categoryId);
      res.status(200).json({ status: "success", data: types });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  testSessions: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const typeId = toStr(req.params.typeId);
      if (!typeId) {
        return res.status(400).json({ status: "error", message: "شناسه نوع تست ارسال نشده" });
      }

      const sessions = await ExtensionManagementService.getTestSessionsByType(typeId);
      res.status(200).json({ status: "success", data: sessions });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  testSessionDetail: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const sessionId = toStr(req.params.sessionId);
      if (!sessionId) {
        return res.status(400).json({ status: "error", message: "شناسه جلسه ارسال نشده" });
      }

      const detail = await ExtensionManagementService.getTestSessionDetailById(sessionId);
      res.status(200).json({ status: "success", data: detail });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // resume section 
  resumes: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const users = await ExtensionManagementService.getUsersWithResumes();
      res.status(200).json({ status: "success", data: users });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  // converter section 
  converterUserUsage: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const data = await ExtensionManagementService.getUsersToolUsage();
      res.status(200).json({ status: "success", data });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  converterPopularity: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const data = await ExtensionManagementService.getToolPopularity();
      res.status(200).json({ status: "success", data });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  converterPerformance: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const data = await ExtensionManagementService.getToolPerformance();
      res.status(200).json({ status: "success", data });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },
};

export default ExtensionManagementCtrl;