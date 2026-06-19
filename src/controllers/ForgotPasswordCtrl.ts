import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res
        .status(400)
        .json({ success: false, msg: "توکن و رمز جدید الزامی است" });
    }

    if (newPassword.length < 5) {
      return res
        .status(400)
        .json({ success: false, msg: "رمز عبور باید حداقل 5 کاراکتر باشد" });
    }

    // verify reset token
    let decoded: any;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET as string);
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, msg: "توکن نامعتبر یا منقضی شده است" });
    }

    const { phone } = decoded;
    if (!phone) {
      return res
        .status(400)
        .json({ success: false, msg: "توکن فاقد شماره تلفن است" });
    }

    // هش کردن رمز جدید
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await prisma.user.update({
      where: { phone },
      data: { password: hashedPassword },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "کاربری با این شماره یافت نشد" });
    }

    res
      .status(200)
      .json({ success: true, msg: "رمز عبور با موفقیت تغییر کرد" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "خطا در سرور" });
  }
};

// =================== export default ===================
const ForgotPasswordCtrl = {
  resetPassword,
};

export default ForgotPasswordCtrl;
