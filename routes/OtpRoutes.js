const router = require("express").Router();
const { sendOTP, verifyOTP } = require("../controllers/OtpCtrl");

router.post("/otp/send", sendOTP);
router.post("/otp/verify", verifyOTP);

module.exports = router;
