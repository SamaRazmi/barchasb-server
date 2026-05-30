const OtpService = require("../services/OtpService");

// ارسال OTP
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ msg: "شماره موبایل الزامی است" });

    const result = await OtpService.sendOTP(phone);
    res.status(200).json({ msg: result.msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

// تایید OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code)
      return res.status(400).json({ msg: "شماره و کد الزامی است" });

    const result = await OtpService.verifyOTP(phone, code);
    if (!result.success) return res.status(400).json({ msg: result.msg });

    res.status(200).json({ msg: result.msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
