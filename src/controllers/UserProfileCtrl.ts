// src/controllers/UserProfileCtrl.ts
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

// GET /api/profile?userId=...
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ msg: "شناسه کاربر ارسال نشده" });

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

// PUT /api/profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId as string;
    if (!userId) return res.status(400).json({ msg: "شناسه کاربر ارسال نشده" });

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
          if (error.code === "P2002" && error.meta?.target?.includes("username")) {
            return res.status(400).json({ msg: "نام کاربری تکراری است" });
          }
          throw error;
        }
      }
    }

    // ================= UPDATE PROFILE =================
    if (profileData) {
      updatedProfile = await prisma.userProfile.upsert({
        where: { user: userId },
        update: profileData,
        create: { user: userId, ...profileData },
      });
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
    const userId = req.body.userId as string;
    if (!userId) return res.status(400).json({ msg: "شناسه کاربر ارسال نشده" });
    if (!req.file || !(req.file as any).location)
      return res.status(400).json({ msg: "عکس ارسال نشده است" });

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
          })
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