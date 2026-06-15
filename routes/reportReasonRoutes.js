const express = require("express");
const router = express.Router();
const reportReasonController = require("../controllers/reportReasonCtrl");
const { isAdmin } = require("../middleware/authAdmin");

router.get("/report-reasons", reportReasonController.getReportReasons);
router.post(
  "/admin/report-reasons",
  isAdmin,
  reportReasonController.createReportReason,
);
router.put(
  "/admin/report-reasons/:id",
  isAdmin,
  reportReasonController.updateReportReason,
);
router.delete(
  "/admin/report-reasons/:id",
  isAdmin,
  reportReasonController.deleteReportReason,
);

module.exports = router;
