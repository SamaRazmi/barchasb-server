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
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

// ===== ۱. تعریف ساختار Payload توکن =====
interface AdminJwtPayload extends JwtPayload {
  sub?: string; // شناسه کاربر (مطابق با لاگین شما)
  id?: string;
  phone?: string;
  role?: string; // نقش: 'ADMIN' یا 'SUPER_ADMIN'
}

// ===== ۲. گسترش Request برای دسترسی به user =====
export interface AuthenticatedRequest extends Request {
  user?: AdminJwtPayload;
}

/**
 * ===== ۳. Middleware authAdmin =====
 * - توکن را از کوکی (accessToken) یا هدر Authorization استخراج میکند.
 * - ابتدا با JWT_SECRET_ADMIN و در صورت خطا با JWT_SECRET_SUPER_ADMIN اعتبارسنجی میکند.
 * - در صورت موفقیت، نقش کاربر را بررسی میکند که حتماً 'ADMIN' یا 'SUPER_ADMIN' باشد.
 * - اطلاعات کاربر را در req.user قرار داده و next() را صدا میزند.
 * - در غیر این صورت پاسخ ۴۰۱ یا ۴۰۳ برمیگرداند.
 */
export const authAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  // ۱. استخراج توکن از کوکی یا هدر Authorization
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "توکن احراز هویت ارائه نشده است",
      error: "Unauthorized",
      statusCode: 401,
    });
    return;
  }

  // ۲. دریافت سکرتها از متغیرهای محیطی
  const adminSecret = process.env.JWT_SECRET_ADMIN;
  const superSecret = process.env.JWT_SECRET_SUPER_ADMIN;

  if (!adminSecret || !superSecret) {
    console.error(
      "❌ JWT_SECRET_ADMIN یا JWT_SECRET_SUPER_ADMIN در .env تعریف نشده است.",
    );
    res.status(500).json({
      message: "خطای داخلی سرور در تنظیمات احراز هویت",
      error: "Internal Server Error",
      statusCode: 500,
    });
    return;
  }

  // ۳. ابتدا با سکرت ادمین عادی امتحان کن
  jwt.verify(token, adminSecret, (err: VerifyErrors | null, decoded: any) => {
    if (err) {
      // اگر خطا خورد، با سکرت سوپرادمین امتحان کن
      jwt.verify(
        token,
        superSecret,
        (err2: VerifyErrors | null, decoded2: any) => {
          if (err2 || !decoded2) {
            res.status(403).json({
              message: "توکن نامعتبر یا منقضی شده است",
              error: "Forbidden",
              statusCode: 403,
            });
            return;
          }

          const user = decoded2 as AdminJwtPayload;
          // نقش باید SUPER_ADMIN باشد (حروف بزرگ)
          if (user.role !== "SUPER_ADMIN") {
            res.status(403).json({
              message:
                "دسترسی غیرمجاز. فقط ادمینها میتوانند به این بخش دسترسی داشته باشند.",
              error: "Forbidden",
              statusCode: 403,
            });
            return;
          }

          req.user = user;
          next();
        },
      );
      return;
    }

    // اعتبارسنجی با سکرت ادمین عادی موفق بود
    if (!decoded) {
      res.status(403).json({
        message: "توکن نامعتبر",
        error: "Forbidden",
        statusCode: 403,
      });
      return;
    }

    const user = decoded as AdminJwtPayload;
    // نقش باید ADMIN باشد (حروف بزرگ)
    if (user.role !== "ADMIN") {
      res.status(403).json({
        message:
          "دسترسی غیرمجاز. فقط ادمینها میتوانند به این بخش دسترسی داشته باشند.",
        error: "Forbidden",
        statusCode: 403,
      });
      return;
    }
  };
};


    req.user = user;
    next();
  });
};

// همچنین برای سازگاری با نام‌های قدیمی، میتوانید یک alias صادر کنید:
export const isAdmin = authAdmin;
