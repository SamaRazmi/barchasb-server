import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// ۱. تعریف ساختار اطلاعاتی که درون توکن وجود دارد (Payload)
interface AdminJwtPayload extends JwtPayload {
  id?: string;
  role?: string;
  phone?: string;
}

// ۲. توسعه دادن اینترفیس Request اکسترس برای پذیریش کاربری که احراز هویت شده
export interface AuthenticatedRequest extends Request {
  user?: AdminJwtPayload;
}

/**
 * میدلور isAdmin:
 * - توکن را از هدر Authorization استخراج می‌کند (فرمت: Bearer <token>)
 * - با استفاده از JWT_SECRET_ADMIN صحت توکن را بررسی می‌کند
 * - نقش (role) کاربر را چک می‌کند که حتماً "admin" باشد
 * - در صورت موفقیت، اطلاعات کاربر (payload) را در req.user قرار می‌دهد
 * - در غیر این صورت خطای 401 یا 403 برمی‌گرداند
 */
export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // استخراج توکن از هدر Authorization
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: "توکن ارائه نشده است" });
    return;
  }

  const secret = process.env.JWT_SECRET_ADMIN;
  if (!secret) {
    console.error("❌ JWT_SECRET_ADMIN در متغیرهای محیطی (.env) تعریف نشده است.");
    res.status(500).json({ error: "خطای داخلی سرور در تنظیمات احراز هویت" });
    return;
  }

  // اعتبارسنجی توکن با کلید مخفی JWT_SECRET_ADMIN
  jwt.verify(token, secret, (err, decoded) => {
    if (err || !decoded) {
      res.status(403).json({ error: "توکن نامعتبر یا منقضی شده است" });
      return;
    }

    // کست کردن نتیجه دی‌کد شده به تایپ اختصاصی‌مان
    const user = decoded as AdminJwtPayload;

    // بررسی نقش ادمین
    if (user.role !== "admin") {
      res.status(403).json({ error: "دسترسی غیرمجاز. فقط ادمین می‌تواند به این بخش دسترسی داشته باشد." });
      return;
    }

    // ذخیره اطلاعات کاربر در req برای استفاده در کنترلرها
    req.user = user;
    next();
  });
};