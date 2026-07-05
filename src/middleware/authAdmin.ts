import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

// ====== ۱. تعریف نوع‌های دقیق ======
export type AdminRole = "ADMIN" | "SUPER_ADMIN";

interface AdminJwtPayload extends jwt.JwtPayload {
  sub?: string;
  id?: string;
  phone?: string;
  role?: AdminRole;
}

export type AdminInfo = {
  id: string;
  phone: string;
  role: AdminRole;
};

// ====== ۲. اضافه کردن تایپ به Express (هماهنگ با authMidleware) ======
declare global {
  namespace Express {
    interface Request {
      user?: any;
      admin?: any;
    }
  }
}

// ====== ۳. متغیرهای محیطی ======
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_ADMIN_SECRET = process.env.JWT_SECRET_ADMIN!;
const JWT_SUPER_SECRET = process.env.JWT_SECRET_SUPER_ADMIN!;

if (!JWT_SECRET) throw new Error("❌ JWT_SECRET تعریف نشده!");
if (!JWT_ADMIN_SECRET) throw new Error("❌ JWT_SECRET_ADMIN تعریف نشده!");
if (!JWT_SUPER_SECRET) throw new Error("❌ JWT_SECRET_SUPER_ADMIN تعریف نشده!");

// ====== توابع احراز هویت ======

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token = req.cookies?.accessToken;
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "توکن موجود نیست" });
  }
  try {
    const userPayload = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: userPayload.id,
      name: userPayload.name || "",
      lastName: userPayload.lastName || "",
      role: userPayload.role,
      phone: userPayload.phone || "",
      email: userPayload.email || "",
      avatar: userPayload.avatar || "",
    };
    next();
  } catch (err: any) {
    return res
      .status(403)
      .json({ status: "error", message: "توکن نامعتبر یا منقضی شده" });
  }
};

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "دسترسی غیرمجاز: توکن ارسال نشده است." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "توکن نامعتبر یا منقضی شده است." });
  }
};

export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "دسترسی غیرمجاز: توکن ارسال نشده است." });
  }
  try {
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET) as any;
    req.admin = {
      id: decoded.id || decoded.sub,
      phone: decoded.phone || "",
      role: decoded.role || "ADMIN",
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "توکن نامعتبر یا منقضی شده است." });
  }
};

// ====== میدلور پیشرفته authAdmin ======
export const authAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    res
      .status(401)
      .json({
        message: "توکن احراز هویت ارائه نشده است",
        error: "Unauthorized",
        statusCode: 401,
      });
    return;
  }

  jwt.verify(token, JWT_ADMIN_SECRET, (err: any, decoded: any) => {
    if (err) {
      jwt.verify(token, JWT_SUPER_SECRET, (err2: any, decoded2: any) => {
        if (err2 || !decoded2) {
          res
            .status(403)
            .json({
              message: "توکن نامعتبر یا منقضی شده است",
              error: "Forbidden",
              statusCode: 403,
            });
          return;
        }
        const user = decoded2 as AdminJwtPayload;
        if (user.role !== "SUPER_ADMIN") {
          res
            .status(403)
            .json({
              message:
                "دسترسی غیرمجاز. فقط ادمینها میتوانند به این بخش دسترسی داشته باشند.",
              error: "Forbidden",
              statusCode: 403,
            });
          return;
        }
        req.admin = {
          id: user.id || user.sub || "",
          phone: user.phone || "",
          role: user.role || "SUPER_ADMIN",
        };
        next();
      });
      return;
    }
    if (!decoded) {
      res
        .status(403)
        .json({ message: "توکن نامعتبر", error: "Forbidden", statusCode: 403 });
      return;
    }
    const user = decoded as AdminJwtPayload;
    if (user.role !== "ADMIN") {
      res
        .status(403)
        .json({
          message:
            "دسترسی غیرمجاز. فقط ادمینها میتوانند به این بخش دسترسی داشته باشند.",
          error: "Forbidden",
          statusCode: 403,
        });
      return;
    }
    req.admin = {
      id: user.id || user.sub || "",
      phone: user.phone || "",
      role: user.role || "ADMIN",
    };
    next();
  });
};

// alias
export const isAdmin = authAdmin;

// ====== authorizeAdmin با بررسی نقش ======
export const authorizeAdmin = (requiredRole: AdminRole = "ADMIN") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    authAdmin(req, res, (err?: any) => {
      if (err) return next(err);
      const admin = req.admin as AdminInfo | undefined;
      if (!admin) {
        return res
          .status(401)
          .json({ status: "error", message: "اطلاعات ادمین یافت نشد" });
      }
      if (admin.role === "SUPER_ADMIN") {
        return next();
      }
      if (admin.role === "ADMIN" && requiredRole === "SUPER_ADMIN") {
        return res
          .status(403)
          .json({
            status: "error",
            message: "دسترسی غیرمجاز. این بخش فقط مخصوص سوپر ادمین است.",
          });
      }
      next();
    });
  };
};
