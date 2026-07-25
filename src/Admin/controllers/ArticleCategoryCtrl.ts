import { Request, Response } from "express";
import * as CategoryService from "../services/ArticleCategoryService";
import { AdminRole } from "@prisma/client";
import { checkArticlePermission } from "../utils/permissionCheck";

interface AuthRequest extends Request {
  admin?: {
    id: string;
    role: AdminRole;
  };
}

const toStr = (value: string | string[] | undefined): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return "";
};

const CategoryCtrl = {
  getAll: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }
      checkArticlePermission(admin);
      const categories = await CategoryService.getAllArticleCategories();
      res.status(200).json({ status: "success", data: categories });
    } catch (error: any) {
      console.error("Error getting categories:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  create: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }
      checkArticlePermission(admin);

      const { name, slug, description } = req.body;

      if (!name || !slug) {
        return res.status(400).json({
          status: "error",
          message: "نام و اسلاگ الزامی هستند",
        });
      }

      const category = await CategoryService.createArticleCategory({
        name,
        slug,
      });

      res.status(201).json({ status: "success", data: category });
    } catch (error: any) {
      console.error("Error creating category:", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  },

  update: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }
      checkArticlePermission(admin);
      const id = toStr(req.params.id);
      const { name, slug, description } = req.body;

      const category = await CategoryService.updateArticleCategory({
        id,
        name,
        slug,
      });

      res.status(200).json({ status: "success", data: category });
    } catch (error: any) {
      console.error("Error updating category:", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  },

  delete: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }
      checkArticlePermission(admin);
      const id = toStr(req.params.id);
      await CategoryService.deleteArticleCategory(id);
      res.status(200).json({ status: "success", message: "دسته‌بندی با موفقیت حذف شد" });
    } catch (error: any) {
      console.error("Error deleting category:", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  },
};

export default CategoryCtrl;