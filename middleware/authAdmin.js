const jwt = require("jsonwebtoken");

/**
 * میدلور isAdmin:
 * - توکن را از هدر Authorization استخراج می‌کند (فرمت: Bearer <token>)
 * - با استفاده از JWT_SECRET_ADMIN صحت توکن را بررسی می‌کند
 * - نقش (role) کاربر را چک می‌کند که حتماً "admin" باشد
 * - در صورت موفقیت، اطلاعات کاربر (payload) را در req.user قرار می‌دهد
 * - در غیر این صورت خطای 401 یا 403 برمی‌گرداند
 */
const isAdmin = (req, res, next) => {
  // استخراج توکن از هدر Authorization
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "توکن ارائه نشده است" });
  }

  // اعتبارسنجی توکن با کلید مخفی JWT_SECRET_ADMIN
  jwt.verify(token, process.env.JWT_SECRET_ADMIN, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "توکن نامعتبر یا منقضی شده است" });
    }

    // بررسی نقش ادمین
    if (user.role !== "admin") {
      return res.status(403).json({ error: "دسترسی غیرمجاز. فقط ادمین می‌تواند به این بخش دسترسی داشته باشد." });
    }

    // ذخیره اطلاعات کاربر در req برای استفاده در کنترلرها
    req.user = user;
    next();
  });
};

module.exports = { isAdmin };