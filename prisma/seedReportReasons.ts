// prisma/seedReportReasons.ts
import prisma from "../src/config/prisma";
import bcrypt from "bcrypt";

// ===================== دلایل پایه برای چت =====================
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

// ===================== دلایل گزارش =====================
const reasonsData = [
  // عمومی
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

  // کارفرما
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

  // کارجو
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

  // دیجیتال
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

  // چت
  ...chatReasons,
];

// ===================== تابع اصلی Seed =====================
async function seedReportReasons() {
  try {
    console.log("🌱 شروع seed دلایل گزارش...");

    let user = await prisma.user.findFirst();

    if (!user) {
      const hashedPassword = await bcrypt.hash("Default@123", 10);
      user = await prisma.user.create({
        data: {
          name: "سیستم",
          lastName: "پیش‌فرض",
          nationalCode: "0000000000",
          phone: "09120000000",
          password: hashedPassword,
          birthDate: "1370/01/01",
          gender: "male",
          province: "تهران",
          city: "تهران",
          acceptTerms: true,
          role: "USER",
          joinedAt: new Date().toLocaleDateString("fa-IR"),
          email: "system@barchasb.org",
          email_confirmed: true,
          phone_confirmed: true,
          referralCode: "SYSTEM",
        },
      });
      console.log("👤 کاربر پیش‌فرض سیستم ایجاد شد");
    }

    await prisma.reportReason.deleteMany({});
    console.log("🗑️ دلایل قبلی حذف شدند");

    const dataWithAdmin = reasonsData.map((item) => ({
      type: item.type as any, // cast به any برای رفع خطای TypeScript
      key: item.key,
      label: item.label,
      description: item.description,
      order: item.order,
      isActive: true,
      createdById: user.id,
    }));

    const inserted = await prisma.reportReason.createMany({
      data: dataWithAdmin,
      skipDuplicates: true,
    });

    console.log(`✅ ${inserted.count} دلیل گزارش با موفقیت درج شد`);

    const grouped = await prisma.reportReason.groupBy({
      by: ["type"],
      _count: true,
    });
    console.log("📊 خلاصه بر اساس نوع:");
    grouped.forEach((g) => {
      console.log(`   - ${g.type}: ${g._count} دلیل`);
    });

    console.log("✅ عملیات seed با موفقیت کامل شد");
  } catch (err) {
    console.error("❌ خطا در seed کردن دلایل گزارش:", err);
    process.exit(1);
  }
}

seedReportReasons()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

export default seedReportReasons;
