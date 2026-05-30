const express = require("express");
const { fileUpload } = require("../middleware/upload.js");
const {
  uploadSingleFile,
  uploadMultipleFiles,
} = require("../controllers/UploadFileCtrl.js");

const router = express.Router();

// آپلود یک فایل PDF/Word
router.post("/upload/file", fileUpload.single("file"), uploadSingleFile);

// آپلود چند فایل PDF/Word
router.post("/upload/files", fileUpload.array("files", 5), uploadMultipleFiles);

module.exports = router;
