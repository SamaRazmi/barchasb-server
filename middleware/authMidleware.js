const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
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
    return res
      .status(401)
      .json({ status: "error", message: "توکن موجود نیست" });
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
  } catch (err) {
    console.error("❌ JWT verify error:", err.message);
    // برای دیباگ، خطای کامل را برگردانید (در تولید این خط را حذف کنید)
    return res.status(403).json({
      status: "error",
      message: "توکن نامعتبر یا منقضی شده",
      error: err.message,
    });
  }
};

module.exports = authenticateToken;
