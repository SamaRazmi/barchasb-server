import { Request, Response, NextFunction } from "express";
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

    req.user = user;
    next();
  });
};

// همچنین برای سازگاری با نام‌های قدیمی، میتوانید یک alias صادر کنید:
export const isAdmin = authAdmin;
