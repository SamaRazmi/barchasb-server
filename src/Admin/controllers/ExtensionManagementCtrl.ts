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

  testTypes: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const categoryId = req.query.categoryId as string | undefined;
      const types = await ExtensionManagementService.getAllTestTypes(categoryId);
      res.status(200).json({ status: "success", data: types });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  usersWithTestSessions: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const users = await ExtensionManagementService.getUsersWithTestSessions();
      res.status(200).json({ status: "success", data: users });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  allTestSessionsInfo: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      checkUserPermission(admin);

      const sessions = await ExtensionManagementService.getAllTestSessionsInfo();
      res.status(200).json({ status: "success", data: sessions });
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