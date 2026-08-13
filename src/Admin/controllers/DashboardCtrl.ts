import { Request, Response } from "express";
import * as DashboardService from "../services/DashboardService";
import { AdminRole } from "@prisma/client";

interface AuthRequest extends Request {
  admin?: {
    id: string;
    role: AdminRole;
    permissions?: any;
  };
}

const DashboardCtrl = {
  stats: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }

      const stats = await DashboardService.getDashboardStats();

      res.status(200).json({
        status: "success",
        data: stats,
      });
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در دریافت آمار",
      });
    }
  },

  monthlyRevenue: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }

      const year = parseInt(req.query.year as string);
      if (!year || isNaN(year)) {
        return res.status(400).json({
          status: "error",
          message: "سال معتبر نیست",
        });
      }

      const monthlyRevenue = await DashboardService.getMonthlyRevenue(year);

      res.status(200).json({
        status: "success",
        data: monthlyRevenue,
      });
    } catch (error: any) {
      console.error("Error fetching monthly revenue:", error);
      res.status(500).json({
        status: "error",
        message: error.message || "خطا در دریافت درآمد ماهانه",
      });
    }
  },
};

export default DashboardCtrl;