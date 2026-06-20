import prisma from "../../../config/prisma";

const AdobePsQuestions = async (typeId: string) => {
  const rawQuestions = [
    // ==========================================
    // A1: Basics (10 questions)
    // ==========================================
    {
      text: "فرمت پیش‌فرض و بومی فتوشاپ که لایه‌ها را حفظ می‌کند چیست؟",
      subject: "Basics",
      level: "A1",
      opts: ["PSD", "JPEG", "PNG", "TIFF"],
      ans: 0,
    },
    {
      text: "کدام مد رنگی برای چاپ افست استاندارد است؟",
      subject: "Basics",
      level: "A1",
      opts: ["CMYK", "RGB", "Lab", "Grayscale"],
      ans: 0,
    },
    {
      text: "رزولوشن استاندارد برای چاپ تصاویر با کیفیت بالا چند DPI است؟",
      subject: "Basics",
      level: "A1",
      opts: ["300", "72", "150", "1200"],
      ans: 0,
    },
    {
      text: "واحد PPI مخفف چیست؟",
      subject: "Basics",
      level: "A1",
      opts: [
        "Pixels Per Inch",
        "Points Per Inch",
        "Paper Per Inch",
        "Pictures Per Inch",
      ],
      ans: 0,
    },
    {
      text: "بوم نقاشی در فتوشاپ چه نامیده می‌شود؟",
      subject: "Basics",
      level: "A1",
      opts: ["Canvas", "Board", "Frame", "Page"],
      ans: 0,
    },
    {
      text: "کدام کلید میانبر برای بازگشت به عقب (Undo) استفاده می‌شود؟",
      subject: "Basics",
      level: "A1",
      opts: ["Ctrl + Z", "Ctrl + X", "Ctrl + S", "Ctrl + Shift + N"],
      ans: 0,
    },
    {
      text: "مد رنگی مناسب برای نمایشگرها و وب چیست؟",
      subject: "Basics",
      level: "A1",
      opts: ["RGB", "CMYK", "Bitmap", "Indexed Color"],
      ans: 0,
    },
    {
      text: "چشم کنار لایه در پنل Layers نشان‌دهنده چیست؟",
      subject: "Basics",
      level: "A1",
      opts: [
        "قابلیت رویت لایه (Visibility)",
        "قفل بودن لایه",
        "ماسک بودن لایه",
        "اسمارت آبجکت بودن",
      ],
      ans: 0,
    },
    {
      text: "منوی اصلی برای تغییر اندازه بوم (بدون تغییر اندازه تصویر) چیست؟",
      subject: "Basics",
      level: "A1",
      opts: [
        "Image > Canvas Size",
        "Image > Image Size",
        "Edit > Transform",
        "File > New",
      ],
      ans: 0,
    },
    {
      text: "کدام گزینه باعث شفافیت کل لایه می‌شود؟",
      subject: "Basics",
      level: "A1",
      opts: ["Opacity", "Flow", "Tolerance", "Hardness"],
      ans: 0,
    },

    // ==========================================
    // A1: Tools (10 questions)
    // ==========================================
    {
      text: "کلید میانبر ابزار Move Tool چیست؟",
      subject: "Tools",
      level: "A1",
      opts: ["V", "M", "A", "Z"],
      ans: 0,
    },
    {
      text: "برای کشیدن خطوط صاف با ابزار Brush کدام کلید را نگه می‌داریم؟",
      subject: "Tools",
      level: "A1",
      opts: ["Shift", "Alt", "Ctrl", "Tab"],
      ans: 0,
    },
    {
      text: "ابزار Zoom با کدام کلید فعال می‌شود؟",
      subject: "Tools",
      level: "A1",
      opts: ["Z", "X", "C", "V"],
      ans: 0,
    },
    {
      text: "کدام ابزار برای نمونه‌برداری رنگ از روی تصویر است؟",
      subject: "Tools",
      level: "A1",
      opts: ["Eyedropper", "Paint Bucket", "Brush", "Gradient"],
      ans: 0,
    },
    {
      text: "ابزار Hand Tool (کلید Space) چه کاربردی دارد؟",
      subject: "Tools",
      level: "A1",
      opts: [
        "جابجایی نمای بوم (Panning)",
        "جابجایی لایه",
        "تغییر سایز تصویر",
        "چرخاندن لایه",
      ],
      ans: 0,
    },
    {
      text: "ابزار Paint Bucket برای چه کاری است؟",
      subject: "Tools",
      level: "A1",
      opts: [
        "پر کردن ناحیه با رنگ تخت",
        "رسم طیف رنگی",
        "پاک کردن لایه",
        "انتخاب هوشمند",
      ],
      ans: 0,
    },
    {
      text: "برای تغییر اندازه قلم براش از چه کلیدهایی استفاده می‌شود؟",
      subject: "Tools",
      level: "A1",
      opts: ["[ ] (چکمه)", "Shift + +", "Alt + Scroll", "Ctrl + T"],
      ans: 0,
    },
    {
      text: "ابزار Type Tool با کدام میانبر فعال می‌شود؟",
      subject: "Tools",
      level: "A1",
      opts: ["T", "Y", "M", "P"],
      ans: 0,
    },
    {
      text: "کاربرد ابزار Rectangle Tool (U) چیست؟",
      subject: "Tools",
      level: "A1",
      opts: [
        "رسم اشکال هندسی برداری",
        "انتخاب مستطیلی",
        "برش تصویر",
        "تغییر رنگ",
      ],
      ans: 0,
    },
    {
      text: "ابزار Eraser چه کاری انجام می‌دهد؟",
      subject: "Tools",
      level: "A1",
      opts: [
        "حذف پیکسل‌های لایه",
        "تیره کردن لایه",
        "کپی لایه",
        "چرخاندن لایه",
      ],
      ans: 0,
    },

    // ==========================================
    // A2: Layers (10 questions)
    // ==========================================
    {
      text: "برای ادغام کردن لایه‌های انتخابی در یک لایه (Merge) چه کلیدی استفاده می‌شود؟",
      subject: "Layers",
      level: "A2",
      opts: ["Ctrl + E", "Ctrl + G", "Ctrl + J", "Ctrl + M"],
      ans: 0,
    },
    {
      text: "تفاوت Opacity و Fill در چیست؟",
      subject: "Layers",
      level: "A2",
      opts: [
        "Fill روی استایل‌های لایه اثر نمی‌گذارد",
        "هر دو یکسان هستند",
        "Opacity فقط برای متن است",
        "Fill رزولوشن را تغییر می‌دهد",
      ],
      ans: 0,
    },
    {
      text: "گروه‌بندی لایه‌ها (Group) با کدام کلید انجام می‌شود؟",
      subject: "Layers",
      level: "A2",
      opts: ["Ctrl + G", "Ctrl + Shift + N", "Ctrl + L", "Ctrl + K"],
      ans: 0,
    },
    {
      text: "Blending Mode پیش‌فرض لایه‌ها چیست؟",
      subject: "Layers",
      level: "A2",
      opts: ["Normal", "Dissolve", "Multiply", "Screen"],
      ans: 0,
    },
    {
      text: "برای قفل کردن پیکسل‌های شفاف لایه از کدام آیکون در پنل Layers استفاده می‌شود؟",
      subject: "Layers",
      level: "A2",
      opts: [
        "Lock Transparent Pixels",
        "Lock All",
        "Lock Position",
        "Lock Image",
      ],
      ans: 0,
    },
    {
      text: "چگونه نام یک لایه را تغییر می‌دهیم؟",
      subject: "Layers",
      level: "A2",
      opts: [
        "دوبار کلیک روی نام لایه",
        "راست کلیک > Rename",
        "استفاده از ابزار Type",
        "فشردن Ctrl + R",
      ],
      ans: 0,
    },
    {
      text: "لایه Background چه محدودیتی دارد؟",
      subject: "Layers",
      level: "A2",
      opts: [
        "نمی‌تواند پیکسل شفاف داشته باشد",
        "رنگی نمی‌شود",
        "تغییر سایز نمی‌دهد",
        "فیلتر نمی‌گیرد",
      ],
      ans: 0,
    },
    {
      text: "برای تغییر ترتیب لایه‌ها چه باید کرد؟",
      subject: "Layers",
      level: "A2",
      opts: [
        "کشیدن و رها کردن در پنل لایه‌ها",
        "استفاده از ابزار Move",
        "تغییر Opacity",
        "استفاده از منوی Filter",
      ],
      ans: 0,
    },
    {
      text: "کاربرد آیکون New Layer در پایین پنل لایه‌ها چیست؟",
      subject: "Layers",
      level: "A2",
      opts: [
        "ایجاد لایه خالی جدید",
        "کپی لایه فعلی",
        "حذف لایه",
        "ایجاد لایه متنی",
      ],
      ans: 0,
    },
    {
      text: "کدام مد ترکیبی (Blending Mode) برای حذف بخش‌های سفید تصویر کاربرد دارد؟",
      subject: "Layers",
      level: "A2",
      opts: ["Multiply", "Screen", "Overlay", "Difference"],
      ans: 0,
    },

    // ==========================================
    // A2: Selection (10 questions)
    // ==========================================
    {
      text: "خارج کردن از حالت انتخاب (Deselect) با چه کلیدی است؟",
      subject: "Selection",
      level: "A2",
      opts: ["Ctrl + D", "Ctrl + U", "Ctrl + Shift + I", "Ctrl + Alt + D"],
      ans: 0,
    },
    {
      text: "معکوس کردن ناحیه انتخاب (Inverse) چیست؟",
      subject: "Selection",
      level: "A2",
      opts: ["Ctrl + Shift + I", "Ctrl + I", "Ctrl + R", "Ctrl + Alt + I"],
      ans: 0,
    },
    {
      text: "Tolerance در ابزار Magic Wand چه چیزی را کنترل می‌کند؟",
      subject: "Selection",
      level: "A2",
      opts: [
        "بازه رنگی مورد انتخاب",
        "نرمی لبه‌ها",
        "سرعت انتخاب",
        "شفافیت انتخاب",
      ],
      ans: 0,
    },
    {
      text: "برای اضافه کردن به ناحیه انتخاب فعلی کدام کلید را نگه می‌داریم؟",
      subject: "Selection",
      level: "A2",
      opts: ["Shift", "Alt", "Ctrl", "Alt + Shift"],
      ans: 0,
    },
    {
      text: "برای کم کردن از ناحیه انتخاب فعلی کدام کلید استفاده می‌شود؟",
      subject: "Selection",
      level: "A2",
      opts: ["Alt", "Shift", "Ctrl", "Tab"],
      ans: 0,
    },
    {
      text: "ابزار Magnetic Lasso بر چه اساسی انتخاب می‌کند؟",
      subject: "Selection",
      level: "A2",
      opts: [
        "تضاد نوری و لبه‌های تصویر",
        "فقط رنگ",
        "اشکال هندسی",
        "تشخیص چهره",
      ],
      ans: 0,
    },
    {
      text: "گزینه Anti-alias در ابزارهای انتخاب چه کاری می‌کند؟",
      subject: "Selection",
      level: "A2",
      opts: [
        "نرم کردن لبه‌های دندانه‌دار در منحنی‌ها",
        "حذف رنگ",
        "افزایش غلظت",
        "ایجاد سایه",
      ],
      ans: 0,
    },
    {
      text: "ابزار Object Selection چگونه کار می‌کند؟",
      subject: "Selection",
      level: "A2",
      opts: [
        "تشخیص هوشمند سوژه با کشیدن کادر دور آن",
        "انتخاب دستی",
        "انتخاب بر اساس مسیر Pen",
        "انتخاب کل لایه‌ها",
      ],
      ans: 0,
    },
    {
      text: "Select Subject در کجا قرار دارد؟",
      subject: "Selection",
      level: "A2",
      opts: [
        "در نوار تنظیمات ابزارهای انتخاب یا منوی Select",
        "در منوی Filter",
        "در پنل Layers",
        "در منوی Edit",
      ],
      ans: 0,
    },
    {
      text: "کاربرد Feather در انتخاب‌های فتوشاپ چیست؟",
      subject: "Selection",
      level: "A2",
      opts: [
        "محو کردن لبه‌های انتخاب (Fade)",
        "تیز کردن لبه‌ها",
        "تغییر رنگ لبه",
        "ذخیره ناحیه انتخاب",
      ],
      ans: 1,
    },

    // ==========================================
    // B1: Retouching (10 questions)
    // ==========================================
    {
      text: "ابزار Healing Brush برای کار به چه چیزی نیاز دارد؟",
      subject: "Retouching",
      level: "B1",
      opts: [
        "تعیین نقطه منبع با کلید Alt",
        "فقط کشیدن روی لکه",
        "انتخاب ناحیه با Lasso",
        "استفاده از ماسک",
      ],
      ans: 0,
    },
    {
      text: "ابزار Patch Tool برای چه کاری مناسب است؟",
      subject: "Retouching",
      level: "B1",
      opts: [
        "ترمیم نواحی بزرگ با کشیدن ناحیه انتخاب روی بخش سالم",
        "رسم براش",
        "تغییر نور موضعی",
        "برش تصویر",
      ],
      ans: 0,
    },
    {
      text: "Spot Healing Brush چه مزیتی دارد؟",
      subject: "Retouching",
      level: "B1",
      opts: [
        "نیاز به تعیین منبع ندارد و خودکار عمل می‌کند",
        "دقیق‌تر از بقیه است",
        "رنگ را عوض می‌کند",
        "لایه را پاک می‌کند",
      ],
      ans: 0,
    },
    {
      text: "ابزار Red Eye برای رفع چه مشکلی است؟",
      subject: "Retouching",
      level: "B1",
      opts: [
        "قرمزی چشم ناشی از فلاش دوربین",
        "سفید کردن دندان",
        "تغییر رنگ چشم",
        "حذف سیاهی دور چشم",
      ],
      ans: 0,
    },
    {
      text: "Content-Aware Fill در کدام منو قرار دارد؟",
      subject: "Retouching",
      level: "B1",
      opts: ["Edit", "Filter", "Layer", "Select"],
      ans: 0,
    },
    {
      text: "ابزار Dodge باعث چه تغییری در تصویر می‌شود؟",
      subject: "Retouching",
      level: "B1",
      opts: [
        "روشن کردن نواحی تیره",
        "تیره کردن نواحی روشن",
        "حذف رنگ",
        "محو کردن",
      ],
      ans: 0,
    },
    {
      text: "ابزار Burn برای کدام بخش‌های عکس استفاده می‌شود؟",
      subject: "Retouching",
      level: "B1",
      opts: [
        "ایجاد سایه و تیره کردن نواحی",
        "روشن کردن",
        "اشباع رنگ",
        "تیز کردن لبه‌ها",
      ],
      ans: 0,
    },
    {
      text: "ابزار Sharpen چه کاری انجام می‌دهد؟",
      subject: "Retouching",
      level: "B1",
      opts: [
        "افزایش تضاد در لبه‌ها برای وضوح بیشتر",
        "تاری تصویر",
        "تغییر رنگ",
        "پاک کردن لکه",
      ],
      ans: 0,
    },
    {
      text: "ابزار Smudge چه افکتی ایجاد می‌کند؟",
      subject: "Retouching",
      level: "B1",
      opts: [
        "کشیدن و پخش کردن رنگ‌ها مثل اثر انگشت روی رنگ خیس",
        "شارپ کردن",
        "روشن کردن",
        "تیره کردن",
      ],
      ans: 0,
    },
    {
      text: "کاربرد ابزار Blur چیست؟",
      subject: "Retouching",
      level: "B1",
      opts: [
        "کم کردن وضوح و نرم کردن پیکسل‌ها",
        "افزایش وضوح",
        "تغییر رنگ",
        "نمونه‌برداری",
      ],
      ans: 0,
    },

    // ==========================================
    // B1: Adjustment (10 questions)
    // ==========================================
    {
      text: "Adjustment Layer چه برتری نسبت به Image > Adjustments دارد؟",
      subject: "Adjustment",
      level: "B1",
      opts: [
        "ویرایش غیرمخرب و قابلیت تغییر دائمی تنظیمات",
        "کیفیت بالاتر",
        "حجم فایل کمتر",
        "سرعت بیشتر",
      ],
      ans: 0,
    },
    {
      text: "Saturation در Hue/Saturation چه چیزی را کنترل می‌کند؟",
      subject: "Adjustment",
      level: "B1",
      opts: ["شدت و خلوص رنگ", "نوع رنگ", "روشنایی", "کنتراست"],
      ans: 0,
    },
    {
      text: "در پنجره Levels، نمودار سیاه نشان‌دهنده چیست؟",
      subject: "Adjustment",
      level: "B1",
      opts: [
        "Histogram (توزیع پیکسل‌ها)",
        "تعداد لایه‌ها",
        "عمق میدان",
        "رزولوشن",
      ],
      ans: 0,
    },
    {
      text: "Brightness/Contrast برای چیست؟",
      subject: "Adjustment",
      level: "B1",
      opts: [
        "تنظیم کلی روشنایی و تضاد نوری",
        "تغییر رنگ قرمز",
        "سیاه و سفید کردن",
        "ماسک کردن",
      ],
      ans: 0,
    },
    {
      text: "Vibrance چه تفاوتی با Saturation دارد؟",
      subject: "Adjustment",
      level: "B1",
      opts: [
        "هوشمندانه رنگ‌های ضعیف را تقویت می‌کند",
        "فرقی ندارند",
        "فقط برای چاپ است",
        "نور را کم می‌کند",
      ],
      ans: 0,
    },
    {
      text: "Black & White Adjustment چه مزیتی دارد؟",
      subject: "Adjustment",
      level: "B1",
      opts: [
        "کنترل روی غلظت هر رنگ در تبدیل به خاکستری",
        "حذف خودکار پس‌زمینه",
        "افزایش رزولوشن",
        "تغییر فرمت",
      ],
      ans: 0,
    },
    {
      text: "Photo Filter در فتوشاپ چه کاری می‌کند؟",
      subject: "Adjustment",
      level: "B1",
      opts: [
        "شبیه‌سازی فیلترهای رنگی لنز دوربین",
        "برش عکس",
        "روتوش صورت",
        "حذف نویز",
      ],
      ans: 0,
    },
    {
      text: "Invert (Ctrl + I) چه تغییری ایجاد می‌کند؟",
      subject: "Adjustment",
      level: "B1",
      opts: [
        "نگاتیو کردن رنگ‌های تصویر",
        "سیاه و سفید کردن",
        "چرخاندن تصویر",
        "شفاف کردن لایه",
      ],
      ans: 0,
    },
    {
      text: "Threshold چه افکتی ایجاد می‌کند؟",
      subject: "Adjustment",
      level: "B1",
      opts: [
        "تبدیل تصویر به سیاه و سفید مطلق بدون خاکستری",
        "محو کردن",
        "تغییر طیف رنگ",
        "سه بعدی کردن",
      ],
      ans: 0,
    },
    {
      text: "Posterize چه تغییری در تصویر می‌دهد؟",
      subject: "Adjustment",
      level: "B1",
      opts: [
        "کاهش تعداد سطوح رنگی تصویر",
        "افزایش کیفیت",
        "تغییر رزولوشن",
        "ایجاد سایه",
      ],
      ans: 0,
    },

    // ==========================================
    // B2: SmartObjects (10 questions)
    // ==========================================
    {
      text: "چگونه یک لایه معمولی را به Smart Object تبدیل می‌کنیم؟",
      subject: "SmartObjects",
      level: "B2",
      opts: [
        "راست کلیک روی لایه > Convert to Smart Object",
        "استفاده از ابزار Move",
        "فشردن Ctrl + S",
        "کشیدن لایه به پنل Channel",
      ],
      ans: 0,
    },
    {
      text: "آیا می‌توان مستقیماً روی Smart Object با براش نقاشی کرد؟",
      subject: "SmartObjects",
      level: "B2",
      opts: [
        "خیر، باید ابتدا Rasterize شود یا محتوای آن باز شود",
        "بله، به راحتی",
        "بله، اما فقط با رنگ مشکی",
        "فقط در نسخه‌های جدید",
      ],
      ans: 0,
    },
    {
      text: "Smart Filter چیست؟",
      subject: "SmartObjects",
      level: "B2",
      opts: [
        "فیلتری که روی اسمارت آبجکت اعمال شده و قابل ویرایش است",
        "فیلتری که با هوش مصنوعی کار می‌کند",
        "فیلتری برای حذف نویز",
        "فیلتر مخصوص متن",
      ],
      ans: 0,
    },
    {
      text: "برای ویرایش محتویات یک Smart Object چه باید کرد؟",
      subject: "SmartObjects",
      level: "B2",
      opts: [
        "دوبار کلیک روی آیکون لایه در پنل Layers",
        "استفاده از ابزار Eraser",
        "تغییر Opacity",
        "استفاده از منوی Filter",
      ],
      ans: 0,
    },
    {
      text: "Embedded Smart Object چه تفاوتی با Linked دارد؟",
      subject: "SmartObjects",
      level: "B2",
      opts: [
        "Embedded داخل خود فایل PSD ذخیره می‌شود",
        "Linked حجم فایل را زیاد می‌کند",
        "Embedded به اینترنت نیاز دارد",
        "فرقی ندارند",
      ],
      ans: 0,
    },
    {
      text: "مزیت استفاده از اسمارت آبجکت در طراحی موکاپ چیست؟",
      subject: "SmartObjects",
      level: "B2",
      opts: [
        "جایگزینی سریع تصویر با حفظ پرسپکتیو و فیلترها",
        "کاهش حجم فایل خروجی",
        "تغییر اتوماتیک فونت",
        "اتصال به چاپخانه",
      ],
      ans: 0,
    },
    {
      text: "اگر یک Smart Object را کوچک و سپس بزرگ کنیم، چه می‌شود؟",
      subject: "SmartObjects",
      level: "B2",
      opts: [
        "کیفیت تصویر کاملاً حفظ می‌شود",
        "تصویر شطرنجی می‌شود",
        "تصویر سیاه می‌شود",
        "لایه حذف می‌شود",
      ],
      ans: 0,
    },
    {
      text: "Stack Mode در اسمارت آبجکت‌ها برای چیست؟",
      subject: "SmartObjects",
      level: "B2",
      opts: [
        "ترکیب چندین تصویر برای حذف نویز یا اشیاء متحرک",
        "چیدمان لایه‌ها",
        "سه بعدی کردن",
        "تغییر رنگ",
      ],
      ans: 0,
    },
    {
      text: "کدام فرمت هنگام ورود به فتوشاپ به صورت Smart Object باز می‌شود؟",
      subject: "SmartObjects",
      level: "B2",
      opts: ["Raw / PDF / AI", "JPEG", "BMP", "GIF"],
      ans: 0,
    },
    {
      text: "Rasterize کردن اسمارت آبجکت چه نتیجه‌ای دارد؟",
      subject: "SmartObjects",
      level: "B2",
      opts: [
        "تبدیل آن به لایه پیکسلی معمولی و از دست دادن خاصیت ویرایشی",
        "افزایش کیفیت",
        "وکتور کردن",
        "ایجاد ماسک",
      ],
      ans: 0,
    },

    // ==========================================
    // B2: Masking (10 questions)
    // ==========================================
    {
      text: "کلید میانبر برای ایجاد Clipping Mask چیست؟",
      subject: "Masking",
      level: "B2",
      opts: [
        "Ctrl + Alt + G",
        "Ctrl + M",
        "Ctrl + Shift + M",
        "Alt + کلیک بین دو لایه",
      ],
      ans: 3,
    },
    {
      text: "در Layer Mask، رنگ خاکستری چه معنایی دارد؟",
      subject: "Masking",
      level: "B2",
      opts: ["نیمه شفاف بودن لایه", "نمایش کامل", "عدم نمایش", "تغییر رنگ"],
      ans: 0,
    },
    {
      text: "چگونه ماسک را موقتاً غیرفعال کنیم؟",
      subject: "Masking",
      level: "B2",
      opts: [
        "Shift + کلیک روی ماسک",
        "Alt + کلیک روی ماسک",
        "Ctrl + X",
        "دوبار کلیک",
      ],
      ans: 0,
    },
    {
      text: "Vector Mask با چه ابزاری ایجاد می‌شود؟",
      subject: "Masking",
      level: "B2",
      opts: ["Pen Tool یا Shape Tools", "Brush", "Eraser", "Magic Wand"],
      ans: 0,
    },
    {
      text: "تفاوت لایه ماسک با حذف پیکسل چیست؟",
      subject: "Masking",
      level: "B2",
      opts: [
        "ماسک قابلیت بازگشت دارد (غیرمخرب است)",
        "ماسک حجم را زیاد می‌کند",
        "حذف کردن سریع‌تر است",
        "تفاوتی ندارند",
      ],
      ans: 0,
    },
    {
      text: "برای دیدن خودِ ماسک به صورت تمام صفحه چه کلیدی را روی آن می‌زنیم؟",
      subject: "Masking",
      level: "B2",
      opts: ["Alt + کلیک", "Shift + کلیک", "Ctrl + کلیک", "راست کلیک"],
      ans: 0,
    },
    {
      text: "Density در تنظیمات ماسک چه کاری انجام می‌دهد؟",
      subject: "Masking",
      level: "B2",
      opts: [
        "کنترل غلظت و شفافیت کل ماسک",
        "نرمی لبه‌ها",
        "تغییر رنگ",
        "معکوس کردن",
      ],
      ans: 0,
    },
    {
      text: "Global Refine در Select and Mask برای چیست؟",
      subject: "Masking",
      level: "B2",
      opts: [
        "بهبود کلی لبه‌های ماسک (Smooth, Feather, Contrast)",
        "تغییر رزولوشن",
        "حذف پس‌زمینه",
        "کپی ماسک",
      ],
      ans: 0,
    },
    {
      text: "کاربرد ابزار Refine Edge Brush در ماسک کردن چیست؟",
      subject: "Masking",
      level: "B2",
      opts: [
        "انتخاب دقیق جزئیات ظریف مثل مو",
        "پاک کردن لایه‌ها",
        "رسم شکل هندسی",
        "تغییر نور",
      ],
      ans: 0,
    },
    {
      text: "آیا یک لایه می‌تواند همزمان Layer Mask و Vector Mask داشته باشد؟",
      subject: "Masking",
      level: "B2",
      opts: ["بله", "خیر", "فقط در مد CMYK", "فقط برای لایه‌های متنی"],
      ans: 0,
    },

    // ==========================================
    // C1: ColorGrading (5 questions)
    // ==========================================
    {
      text: "Color Lookup در فتوشاپ از چه فایل‌هایی استفاده می‌کند؟",
      subject: "ColorGrading",
      level: "C1",
      opts: [".3DL / .CUBE", ".PSD", ".JPG", ".BRUSH"],
      ans: 0,
    },
    {
      text: "تکنیک Color Match برای چه هدفی استفاده می‌شود؟",
      subject: "ColorGrading",
      level: "C1",
      opts: [
        "یکسان‌سازی تناژ رنگی دو تصویر متفاوت در ترکیب‌بندی",
        "تغییر فونت",
        "برش عکس",
        "رزولوشن",
      ],
      ans: 0,
    },
    {
      text: "Gradient Map چگونه به Color Grading کمک می‌کند؟",
      subject: "ColorGrading",
      level: "C1",
      opts: [
        "با اختصاص رنگ‌های خاص به توناژهای مختلف نور (Shadow/Highlight)",
        "رسم خطوط",
        "محو کردن",
        "تغییر ابعاد",
      ],
      ans: 0,
    },
    {
      text: "Selective Color بیشتر در چه موردی کاربرد حرفه‌ای دارد؟",
      subject: "ColorGrading",
      level: "C1",
      opts: [
        "اصلاح دقیق رنگ‌های خاص (مثلاً فقط قرمزها) در چاپ و ادیت",
        "سیاه سفید کردن",
        "برش زدن",
        "تغییر سایز",
      ],
      ans: 0,
    },
    {
      text: "کاربرد اصلی Curves در کالرگریدینگ حرفه‌ای چیست؟",
      subject: "ColorGrading",
      level: "C1",
      opts: [
        "کنترل جداگانه کانال‌های رنگی (Red, Green, Blue) برای تغییر تناژ",
        "تاری تصویر",
        "حذف لکه",
        "خروجی وب",
      ],
      ans: 0,
    },

    // ==========================================
    // C1: Compositing (5 questions)
    // ==========================================
    {
      text: "در فتومونتاژ، برای ایجاد سایه طبیعی سوژه معمولاً از چه روشی استفاده می‌شود؟",
      subject: "Compositing",
      level: "C1",
      opts: [
        "رسم دستی با براش و استفاده از Blending Modes",
        "فقط ابزار Drop Shadow",
        "تغییر رزولوشن",
        "فیلتر Blur ساده",
      ],
      ans: 0,
    },
    {
      text: "اصطلاح Lighting Wrap در کامپوزیت چیست؟",
      subject: "Compositing",
      level: "C1",
      opts: [
        "نشت نور پس‌زمینه به لبه‌های سوژه برای ادغام بهتر",
        "بستن لایه",
        "تغییر کنتراست",
        "ماسک کردن متن",
      ],
      ans: 0,
    },
    {
      text: "چگونه پرسپکتیو دو تصویر را در کامپوزیت هماهنگ می‌کنیم؟",
      subject: "Compositing",
      level: "C1",
      opts: [
        "استفاده از خطوط راهنما و Perspective Warp",
        "تغییر Opacity",
        "استفاده از ابزار Eraser",
        "فیلتر Liquify",
      ],
      ans: 0,
    },
    {
      text: "مهم‌ترین اصل در واقع‌گرایی یک کامپوزیت چیست؟",
      subject: "Compositing",
      level: "C1",
      opts: [
        "هماهنگی جهت نور، پرسپکتیو و تراز رنگی",
        "تعداد لایه‌ها",
        "استفاده از فونت زیبا",
        "حجم فایل",
      ],
      ans: 0,
    },
    {
      text: "کاربرد فیلتر Camera Raw در انتهای پروژه کامپوزیت چیست؟",
      subject: "Compositing",
      level: "C1",
      opts: [
        "یکدست کردن نهایی رنگ و نور تمام لایه‌ها",
        "برش نهایی",
        "حذف تمام لایه‌ها",
        "ذخیره برای وب",
      ],
      ans: 0,
    },

    // ==========================================
    // C2: Automation (5 questions)
    // ==========================================
    {
      text: "چگونه یک مجموعه دستور تکراری را ضبط کنیم؟",
      subject: "Automation",
      level: "C2",
      opts: [
        "پنل Actions و زدن دکمه Record",
        "منوی File > Save",
        "استفاده از ابزار Move",
        "پنل History",
      ],
      ans: 0,
    },
    {
      text: "Droplet در فتوشاپ چیست؟",
      subject: "Automation",
      level: "C2",
      opts: [
        "یک فایل اجرایی کوچک که با کشیدن عکس روی آن، اکشن اجرا می‌شود",
        "یک نوع براش",
        "یک فیلتر محوکننده",
        "نوعی خط‌کش",
      ],
      ans: 0,
    },
    {
      text: "Script Events Manager چه کاری انجام می‌دهد؟",
      subject: "Automation",
      level: "C2",
      opts: [
        "اجرای خودکار اسکریپت هنگام رخ دادن اتفاقی خاص (مثل باز کردن فایل)",
        "مدیریت لایه‌ها",
        "تغییر فونت",
        "اتصال به اسکنر",
      ],
      ans: 0,
    },
    {
      text: "برای خروجی گرفتن سریع از تمام لایه‌ها به صورت فایل‌های جداگانه چه باید کرد؟",
      subject: "Automation",
      level: "C2",
      opts: [
        "File > Export > Layers to Files",
        "تک‌تک Save As کنیم",
        "استفاده از ابزار Crop",
        "در فتوشاپ ممکن نیست",
      ],
      ans: 0,
    },
    {
      text: "زبان برنامه‌نویسی برای نوشتن اسکریپت‌های پیچیده در فتوشاپ چیست؟",
      subject: "Automation",
      level: "C2",
      opts: ["JavaScript / ExtendScript", "C++", "Python", "Swift"],
      ans: 0,
    },

    // ==========================================
    // C2: ProfessionalRetouch (10 questions)
    // ==========================================
    {
      text: "در تکنیک Frequency Separation، لایه Low Frequency حاوی چه اطلاعاتی است؟",
      subject: "ProfessionalRetouch",
      level: "C2",
      opts: [
        "اطلاعات رنگ و نور (بدون بافت)",
        "بافت دقیق و منافذ پوست",
        "سایه‌های تند",
        "خطوط دور چشم",
      ],
      ans: 0,
    },
    {
      text: "در تکنیک Frequency Separation، لایه High Frequency چه چیزی را نگه می‌دارد؟",
      subject: "ProfessionalRetouch",
      level: "C2",
      opts: [
        "بافت پوست، منافذ و جزییات ریز",
        "رنگ کل صورت",
        "تاری تصویر",
        "روشنایی عمومی",
      ],
      ans: 0,
    },
    {
      text: "هدف از Dodge & Burn در روتوش حرفه‌ای چیست؟",
      subject: "ProfessionalRetouch",
      level: "C2",
      opts: [
        "اصلاح فرم صورت و ایجاد حجم با حفظ کامل بافت پوست",
        "سفید کردن کل صورت",
        "تغییر رنگ چشم",
        "حذف پس‌زمینه",
      ],
      ans: 0,
    },
    {
      text: "استفاده از Check Layer (مثلاً لایه سیاه سفید) در روتوش برای چیست؟",
      subject: "ProfessionalRetouch",
      level: "C2",
      opts: [
        "مشاهده بهتر لکه‌ها و ناهماهنگی‌های نوری پوست",
        "خروجی نهایی",
        "تغییر فونت",
        "کاهش حجم",
      ],
      ans: 0,
    },
    {
      text: "تکنیک Inverted High Pass برای چه کاری در روتوش استفاده می‌شود？",
      subject: "ProfessionalRetouch",
      level: "C2",
      opts: [
        "نرم کردن پوست با حفظ بافت طبیعی",
        "شارپ کردن چشم‌ها",
        "تغییر رنگ مو",
        "حذف قرمزی چشم",
      ],
      ans: 0,
    },
    {
      text: "بهترین روش برای تغییر رنگ لب بدون از دست دادن براقیت آن چیست؟",
      subject: "ProfessionalRetouch",
      level: "C2",
      opts: [
        "استفاده از Hue/Saturation با ماسک و مد Color یا Soft Light",
        "رنگ کردن با براش معمولی",
        "استفاده از Eraser",
        "تغییر رزولوشن",
      ],
      ans: 0,
    },
    {
      text: "چگونه تارهای نازک مو را در روتوش از پس‌زمینه جدا می‌کنند؟",
      subject: "ProfessionalRetouch",
      level: "C2",
      opts: [
        "استفاده از Channel Masking و Refine Edge",
        "ابزار Eraser",
        "ابزار Crop",
        "ابزار Pen به تنهایی",
      ],
      ans: 0,
    },
    {
      text: "در روتوش چشم، Catch Light به چه معناست؟",
      subject: "ProfessionalRetouch",
      level: "C2",
      opts: [
        "بازتاب منبع نور در مردمک چشم که به آن روح می‌دهد",
        "تیرگی زیر چشم",
        "رنگ عنبیه",
        "پلک زدن",
      ],
      ans: 0,
    },
    {
      text: "تکنیک 'Digital Makeup' در فتوشاپ شامل چیست؟",
      subject: "ProfessionalRetouch",
      level: "C2",
      opts: [
        "افزودن آرایش دیجیتالی با استفاده از لایه‌های کمکی و Blending Modes",
        "پاک کردن عکس",
        "تغییر سایز سر",
        "چاپ عکس",
      ],
      ans: 0,
    },
    {
      text: "چرا روتوش مخرب (Destructive) در صنعت حرفه‌ای رد می‌شود؟",
      subject: "ProfessionalRetouch",
      level: "C2",
      opts: [
        "چون امکان بازگشت و اصلاح نظرات مشتری وجود ندارد",
        "چون کیفیت را بالا می‌برد",
        "چون حجم فایل را کم می‌کند",
        "به دلیل استفاده از براش",
      ],
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

    console.log(
      `Successfully imported ${formattedQuestions.length} Adobe Photoshop questions!`,
    );
  } catch (err) {
    console.error("Adobe Photoshop Import failed:", err);
  }
};

export default AdobePsQuestions;
