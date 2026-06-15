const Resume = require('../models/Resume');
const dateFormatter = require("../utils/dateFormatter");

// liara S3
const { uploadToLiara } = require('../utils/s3Upload');

exports.getResumeData = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) return res.status(404).json({ message: 'رزومه یافت نشد' });
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت رزومه' });
  }
};

exports.saveResumeData = async (req, res) => {
  try {
    const { resumeId, ...resumeData } = req.body;

    const userId = req.user.id ; 

    if (!userId) {
      return res.status(400).json({ message: "آیدی کاربر در توکن یافت نشد." });
    }

    if (resumeId) {
      const existingResume = await Resume.findById(resumeId);
      if (!existingResume) return res.status(404).json({ message: "رزومه یافت نشد." });
      
      if (existingResume.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: "شما اجازه ویرایش این رزومه را ندارید." });
      }

      if (existingResume.updateCount >= 3) {
        return res.status(403).json({ message: "محدودیت ویرایش (حداکثر ۳ بار) به پایان رسیده است." });
      }
      const updatedResume = await Resume.findByIdAndUpdate(
        resumeId,
        { 
          $set: { ...resumeData }, 
          $inc: { updateCount: 1 } 
        },
        { new: true }
      );

      return res.status(200).json({ message: "رزومه آپدیت شد." });
    } else {
      // منطق ساخت رزومه جدید
      // const userResumesCount = await Resume.countDocuments({ userId });
      // if (userResumesCount >= 2) {
      //   return res.status(403).json({ message: "حداکثر می‌توانید ۲ رزومه داشته باشید." });
      // }

      const newResume = new Resume({
        userId,
        ...resumeData
      });

      const savedResume = await newResume.save();
      return res.status(201).json({ 
        message: "رزومه ایجاد شد.", 
        resumeId: savedResume._id 
      });

    }
  } catch (error) {
    console.error("Error saving resume data:", error);
    res.status(500).json({ message: "خطای سرور در ذخیره اطلاعات." });
  }
};

exports.getResumeUrl = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume || !resume.fileUrl) return res.status(404).json({ message: 'فایلی یافت نشد' });
    res.status(200).json({ fileUrl: resume.fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت لینک' });
  }
};


exports.uploadResumeFile = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "فایلی ارسال نشده یا فرمت آن PDF نیست."});
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: "رزومه یافت نشد." });
    }

    const fileUrl = await uploadToLiara(file, resume.userId);
    
    resume.fileUrl = fileUrl;
    await resume.save();

    res.status(200).json({ message: "فایل با موفقیت آپلود شد.", fileUrl });
  } catch (error) {
    console.error("Error uploading resume file:", error);
    if (error.message === 'فقط فایل‌های PDF مجاز هستند.') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "خطای سرور در آپلود فایل." });
  }
};

// USER PROFILE
// ---------------------------------------------------------------
exports.getMyResumes = async (req, res) => {
  try {
    const userId = req.user.id;

    const resumes = await Resume.find({ userId }).select('_id fullName updateCount createdAt updatedAt').lean();

    if (!resumes || resumes.length === 0) {
      return res.status(200).json({ success: true, message: "رزومه‌ای یافت نشد.", resumes: [] });
    }
    const formattedResumes = resumes.map(resume => ({
      ...resume,
      createdAt: dateFormatter.toJalali(resume.createdAt),
      updatedAt: dateFormatter.toJalali(resume.updatedAt)
    }));

    res.status(200).json({ success: true, resumes: formattedResumes });
  } catch (error) {
    console.error("Error getting user resumes:", error);
    res.status(500).json({ success: false, message: "خطای سرور در دریافت لیست رزومه‌ها." });
  }
};

// ADMIN
// -------------------------------------------------------------
exports.getUsersWithResumes = async (req, res) => {
  try {
    const usersData = await Resume.aggregate([
      { $sort: { updatedAt: -1 } },
      {
        $group: {
          _id: "$userId",
          totalResumes: { $sum: 1 },
          lastUserUpdate: { $max: "$updatedAt" },
          resumes: {
            $push: {
              resumeId: "$_id",
              updateCount: "$updateCount",
              updatedAt: "$updatedAt"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          totalResumes: 1,
          lastUserUpdate: 1,
          resumes: 1
        }
      },
      { $sort: { lastUserUpdate: -1 } }
    ]);

    // date formatter
    const formattedData = usersData.map(user => ({
      ...user,
      lastUserUpdate: dateFormatter.toJalali(user.lastUserUpdate),
      resumes: user.resumes.map(resume => ({
        ...resume,
        updatedAt: dateFormatter.toJalali(resume.updatedAt)
      }))
    }));

    res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData
    });

  } catch (error) {
    console.error("Error fetching users with resumes:", error);
    res.status(500).json({ success: false, message: "Error fetching users with resumes." });
  }
};
