import { Request, Response } from "express";
import * as ArticleService from "../services/ArticleManagementService";
import { checkArticlePermission } from "../utils/permissionCheck";
import { ArticleStatus, AdminRole } from "@prisma/client";
import { transformFileUrls } from "../../middleware/upload";

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

const ArticleCtrl = {
  list: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }
      checkArticlePermission(admin);

      const { status, categoryId, search, page, limit } = req.query;
      const result = await ArticleService.getArticles({
        status: status as ArticleStatus,
        categoryId: categoryId as string,
        search: search as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });

      res.status(200).json({ status: "success", data: result });
    } catch (error: any) {
      console.error("Error listing articles:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  getOne: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }
      checkArticlePermission(admin);

      const id = toStr(req.params.id);
      const article = await ArticleService.getArticleById(id);

      res.status(200).json({ status: "success", data: article });
    } catch (error: any) {
      console.error("Error getting article:", error);
      res.status(404).json({ status: "error", message: error.message });
    }
  },

  create: async (req: AuthRequest, res: Response) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: "error", message: "احراز هویت نشده" });
      }
      checkArticlePermission(admin);

      let featuredImage: string | undefined = req.body.featuredImage;
      if ((req as any).file) {
        const files = transformFileUrls([(req as any).file]);
        featuredImage = files[0]?.location || files[0]?.path || "";
      }

      const { title, slug, categoryId, content, plaintext, status } = req.body;

      if (!title || !slug || !categoryId || !content) {
        return res.status(400).json({
          status: "error",
          message: "عنوان، اسلاگ، دسته‌بندی و محتوا الزامی هستند",
        });
      }

      const article = await ArticleService.createArticle({
        title,
        slug,
        categoryId,
        featuredImage,
        content: typeof content === "string" ? JSON.parse(content) : content,
        plaintext,
        status,
        authorId: admin.id,
      });

      res.status(201).json({ status: "success", data: article });
    } catch (error: any) {
      console.error("Error creating article:", error);
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

      let featuredImage: string | undefined = req.body.featuredImage;
      if ((req as any).file) {
        const files = transformFileUrls([(req as any).file]);
        featuredImage = files[0]?.location || files[0]?.path || "";
      }

      const { title, slug, categoryId, content, plaintext, status } = req.body;

      const article = await ArticleService.updateArticle({
        id,
        title,
        slug,
        categoryId,
        featuredImage,
        content: content ? (typeof content === "string" ? JSON.parse(content) : content) : undefined,
        plaintext,
        status,
      });

      res.status(200).json({ status: "success", data: article });
    } catch (error: any) {
      console.error("Error updating article:", error);
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
      await ArticleService.deleteArticle(id);

      res.status(200).json({ status: "success", message: "مقاله با موفقیت حذف شد" });
    } catch (error: any) {
      console.error("Error deleting article:", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  },
};

export default ArticleCtrl;