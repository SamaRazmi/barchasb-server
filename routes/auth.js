// routes/auth.js یا فایل اصلی route ها
const express = require("express");
const router = express.Router();

// POST /api/logout
router.post("/logout", (req, res) => {
  // پاک کردن کوکی accessToken
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.status(200).json({ message: "خروج با موفقیت انجام شد" });
});

module.exports = router;
