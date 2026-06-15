const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });

if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL در فایل .env تعریف نشده است.");
  process.exit(1);
}

const { connectDB } = require("../db");
const ReportReason = require("../models/ReportReason");

// ===================== دلایل پایه برای چت (مشترک بین انواع آگهی) =====================
const baseChatReasons = [
  {
    key: "harassment",
    label: "مزاحمت",
    description: "پیام‌های مکرر، توهین، تهدید یا ایجاد وحشت",
    order: 1,
  },
  {
    key: "advertising",
    label: "تبلیغات و اسپم",
    description: "لینک تبلیغاتی، دعوت به کانال دیگر بدون درخواست",
    order: 2,
  },
  {
    key: "personal_info",
    label: "درخواست اطلاعات شخصی",
    description: "درخواست شماره تماس، کارت بانکی، رمز یا عکس خصوصی",
    order: 3,
  },
  {
    key: "fraud",
    label: "کلاهبرداری در چت",
    description:
      "پیشنهاد مالی فریبنده، طرح هرمی یا واریز وجه برای شرکت در مسابقه",
    order: 4,
  },
  {
    key: "impersonate",
    label: "جعل هویت",
    description: "وانمود به ادمین، پشتیبان یا شخص دیگر",
    order: 5,
  },
];

// ===================== تولید دلایل چت برای انواع مورد نیاز =====================
const chatReasons = [
  ...baseChatReasons.map((item) => ({ ...item, type: "chat_employerAd" })),
  ...baseChatReasons.map((item) => ({ ...item, type: "chat_jobSeekerAd" })),
  ...baseChatReasons.map((item) => ({ ...item, type: "chat_DigitalAd" })),
];

// ===================== دلایل گزارش (عمومی + آگهی‌ها) =====================
const reasonsData = [
  // ---------- دسته عمومی ----------
  {
    type: "general",
    key: "harassment",
    label: "مزاحمت و آزار",
    description: "پیام‌های توهین‌آمیز، ناسزا، تهدید یا ایجاد مزاحمت تکراری",
    order: 1,
  },
  {
    type: "general",
    key: "fraud",
    label: "کلاهبرداری",
    description: "درخواست پول یا اطلاعات کارت بانکی خارج از پلتفرم، فریب مالی",
    order: 2,
  },
  {
    type: "general",
    key: "inappropriate",
    label: "محتوای نامناسب",
    description: "عکس یا متن مستهجن، توهین به مقدسات، خشونت یا نفرت‌پراکنی",
    order: 3,
  },
  {
    type: "general",
    key: "illegal",
    label: "خدمات غیرقانونی",
    description: "هک، فیشینگ، تولید بدافزار، هر فعالیت خلاف قانون",
    order: 4,
  },
  {
    type: "general",
    key: "privacy",
    label: "نشر اطلاعات شخصی دیگران",
    description: "انتشار شماره تماس، آدرس، عکس خصوصی یا مدارک بدون رضایت",
    order: 5,
  },
  {
    type: "general",
    key: "spam",
    label: "هرزنامه و تبلیغات مزاحم",
    description: "پیام‌های تکراری، لینک‌های تبلیغاتی بی‌ربط",
    order: 6,
  },
  {
    type: "general",
    key: "wrong_category",
    label: "دسته‌بندی اشتباه",
    description: "آگهی در دسته‌بندی نامناسب منتشر شده است",
    order: 7,
  },
  {
    type: "general",
    key: "fake_id",
    label: "هویت جعلی",
    description:
      "استفاده از نام، لوگو یا اطلاعات جعلی، جعل هویت افراد یا برندها",
    order: 8,
  },
  {
    type: "general",
    key: "external_link",
    label: "تلاش برای خروج از پلتفرم",
    description:
      "درخواست برای ادامه معامله در شبکه‌های اجتماعی یا خارج از سایت",
    order: 9,
  },

  // ---------- آگهی کارفرما (Employer) ----------
  {
    type: "employerAd",
    key: "fake_project",
    label: "پروژه جعلی",
    description: "درخواست انجام پروژه بدون قصد پرداخت یا تست رایگان فریبنده",
    order: 1,
  },
  {
    type: "employerAd",
    key: "unclear_scope",
    label: "شرایط پروژه مبهم",
    description:
      "توضیحات پروژه بسیار کلی، تغییر مداوم خواسته‌ها یا بدون خروجی مشخص",
    order: 2,
  },
  {
    type: "employerAd",
    key: "unpaid_test",
    label: "درخواست کار رایگان به اسم تست",
    description: "خواستن کار حرفه‌ای بدون پرداخت به عنوان نمونه",
    order: 3,
  },
  {
    type: "employerAd",
    key: "low_budget_unreal",
    label: "بودجه غیرواقعی",
    description: "پیشنهاد بودجه بسیار پایین‌تر از نرخ استاندارد پروژه",
    order: 4,
  },
  {
    type: "employerAd",
    key: "no_contract",
    label: "امتناع از قرارداد شفاف",
    description: "کارفرما از نوشتن توافقات اولیه یا تعهد تحویل خودداری می‌کند",
    order: 5,
  },

  // ---------- آگهی کارجو (فریلنسر) ----------
  {
    type: "jobSeekerAd",
    key: "fake_portfolio",
    label: "نمونه‌کار جعلی",
    description: "ارائه نمونه‌کارهای غیرواقعی یا متعلق به دیگران",
    order: 1,
  },
  {
    type: "jobSeekerAd",
    key: "delay_delivery",
    label: "تأخیر مکرر در تحویل",
    description: "عدم تحویل پروژه در زمان توافق شده بدون دلیل موجه",
    order: 2,
  },
  {
    type: "jobSeekerAd",
    key: "poor_quality",
    label: "کیفیت بسیار پایین",
    description: "تحویل خروجی غیرحرفه‌ای، ناقص یا بدون استاندارد",
    order: 3,
  },
  {
    type: "jobSeekerAd",
    key: "abandon_project",
    label: "رها کردن پروژه",
    description: "ناگهان پاسخگو نبودن و پروژه را نیمه‌کاره رها کردن",
    order: 4,
  },
  {
    type: "jobSeekerAd",
    key: "extra_cost",
    label: "درخواست مبلغ اضافه بدون دلیل",
    description: "بعد از توافق اولیه، مدام درخواست هزینه بیشتر می‌کند",
    order: 5,
  },

  // ---------- آگهی دیجیتال (DigitalAd) – مثل طراحی سایت، برنامه‌نویسی و ... ----------
  // دلایل کاملاً کلی و بدون مسائل فنی خاص
  {
    type: "DigitalAd",
    key: "fake_service",
    label: "خدمات جعلی",
    description:
      "ادعای ارائه خدمتی که قادر به انجام آن نیست یا اصلاً وجود ندارد",
    order: 1,
  },
  {
    type: "DigitalAd",
    key: "misleading_description",
    label: "توضیحات گمراه‌کننده",
    description: "مهارت‌ها، نمونه‌کارها یا خروجی پروژه با واقعیت همخوانی ندارد",
    order: 2,
  },
  {
    type: "DigitalAd",
    key: "no_delivery",
    label: "عدم تحویل پروژه",
    description: "پس از دریافت وجه یا توافق، هیچ خروجی تحویل نمی‌دهد",
    order: 3,
  },
  {
    type: "DigitalAd",
    key: "illegal_service",
    label: "خدمات غیرقانونی",
    description: "ارائه خدمات خلاف قانون (مثل هک، اسپم، فیشینگ)",
    order: 4,
  },
  {
    type: "DigitalAd",
    key: "external_deal",
    label: "تلاش برای خروج از پلتفرم",
    description: "درخواست برای ادامه کار در شبکه‌های اجتماعی یا خارج از سایت",
    order: 5,
  },

  // ---------- دلایل چت (برای انواع انتخابی) ----------
  ...chatReasons,
];

// ===================== تابع اصلی Seed =====================
const seedReportReasons = async () => {
  try {
    await connectDB();
    await ReportReason.deleteMany({});
    console.log("🗑️ دلایل قبلی حذف شدند");

    const inserted = await ReportReason.insertMany(reasonsData);
    console.log(`✅ ${inserted.length} دلیل گزارش با موفقیت درج شد`);

    const grouped = {};
    inserted.forEach((r) => {
      if (!grouped[r.type]) grouped[r.type] = 0;
      grouped[r.type]++;
    });
    console.log("📊 خلاصه بر اساس نوع:");
    Object.entries(grouped).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count} دلیل`);
    });

    console.log("✅ عملیات seed با موفقیت کامل شد");
    process.exit(0);
  } catch (err) {
    console.error("❌ خطا در seed کردن دلایل گزارش:", err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedReportReasons();
}

module.exports = seedReportReasons;
