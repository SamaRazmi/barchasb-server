import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

// ====== ۱. تعریف دقیق تایپ‌ها (با حروف بزرگ) ======
export type AdminRole = 'ADMIN' | 'SUPER_ADMIN';

// ساختار دقیق پیلود توکن ادمین
interface AdminJwtPayload extends jwt.JwtPayload {
  sub: string;      // آیدی دیتابیس (اجباری)
  phone: string;    // شماره تلفن (اجباری)
  role: AdminRole;  // نقش (اجباری)
  // iat و exp به صورت خودکار توسط jwt.JwtPayload اضافه می‌شوند
}

// ====== ۲. اضافه کردن تایپ admin به Express ======
declare global {
  namespace Express {
    interface Request {
      user?: any; // برای یوزرهای معمولی
      admin?: {
        id: string;       // مپ شده از sub
        phone: string;
        role: AdminRole;
      };
    }
  }
}

// ====== ۳. متغیر محیطی ======
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN!;
if (!JWT_SECRET_ADMIN) {
  throw new Error("❌ متغیر JWT_SECRET_ADMIN در فایل .env تعریف نشده است!");
}

/**
 * میدلور احراز هویت و بررسی دسترسی ادمین/سوپر ادمین
 * @param requiredRole - نقش مورد نیاز برای این مسیر. پیش‌فرض: 'ADMIN'
 */
export const authorizeAdmin = (requiredRole: AdminRole = 'ADMIN') => {
  
  return (req: Request, res: Response, next: NextFunction): void => {
    // ۱. استخراج توکن (از کوکی یا هدر)
    let token = req.cookies?.accessToken;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({ 
        status: "error", 
        message: "توکن ادمین موجود نیست" 
      });
      return;
    }

    try {
      // ۲. اعتبارسنجی توکن
      const decoded = jwt.verify(token, JWT_SECRET_ADMIN) as AdminJwtPayload;

      // ۳. ذخیره اطلاعات در req.admin 
      // (توجه: sub تبدیل به id می‌شود تا در کنترلرها راحت‌تر باشد)
      req.admin = {
        id: decoded.sub, 
        phone: decoded.phone,
        role: decoded.role,
      };

      const userRole = req.admin.role;

      // ==========================================
      // ۴. منطق بررسی نقش‌ها (Condition Logic)
      // ==========================================

      // حالت اول: اگر سوپر ادمین است، به همه چیز دسترسی دارد (Bypass)
      if (userRole === 'SUPER_ADMIN') {
        return next();
      }

      // حالت دوم: اگر ادمین معمولی است
      if (userRole === 'ADMIN') {
        // چک می‌کنیم که آیا این مسیر مخصوص سوپر ادمین بوده یا نه
        if (requiredRole === 'SUPER_ADMIN') {
          res.status(403).json({ 
            status: "error", 
            message: "دسترسی غیرمجاز. این بخش فقط مخصوص سوپر ادمین است." 
          });
          return;
        }
        
        // اگر مسیر مخصوص ادمین معمولی بوده، اجازه عبور دارد
        return next();
      }

      // حالت سوم: اگر نقش اصلا شناخته شده نبود (برای امنیت بیشتر)
      res.status(403).json({ 
        status: "error", 
        message: "نقش کاربری در توکن ادمین نامعتبر است." 
      });

    } catch (err: any) {
      console.error("❌ JWT Admin verify error:", err.message);
      res.status(403).json({ 
        status: "error", 
        message: "توکن ادمین نامعتبر یا منقضی شده" 
      });
    }
  };
};


