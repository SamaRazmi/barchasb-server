import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import "dotenv/config";

// ============================================================
//  1. تعریف تایپ‌ها
// ============================================================

export type AdminRole = "ADMIN" | "SUPER_ADMIN";

// ساختار پیلود توکن ادمین (برای authorizeAdmin)
interface AdminJwtPayload extends jwt.JwtPayload {
  sub: string; // آیدی دیتابیس (اجباری)
  phone: string; // شماره تلفن (اجباری)
  role: AdminRole; // نقش (اجباری)
  // iat و exp به صورت خودکار توسط jwt.JwtPayload اضافه می‌شوند
}

// ساختار پیلود توکن برای authAdmin (سازگار با هر دو سکرت)
interface AuthAdminJwtPayload extends JwtPayload {
  sub?: string;
  id?: string;
  phone?: string;
  role?: string;
}

// ============================================================
//  2. گسترش Request برای دسترسی به admin (و user در صورت نیاز)
// ============================================================

declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        phone: string;
        role: AdminRole;
      };
      user?: any; // برای هماهنگی با authMidleware
    }
  }
}

// Request اختصاصی برای authAdmin
export interface AuthenticatedRequest extends Request {
  user?: AuthAdminJwtPayload;
}

// ============================================================
//  3. متغیرهای محیطی
// ============================================================

const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;
const JWT_SECRET_SUPER_ADMIN = process.env.JWT_SECRET_SUPER_ADMIN;

if (!JWT_SECRET_ADMIN) {
  throw new Error("❌ متغیر JWT_SECRET_ADMIN در فایل .env تعریف نشده است!");
}
if (!JWT_SECRET_SUPER_ADMIN) {
  throw new Error(
    "❌ متغیر JWT_SECRET_SUPER_ADMIN در فایل .env تعریف نشده است!",
  );
}

// ============================================================
//  4. میدلور authorizeAdmin (با قابلیت تعیین نقش مورد نیاز)
// ============================================================

/**
 * میدلور احراز هویت و بررسی دسترسی ادمین/سوپر ادمین
 * @param requiredRole - نقش مورد نیاز برای این مسیر. پیش‌فرض: 'ADMIN'
 */
export const authorizeAdmin = (requiredRole: AdminRole = "ADMIN") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // ۱. استخراج توکن (از کوکی یا هدر)
    let token = req.cookies?.accessToken;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        status: "error",
        message: "توکن ادمین موجود نیست",
      });
      return;
    }

    try {
      // ۲. اعتبارسنجی توکن
      const decoded = jwt.verify(token, JWT_SECRET_ADMIN!) as AdminJwtPayload;

      // ۳. ذخیره اطلاعات در req.admin
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
      if (userRole === "SUPER_ADMIN") {
        return next();
      }

      // حالت دوم: اگر ادمین معمولی است
      if (userRole === "ADMIN") {
        // چک می‌کنیم که آیا این مسیر مخصوص سوپر ادمین بوده یا نه
        if (requiredRole === "SUPER_ADMIN") {
          res.status(403).json({
            status: "error",
            message: "دسترسی غیرمجاز. این بخش فقط مخصوص سوپر ادمین است.",
          });
          return;
        }
        // اگر مسیر مخصوص ادمین معمولی بوده، اجازه عبور دارد
        return next();
      }

      // حالت سوم: اگر نقش اصلا شناخته شده نبود (برای امنیت بیشتر)
      res.status(403).json({
        status: "error",
        message: "نقش کاربری در توکن ادمین نامعتبر است.",
      });
    } catch (err: any) {
      console.error("❌ JWT Admin verify error:", err.message);
      res.status(403).json({
        status: "error",
        message: "توکن ادمین نامعتبر یا منقضی شده",
      });
    }
  };
};

// ============================================================
//  5. میدلور authAdmin (سازگار با هر دو سکرت)
// ============================================================

/**
 * =====  Middleware authAdmin =====
 * - توکن را از کوکی (accessToken) یا هدر Authorization استخراج می‌کند.
 * - ابتدا با JWT_SECRET_ADMIN و در صورت خطا با JWT_SECRET_SUPER_ADMIN اعتبارسنجی می‌کند.
 * - در صورت موفقیت، نقش کاربر را بررسی می‌کند که حتماً 'ADMIN' یا 'SUPER_ADMIN' باشد.
 * - اطلاعات کاربر را در req.user قرار داده و next() را صدا می‌زند.
 * - در غیر این صورت پاسخ ۴۰۱ یا ۴۰۳ برمی‌گرداند.
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

  // ۲. ابتدا با سکرت ادمین عادی امتحان کن
  jwt.verify(
    token,
    JWT_SECRET_ADMIN!,
    (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        // اگر خطا خورد، با سکرت سوپرادمین امتحان کن
        jwt.verify(
          token,
          JWT_SECRET_SUPER_ADMIN!,
          (err2: VerifyErrors | null, decoded2: any) => {
            if (err2 || !decoded2) {
              res.status(403).json({
                message: "توکن نامعتبر یا منقضی شده است",
                error: "Forbidden",
                statusCode: 403,
              });
              return;
            }

            const user = decoded2 as AuthAdminJwtPayload;
            // نقش باید SUPER_ADMIN باشد (حروف بزرگ)
            if (user.role !== "SUPER_ADMIN") {
              res.status(403).json({
                message:
                  "دسترسی غیرمجاز. فقط ادمین‌ها می‌توانند به این بخش دسترسی داشته باشند.",
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

      const user = decoded as AuthAdminJwtPayload;
      // نقش باید ADMIN باشد (حروف بزرگ)
      if (user.role !== "ADMIN") {
        res.status(403).json({
          message:
            "دسترسی غیرمجاز. فقط ادمین‌ها می‌توانند به این بخش دسترسی داشته باشند.",
          error: "Forbidden",
          statusCode: 403,
        });
        return;
      }

      req.user = user;
      next();
    },
  );
};

// ============================================================
//  6. نام‌های مستعار برای سازگاری با کدهای قدیمی
// ============================================================

export const isAdmin = authAdmin;
