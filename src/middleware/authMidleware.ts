import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
import prisma from "../config/prisma";


// ====== اضافه کردن تایپ به Express ======
declare global {
  namespace Express {
    interface Request {
      user?: any;
      admin?: any;
    }
  }
}
// =========================================

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_ADMIN_SECRET = process.env.JWT_SECRET_ADMIN!;

/* =========================
   MAIN AUTH (User) - FULL VERSION
========================= */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(
    "🔐 JWT_SECRET (first 5 chars):",
    JWT_SECRET ? JWT_SECRET.substring(0, 5) : "MISSING",
  );

  console.log("Authorization header:", req.headers.authorization);

  let token = req.cookies?.accessToken;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.error("❌ توکن یافت نشد");
    return res.status(401).json({
      status: "error",
      message: "توکن موجود نیست",
    });
  }

  try {
    // استفاده از as any برای دسترسی به فیلدها
    const userPayload = jwt.verify(token, JWT_SECRET) as any;

    console.log("✅ توکن معتبر، کاربر:", userPayload);

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
    console.error("❌ JWT verify error:", err.message);

    return res.status(403).json({
      status: "error",
      message: "توکن نامعتبر یا منقضی شده",
      error: err.message,
    });
  }
};

/* =========================
   USER AUTH (simple extension)
========================= */
export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "دسترسی غیرمجاز: توکن ارسال نشده است.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "توکن نامعتبر یا منقضی شده است.",
    });
  }
};

// /* =========================
//    ADMIN AUTH (FULL SAFE)
// ========================= */
export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies?.accessToken
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'توکن ارائه نشده' })
  }

  try {
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET) as any

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.sub || decoded.id },
      select: {
        id: true,
        username: true,
        role: true,
        permissions: true,
      },
    });

    if (!admin) {
      return res.status(403).json({
        status: 'error',
        message: 'ادمین یافت نشد',
      });
    }

    req.admin = {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      permissions: admin.permissions as any,
    }
    next()
  } catch {
    return res.status(403).json({ status: 'error', message: 'توکن نامعتبر' })
  }
}