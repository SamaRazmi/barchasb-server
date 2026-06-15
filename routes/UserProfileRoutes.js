const express = require("express");
const router = express.Router();

const UserProfileCtrl = require("../controllers/UserProfileCtrl");
const { imagesUpload } = require("../middleware/upload"); // middleware آپلود فایل

// دریافت پروفایل
router.get("/profile", UserProfileCtrl.getProfile); // ✅ userId از query

// بروزرسانی پروفایل
router.put("/profile", UserProfileCtrl.updateProfile); // body شامل userId + داده‌ها

// آپلود عکس پروفایل
router.post(
  "/profile/upload-photo",
  imagesUpload.single("profileImage"),
  UserProfileCtrl.uploadProfilePhoto,
);

module.exports = router;
