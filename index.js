import express from "express";
import { avatarUpload, fileUpload } from "./middleware/uploadMiddleware.js";

const app = express();

// --- Route تست آپلود عکس ---
app.post("/test-avatar", (req, res) => {
  avatarUpload.single("avatar")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res
        .status(500)
        .json({ message: "Upload failed", error: err.message });
    }
    res.json({
      message: "Avatar uploaded successfully! 🎉",
      file: req.file,
    });
  });
});

// --- Route تست آپلود فایل ---
app.post("/test-file", (req, res) => {
  fileUpload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res
        .status(500)
        .json({ message: "Upload failed", error: err.message });
    }
    res.json({
      message: "File uploaded successfully! 🎉",
      file: req.file,
    });
  });
});

// --- Route تست ساده برای اطمینان ---
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// اجرا روی پورت 3000
app.listen(3000, () => console.log("🚀 Server on: http://localhost:3000"));
