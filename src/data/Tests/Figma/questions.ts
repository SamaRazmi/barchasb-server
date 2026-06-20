import prisma from "../../../config/prisma";

const FigmaQuestions = async (typeId: string) => {
  const rawQuestions = [
    // ==========================================
    // A1: Basics (5) & Layers (5)
    // ==========================================
    {
      text: "فیگما (Figma) چیست؟",
      subject: "Basics",
      level: "A1",
      opts: ["ابزار طراحی رابط کاربر و تجربه کاربری تحت وب", "یک ویرایشگر ویدیو", "پایگاه داده عکس", "فریم‌ورک جاوااسکریپت"],
      ans: 0,
    },
    {
      text: "چه ویژگی فیگما را از سایر ابزارها متمایز می‌کند؟",
      subject: "Basics",
      level: "A1",
      opts: ["همکاری همزمان و واقعی (Real-time Collaboration)", "عدم نیاز به اینترنت", "نصب فقط روی لینوکس", "ابزار اختصاصی ویرایش صدا"],
      ans: 0,
    },
    {
      text: "Figma Mirror چه کاربردی دارد؟",
      subject: "Basics",
      level: "A1",
      opts: ["نمایش طراحی روی موبایل برای تست در دستگاه واقعی", "ادیت عکس", "خروجی گرفتن کد", "برعکس کردن لایه‌ها"],
      ans: 0,
    },
    {
      text: "نرم‌افزار FigJam در اکوسیستم فیگما چه وظیفه‌ای دارد؟",
      subject: "Basics",
      level: "A1",
      opts: ["ابزار وایت‌بورد و طوفان فکری تیمی", "پلاگین انیمیشن", "خروجی گرفتن SVG", "مدیریت فونت"],
      ans: 0,
    },
    {
      text: "Vector Network در فیگما چیست؟",
      subject: "Basics",
      level: "A1",
      opts: ["سیستم ترسیم وکتور بدون محدودیت مسیرهای متصل", "یک شبکه اجتماعی طراحان", "فرمت ذخیره‌سازی فایل", "پروژه تحت وب"],
      ans: 0,
    },

    {
      text: "تفاوت اصلی Frame و Group در فیگما چیست؟",
      subject: "Layers",
      level: "A1",
      opts: ["Frame کانتینری با قابلیت گرید و کلیپینگ است، اما Group فقط دسته‌بندی است", "Group قوی‌تر است", "فقط Frame قابلیت حرکت دارد", "تفاوتی ندارند"],
      ans: 0,
    },
    {
      text: "چگونه محتوای اضافی خارج از لبه‌های یک فریم را مخفی می‌کنیم؟",
      subject: "Layers",
      level: "A1",
      opts: ["فعال کردن Clip Content", "حذف لایه", "قفل کردن لایه", "تغییر Opacity"],
      ans: 0,
    },
    {
      text: "کاربرد لایه‌های Mask در فیگما چیست؟",
      subject: "Layers",
      level: "A1",
      opts: ["نمایش بخشی از تصویر از طریق یک لایه پایه", "تغییر رنگ", "قفل کردن المان", "افزودن سایه"],
      ans: 0,
    },
    {
      text: "Boolean Operations در فیگما شامل چه مواردی است؟",
      subject: "Layers",
      level: "A1",
      opts: ["Union, Subtract, Intersect, Exclude", "Copy, Paste, Cut", "Shadow, Blur", "Align, Distribute"],
      ans: 0,
    },
    {
      text: "Smart Selection چه کاربردی دارد؟",
      subject: "Layers",
      level: "A1",
      opts: ["تغییر سریع فاصله و ترتیب المان‌های مشابه", "انتخاب لایه‌های قفل شده", "حذف لایه‌های خالی", "ساخت کامپوننت"],
      ans: 0,
    },

    // ==========================================
    // A2: Auto Layout (5) & Constraints (5)
    // ==========================================

    {
      text: "قابلیت Auto Layout در فیگما چیست؟",
      subject: "AutoLayout",
      level: "A2",
      opts: ["مرتب‌سازی و تغییر اندازه خودکار المان‌ها بر اساس محتوا", "رسم خودکار شکل", "تولید کد CSS", "پیش‌بینی رفتار کاربر"],
      ans: 0,
    },
    {
      text: "در Auto Layout، مفهوم Padding چیست؟",
      subject: "AutoLayout",
      level: "A2",
      opts: ["فاصله بین محتوا و لبه‌های فریم والد", "فاصله بین دو المان", "ضخامت خط دور", "شفافیت"],
      ans: 0,
    },
    {
      text: "Spacing Between در Auto Layout چه کاری انجام می‌دهد؟",
      subject: "AutoLayout",
      level: "A2",
      opts: ["تعیین فاصله ثابت بین المان‌های داخل فریم", "تغییر سایز فونت", "تغییر رنگ", "حذف لایه"],
      ans: 0,
    },
    {
      text: "Nested Auto Layout به چه معناست؟",
      subject: "AutoLayout",
      level: "A2",
      opts: ["قرار دادن یک فریم اتولایه داخل یک اتولایه دیگر", "حذف اتولایه", "پلاگین چیدمان", "اتولایه مخصوص موبایل"],
      ans: 0,
    },
    {
      text: "ویژگی Absolute Position داخل اتولایه چه امکانی می‌دهد؟",
      subject: "AutoLayout",
      level: "A2",
      opts: ["قرار دادن المان در موقعیت دلخواه بدون تاثیر بر چیدمان خودکار", "مرکزگرا کردن لایه", "حذف فاصله", "تبدیل به گروه"],
      ans: 0,
    },

    {
      text: "Constraints در فیگما چه کاربردی دارد؟",
      subject: "Constraints",
      level: "A2",
      opts: ["تعیین نحوه تغییر اندازه المان نسبت به فریم والد", "محدود کردن دسترسی", "تعیین فونت", "حذف لایه"],
      ans: 0,
    },
    {
      text: "اگر بخواهیم المان در مرکز فریم باقی بماند، کدام Constraint لازم است؟",
      subject: "Constraints",
      level: "A2",
      opts: ["Center", "Left", "Scale", "Right"],
      ans: 0,
    },
    {
      text: "تفاوت Scale با Left & Right در Constraints چیست؟",
      subject: "Constraints",
      level: "A2",
      opts: ["Scale نسبت اندازه را حفظ می‌کند، Left & Right فاصله از لبه را ثابت نگه می‌دارد", "فرقی ندارند", "Scale فقط برای عکس است", "Left & Right در اتولایه کار نمی‌کند"],
      ans: 0,
    },
    {
      text: "کدام گزینه باعث می‌شود المان تمام عرض فریم والد را پر کند؟",
      subject: "Constraints",
      level: "A2",
      opts: ["Left & Right", "Top", "Center", "Bottom"],
      ans: 0,
    },
    {
      text: "Constraints چه زمانی عمل می‌کنند؟",
      subject: "Constraints",
      level: "A2",
      opts: ["فقط زمان تغییر سایز فریم والد", "زمان نصب پلاگین", "فقط در پروتوتایپ", "وقتی لایه قفل باشد"],
      ans: 0,
    },

    // ==========================================
    // B1: Components (5) & Properties (5)
    // ==========================================

    {
      text: "Component در فیگما چیست؟",
      subject: "Components",
      level: "B1",
      opts: ["المان قابل استفاده مجدد در طراحی", "فایل تصویری", "گرید ساده", "لایه متنی"],
      ans: 0,
    },
    {
      text: "تفاوت Main Component و Instance چیست؟",
      subject: "Components",
      level: "B1",
      opts: ["تغییر در Main روی تمام Instanceها اعمال می‌شود", "Instance نسخه اصلی است", "فقط Main انیمیشن دارد", "تفاوتی ندارند"],
      ans: 0,
    },
    {
      text: "Component Variants چه کاربردی دارند؟",
      subject: "Components",
      level: "B1",
      opts: ["دسته‌بندی نسخه‌های مختلف یک کامپوننت در یک مجموعه", "جلوگیری از کپی", "تبدیل وکتور به عکس", "تغییر فونت"],
      ans: 0,
    },
    {
      text: "Interactive Components چه مزیتی دارند؟",
      subject: "Components",
      level: "B1",
      opts: ["تعریف تعاملات داخل خود کامپوننت برای کاهش تعداد فریم‌ها", "تغییر رنگ عکس", "اتصال به دیتابیس", "حذف پلاگین"],
      ans: 0,
    },
    {
      text: "چگونه یک Instance را از Main Component جدا می‌کنیم؟",
      subject: "Components",
      level: "B1",
      opts: ["Detach Instance", "حذف Main", "قفل لایه", "کلید Delete"],
      ans: 0,
    },

    {
      text: "Boolean Property در کامپوننت‌ها چه کاری انجام می‌دهد؟",
      subject: "Properties",
      level: "B1",
      opts: ["روشن یا خاموش کردن نمایش یک المان از سایدبار", "تغییر نام لایه", "محاسبه ریاضی", "تغییر فونت"],
      ans: 0,
    },
    {
      text: "Instance Swap Property چه مزیتی دارد؟",
      subject: "Properties",
      level: "B1",
      opts: ["تعویض سریع یک بخش از کامپوننت با المانی دیگر از سایدبار", "تغییر سایز", "انیمیشن", "خروجی SVG"],
      ans: 0,
    },
    {
      text: "Text Property در فیگما چه کاربردی دارد؟",
      subject: "Properties",
      level: "B1",
      opts: ["تغییر متن کامپوننت از پنل تنظیمات بدون ورود به لایه‌ها", "تغییر فونت کل سایت", "اعتبارسنجی فرم", "ترجمه"],
      ans: 0,
    },
    {
      text: "Expose Nested Instances چه امکانی می‌دهد؟",
      subject: "Properties",
      level: "B1",
      opts: ["دسترسی به تنظیمات کامپوننت‌های داخلی از لایه بالاتر", "مخفی کردن لایه", "قفل اینستنس", "تغییر پس‌زمینه"],
      ans: 0,
    },
    {
      text: "Variant Property چیست؟",
      subject: "Properties",
      level: "B1",
      opts: ["ویژگی‌ای که تفاوت بین نسخه‌های یک کامپوننت را مشخص می‌کند", "حذف کامپوننت", "تغییر فریم", "لایه استاتیک"],
      ans: 0,
    },

    // ==========================================
    // B2: Styles (5) & Libraries (5)
    // ==========================================
    {
      text: "Styles در فیگما شامل چه مواردی است؟",
      subject: "Styles",
      level: "B2",
      opts: ["رنگ، متن، افکت و گرید", "فقط تصاویر", "کدها", "پلاگین‌ها"],
      ans: 0,
    },
    {
      text: "مزیت استفاده از Color Styles چیست؟",
      subject: "Styles",
      level: "B2",
      opts: ["تغییر یکجای رنگ در کل پروژه با ویرایش استایل اصلی", "حجم کمتر", "سرعت وب", "فقط چاپ"],
      ans: 0,
    },
    {
      text: "در Text Styles، کدام مورد ذخیره می‌شود؟",
      subject: "Styles",
      level: "B2",
      opts: ["فونت، سایز، وزن و فاصله خطوط", "رنگ متن", "محتوای متنی", "تصویر پس‌زمینه"],
      ans: 0,
    },
    {
      text: "Effect Styles شامل چه افکت‌هایی است؟",
      subject: "Styles",
      level: "B2",
      opts: ["انواع Shadow و Blur", "Opacity", "Color Overlay", "Border Radius"],
      ans: 0,
    },
    {
      text: "چگونه یک استایل محلی را به پروژه دیگر منتقل می‌کنیم؟",
      subject: "Styles",
      level: "B2",
      opts: ["انتشار در Team Library", "کپی پیست ساده", "خروجی PDF", "غیرممکن است"],
      ans: 0,
    },

    {
      text: "Team Library چه کاربردی دارد؟",
      subject: "Libraries",
      level: "B2",
      opts: ["اشتراک‌گذاری کامپوننت‌ها و استایل‌ها بین اعضای تیم", "چت تیمی", "لیست ایمیل", "ذخیره عکس"],
      ans: 0,
    },
    {
      text: "Publish Library چه زمانی استفاده می‌شود؟",
      subject: "Libraries",
      level: "B2",
      opts: ["ارسال تغییرات کامپوننت‌ها برای بقیه اعضای تیم", "بستن فایل", "نصب پلاگین", "شروع پروژه"],
      ans: 0,
    },
    {
      text: "Asset Panel در فیگما چه کاربردی دارد؟",
      subject: "Libraries",
      level: "B2",
      opts: ["دسترسی به کامپوننت‌های موجود در کتابخانه‌ها", "ویرایش عکس", "تاریخچه فایل", "مدیریت متن"],
      ans: 0,
    },
    {
      text: "Library Sync به چه معناست؟",
      subject: "Libraries",
      level: "B2",
      opts: ["همگام‌سازی آخرین نسخه استایل‌ها بین پروژه‌ها", "حذف فایل", "قفل لایه", "تغییر نام"],
      ans: 0,
    },
    {
      text: "مزیت اصلی استفاده از Design System چیست؟",
      subject: "Libraries",
      level: "B2",
      opts: ["یکپارچگی طراحی و سرعت بالا در پروژه‌های بزرگ", "صرفاً زیبایی", "کاهش امنیت", "تولید عکس"],
      ans: 0,
    },

    // ==========================================
    // C1: Prototyping (5) & Variables (5)
    // ==========================================

    {
      text: "Smart Animate چگونه کار می‌کند؟",
      subject: "Prototyping",
      level: "C1",
      opts: ["تشخیص تغییرات لایه‌های هم‌نام و ایجاد انیمیشن خودکار", "کد CSS", "فقط لایه متن", "تغییر Opacity"],
      ans: 0,
    },
    {
      text: "Overlays در پروتوتایپ چه کاربردی دارند؟",
      subject: "Prototyping",
      level: "C1",
      opts: ["نمایش پنجره‌های Pop-up روی صفحه فعلی", "تغییر رنگ", "قفل اسکرول", "خروجی فیلم"],
      ans: 0,
    },
    {
      text: "Scroll Overflow چه امکانی می‌دهد؟",
      subject: "Prototyping",
      level: "C1",
      opts: ["اسکرول کردن داخل یک فریم خاص", "بزرگنمایی", "تغییر خودکار صفحه", "ثابت ماندن هدر"],
      ans: 0,
    },
    {
      text: "Flow Starting Point چیست؟",
      subject: "Prototyping",
      level: "C1",
      opts: ["تعیین نقطه شروع برای سناریوی پروتوتایپ", "لایه اول", "شروع پلاگین", "اتصال دیتابیس"],
      ans: 0,
    },
    {
      text: "Interaction در پروتوتایپ به چه معناست؟",
      subject: "Prototyping",
      level: "C1",
      opts: ["تعیین رفتار المان هنگام کلیک، هاور یا درگ", "حذف المان", "تغییر لایه", "فقط رنگ"],
      ans: 0,
    },

    {
      text: "Figma Variables چه تفاوتی با Styles دارند؟",
      subject: "Variables",
      level: "C1",
      opts: ["متغیرها مقادیر منطقی و عددی دارند و در طراحی شرطی استفاده می‌شوند", "استایل پیشرفته‌تر است", "متغیر فقط برای رنگ است", "فرقی ندارند"],
      ans: 0,
    },
    {
      text: "کاربرد Modes در متغیرها چیست؟",
      subject: "Variables",
      level: "C1",
      opts: ["تعریف حالت‌های مختلف مثل Dark/Light برای یک متغیر", "سرعت انیمیشن", "دسترسی کاربر", "تغییر زبان"],
      ans: 0,
    },
    {
      text: "Design Tokens در فیگما چه کاربردی دارند؟",
      subject: "Variables",
      level: "C1",
      opts: ["ذخیره مقادیر استاندارد مثل رنگ و فاصله برای استفاده در کل سیستم", "حذف کامپوننت", "فریم ساده", "لایه متنی"],
      ans: 0,
    },
    {
      text: "Advanced Prototyping با متغیرها شامل چه مواردی است؟",
      subject: "Variables",
      level: "C1",
      opts: ["استفاده از عبارات ریاضی و منطق شرطی در تعاملات", "فقط انیمیشن", "خروجی کد", "طراحی آیکون"],
      ans: 0,
    },
    {
      text: "چگونه با متغیر Boolean نمایش یک لایه را کنترل می‌کنیم؟",
      subject: "Variables",
      level: "C1",
      opts: ["اتصال متغیر بهVisibility لایه", "تغییر نام", "پلاگین", "قفل لایه"],
      ans: 0,
    },

    // ==========================================
    // C2: Advanced Workflow (5) & DevMode (5)
    // ==========================================
    {
      text: "Branching در فیگما چه مزیتی دارد؟",
      subject: "AdvancedWorkflow",
      level: "C2",
      opts: ["تست تغییرات بدون آسیب به فایل اصلی و ترکیب بعد از تایید", "فولدر تودرتو", "ورژن آزمایشی", "ارسال پیام"],
      ans: 0,
    },
    {
      text: "Merge در فیگما چه کاری انجام می‌دهد؟",
      subject: "AdvancedWorkflow",
      level: "C2",
      opts: ["ترکیب تغییرات شاخه‌ها (Branches) به فایل اصلی", "حذف کامپوننت", "تغییر فریم", "لایه ساده"],
      ans: 0,
    },
    {
      text: "Version History تا چه زمانی نسخه‌ها را نگه می‌دارد؟",
      subject: "AdvancedWorkflow",
      level: "C2",
      opts: ["در نسخه حرفه‌ای نامحدود و در رایگان ۳۰ روز", "فقط ۲۴ ساعت", "بستن فایل", "۱۰ نسخه آخر"],
      ans: 0,
    },
    {
      text: "Widgets در فیگما چه تفاوتی با پلاگین دارند؟",
      subject: "AdvancedWorkflow",
      level: "C2",
      opts: ["ابزارهای تعاملی که مستقیماً روی بوم طراحی برای همه اعضا دیده می‌شوند", "آیکون ساده", "فایل صوتی", "جایگزین فریم"],
      ans: 0,
    },
    {
      text: "Plugin API در فیگما چه کاربردی دارد؟",
      subject: "AdvancedWorkflow",
      level: "C2",
      opts: ["دسترسی به المان‌ها برای خودکارسازی کارهای تکراری", "تغییر پسورد", "سرعت رندر", "گرافیک بازی"],
      ans: 0,
    },

    {
      text: "Dev Mode در فیگما چه هدفی دارد؟",
      subject: "DevMode",
      level: "C2",
      opts: ["فضای اختصاصی برنامه‌نویس برای استخراج کد و اندازه", "ادیت کد JS", "ساخت اپلیکیشن", "تست امنیت"],
      ans: 0,
    },
    {
      text: "در پنل Inspect، چه کدهایی تولید می‌شود؟",
      subject: "DevMode",
      level: "C2",
      opts: ["CSS, SwiftUI, Compose", "فقط HTML", "PHP", "C++"],
      ans: 0,
    },
    {
      text: "Section Status (Ready for Dev) چه کمکی می‌کند؟",
      subject: "DevMode",
      level: "C2",
      opts: ["مشخص کردن بخش‌های نهایی شده برای برنامه‌نویس", "تغییر رنگ", "قفل لایه", "ارسال ایمیل"],
      ans: 0,
    },
    {
      text: "Export در Dev Mode چه تفاوتی دارد؟",
      subject: "DevMode",
      level: "C2",
      opts: ["امکان خروجی گرفتن سریع Assets به صورت دسته‌بندی شده برای پروژه", "وارد کردن فایل", "حذف کامپوننت", "لایه ساده"],
      ans: 0,
    },
    {
      text: "مفهوم Handoff در فیگما چیست؟",
      subject: "DevMode",
      level: "C2",
      opts: ["فرآیند انتقال مستندات و مشخصات طراحی به تیم توسعه", "حذف طراحی", "تغییر لایه", "فقط رنگ"],
      ans: 0,
    },
  ];

  try {
    const formattedQuestions = rawQuestions.map((q) => ({
      questionText: q.text,
      subject: q.subject,
      level: q.level,
      typeId: typeId,
      options: q.opts.map((o, i) => ({
        text: o,
        value: i,
        isCorrect: i === q.ans,
      })),
    }));

    await prisma.question.createMany({
      data: formattedQuestions,
      skipDuplicates: true,
    });

    console.log(`Successfully imported ${formattedQuestions.length} Figma questions!`);
  } catch (err) {
    console.error("Figma Import failed:", err);
  }
};

export default FigmaQuestions;