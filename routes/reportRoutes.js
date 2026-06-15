const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { authenticateUser } = require("../middleware/authMidleware");

// تابع کمکی برای تنظیم req.body
const setReportData = (reportType) => (req, res, next) => {
  req.body.targetId = req.params.targetId;
  req.body.reportType = reportType;
  next();
};

router.post(
  "/employer/report/:targetId",
  authenticateUser,
  setReportData("employerAd"),
  reportController.createReport,
);
router.post(
  "/job-seeker/report/:targetId",
  authenticateUser,
  setReportData("jobSeekerAd"),
  reportController.createReport,
);
router.post(
  "/seller/report/:targetId",
  authenticateUser,
  setReportData("sellerAd"),
  reportController.createReport,
);
router.post(
  "/digital/report/:targetId",
  authenticateUser,
  setReportData("DigitalAd"),
  reportController.createReport,
);
router.post(
  "/chat/report/:targetId",
  authenticateUser,
  setReportData("chat"),
  reportController.createReport,
);

module.exports = router;
