const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/ResumeCtrl');

// Multer settings
const multer = require('multer');
// const upload = multer({ storage: multer.memoryStorage() });
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('فقط فایل‌های PDF مجاز هستند.'), false);
    }
  },
  limits: { fileSize: 15 * 1024 * 1024 }
});


// update or create resume
/**
 * @swagger
 * /api/resume/data:
 *   post:
 *     summary: create or update textual info of resume
 *     tags: [Resume]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               resumeId:
 *                 type: string
 *                 description: send just in update case
 *               fullName:
 *                 type: string
 *                 description: نام و نام خانوادگی
 *               phoneNumber:
 *                 type: string
 *                 description: شماره تماس
 *               birthDate:
 *                 type: string
 *                 description: تاریخ تولد
 *               gender:
 *                 type: string
 *                 description: جنسیت
 *               maritalStatus:
 *                 type: string
 *                 description: وضعیت تأهل
 *               address:
 *                 type: string
 *                 description: آدرس محل سکونت
 *               expectedSalary:
 *                 type: string
 *                 description: حقوق درخواستی
 *               cooperationType:
 *                 type: string
 *                 description: نحوه همکاری
 *               hasInsuranceHistory:
 *                 type: boolean
 *                 description: سابقه بیمه
 *               willingToGoOnMission:
 *                 type: boolean
 *                 description: رضایت به انجام ماموریت
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: لیست مهارت‌ها
 *               education:
 *                 type: array
 *                 description: سوابق تحصیلی
 *                 items:
 *                   type: object
 *                   properties:
 *                     major:
 *                       type: string
 *                       description: رشته تحصیلی
 *                     university:
 *                       type: string
 *                       description: دانشگاه
 *                     gpa:
 *                       type: string
 *                       description: معدل
 *               workExperience:
 *                 type: array
 *                 description: سوابق شغلی
 *                 items:
 *                   type: object
 *                   properties:
 *                     jobTitle:
 *                       type: string
 *                       description: عنوان شغلی
 *                     companyName:
 *                       type: string
 *                       description: نام سازمان/شرکت
 *                     duration:
 *                       type: string
 *                       description: مدت زمان سابقه
 *               certificates:
 *                 type: array
 *                 description: گواهینامه‌ها
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: عنوان گواهینامه
 *                     provider:
 *                       type: string
 *                       description: نام ارائه‌دهنده
 *                     date:
 *                       type: string
 *                       description: تاریخ اخذ
 *     responses:
 *       200:
 *         description: resume created or updated successfully
 *       400:
 *         description: data transfer error
 *       403:
 *         description: pass through the limit(2 resume 3 times edith)
 *       404:
 *         description: resume not found
 */
router.post('/data', resumeController.saveResumeData);

// Get inside resume data
/**
 * @swagger
 * /api/resume/data/{id}:
 *   get:
 *     summary: Get textual info of resume
 *     tags: [Resume]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: resume info
 */
router.get('/data/:id', resumeController.getResumeData);

/**
 * @swagger
 * /api/resume/upload/{resumeId}:
 *   post:
 *     summary: upload PDF file of resume
 *     tags: [Resume]
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resumeFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: file saved and uploaded successfully
 */
router.post('/upload/:resumeId', upload.single('resumeFile'), resumeController.uploadResumeFile);

// Get resume Url
/**
 * @swagger
 * /api/resume/preview/{id}:
 *   get:
 *     summary: Get url file of resume
 *     tags: [Resume]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: file link 
 */
router.get('/preview/:id', resumeController.getResumeUrl);

module.exports = router;
