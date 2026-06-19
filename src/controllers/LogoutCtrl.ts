// src/controllers/LogoutCtrl.ts
import { Request, Response } from "express";

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
      path: "/",
    };

    // پاک کردن کوکی
    res.clearCookie("accessToken", cookieOptions);

    // یک کوکی خالی هم بفرست برای اطمینان
    res.cookie("accessToken", "", {
      ...cookieOptions,
      expires: new Date(0),
      maxAge: 0,
    });

    return res.status(200).json({ message: "خروج با موفقیت انجام شد" });
  } catch (error: any) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ message: "خطا در خروج", error: error.message });
  }
};

// =================== export default ===================
const LogoutCtrl = {
  logoutUser,
};

export default LogoutCtrl;
