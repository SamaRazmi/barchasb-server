import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// S3 client
const s3 = new S3Client({
  endpoint: process.env.LIARA_ENDPOINT,
  region: "default",
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
});

// GET /api/profile?userId=...
export const getProfile = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ msg: "شناسه کاربر ارسال نشده" });

    const user = await User.findById(userId).select(
      "name lastName username phone email birthDate province city email_confirmed phone_confirmed nationalCode",
    );

    if (!user) return res.status(404).json({ msg: "کاربر پیدا نشد" });

    let profile = await UserProfile.findOne({ user: userId });
    if (!profile) profile = await UserProfile.create({ user: userId });

    res.status(200).json({ msg: "ok", user, profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "خطای سرور" });
  }
};

// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
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

      const safeUserData = {};
      allowedUserFields.forEach((field) => {
        // فقط فیلدهای تعریف شده و غیر خالی را اضافه کن
        if (userData[field] !== undefined && userData[field] !== "") {
          safeUserData[field] = userData[field];
        }
      });

      // فقط اگر فیلدی برای آپدیت وجود داشت اجرا شود
      if (Object.keys(safeUserData).length > 0) {
        console.log("safeUserData for update:", safeUserData);
        try {
          updatedUser = await User.findByIdAndUpdate(userId, safeUserData, {
            new: true,
            runValidators: true,
          });
        } catch (error) {
          // بررسی یکتا بودن username
          if (error.code === 11000 && error.keyPattern?.username) {
            return res.status(400).json({ msg: "نام کاربری تکراری است" });
          }
          throw error;
        }
      }
    }

    // ================= UPDATE PROFILE =================
    if (profileData) {
      updatedProfile = await UserProfile.findOneAndUpdate(
        { user: userId },
        profileData,
        { new: true, upsert: true },
      );
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
export const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ msg: "شناسه کاربر ارسال نشده" });
    if (!req.file || !req.file.location)
      return res.status(400).json({ msg: "عکس ارسال نشده است" });

    const profile = await UserProfile.findOne({ user: userId });

    if (profile && profile.profileImage) {
      try {
        const key = profile.profileImage.split("/").slice(-2).join("/");
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: key,
          }),
        );
        console.log("عکس قبلی حذف شد:", key);
      } catch (err) {
        console.error("خطا در حذف عکس قبلی:", err);
      }
    }

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { profileImage: req.file.location },
      { new: true, upsert: true },
    );

    res
      .status(200)
      .json({ msg: "عکس پروفایل با موفقیت آپلود شد", profile: updatedProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "خطا در سرور" });
  }
};
