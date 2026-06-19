// src/controllers/OtpCtrl.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import OtpService from "../services/OtpService";
import prisma from "../config/prisma";

// ارسال OTP
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone, purpose = "default" } = req.body;
    if (!phone) return res.status(400).json({ msg: "شماره موبایل الزامی است" });

    // برای فراموشی رمز، بررسی وجود کاربر
    if (purpose === "reset") {
      const user = await prisma.user.findUnique({
        where: { phone },
      });
      if (!user) {
        return res.status(404).json({ msg: "کاربری با این شماره یافت نشد" });
      }
    }

    const result = await OtpService.sendOTP(phone, purpose);
    res.status(200).json({ msg: result.msg });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

// تایید OTP
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, code, purpose = "default" } = req.body;
    if (!phone || !code)
      return res.status(400).json({ msg: "شماره و کد الزامی است" });

    const result = await OtpService.verifyOTP(phone, code, purpose);
    if (!result.success) return res.status(400).json({ msg: result.msg });

    const response: any = { msg: result.msg };

    // فقط برای فراموشی رمز (purpose == "reset") توکن صادر کن
    if (purpose === "reset") {
      const resetToken = jwt.sign(
        { phone, purpose: "reset" },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" },
      );
      response.resetToken = resetToken;
    }

    res.status(200).json(response);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

// =================== export default ===================
const OtpCtrl = {
  sendOTP,
  verifyOTP,
};

export default OtpCtrl;