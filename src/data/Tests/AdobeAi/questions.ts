import prisma from "../../../config/prisma";

const AdobeAiQuestions = async (typeId: string) => {
  const rawQuestions = [
    // ==========================================
    // 1. Basics (Level A1 - 10 Questions)
    // ==========================================
    {
      text: "ماهیت تصاویر در ایلاستریتور چیست؟",
      subject: "Basics",
      level: "A1",
      opts: ["وکتور (Vector)", "رستر (Raster)", "پیکسل", "بیت‌مپ"],
      ans: 0,
    },
    {
      text: "کدام فرمت برای ذخیره فایل‌های لایه باز ایلاستریتور به کار می‌رود؟",
      subject: "Basics",
      level: "A1",
      opts: [".ai", ".psd", ".jpg", ".png"],
      ans: 0,
    },
    {
      text: "مزیت اصلی وکتور نسبت به رستر چیست؟",
      subject: "Basics",
      level: "A1",
      opts: [
        "قابلیت تغییر سایز بدون افت کیفیت",
        "تعداد لایه‌های بیشتر",
        "حجم فایل بالاتر",
        "رنگ‌های طبیعی‌تر",
      ],
      ans: 0,
    },
    {
      text: "آرت‌بورد (Artboard) در ایلاستریتور به چه معناست؟",
      subject: "Basics",
      level: "A1",
      opts: ["محدوده طراحی و چاپ", "ابزار براش", "منوی فیلتر", "پالت رنگ"],
      ans: 0,
    },
    {
      text: "کدام مد رنگی برای طراحی جهت نمایش در مانیتور استفاده می‌شود؟",
      subject: "Basics",
      level: "A1",
      opts: ["RGB", "CMYK", "Lab", "Grayscale"],
      ans: 0,
    },
    {
      text: "واحد پیش‌فرض برای کارهای چاپی در ایلاستریتور چیست؟",
      subject: "Basics",
      level: "A1",
      opts: ["Millimeters", "Pixels", "Points", "Inches"],
      ans: 0,
    },
    {
      text: "چشم کنار لایه در پنل Layers چه وظیفه‌ای دارد؟",
      subject: "Basics",
      level: "A1",
      opts: [
        "نمایش یا عدم نمایش لایه",
        "قفل کردن لایه",
        "کپی لایه",
        "حذف لایه",
      ],
      ans: 0,
    },
    {
      text: "تفاوت میانبر Ctrl+N و Ctrl+O چیست؟",
      subject: "Basics",
      level: "A1",
      opts: [
        "N برای فایل جدید و O برای باز کردن فایل",
        "برعکس است",
        "فرقی ندارند",
        "هر دو برای ذخیره هستند",
      ],
      ans: 0,
    },
    {
      text: "کدام کلید میانبر برای بازگشت به عقب (Undo) استفاده می‌شود؟",
      subject: "Basics",
      level: "A1",
      opts: ["Ctrl+Z", "Ctrl+S", "Ctrl+P", "Ctrl+V"],
      ans: 0,
    },
    {
      text: "اگر فایلی را با پسوند .SVG ذخیره کنیم، چه مزیتی دارد؟",
      subject: "Basics",
      level: "A1",
      opts: [
        "قابلیت استفاده در وب به صورت وکتور",
        "مخصوص چاپ افست است",
        "لایه باز فتوشاپ است",
        "فقط در ایلاستریتور باز می‌شود",
      ],
      ans: 0,
    },

    // ==========================================
    // 2. Selection (Level A1 - 10 Questions)
    // ==========================================
    {
      text: "کلید میانبر ابزار Selection Tool چیست؟",
      subject: "Selection",
      level: "A1",
      opts: ["V", "A", "P", "T"],
      ans: 0,
    },
    {
      text: "کدام ابزار برای انتخاب تک تک نقاط لنگر (Anchor Points) استفاده می‌شود؟",
      subject: "Selection",
      level: "A1",
      opts: [
        "Direct Selection Tool (A)",
        "Selection Tool (V)",
        "Lasso Tool",
        "Magic Wand",
      ],
      ans: 0,
    },
    {
      text: "برای انتخاب چند آبجکت همزمان، کدام کلید را نگه می‌داریم؟",
      subject: "Selection",
      level: "A1",
      opts: ["Shift", "Alt", "Ctrl", "Space"],
      ans: 0,
    },
    {
      text: "ابزار Magic Wand بر چه اساسی انتخاب می‌کند؟",
      subject: "Selection",
      level: "A1",
      opts: [
        "شباهت در ویژگی‌های رنگی و ظاهری",
        "انتخاب دستی",
        "ترسیم مسیر",
        "انتخاب نقاط لنگر",
      ],
      ans: 0,
    },
    {
      text: "ابزار Lasso Tool برای چه نوع انتخابی مناسب است؟",
      subject: "Selection",
      level: "A1",
      opts: [
        "انتخاب آزاد و دستی دور نقاط یا آبجکت‌ها",
        "انتخاب مستطیلی",
        "انتخاب وکتور",
        "انتخاب متن",
      ],
      ans: 0,
    },
    {
      text: "اگر بخواهیم محتویات داخل یک گروه را بدون Ungroup انتخاب کنیم از چه ابزاری استفاده می‌کنیم؟",
      subject: "Selection",
      level: "A1",
      opts: ["Group Selection Tool", "Selection Tool", "Type Tool", "Pen Tool"],
      ans: 0,
    },
    {
      text: "میانبر Deselect (خارج کردن از انتخاب) چیست؟",
      subject: "Selection",
      level: "A1",
      opts: ["Ctrl+Shift+A", "Ctrl+D", "Ctrl+Z", "Ctrl+X"],
      ans: 0,
    },
    {
      text: "ابزار Direct Selection علاوه بر جابجایی نقاط، چه کاربردی در گوشه‌های شکل دارد؟",
      subject: "Selection",
      level: "A1",
      opts: [
        "گرد کردن گوشه‌ها (Live Corners)",
        "تغییر رنگ",
        "حذف شکل",
        "ایجاد سایه",
      ],
      ans: 0,
    },
    {
      text: "برای جابجایی دقیق آبجکت به اندازه ۱ پیکسل از چه کلیدی استفاده می‌شود؟",
      subject: "Selection",
      level: "A1",
      opts: ["کلیدهای جهت‌نما (Arrow Keys)", "Space", "Alt", "Shift"],
      ans: 0,
    },
    {
      text: "تفاوت رنگ نشانگر Selection و Direct Selection در چیست؟",
      subject: "Selection",
      level: "A1",
      opts: [
        "اولی مشکی و دومی سفید است",
        "اولی سفید و دومی مشکی است",
        "هردو آبی هستند",
        "فرقی ندارند",
      ],
      ans: 0,
    },

    // ==========================================
    // 3. FillStroke (Level A1 - 10 Questions)
    // ==========================================
    {
      text: "کلید میانبر برای جابجایی بین Fill و Stroke چیست؟",
      subject: "FillStroke",
      level: "A1",
      opts: ["X", "D", "Shift+X", "F"],
      ans: 0,
    },
    {
      text: "کدام میانبر تنظیمات Fill و Stroke را به حالت پیش‌فرض (سفید و مشکی) برمی‌گرداند؟",
      subject: "FillStroke",
      level: "A1",
      opts: ["D", "X", "N", "Z"],
      ans: 0,
    },
    {
      text: "برای حذف رنگ (None کردن) از چه کلیدی استفاده می‌شود؟",
      subject: "FillStroke",
      level: "A1",
      opts: ["/ (Slash)", "X", "D", "Delete"],
      ans: 0,
    },
    {
      text: "کلید میانبر برای معکوس کردن رنگ Fill و Stroke با هم چیست؟",
      subject: "FillStroke",
      level: "A1",
      opts: ["Shift+X", "Ctrl+X", "Alt+X", "X"],
      ans: 0,
    },
    {
      text: "ضخامت خط دور (Stroke) با کدام گزینه تغییر می‌کند؟",
      subject: "FillStroke",
      level: "A1",
      opts: ["Weight", "Opacity", "Size", "Height"],
      ans: 0,
    },
    {
      text: "گزینه Dashed Line در پنل Stroke چه کاری انجام می‌دهد؟",
      subject: "FillStroke",
      level: "A1",
      opts: [
        "تبدیل خط ممتد به خط‌چین",
        "تغییر رنگ خط",
        "گرد کردن لبه خط",
        "ضخیم کردن خط",
      ],
      ans: 0,
    },
    {
      text: "برای اینکه Stroke به جای وسط، در داخل مرز شکل قرار بگیرد کدام گزینه را در پنل Stroke انتخاب می‌کنیم؟",
      subject: "FillStroke",
      level: "A1",
      opts: [
        "Align Stroke to Inside",
        "Align Stroke to Outside",
        "Center",
        "Cap",
      ],
      ans: 0,
    },
    {
      text: "Round Cap در تنظیمات Stroke چه اثری دارد؟",
      subject: "FillStroke",
      level: "A1",
      opts: [
        "گرد کردن دو سر خط",
        "تیز کردن گوشه‌ها",
        "ایجاد خط‌چین",
        "تغییر ضخامت",
      ],
      ans: 0,
    },
    {
      text: "کدام پنل برای ذخیره رنگ‌های پراستفاده جهت اعمال سریع به Fill استفاده می‌شود؟",
      subject: "FillStroke",
      level: "A1",
      opts: ["Swatches", "Layers", "Links", "Symbols"],
      ans: 0,
    },
    {
      text: "آیکون علامت سوال (؟) در بخش رنگ به چه معناست؟",
      subject: "FillStroke",
      level: "A1",
      opts: [
        "انتخاب چندین آبجکت با رنگ‌های متفاوت",
        "نبودن رنگ",
        "خطا در سیستم",
        "رنگ شفاف",
      ],
      ans: 0,
    },

    // ==========================================
    // 4. Tools (Level A2 - 10 Questions)
    // ==========================================
    {
      text: "ابزار Shape Builder (Shift+M) چه کاربردی دارد؟",
      subject: "Tools",
      level: "A2",
      opts: [
        "ترکیب و تفریق اشکال به صورت بصری",
        "تغییر فونت",
        "رسم براش",
        "ایجاد لایه",
      ],
      ans: 0,
    },
    {
      text: "برای تراز کردن (Align) دو آبجکت نسبت به هم از کدام پنل استفاده می‌شود؟",
      subject: "Tools",
      level: "A2",
      opts: ["Align", "Pathfinder", "Transform", "Stroke"],
      ans: 0,
    },
    {
      text: "ابزار Rotate (R) حول چه نقطه‌ای آبجکت را می‌چرخاند؟",
      subject: "Tools",
      level: "A2",
      opts: [
        "نقطه مبدا (Reference Point)",
        "گوشه سمت چپ",
        "مرکز آرت‌بورد",
        "بالای شکل",
      ],
      ans: 0,
    },
    {
      text: "برای ایجاد کپی از یک آبجکت حین درگ کردن، کدام کلید را نگه می‌داریم؟",
      subject: "Tools",
      level: "A2",
      opts: ["Alt", "Shift", "Ctrl", "Tab"],
      ans: 0,
    },
    {
      text: "ابزار Eyedropper علاوه بر رنگ، چه چیزی را کپی می‌کند؟",
      subject: "Tools",
      level: "A2",
      opts: [
        "استایل‌های متن و افکت‌ها",
        "تعداد لایه‌ها",
        "اندازه آرت‌بورد",
        "نام فایل",
      ],
      ans: 0,
    },
    {
      text: "ابزار Blend Tool (W) برای چه کاری است؟",
      subject: "Tools",
      level: "A2",
      opts: [
        "ایجاد مراحل میانی بین دو شکل یا رنگ",
        "پاک کردن لایه",
        "رسم ستاره",
        "برش تصویر",
      ],
      ans: 0,
    },
    {
      text: "برای تغییر اندازه آرت‌بورد از چه ابزاری استفاده می‌شود؟",
      subject: "Tools",
      level: "A2",
      opts: [
        "Artboard Tool (Shift+O)",
        "Selection Tool",
        "Crop Tool",
        "Hand Tool",
      ],
      ans: 0,
    },
    {
      text: "ابزار Scale برای چه منظوری به کار می‌رود؟",
      subject: "Tools",
      level: "A2",
      opts: ["تغییر اندازه دقیق آبجکت", "چرخش", "برش", "رنگ‌آمیزی"],
      ans: 0,
    },
    {
      text: "ابزار Reflect (O) چه کاری انجام می‌دهد؟",
      subject: "Tools",
      level: "A2",
      opts: [
        "ایجاد قرینه (آینه‌ای) از آبجکت",
        "بزرگنمایی",
        "محو کردن",
        "تغییر ضخامت",
      ],
      ans: 0,
    },
    {
      text: "کاربرد ابزار Width Tool (Shift+W) چیست؟",
      subject: "Tools",
      level: "A2",
      opts: [
        "تغییر ضخامت خط در نقاط مختلف به صورت متغیر",
        "تغییر عرض آرت‌بورد",
        "افزایش تعداد نقاط لنگر",
        "تایپ متن",
      ],
      ans: 0,
    },

    // ==========================================
    // 5. Pathfinder (Level A2 - 10 Questions)
    // ==========================================
    {
      text: "دستور Unite در Pathfinder چه می‌کند؟",
      subject: "Pathfinder",
      level: "A2",
      opts: [
        "ترکیب تمام اشکال به یک شکل واحد",
        "برش اشکال",
        "جدا کردن لایه‌ها",
        "حذف رنگ",
      ],
      ans: 0,
    },
    {
      text: "دستور Minus Front چه عملی انجام می‌دهد؟",
      subject: "Pathfinder",
      level: "A2",
      opts: [
        "کم کردن شکل رویی از شکل زیری",
        "کم کردن شکل زیری از رویی",
        "ترکیب دو شکل",
        "ایجاد خط مشترک",
      ],
      ans: 0,
    },
    {
      text: "برای تبدیل تمام بخش‌های متقاطع به تکه‌های جداگانه از کدام گزینه استفاده می‌شود؟",
      subject: "Pathfinder",
      level: "A2",
      opts: ["Divide", "Trim", "Merge", "Crop"],
      ans: 0,
    },
    {
      text: "تفاوت دستور Intersect و Exclude چیست؟",
      subject: "Pathfinder",
      level: "A2",
      opts: [
        "اولى بخش مشترک را نگه می‌دارد، دومى بخش مشترک را حذف می‌کند",
        "برعکس است",
        "یکی هستند",
        "فقط روی متن کار می‌کنند",
      ],
      ans: 0,
    },
    {
      text: "دستور Minus Back چه می‌کند؟",
      subject: "Pathfinder",
      level: "A2",
      opts: [
        "شکل زیری را از رویی کم می‌کند",
        "شکل رویی را حذف می‌کند",
        "همه را یکی می‌کند",
        "رنگ را عوض می‌کند",
      ],
      ans: 0,
    },
    {
      text: "برای اینکه Pathfinder به صورت Non-destructive (قابل بازگشت) عمل کند، کدام کلید را حین کلیک نگه می‌داریم؟",
      subject: "Pathfinder",
      level: "A2",
      opts: ["Alt", "Shift", "Ctrl", "Space"],
      ans: 0,
    },
    {
      text: "دستور Crop در Pathfinder چه نتیجه‌ای دارد؟",
      subject: "Pathfinder",
      level: "A2",
      opts: [
        "فقط بخشی از اشکال که زیر شکل بالایی هستند باقی می‌ماند",
        "کل آرت‌بورد را می‌برد",
        "شکل را بزرگ می‌کند",
        "لایه را حذف می‌کند",
      ],
      ans: 0,
    },
    {
      text: "آیا Pathfinder روی گروه‌ها هم کار می‌کند؟",
      subject: "Pathfinder",
      level: "A2",
      opts: ["بله", "خیر", "فقط در نسخه جدید", "فقط روی متن"],
      ans: 0,
    },
    {
      text: "بعد از اجرای دستور Divide، آبجکت‌ها در چه حالتی قرار می‌گیرند؟",
      subject: "Pathfinder",
      level: "A2",
      opts: [
        "حالت گروه‌بندی شده (Grouped)",
        "حالت جداگانه",
        "ماسک شده",
        "قفل شده",
      ],
      ans: 0,
    },
    {
      text: "پنل Pathfinder در کدام منو قرار دارد؟",
      subject: "Pathfinder",
      level: "A2",
      opts: ["Window", "View", "Object", "Edit"],
      ans: 0,
    },

    // ==========================================
    // 6. Groups (Level A2 - 10 Questions)
    // ==========================================
    {
      text: "میانبر گروه‌بندی (Group) چیست؟",
      subject: "Groups",
      level: "A2",
      opts: ["Ctrl+G", "Ctrl+U", "Ctrl+Shift+G", "Ctrl+L"],
      ans: 0,
    },
    {
      text: "میانبر خارج کردن از گروه (Ungroup) چیست؟",
      subject: "Groups",
      level: "A2",
      opts: ["Ctrl+Shift+G", "Ctrl+G", "Ctrl+Alt+G", "Ctrl+Shift+U"],
      ans: 0,
    },
    {
      text: "Isolation Mode (حالت انزوا) چگونه فعال می‌شود؟",
      subject: "Groups",
      level: "A2",
      opts: [
        "دوبار کلیک روی یک گروه",
        "راست کلیک > Lock",
        "استفاده از Pen Tool",
        "فشردن کلید F",
      ],
      ans: 0,
    },
    {
      text: "مزیت اصلی Isolation Mode چیست؟",
      subject: "Groups",
      level: "A2",
      opts: [
        "ویرایش محتوای گروه بدون نیاز به Ungroup کردن",
        "تغییر رزولوشن",
        "افزایش سرعت سیستم",
        "چاپ سریع",
      ],
      ans: 0,
    },
    {
      text: "چگونه بفهمیم در حالت Isolation Mode هستیم؟",
      subject: "Groups",
      level: "A2",
      opts: [
        "ظهور یک نوار خاکستری در بالای آرت‌بورد",
        "تغییر رنگ آیکون‌ها",
        "بسته شدن پنل لایه‌ها",
        "ارور سیستم",
      ],
      ans: 0,
    },
    {
      text: "برای خروج از Isolation Mode چه کلیدی را می‌زنیم؟",
      subject: "Groups",
      level: "A2",
      opts: ["Esc", "Enter", "Space", "Shift"],
      ans: 0,
    },
    {
      text: "آیا می‌توان یک گروه را داخل گروه دیگر قرار داد (Nested Groups)؟",
      subject: "Groups",
      level: "A2",
      opts: ["بله", "خیر", "فقط تا ۲ مرحله", "فقط در فایل‌های PDF"],
      ans: 0,
    },
    {
      text: "در پنل Layers، یک گروه با چه علامتی مشخص می‌شود؟",
      subject: "Groups",
      level: "A2",
      opts: ["یک فلش کوچک کنار نام لایه", "یک قفل", "یک ستاره", "رنگ قرمز"],
      ans: 0,
    },
    {
      text: "اگر لایه‌ای قفل باشد، آیا می‌توان آن را در گروه قرار داد؟",
      subject: "Groups",
      level: "A2",
      opts: [
        "خیر، اول باید باز شود",
        "بله",
        "فقط با میانبر",
        "فقط در نسخه ۲۰۲۶",
      ],
      ans: 0,
    },
    {
      text: "آیا ویژگی‌هایی مثل Opacity را می‌توان به کل یک گروه اعمال کرد؟",
      subject: "Groups",
      level: "A2",
      opts: [
        "بله، به تمام اعضای گروه اعمال می‌شود",
        "خیر، باید تک تک زد",
        "فقط در پنل Stroke",
        "فقط برای متن",
      ],
      ans: 0,
    },
    // ==========================================
    // 7. PenTool (Level B1 - 10 Questions)
    // ==========================================
    {
      text: "برای ترسیم یک منحنی دقیق، بعد از ایجاد نقطه لنگر چه کاری باید انجام داد؟",
      subject: "PenTool",
      level: "B1",
      opts: [
        "کلیک و درگ کردن برای ایجاد Handle",
        "فقط کلیک کردن",
        "نگه داشتن کلید Shift",
        "استفاده از کلید Space",
      ],
      ans: 0,
    },
    {
      text: "نقش کلید Alt هنگام کار با ابزار Pen چیست؟",
      subject: "PenTool",
      level: "B1",
      opts: [
        "شکستن دستگیره‌ها و تغییر زاویه منحنی مستقل",
        "پاک کردن نقطه",
        "بستن مسیر",
        "کپی کردن کل مسیر",
      ],
      ans: 0,
    },
    {
      text: "کدام ابزار برای اضافه کردن نقطه لنگر به یک مسیر موجود به کار می‌رود؟",
      subject: "PenTool",
      level: "B1",
      opts: [
        "Add Anchor Point Tool (+)",
        "Delete Anchor Point Tool",
        "Direct Selection",
        "Eraser",
      ],
      ans: 0,
    },
    {
      text: "برای رسم خطوط دقیقاً عمودی، افقی یا ۴۵ درجه با Pen، کدام کلید را نگه می‌داریم؟",
      subject: "PenTool",
      level: "B1",
      opts: ["Shift", "Alt", "Ctrl", "Tab"],
      ans: 0,
    },
    {
      text: "چگونه می‌توان یک نقطه منحنی (Smooth) را به یک نقطه تیز (Corner) تبدیل کرد؟",
      subject: "PenTool",
      level: "B1",
      opts: [
        "استفاده از Anchor Point Tool (Shift+C)",
        "استفاده از ابزار Scissors",
        "فشردن کلید Delete",
        "تغییر رنگ Stroke",
      ],
      ans: 0,
    },
    {
      text: "اگر هنگام ترسیم، کلید Ctrl را نگه داریم، ابزار Pen موقتاً به چه ابزاری تبدیل می‌شود؟",
      subject: "PenTool",
      level: "B1",
      opts: [
        "Direct Selection Tool",
        "Selection Tool",
        "Rotate Tool",
        "Eyedropper",
      ],
      ans: 0,
    },
    {
      text: "دستگیره‌های (Handles) یک نقطه لنگر چه چیزی را کنترل می‌کنند؟",
      subject: "PenTool",
      level: "B1",
      opts: ["جهت و شدت انحنای مسیر", "ضخامت خط", "شفافیت رنگ", "موقعیت لایه"],
      ans: 0,
    },
    {
      text: "برای جدا کردن انتهای یک مسیر باز بدون بستن آن، چه کلیدی را می‌زنیم؟",
      subject: "PenTool",
      level: "B1",
      opts: ["P (برای انتخاب مجدد ابزار) یا Esc", "Ctrl+G", "Alt+L", "Shift+X"],
      ans: 0,
    },
    {
      text: "ابزار Curvature Tool چه تفاوتی با Pen Tool دارد؟",
      subject: "PenTool",
      level: "B1",
      opts: [
        "به صورت خودکار مسیرهای نرم و منحنی ایجاد می‌کند",
        "فقط خط صاف می‌کشد",
        "مخصوص تایپ است",
        "فقط برای حذف نقاط است",
      ],
      ans: 0,
    },
    {
      text: "میانبر J (Join) در انتخاب دو نقطه ابتدایی و انتهایی دو مسیر مجزا چه می‌کند؟",
      subject: "PenTool",
      level: "B1",
      opts: [
        "آن دو را با یک خط به هم متصل می‌کند",
        "هر دو را پاک می‌کند",
        "آن‌ها را گروه می‌کند",
        "رنگ آن‌ها را یکی می‌کند",
      ],
      ans: 0,
    },

    // ==========================================
    // 8. Masking (Level B1 - 10 Questions)
    // ==========================================
    {
      text: "در Clipping Mask، لایه‌ای که قرار است نقش 'قاب' را داشته باشد باید کجا باشد؟",
      subject: "Masking",
      level: "B1",
      opts: [
        "بالاترین لایه در انتخاب",
        "پایین‌ترین لایه",
        "فرقی نمی‌کند",
        "در یک فایل جداگانه",
      ],
      ans: 0,
    },
    {
      text: "میانبر ایجاد Clipping Mask چیست؟",
      subject: "Masking",
      level: "B1",
      opts: ["Ctrl+7", "Ctrl+8", "Ctrl+9", "Ctrl+M"],
      ans: 0,
    },
    {
      text: "تفاوت Opacity Mask با Clipping Mask چیست؟",
      subject: "Masking",
      level: "B1",
      opts: [
        "اولی بر اساس درجات خاکستری شفافیت ایجاد می‌کند",
        "اولی فقط برای متن است",
        "دومی مخصوص تصاویر رستر است",
        "تفاوتی ندارند",
      ],
      ans: 0,
    },
    {
      text: "چگونه محتوای داخل یک Clipping Mask را بدون Release کردن جابجا کنیم؟",
      subject: "Masking",
      level: "B1",
      opts: [
        "استفاده از ابزار Direct Selection",
        "استفاده از Pen Tool",
        "تغییر سایز آرت‌بورد",
        "با ابزار Rotate",
      ],
      ans: 0,
    },
    {
      text: "Draw Inside (Shift+D) چه کاربردی در ماسک کردن دارد؟",
      subject: "Masking",
      level: "B1",
      opts: [
        "ترسیم مستقیم محتوا در داخل یک شکل انتخابی (ماسک خودکار)",
        "رسم بیرون شکل",
        "رسم در لایه جدید",
        "پاک کردن داخل شکل",
      ],
      ans: 0,
    },
    {
      text: "اگر بخواهیم ماسک را از بین ببریم (Release)، چه میانبری می‌زنیم؟",
      subject: "Masking",
      level: "B1",
      opts: ["Alt+Ctrl+7", "Shift+Ctrl+7", "Ctrl+Z", "Ctrl+Delete"],
      ans: 0,
    },
    {
      text: "آیا می‌توان یک تصویر رستر (مثل JPG) را به عنوان 'قاب' ماسک استفاده کرد؟",
      subject: "Masking",
      level: "B1",
      opts: [
        "خیر، قاب باید وکتور باشد",
        "بله",
        "فقط در نسخه ۲۰۲۶",
        "فقط اگر سیاه و سفید باشد",
      ],
      ans: 0,
    },
    {
      text: "در پنل Transparency، برای ساخت Opacity Mask کدام دکمه را می‌زنیم؟",
      subject: "Masking",
      level: "B1",
      opts: ["Make Mask", "Clip", "Invert", "Isolate"],
      ans: 0,
    },
    {
      text: "گزینه Clip در تنظیمات Opacity Mask چه می‌کند؟",
      subject: "Masking",
      level: "B1",
      opts: [
        "پس‌زمینه ماسک را مشکی (مخفی) می‌کند",
        "ماسک را حذف می‌کند",
        "لایه را قفل می‌کند",
        "رنگ را برعکس می‌کند",
      ],
      ans: 0,
    },
    {
      text: "آیا می‌توان متن (Type) را بدون تبدیل به شکل، مستقیماً به عنوان ماسک استفاده کرد؟",
      subject: "Masking",
      level: "B1",
      opts: [
        "بله، متن قابلیت ماسک کردن دارد",
        "خیر، حتما باید Outline شود",
        "فقط فونت‌های خاص",
        "فقط در حالت ۳ بعدی",
      ],
      ans: 0,
    },

    // ==========================================
    // 9. Brushes (Level B1 - 10 Questions)
    // ==========================================
    {
      text: "کدام نوع براش برای شبیه‌سازی نوک قلم خوش‌نویسی استفاده می‌شود؟",
      subject: "Brushes",
      level: "B1",
      opts: [
        "Calligraphic Brush",
        "Art Brush",
        "Scatter Brush",
        "Bristle Brush",
      ],
      ans: 0,
    },
    {
      text: "براش Scatter چه رفتاری دارد؟",
      subject: "Brushes",
      level: "B1",
      opts: [
        "توزیع پراکنده اشیاء در اطراف مسیر",
        "کشیدن طرح در طول مسیر",
        "ایجاد بافت آبرنگی",
        "تکرار زنجیره‌ای",
      ],
      ans: 0,
    },
    {
      text: "اگر بخواهید یک لوگو را در طول یک منحنی بدون تکرار (Stretch شده) داشته باشید، از کدام براش استفاده می‌کنید؟",
      subject: "Brushes",
      level: "B1",
      opts: ["Art Brush", "Pattern Brush", "Scatter Brush", "Basic"],
      ans: 0,
    },
    {
      text: "Bristle Brush چه کاربردی دارد؟",
      subject: "Brushes",
      level: "B1",
      opts: [
        "شبیه‌سازی براش‌های طبیعی و نقاشی با رنگ روغن/آبرنگ",
        "رسم خطوط مهندسی",
        "ساخت پترن چاپی",
        "برش وکتور",
      ],
      ans: 0,
    },
    {
      text: "چگونه یک شکل وکتوری را به یک براش جدید تبدیل کنیم؟",
      subject: "Brushes",
      level: "B1",
      opts: [
        "کشیدن آبجکت به داخل پنل Brushes",
        "منوی File > Save Brush",
        "استفاده از ابزار Pen",
        "راست کلیک > Make Brush",
      ],
      ans: 0,
    },
    {
      text: "در تنظیمات Pattern Brush، گزینه‌ی Corners برای چیست؟",
      subject: "Brushes",
      level: "B1",
      opts: [
        "تعریف نحوه نمایش براش در گوشه‌های تیز مسیر",
        "گرد کردن کل خط",
        "تغییر ضخامت",
        "حذف لبه‌ها",
      ],
      ans: 0,
    },
    {
      text: "تفاوت میانبر Paintbrush (B) و Blob Brush (Shift+B) چیست؟",
      subject: "Brushes",
      level: "B1",
      opts: [
        "B مسیر (Stroke) می‌سازد، Shift+B شکل (Fill) می‌سازد",
        "برعکس است",
        "یکی هستند",
        "دومی فقط برای پاک کردن است",
      ],
      ans: 0,
    },
    {
      text: "برای تغییر اندازه نوک براش حین کار از چه کلیدی استفاده می‌شود؟",
      subject: "Brushes",
      level: "B1",
      opts: ["[ و ] (چاکلت)", "Shift", "Alt", "کلیدهای اعداد"],
      ans: 0,
    },
    {
      text: "گزینه Fidelity در تنظیمات براش چه کاری انجام می‌دهد؟",
      subject: "Brushes",
      level: "B1",
      opts: [
        "تنظیم میزان نرمی و دقت خط ترسیم شده نسبت به حرکت دست",
        "تغییر رنگ",
        "تغییر شفافیت",
        "افزایش ضخامت",
      ],
      ans: 0,
    },
    {
      text: "چگونه اثر براش را به یک شکل قابل ویرایش (Fill) تبدیل کنیم؟",
      subject: "Brushes",
      level: "B1",
      opts: [
        "Object > Expand Appearance",
        "Object > Group",
        "File > Export",
        "پنل Stroke > Weight",
      ],
      ans: 0,
    },

    // ==========================================
    // 10. Appearance (Level B2 - 10 Questions)
    // ==========================================
    {
      text: "کاربرد اصلی پنل Appearance چیست؟",
      subject: "Appearance",
      level: "B2",
      opts: [
        "مدیریت چندین استایل، Fill و Stroke روی یک آبجکت",
        "تغییر فونت",
        "مدیریت لایه‌ها",
        "خروجی گرفتن",
      ],
      ans: 0,
    },
    {
      text: "چگونه می‌توان به یک متن، دو خط دور (Stroke) با رنگ‌های مختلف داد؟",
      subject: "Appearance",
      level: "B2",
      opts: [
        "از طریق پنل Appearance و گزینه Add New Stroke",
        "با کپی کردن متن روی هم",
        "با ابزار Pen",
        "امکان‌پذیر نیست",
      ],
      ans: 0,
    },
    {
      text: "آیکون fx در پنل Appearance به چه معناست؟",
      subject: "Appearance",
      level: "B2",
      opts: [
        "یک افکت زنده (Live Effect) به لایه اعمال شده است",
        "لایه قفل است",
        "فایل خطا دارد",
        "لایه مخصوص متن است",
      ],
      ans: 0,
    },
    {
      text: "اگر در پنل Appearance، لایه Stroke زیر لایه Fill قرار بگیرد چه اتفاقی می‌افتد؟",
      subject: "Appearance",
      level: "B2",
      opts: [
        "نیمی از ضخامت خط توسط رنگ داخلی پوشانده می‌شود",
        "خط دور ناپدید می‌شود",
        "رنگ عوض می‌شود",
        "فرقی نمی‌کند",
      ],
      ans: 0,
    },
    {
      text: "چگونه یک تنظیمات پیچیده در Appearance را برای استفاده‌های بعدی ذخیره کنیم؟",
      subject: "Appearance",
      level: "B2",
      opts: [
        "ذخیره در پنل Graphic Styles",
        "ذخیره در Swatches",
        "منوی File > Save",
        "کپی کردن لایه",
      ],
      ans: 0,
    },
    {
      text: "گزینه Clear Appearance چه کاری انجام می‌دهد؟",
      subject: "Appearance",
      level: "B2",
      opts: [
        "تمام رنگ‌ها و افکت‌ها را حذف کرده و آبجکت را بدون استایل می‌کند",
        "آبجکت را پاک می‌کند",
        "لایه را قفل می‌کند",
        "فقط افکت‌ها را می‌برد",
      ],
      ans: 1,
    },
    {
      text: "آیا می‌توان به یک Fill در پنل Appearance، شفافیت (Opacity) جداگانه داد؟",
      subject: "Appearance",
      level: "B2",
      opts: [
        "بله، هر Fill یا Stroke تنظیمات Transparency مستقل دارد",
        "خیر، برای کل آبجکت است",
        "فقط در حالت گرادینت",
        "فقط برای گروه‌ها",
      ],
      ans: 0,
    },
    {
      text: "چرا استفاده از Appearance بهتر از کپی کردن لایه‌ها روی هم است؟",
      subject: "Appearance",
      level: "B2",
      opts: [
        "ویرایش سریع‌تر و تمیز ماندن پنل لایه‌ها",
        "افزایش حجم فایل",
        "دقت کمتر",
        "عدم نیاز به رنگ",
      ],
      ans: 0,
    },
    {
      text: "استفاده از افکت 'Offset Path' در پنل Appearance چه مزیتی دارد؟",
      subject: "Appearance",
      level: "B2",
      opts: [
        "ایجاد استروک‌های با فاصله از مرکز بدون تغییر شکل اصلی",
        "گرد کردن گوشه‌ها",
        "سه بعدی کردن",
        "سیاه و سفید کردن",
      ],
      ans: 0,
    },
    {
      text: "برای تغییر چیدمان Fill و Stroke در Appearance چه باید کرد؟",
      subject: "Appearance",
      level: "B2",
      opts: [
        "کشیدن و رها کردن (Drag & Drop) لایه‌ها در خود پنل",
        "استفاده از میانبر Ctrl+J",
        "رفتن به منوی Object",
        "تغییر نام لایه",
      ],
      ans: 0,
    },

    // ==========================================
    // 11. Typography (Level B2 - 10 Questions)
    // ==========================================
    {
      text: "تفاوت Point Type و Area Type چیست؟",
      subject: "Typography",
      level: "B2",
      opts: [
        "اولى برای کلمات کوتاه و دومى برای پاراگراف است",
        "فرقی ندارند",
        "Area Type فقط دایره‌ای است",
        "Point Type وکتور نیست",
      ],
      ans: 0,
    },
    {
      text: "کرنینگ (Kerning) به چه معناست؟",
      subject: "Typography",
      level: "B2",
      opts: [
        "تنظیم فاصله بین دو حرف خاص",
        "فاصله بین خطوط",
        "ضخامت قلم",
        "بزرگی حروف",
      ],
      ans: 0,
    },
    {
      text: "لیدینگ (Leading) در پنل Character چه چیزی را کنترل می‌کند؟",
      subject: "Typography",
      level: "B2",
      opts: [
        "فاصله عمودی بین خطوط پاراگراف",
        "فاصله بین کلمات",
        "کشش حروف",
        "شفافیت متن",
      ],
      ans: 0,
    },
    {
      text: "ابزار Touch Type Tool (Shift+T) چه کاربردی دارد؟",
      subject: "Typography",
      level: "B2",
      opts: [
        "تغییر سایز و چرخش هر حرف به صورت جداگانه بدون شکستن متن",
        "پاک کردن متن",
        "تبدیل متن به وکتور",
        "غلط‌گیری",
      ],
      ans: 0,
    },
    {
      text: "چگونه متن را روی یک مسیر منحنی (مثلاً دایره) تایپ کنیم؟",
      subject: "Typography",
      level: "B2",
      opts: [
        "ابزار Type on a Path Tool",
        "ابزار Pen",
        "ابزار Rotate",
        "پنل Pathfinder",
      ],
      ans: 0,
    },
    {
      text: "Glyphs Panel برای چه کاری استفاده می‌شود؟",
      subject: "Typography",
      level: "B2",
      opts: [
        "دسترسی به کاراکترهای خاص و نمادهای مخفی فونت",
        "تغییر رنگ",
        "سه بعدی کردن",
        "ایجاد سایه",
      ],
      ans: 0,
    },
    {
      text: "قابلیت Threaded Text در ایلاستریتور چیست؟",
      subject: "Typography",
      level: "B2",
      opts: [
        "اتصال چند کادر متن به هم تا متن از یکی به دیگری سرازیر شود",
        "تایپ چند رنگه",
        "نوشتن روی عکس",
        "قفل کردن فونت",
      ],
      ans: 0,
    },
    {
      text: "گزینه Tracking چه تفاوتی با Kerning دارد؟",
      subject: "Typography",
      level: "B2",
      opts: [
        "Tracking فاصله کل حروف یک کلمه را به صورت یکنواخت تغییر می‌دهد",
        "فرقی ندارند",
        "Tracking برای ارتفاع است",
        "Kerning برای وب است",
      ],
      ans: 0,
    },
    {
      text: "برای قرار دادن متن داخل یک شکل خاص (مثلاً ستاره) چه باید کرد؟",
      subject: "Typography",
      level: "B2",
      opts: [
        "کلیک با ابزار Area Type داخل شکل مورد نظر",
        "استفاده از Clipping Mask",
        "تایپ معمولی و چرخاندن",
        "استفاده از Pathfinder",
      ],
      ans: 0,
    },
    {
      text: "تغییر حروف کوچک به بزرگ (All Caps) در کدام پنل است؟",
      subject: "Typography",
      level: "B2",
      opts: ["پنل Character", "پنل Paragraph", "پنل Layers", "منوی View"],
      ans: 0,
    },

    // ==========================================
    // 12. Effects (Level B2 - 10 Questions)
    // ==========================================
    {
      text: "تفاوت Illustrator Effects و Photoshop Effects در ایلاستریتور چیست؟",
      subject: "Effects",
      level: "B2",
      opts: [
        "اولى وکتور باقی می‌ماند، دومى رستر (پیکسلی) می‌شود",
        "فرقی ندارند",
        "دومی کیفیت بالاتری دارد",
        "اولی فقط سیاه سفید است",
      ],
      ans: 0,
    },
    {
      text: "افکت Drop Shadow در کدام دسته قرار دارد؟",
      subject: "Effects",
      level: "B2",
      opts: ["Stylize", "Distort", "Blur", "Path"],
      ans: 0,
    },
    {
      text: "چگونه می‌توان یک افکت اعمال شده را ویرایش کرد؟",
      subject: "Effects",
      level: "B2",
      opts: [
        "کلیک روی نام افکت در پنل Appearance",
        "اعمال دوباره افکت",
        "استفاده از Ctrl+Z",
        "رفتن به منوی File",
      ],
      ans: 0,
    },
    {
      text: "افکت Gaussian Blur چه تغییری در آبجکت ایجاد می‌کند؟",
      subject: "Effects",
      level: "B2",
      opts: [
        "محو کردن و نرم کردن لبه‌های شکل",
        "تیز کردن لبه‌ها",
        "سه بعدی کردن",
        "شطرنجی کردن",
      ],
      ans: 0,
    },
    {
      text: "برای تبدیل یک افکت 'ظاهری' به 'مسیرهای واقعی وکتوری' از چه دستوری استفاده می‌شود؟",
      subject: "Effects",
      level: "B2",
      opts: [
        "Object > Expand Appearance",
        "Object > Group",
        "Edit > Copy",
        "View > Outline",
      ],
      ans: 0,
    },
    {
      text: "افکت Pucker & Bloat چه کاری انجام می‌دهد؟",
      subject: "Effects",
      level: "B2",
      opts: [
        "تغییر شکل آبجکت با کشیدن یا فشار دادن لبه‌ها به داخل و خارج",
        "تغییر رنگ",
        "ایجاد سایه",
        "برش تصویر",
      ],
      ans: 0,
    },
    {
      text: "Document Raster Effects Settings برای چیست؟",
      subject: "Effects",
      level: "B2",
      opts: [
        "تنظیم رزولوشن خروجی افکت‌هایی مثل سایه و بلور",
        "تغییر فونت",
        "مدیریت لایه‌ها",
        "ذخیره فایل",
      ],
      ans: 0,
    },
    {
      text: "افکت Roughen چه تغییری در لبه‌های وکتور ایجاد می‌کند؟",
      subject: "Effects",
      level: "B2",
      opts: [
        "ایجاد ناهمواری و حالت دندانه‌دار در مسیر",
        "صاف کردن مسیر",
        "گرد کردن گوشه‌ها",
        "تغییر ضخامت",
      ],
      ans: 0,
    },
    {
      text: "Transform Effect در منوی Effect چه تفاوتی با ابزار Transform دارد؟",
      subject: "Effects",
      level: "B2",
      opts: [
        "یک افکت زنده است که می‌توان تعداد کپی‌ها را در آن تنظیم کرد",
        "فرقی ندارند",
        "فقط برای چرخش است",
        "کیفیت را کم می‌کند",
      ],
      ans: 0,
    },
    {
      text: "کدام افکت برای ایجاد حالت بافت‌دار (Texture) پیکسلی روی وکتور استفاده می‌شود؟",
      subject: "Effects",
      level: "B2",
      opts: ["Grain", "Drop Shadow", "Zig Zag", "Free Distort"],
      ans: 0,
    },
    // ==========================================
    // C1: Mesh (5 Questions)
    // ==========================================
    {
      text: "Gradient Mesh برای چه هدفی استفاده می‌شود؟",
      subject: "Mesh",
      level: "C1",
      opts: [
        "ایجاد رنگ‌آمیزی‌های واقع‌گرایانه پیچیده",
        "رسم جدول",
        "برش تصویر",
        "تایپ متن",
      ],
      ans: 0,
    },
    {
      text: "چگونه به یک شبکه Mesh رنگ اضافه کنیم؟",
      subject: "Mesh",
      level: "C1",
      opts: [
        "انتخاب نقطه Mesh و کلیک روی رنگ در Swatches",
        "با ابزار Brush",
        "با ابزار Eraser",
        "در منوی فیلتر",
      ],
      ans: 0,
    },
    {
      text: "ابزار Mesh Tool با چه کلیدی فعال می‌شود؟",
      subject: "Mesh",
      level: "C1",
      opts: ["U", "M", "G", "N"],
      ans: 0,
    },
    {
      text: "آیا می‌توان یک عکس را مستقیم به Mesh تبدیل کرد؟",
      subject: "Mesh",
      level: "C1",
      opts: [
        "خیر، اول باید وکتور شود",
        "بله",
        "فقط در فرمت PNG",
        "فقط در نسخه ۲۰۲۶",
      ],
      ans: 0,
    },
    {
      text: "تفاوت Mesh با Gradient معمولی چیست؟",
      subject: "Mesh",
      level: "C1",
      opts: [
        "Mesh اجازه کنترل رنگ در جهت‌های مختلف را می‌دهد",
        "فرقی ندارند",
        "Mesh فقط سیاه سفید است",
        "Gradient کیفیت بیشتری دارد",
      ],
      ans: 0,
    },

    // ==========================================
    // C1: 3D (5 Questions)
    // ==========================================
    {
      text: "گزینه Revolve در منوی 3D برای ساخت چه اجسامی است؟",
      subject: "3D",
      level: "C1",
      opts: ["اجسام مدور (مثل بطری)", "مکعب‌ها", "متن برجسته", "سایه تخت"],
      ans: 0,
    },
    {
      text: "Extrude & Bevel چه تغییری در شکل ایجاد می‌کند؟",
      subject: "3D",
      level: "C1",
      opts: [
        "دادن عمق و برجستگی به شکل دو بعدی",
        "چرخش دو بعدی",
        "تغییر رنگ",
        "محو کردن لبه",
      ],
      ans: 0,
    },
    {
      text: "قابلیت Map Art در تنظیمات 3D چیست؟",
      subject: "3D",
      level: "C1",
      opts: [
        "چسباندن یک طرح وکتوری روی سطوح جسم سه بعدی",
        "تغییر نور",
        "برش جسم",
        "ذخیره فایل",
      ],
      ans: 0,
    },
    {
      text: "در پنل 3D and Materials، گزینه Ray Tracing برای چیست؟",
      subject: "3D",
      level: "C1",
      opts: [
        "رندر با کیفیت و واقع‌گرایانه نور و سایه",
        "تغییر فونت",
        "افزایش سرعت",
        "حذف لایه‌ها",
      ],
      ans: 0,
    },
    {
      text: "Inflate در ابزارهای جدید 3D چه کاری انجام می‌دهد؟",
      subject: "3D",
      level: "C1",
      opts: [
        "ایجاد حالت پف‌کرده و نرم به اشیاء",
        "تخت کردن شکل",
        "برش وکتور",
        "سیاه سفید کردن",
      ],
      ans: 0,
    },

    // ==========================================
    // C1: Perspective (5 Questions)
    // ==========================================
    {
      text: "ابزار Perspective Grid (Shift+P) چه کاربردی دارد؟",
      subject: "Perspective",
      level: "C1",
      opts: [
        "رسم و تراز کردن اشیاء در فضای پرسپکتیو",
        "برش عکس",
        "تغییر رزولوشن",
        "مدیریت براش",
      ],
      ans: 0,
    },
    {
      text: "چگونه یک آبجکت را به یکی از وجوه پرسپکتیو منتقل کنیم؟",
      subject: "Perspective",
      level: "C1",
      opts: [
        "استفاده از ابزار Perspective Selection Tool",
        "با ابزار Move",
        "با ابزار Rotate",
        "با Pen",
      ],
      ans: 0,
    },
    {
      text: "ویجت دایره‌ای در پرسپکتیو برای چیست؟",
      subject: "Perspective",
      level: "C1",
      opts: [
        "انتخاب وجه فعال برای رسم (چپ، راست یا پایین)",
        "تغییر رنگ",
        "حذف شبکه",
        "زوم کردن",
      ],
      ans: 0,
    },
    {
      text: "چند نوع شبکه پرسپکتیو در ایلاستریتور داریم؟",
      subject: "Perspective",
      level: "C1",
      opts: ["۱، ۲ و ۳ نقطه‌ای", "فقط ۱ نقطه‌ای", "ایزومتریک", "مخصوص وب"],
      ans: 0,
    },
    {
      text: "چگونه شبکه پرسپکتیو را مخفی کنیم؟",
      subject: "Perspective",
      level: "C1",
      opts: ["Ctrl+Shift+I", "Ctrl+H", "Ctrl+D", "Esc"],
      ans: 0,
    },

    // ==========================================
    // C2: Automation (5 Questions)
    // ==========================================
    {
      text: "Actions در ایلاستریتور چه کاربردی دارد؟",
      subject: "Automation",
      level: "C2",
      opts: [
        "ضبط و تکرار خودکار مجموعه‌ای از دستورات",
        "طراحی هوشمند لوگو",
        "چاپ سریع",
        "تغییر زبان",
      ],
      ans: 0,
    },
    {
      text: "استفاده از Scripts (اسکریپت) چه مزیتی دارد؟",
      subject: "Automation",
      level: "C2",
      opts: [
        "اجرای کدهای منطقی پیچیده برای اتوماسیون",
        "رسم دستی",
        "تغییر رنگ",
        "پاک کردن فایل",
      ],
      ans: 0,
    },
    {
      text: "Batch Processing برای چه کاری است؟",
      subject: "Automation",
      level: "C2",
      opts: [
        "اعمال یک اکشن روی تعداد زیادی فایل به صورت خودکار",
        "خروجی گرفتن تک فایل",
        "رسم ستاره",
        "مدیریت لایه‌ها",
      ],
      ans: 0,
    },
    {
      text: "فرمت اسکریپت‌های ایلاستریتور معمولاً چیست؟",
      subject: "Automation",
      level: "C2",
      opts: [".js یا .jsx", ".exe", ".psd", ".txt"],
      ans: 0,
    },
    {
      text: "Variables Panel برای چه هدفی استفاده می‌شود؟",
      subject: "Automation",
      level: "C2",
      opts: [
        "تولید انبوه طرح‌ها (مثل کارت ویزیت) با داده‌های متغیر",
        "تغییر فونت",
        "رسم براش",
        "ایجاد سایه",
      ],
      ans: 0,
    },

    // ==========================================
    // C2: PrintTech (5 Questions)
    // ==========================================
    {
      text: "Bleed در آماده‌سازی فایل چاپ به چه معناست؟",
      subject: "PrintTech",
      level: "C2",
      opts: [
        "حاشیه اطمینان برش برای جلوگیری از لبه‌های سفید",
        "رزولوشن بالا",
        "نوع کاغذ",
        "مد رنگی",
      ],
      ans: 0,
    },
    {
      text: "تفاوت Spot Color با Process Color چیست؟",
      subject: "PrintTech",
      level: "C2",
      opts: [
        "Spot رنگ ساخته شده آماده (پنتون) است",
        "Spot فقط برای وب است",
        "Process کیفیت بیشتری دارد",
        "تفاوتی ندارند",
      ],
      ans: 0,
    },
    {
      text: "Overprint Preview برای چیست؟",
      subject: "PrintTech",
      level: "C2",
      opts: [
        "مشاهده نحوه روی هم افتادن رنگ‌های چاپ",
        "پیش‌نمایش وب",
        "دیدن لایه‌های مخفی",
        "زوم ۱۰۰ درصد",
      ],
      ans: 0,
    },
    {
      text: "مفهوم Rich Black در چاپ افست چیست؟",
      subject: "PrintTech",
      level: "C2",
      opts: [
        "ترکیب سیاه با درصدی از سایر رنگ‌های CMYK برای عمق بیشتر",
        "سیاه خالص ۱۰۰ درصد",
        "رنگ خاکستری",
        "رنگ مخصوص مانیتور",
      ],
      ans: 0,
    },
    {
      text: "چرا قبل از چاپ باید شفافیت‌ها را Flatten کرد؟",
      subject: "PrintTech",
      level: "C2",
      opts: [
        "برای جلوگیری از خطاهای احتمالی در دستگاه‌های چاپ قدیمی (RIP)",
        "برای کاهش حجم",
        "برای تغییر رنگ",
        "برای تغییر فونت",
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
      `Successfully imported ${formattedQuestions.length} Adobe Ai questions!`,
    );
  } catch (err) {
    console.error("Adobe Ai Import failed:", err);
  }
};

export default AdobeAiQuestions;
