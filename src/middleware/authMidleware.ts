import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import 'dotenv/config'
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
    const userPayload = jwt.verify(token, JWT_SECRET);

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
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "توکن نامعتبر یا منقضی شده است.",
    });
  }
};

/* =========================
   ADMIN AUTH (FULL SAFE)
========================= */
export const authenticateAdmin = (
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
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET);

    req.admin = {
      id: decoded.id,
      role: decoded.role || "admin",
      name: decoded.name || "",
      email: decoded.email || "",
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "توکن نامعتبر یا منقضی شده است.",
    });
  }
};

/* =========================
   EXPORT (SAME STYLE AS OLD)
========================= */
module.exports = {
  authenticateToken,
  authenticateUser,
  authenticateAdmin,
};
