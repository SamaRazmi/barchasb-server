// src/controllers/UserProfileCtrl.ts (اصلاح شده با منطق مشابه MongoDB)
import { Request, Response } from "express";
import prisma from "../config/prisma";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// S3 client
const s3 = new S3Client({
  endpoint: process.env.LIARA_ENDPOINT!,
  region: "default",
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY!,
    secretAccessKey: process.env.LIARA_SECRET_KEY!,
  },
});

// GET /api/profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    let userId = req.query.userId as string;
    if (!userId) {
      userId = (req as any).user?.id;
    }
    if (!userId) {
      return res.status(400).json({ msg: "شناسه کاربر ارسال نشده" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        phone: true,
        email: true,
        birthDate: true,
        province: true,
        city: true,
        email_confirmed: true,
        phone_confirmed: true,
        nationalCode: true,
      },
    });

    if (!user) return res.status(404).json({ msg: "کاربر پیدا نشد" });

    let profile = await prisma.userProfile.findUnique({
      where: { user: userId },
    });

    if (!profile) {
      profile = await prisma.userProfile.create({
        data: { user: userId },
      });
    }

    res.status(200).json({ msg: "ok", user, profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "خطای سرور" });
  }
};

// PUT /api/profile (با منطق مشابه MongoDB)
export const updateProfile = async (req: Request, res: Response) => {
  try {
    // ===== دریافت userId (اولویت با توکن، سپس body) =====
    let userId = (req as any).user?.id || req.body.userId;
    if (!userId) {
      return res.status(400).json({ msg: "شناسه کاربر ارسال نشده" });
    }

    // ===== بررسی وجود کاربر =====
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return res.status(404).json({ msg: "کاربر پیدا نشد" });
    }

    const { user: userData, profile: profileData } = req.body;

    let updatedUser = null;
    let updatedProfile = null;

    // ================= UPDATE USER =================
    if (userData) {
      const allowedUserFields = [
        "name",
        "lastName",
        "username",
        "phone",
        "email",
        "birthDate",
        "province",
        "city",
      ];

      const safeUserData: any = {};
      allowedUserFields.forEach((field) => {
        // ✅ فقط فیلدهایی که تعریف شده و مقدار غیر خالی دارند را اضافه کن (مشابه MongoDB)
        if (userData[field] !== undefined && userData[field] !== "") {
          safeUserData[field] = userData[field];
        }
      });

      if (Object.keys(safeUserData).length > 0) {
        console.log("safeUserData for update:", safeUserData);
        try {
          updatedUser = await prisma.user.update({
            where: { id: userId },
            data: safeUserData,
          });
        } catch (error: any) {
          // ===== مدیریت خطای یکتایی (مشابه MongoDB) =====
          if (error.code === "P2002") {
            const target = error.meta?.target;
            let fieldName = "مقدار وارد شده";
            const fields = Array.isArray(target)
              ? target
              : target
                ? [target]
                : [];
            if (fields.includes("username")) fieldName = "نام کاربری";
            else if (fields.includes("phone")) fieldName = "شماره تلفن";
            else if (fields.includes("email")) fieldName = "ایمیل";
            else if (fields.includes("nationalCode")) fieldName = "کد ملی";

            return res.status(400).json({
              msg: `${fieldName} قبلاً توسط کاربر دیگری ثبت شده است`,
              field: fields.length > 0 ? fields[0] : "unknown",
            });
          }
          throw error;
        }
      }
    }

    // ================= UPDATE PROFILE =================
    if (profileData) {
      const allowedProfileFields = [
        "address",
        "educationLevel",
        "aboutMe",
        "interests",
        "skills",
        "resumeFile",
        "portfolioFiles",
        "documents",
      ];
      const safeProfileData: any = {};
      allowedProfileFields.forEach((field) => {
        // فقط فیلدهای تعریف شده و غیر خالی را اضافه کن
        if (profileData[field] !== undefined && profileData[field] !== "") {
          safeProfileData[field] = profileData[field];
        }
      });

      if (Object.keys(safeProfileData).length > 0) {
        updatedProfile = await prisma.userProfile.upsert({
          where: { user: userId },
          update: safeProfileData,
          create: { user: userId, ...safeProfileData },
        });
      }
    }

    res.status(200).json({
      msg: "پروفایل با موفقیت بروزرسانی شد",
      user: updatedUser,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "خطای سرور" });
  }
};

// POST /api/profile/upload-photo
export const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    let userId = (req as any).user?.id || req.body.userId;
    if (!userId) {
      return res.status(400).json({ msg: "شناسه کاربر ارسال نشده" });
    }

    if (!req.file || !(req.file as any).location) {
      return res.status(400).json({ msg: "عکس ارسال نشده است" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return res.status(404).json({ msg: "کاربر پیدا نشد" });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { user: userId },
    });

    if (profile && profile.profileImage) {
      try {
        const key = profile.profileImage.split("/").slice(-2).join("/");
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.LIARA_BUCKET_NAME!,
            Key: key,
          }),
        );
        console.log("عکس قبلی حذف شد:", key);
      } catch (err) {
        console.error("خطا در حذف عکس قبلی:", err);
      }
    }

    const updatedProfile = await prisma.userProfile.upsert({
      where: { user: userId },
      update: { profileImage: (req.file as any).location },
      create: { user: userId, profileImage: (req.file as any).location },
    });

    res.status(200).json({
      msg: "عکس پروفایل با موفقیت آپلود شد",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "خطا در سرور" });
  }
};
