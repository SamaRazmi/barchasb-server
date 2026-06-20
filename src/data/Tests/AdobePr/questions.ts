import prisma from "../../../config/prisma";

const AdobePrQuestions = async (typeId: string) => {
  const rawQuestions = [
    // ==========================================
    // A1: Basics (8 Questions)
    // ==========================================
    {
      text: "ماهیت اصلی نرم‌افزار Adobe Premiere Pro چیست؟",
      subject: "Basics",
      level: "A1",
      opts: ["تدوین غیرخطی ویدیو (NLE)", "طراحی گرافیک برداری", "ویرایش تخصصی تک عکس", "ساخت انیمیشن سه بعدی"],
      ans: 0,
    },
    {
      text: "پنل Project در پریمیر چه وظیفه‌ای دارد؟",
      subject: "Basics",
      level: "A1",
      opts: [
        "نگهداری و مدیریت فایل‌های وارد شده به پروژه",
        "نمایش نهایی ویدیو",
        "برش کلیپ‌ها",
        "تنظیم صدای خروجی",
      ],
      ans: 0,
    },
    {
      text: "فضای کاری (Workspace) پیش‌فرض برای شروع تدوین کدام است؟",
      subject: "Basics",
      level: "A1",
      opts: ["Editing", "Color", "Effects", "Audio"],
      ans: 0,
    },
    {
      text: "تفاوت Source Monitor و Program Monitor چیست؟",
      subject: "Basics",
      level: "A1",
      opts: [
        "Source برای مشاهده فایل خام و Program برای مشاهده تایم‌لاین است",
        "برعکس است",
        "هر دو یکی هستند",
        "اولی برای صدا و دومی برای ویدیو است",
      ],
      ans: 0,
    },
    {
      text: "خط عمودی آبی رنگ در تایم‌لاین که موقعیت زمانی را نشان می‌دهد چه نام دارد؟",
      subject: "Basics",
      level: "A1",
      opts: ["Playhead (CTI)", "Razor", "Marker", "Handle"],
      ans: 0,
    },
    {
      text: "برای ذخیره کردن پروژه از کدام کلید میانبر استفاده می‌شود؟",
      subject: "Basics",
      level: "A1",
      opts: ["Ctrl+S", "Ctrl+N", "Ctrl+I", "Ctrl+E"],
      ans: 0,
    },
    {
      text: "منظور از Frame Rate در یک ویدیو چیست؟",
      subject: "Basics",
      level: "A1",
      opts: ["تعداد فریم‌های نمایش داده شده در هر ثانیه", "سرعت رندر گرفتن", "رزولوشن تصویر", "تعداد لایه‌های صوتی"],
      ans: 0,
    },
    {
      text: "کدام پنل برای کنترل پارامترهای افکت‌های اعمال شده به کار می‌رود؟",
      subject: "Basics",
      level: "A1",
      opts: ["Effect Controls", "Effects", "Tools", "History"],
      ans: 0,
    },

    // ==========================================
    // A1: Import (8 Questions)
    // ==========================================
    {
      text: "سریع‌ترین راه برای وارد کردن (Import) فایل به پروژه چیست؟",
      subject: "Import",
      level: "A1",
      opts: [
        "دوبار کلیک در پنل Project یا کشیدن فایل به داخل آن",
        "منوی File > Save",
        "استفاده از ابزار Pen",
        "راست کلیک روی تایم‌لاین",
      ],
      ans: 0,
    },
    {
      text: "هنگام Import فایل PSD، کدام گزینه لایه‌ها را به صورت مجزا وارد می‌کند؟",
      subject: "Import",
      level: "A1",
      opts: ["Individual Layers", "Merge All Layers", "Sequence", "Footage"],
      ans: 0,
    },
    {
      text: "Media Browser چه مزیتی نسبت به Import معمولی دارد؟",
      subject: "Import",
      level: "A1",
      opts: [
        "پیش‌نمایش فایل‌ها قبل از وارد کردن و پشتیبانی از ساختار دوربین‌ها",
        "سرعت کمتر",
        "حذف خودکار صدا",
        "تغییر رنگ ویدیو",
      ],
      ans: 0,
    },
    {
      text: "اگر فایلی در سیستم جابجا شود، پریمیر چه خطایی می‌دهد؟",
      subject: "Import",
      level: "A1",
      opts: ["Media Offline", "Export Error", "Direct Link Error", "Codec Missing"],
      ans: 0,
    },
    {
      text: "آیا می‌توان یک فایل Premiere دیگر را در پروژه فعلی Import کرد؟",
      subject: "Import",
      level: "A1",
      opts: ["بله، به صورت یک پروژه کامل یا سکانس‌های انتخابی", "خیر", "فقط در نسخه مک", "فقط با فرمت XML"],
      ans: 0,
    },
    {
      text: "کدام فرمت تصویری لایه شفاف (Alpha) را در پریمیر حفظ می‌کند؟",
      subject: "Import",
      level: "A1",
      opts: ["PNG", "JPEG", "BMP", "GIF"],
      ans: 0,
    },
    {
      text: "منظور از Ingest در هنگام ورود فایل چیست؟",
      subject: "Import",
      level: "A1",
      opts: ["کپی یا تبدیل همزمان فایل‌ها هنگام ورود به پروژه", "حذف فایل", "خروجی گرفتن", "برش کلیپ"],
      ans: 0,
    },
    {
      text: "برای وارد کردن مستقیم محتویات یک پوشه، چه باید کرد؟",
      subject: "Import",
      level: "A1",
      opts: ["Import کردن کل پوشه (Folder)", "انتخاب تک تک فایل‌ها", "استفاده از Drag", "امکان‌پذیر نیست"],
      ans: 0,
    },

    // ==========================================
    // A2: Tools (8 Questions)
    // ==========================================
    {
      text: "میانبر ابزار Selection Tool چیست؟",
      subject: "Tools",
      level: "A2",
      opts: ["V", "C", "R", "A"],
      ans: 0,
    },
    {
      text: "کدام ابزار برای برش مستقیم کلیپ در تایم‌لاین استفاده می‌شود؟",
      subject: "Tools",
      level: "A2",
      opts: ["Razor Tool (C)", "Selection Tool", "Track Select", "Slip Tool"],
      ans: 0,
    },
    {
      text: "ابزار Ripple Edit (B) چه کاری انجام می‌دهد؟",
      subject: "Tools",
      level: "A2",
      opts: [
        "تغییر طول یک کلیپ و جابجایی خودکار بقیه کلیپ‌ها برای بستن فضای خالی",
        "فقط برش",
        "ایجاد ترنزیشن",
        "تغییر رنگ",
      ],
      ans: 0,
    },
    {
      text: "برای انتخاب تمام کلیپ‌های موجود در یک ترک از یک نقطه به بعد، کدام ابزار مناسب است؟",
      subject: "Tools",
      level: "A2",
      opts: ["Track Select Forward (A)", "Selection Tool", "Razor Tool", "Rolling Edit"],
      ans: 0,
    },
    {
      text: "ابزار Rolling Edit چه تفاوتی با Ripple دارد؟",
      subject: "Tools",
      level: "A2",
      opts: [
        "نقطه برش بین دو کلیپ را جابجا می‌کند بدون تغییر در طول کل تایم‌لاین",
        "کل زمان را زیاد می‌کند",
        "صدا را قطع می‌کند",
        "فقط یک کلیپ را جابجا می‌کند",
      ],
      ans: 0,
    },
    {
      text: "ابزار Rate Stretch (R) چه کاربردی دارد؟",
      subject: "Tools",
      level: "A2",
      opts: ["تغییر سرعت کلیپ با کشیدن لبه‌های آن در تایم‌لاین", "ایجاد ماسک", "بزرگنمایی", "برش دقیق"],
      ans: 0,
    },
    {
      text: "برای جابجایی محتوای داخل یک کلیپ بدون تغییر مکان آن در تایم‌لاین از چه ابزاری استفاده می‌شود؟",
      subject: "Tools",
      level: "A2",
      opts: ["Slip Tool (Y)", "Slide Tool (U)", "Pen Tool", "Hand Tool"],
      ans: 0,
    },
    {
      text: "ابزار Pen در تایم‌لاین پریمیر چه کاربردی دارد؟",
      subject: "Tools",
      level: "A2",
      opts: ["ایجاد کی‌فریم برای تغییرات صدا و شفافیت", "برش ویدیو", "تایپ متن", "بزرگنمایی"],
      ans: 0,
    },

    // ==========================================
    // A2: Sequence (8 Questions)
    // ==========================================
    {
      text: "Sequence در پریمیر به چه معناست؟",
      subject: "Sequence",
      level: "A2",
      opts: [
        "ظرفی که لایه‌های ویدیو و صدا در آن چیده و تدوین می‌شوند",
        "یک فرمت خروجی",
        "ابزار برش",
        "پالت تنظیمات رنگ",
      ],
      ans: 0,
    },
    {
      text: "سریع‌ترین راه برای ساخت یک سکانس مطابق با تنظیمات ویدیو چیست؟",
      subject: "Sequence",
      level: "A2",
      opts: ["کشیدن ویدیو روی آیکون New Item", "منوی File > New", "استفاده از Ctrl+N", "راست کلیک روی دسکتاپ"],
      ans: 0,
    },
    {
      text: "اگر رزولوشن ویدیو با سکانس متفاوت باشد، کدام گزینه ویدیو را هم‌اندازه سکانس می‌کند؟",
      subject: "Sequence",
      level: "A2",
      opts: ["Set to Frame Size", "Scale to 100%", "Crop", "Nest"],
      ans: 0,
    },
    {
      text: "تنظیمات Timebase در سکانس به چه معنی است؟",
      subject: "Sequence",
      level: "A2",
      opts: ["تعداد فریم بر ثانیه سکانس", "زمان کل پروژه", "سرعت رندر", "حجم فایل نهایی"],
      ans: 0,
    },
    {
      text: "Audio Channels در تنظیمات سکانس معمولاً روی چه حالتی قرار دارد؟",
      subject: "Sequence",
      level: "A2",
      opts: ["Stereo", "Mono", "5.1", "Adaptive"],
      ans: 0,
    },
    {
      text: "تفاوت میانبر Enter و Ctrl+Render در تایم‌لاین چیست؟",
      subject: "Sequence",
      level: "A2",
      opts: ["Enter بخش‌های قرمز را رندر (Pre-render) می‌کند", "فرقی ندارند", "Enter فایل را ذخیره می‌کند", "Enter صدا را قطع می‌کند"],
      ans: 0,
    },
    {
      text: "نوار رنگی بالای تایم‌لاین (زرد، قرمز، سبز) نشانه چیست؟",
      subject: "Sequence",
      level: "A2",
      opts: ["وضعیت رندر و روانی پخش (Real-time playback)", "میزان بلندی صدا", "تعداد لایه‌ها", "خطاهای فایل"],
      ans: 0,
    },
    {
      text: "چگونه می‌توان ابعاد یک سکانس ساخته شده را تغییر داد؟",
      subject: "Sequence",
      level: "A2",
      opts: ["Sequence > Sequence Settings", "File > Export", "Tools > Scale", "امکان‌پذیر نیست"],
      ans: 0,
    },

    // ==========================================
    // B1: Color (8 Questions)
    // ==========================================
    {
      text: "پنل اصلی برای اصلاح رنگ و درجه‌بندی رنگ در پریمیر چیست؟",
      subject: "Color",
      level: "B1",
      opts: ["Lumetri Color", "Color Wheels", "Effects", "Info"],
      ans: 0,
    },
    {
      text: "بخش Basic Correction در لومتری شامل کدام تنظیمات است؟",
      subject: "Color",
      level: "B1",
      opts: ["White Balance, Exposure, Contrast", "Masking", "Audio Gain", "Text Styles"],
      ans: 0,
    },
    {
      text: "ابزار White Balance Selector (قطره‌چکان) چه کاری انجام می‌دهد؟",
      subject: "Color",
      level: "B1",
      opts: ["تنظیم دمای رنگ با کلیک روی یک نقطه سفید یا خاکستری خنثی", "تغییر رنگ سیاه", "حذف پرده سبز", "بزرگنمایی"],
      ans: 0,
    },
    {
      text: "تفاوت Saturation و Vibrance در چیست؟",
      subject: "Color",
      level: "B1",
      opts: [
        "Vibrance هوشمندانه روی رنگ‌های کدر اثر می‌گذارد و از اشباع بیش از حد پوست جلوگیری می‌کند",
        "یکی هستند",
        "Saturation فقط برای رنگ قرمز است",
        "Vibrance کیفیت را کم می‌کند",
      ],
      ans: 0,
    },
    {
      text: "کاربرد بخش Creative در پنل لومتری چیست؟",
      subject: "Color",
      level: "B1",
      opts: ["اعمال Look‌ها و تنظیم میزان شارپنس و ویینیت", "اصلاح نور اولیه", "برش تصویر", "تنظیم صدای خروجی"],
      ans: 0,
    },
    {
      text: "Color Wheels در لومتری برای کنترل کدام بخش‌هاست؟",
      subject: "Color",
      level: "B1",
      opts: ["Shadows, Midtones, Highlights", "فقط سیاهی‌ها", "فقط سفیدی‌ها", "شفافیت کل تصویر"],
      ans: 0,
    },
    {
      text: "Curves در اصلاح رنگ چه مزیتی دارد؟",
      subject: "Color",
      level: "B1",
      opts: ["کنترل دقیق روی سطوح روشنایی و کانال‌های رنگی RGB", "سرعت بیشتر", "حذف نویز", "ایجاد متن"],
      ans: 0,
    },
    {
      text: "بخش HSL Secondary برای چه منظوری استفاده می‌شود؟",
      subject: "Color",
      level: "B1",
      opts: [
        "انتخاب و تغییر یک رنگ خاص در تصویر (مثلاً فقط تغییر رنگ لباس)",
        "تغییر کل رنگ تصویر",
        "سیاه و سفید کردن",
        "ایجاد سایه",
      ],
      ans: 0,
    },

    // ==========================================
    // B1: Audio (8 Questions)
    // ==========================================
    {
      text: "واحد اندازه‌گیری بلندی صدا در پریمیر چیست؟",
      subject: "Audio",
      level: "B1",
      opts: ["Decibels (dB)", "Pixels", "Hertz", "Frames"],
      ans: 0,
    },
    {
      text: "برای افزایش صدای یک کلیپ به صورت سریع از کدام میانبر استفاده می‌شود؟",
      subject: "Audio",
      level: "B1",
      opts: ["G (Audio Gain)", "L (Loop)", "M (Mute)", "S (Solo)"],
      ans: 0,
    },
    {
      text: "تفاوت Mute و Solo در ترک‌های صوتی چیست؟",
      subject: "Audio",
      level: "B1",
      opts: ["Mute صدا را قطع می‌کند، Solo فقط آن ترک را پخش می‌کند", "برعکس است", "یکی هستند", "فقط در خروجی اثر دارند"],
      ans: 0,
    },
    {
      text: "پنل Essential Sound چه کاربردی دارد؟",
      subject: "Audio",
      level: "B1",
      opts: ["تنظیم سریع و هوشمند نوع صدا (Dialogue, Music, SFX)", "رسم موج صوتی", "حذف تصویر", "تایپ متن"],
      ans: 0,
    },
    {
      text: "افکت Constant Power در صدا چه کاری انجام می‌دهد؟",
      subject: "Audio",
      level: "B1",
      opts: ["ایجاد یک ترنزیشن نرم (Crossfade) بین دو کلیپ صوتی", "بلند کردن صدا", "حذف نویز", "تغییر سرعت"],
      ans: 0,
    },
    {
      text: "چگونه می‌توان صدای یک ویدیو را از تصویرش جدا کرد؟",
      subject: "Audio",
      level: "B1",
      opts: ["راست کلیک > Unlink", "فشردن Ctrl+G", "استفاده از Razor", "دیلیت کردن"],
      ans: 0,
    },
    {
      text: "Audio Clip Mixer با Audio Track Mixer چه تفاوتی دارد؟",
      subject: "Audio",
      level: "B1",
      opts: [
        "Clip روی تک‌تک فایل‌ها اثر می‌گذارد، Track روی کل لایه صوتی",
        "برعکس است",
        "فرقی ندارند",
        "دومی فقط برای ضبط است",
      ],
      ans: 0,
    },
    {
      text: "نورمالیزه کردن (Normalize) صدا به چه معنی است؟",
      subject: "Audio",
      level: "B1",
      opts: ["تنظیم خودکار بلندترین قله صدا بر روی یک عدد مشخص", "حذف سکوت‌ها", "تغییر زیر و بم", "استریو کردن"],
      ans: 0,
    },

    // ==========================================
    // B1: Transitions (8 Questions)
    // ==========================================
    {
      text: "رایج‌ترین ویدیو ترنزیشن در پریمیر چیست؟",
      subject: "Transitions",
      level: "B1",
      opts: ["Cross Dissolve", "Dip to Black", "Wipe", "Slide"],
      ans: 0,
    },
    {
      text: "میانبر اعمال Default Transition روی ویدیو چیست؟",
      subject: "Transitions",
      level: "B1",
      opts: ["Ctrl+D", "Ctrl+Shift+D", "Ctrl+T", "Alt+D"],
      ans: 0,
    },
    {
      text: "چگونه می‌توان زمان (Duration) یک ترنزیشن را تغییر داد؟",
      subject: "Transitions",
      level: "B1",
      opts: ["کشیدن لبه‌های ترنزیشن در تایم‌لاین یا تغییر در Effect Controls", "با ابزار Razor", "با کلیک راست روی ویدیو", "امکان‌پذیر نیست"],
      ans: 0,
    },
    {
      text: "اگر کلیپ 'Handle' کافی نداشته باشد، ترنزیشن چگونه اعمال می‌شود؟",
      subject: "Transitions",
      level: "B1",
      opts: ["پریمیر فریم‌های ابتدایی یا انتهایی را تکرار (Freeze) می‌کند", "ترنزیشن اعمال نمی‌شود", "ویدیو سیاه می‌شود", "صدا قطع می‌شود"],
      ans: 0,
    },
    {
      text: "ترنزیشن Dip to White معمولاً برای چه حسی استفاده می‌شود؟",
      subject: "Transitions",
      level: "B1",
      opts: ["ایجاد حالت فلاش دوربین یا رویا", "پایان فیلم", "ترسناک کردن", "افزایش سرعت"],
      ans: 0,
    },
    {
      text: "برای تنظیم یک ترنزیشن به عنوان Default، چه باید کرد؟",
      subject: "Transitions",
      level: "B1",
      opts: ["راست کلیک روی ترنزیشن در پنل Effects > Set Selected as Default", "کشیدن آن به اول تایم‌لاین", "استفاده از Ctrl+S", "تغییر نام آن"],
      ans: 0,
    },
    {
      text: "کدام بخش اجازه می‌دهد نقطه شروع و پایان ترنزیشن را روی کلیپ تنظیم کنید؟",
      subject: "Transitions",
      level: "B1",
      opts: ["Alignment (Start/Center/End at Cut)", "Opacity", "Speed", "Scale"],
      ans: 0,
    },
    {
      text: "ترنزیشن‌های صوتی در کدام پنل قرار دارند؟",
      subject: "Transitions",
      level: "B1",
      opts: ["Effects > Audio Transitions", "Essential Sound", "Audio Mixer", "Markers"],
      ans: 0,
    },

    // ==========================================
    // B2: Keyframes (8 Questions)
    // ==========================================
    {
      text: "برای فعال کردن کی‌فریم در یک پارامتر، کدام آیکون را باید کلیک کرد؟",
      subject: "Keyframes",
      level: "B2",
      opts: ["آیکون ساعت (Toggle Animation)", "آیکون قفل", "آیکون ستاره", "آیکون fx"],
      ans: 0,
    },
    {
      text: "منظور از Interpolation در کی‌فریم‌ها چیست؟",
      subject: "Keyframes",
      level: "B2",
      opts: ["نحوه محاسبه و تغییر مقادیر بین دو کی‌فریم", "حذف کی‌فریم", "کپی کردن افکت", "رندر گرفتن"],
      ans: 0,
    },
    {
      text: "کی‌فریم از نوع Bezier چه ویژگی‌ای دارد؟",
      subject: "Keyframes",
      level: "B2",
      opts: ["اجازه می‌دهد با دستگیره‌ها سرعت حرکت را نرم و منحنی کنید", "حرکت خطی و خشک ایجاد می‌کند", "فقط برای صداست", "مخصوص برش است"],
      ans: 0,
    },
    {
      text: "تفاوت Ease In و Ease Out چیست؟",
      subject: "Keyframes",
      level: "B2",
      opts: ["Ease In حرکت را هنگام رسیدن نرم می‌کند، Ease Out هنگام شروع", "برعکس است", "یکی هستند", "فقط برای رنگ است"],
      ans: 0,
    },
    {
      text: "چگونه می‌توان تمام کی‌فریم‌های یک افکت را کپی کرد؟",
      subject: "Keyframes",
      level: "B2",
      opts: ["انتخاب کی‌فریم‌ها > Ctrl+C و چسباندن در کلیپ مقصد", "با ابزار Selection", "با دستور Nest", "امکان‌پذیر نیست"],
      ans: 0,
    },
    {
      text: "Hold Keyframe چه کاربردی دارد؟",
      subject: "Keyframes",
      level: "B2",
      opts: ["نگه داشتن مقدار ثابت تا رسیدن به کی‌فریم بعدی (حالت پله‌ای)", "نرم کردن حرکت", "حذف انیمیشن", "تکرار حرکت"],
      ans: 0,
    },
    {
      text: "Velocity Graph در پنل Effect Controls چه چیزی را نشان می‌دهد؟",
      subject: "Keyframes",
      level: "B2",
      opts: ["نمودار تغییر سرعت پارامتر در طول زمان", "حجم صدا", "تعداد فریم‌ها", "رزولوشن"],
      ans: 0,
    },
    {
      text: "برای جابجایی بین کی‌فریم‌ها با دقت ۱۰۰٪ از چه دکمه‌ای استفاده می‌شود؟",
      subject: "Keyframes",
      level: "B2",
      opts: ["فلش‌های کوچک کنار آیکون کی‌فریم (Go to Next/Previous)", "کلیدهای جهت‌نما", "Space", "Alt"],
      ans: 0,
    },

    // ==========================================
    // B2: Masking (8 Questions)
    // ==========================================
    {
      text: "در پریمیر، ماسک کردن معمولاً در کدام بخش انجام می‌شود؟",
      subject: "Masking",
      level: "B2",
      opts: ["تنظیمات Opacity یا افکت‌ها در Effect Controls", "پنل Project", "پنل Audio", "منوی File"],
      ans: 0,
    },
    {
      text: "ابزار Free draw bezier (Pen) در ماسک برای چیست؟",
      subject: "Masking",
      level: "B2",
      opts: ["رسم دستی و دقیق محدوده‌های ماسک", "فقط رسم مربع", "تایپ متن", "تغییر رنگ"],
      ans: 0,
    },
    {
      text: "گزینه Mask Feather چه کاری انجام می‌دهد؟",
      subject: "Masking",
      level: "B2",
      opts: ["نرم و محو کردن لبه‌های ماسک", "تغییر سایز ماسک", "شفاف کردن داخل ماسک", "چرخش ماسک"],
      ans: 0,
    },
    {
      text: "کاربرد Mask Path چیست؟",
      subject: "Masking",
      level: "B2",
      opts: ["ایجاد کی‌فریم برای حرکت و تغییر شکل ماسک در طول زمان", "تغییر رنگ لبه", "حذف ماسک", "ذخیره فایل"],
      ans: 0,
    },
    {
      text: "دکمه Play (Track Selected Mask) در تنظیمات ماسک چه می‌کند؟",
      subject: "Masking",
      level: "B2",
      opts: ["تحلیل خودکار فریم‌ها برای چسباندن ماسک به سوژه متحرک", "پخش ویدیو", "رندر گرفتن", "معکوس کردن ماسک"],
      ans: 0,
    },
    {
      text: "گزینه Inverted در تنظیمات ماسک چه اثری دارد؟",
      subject: "Masking",
      level: "B2",
      opts: ["ناحیه انتخاب شده را برعکس می‌کند (داخل ماسک مخفی، بیرون نمایان)", "ماسک را حذف می‌کند", "لبه را تیز می‌کند", "رنگ را عوض می‌کند"],
      ans: 0,
    },
    {
      text: "Mask Expansion چه پارامتری را کنترل می‌کند؟",
      subject: "Masking",
      level: "B2",
      opts: ["گسترش یا انقباض محدوده کلی ماسک", "شفافیت", "محو شدگی", "سرعت"],
      ans: 0,
    },
    {
      text: "آیا می‌توان برای یک افکت خاص (مثل Blur) ماسک جداگانه ساخت؟",
      subject: "Masking",
      level: "B2",
      opts: ["بله، اکثر افکت‌ها در پریمیر قابلیت ماسک اختصاصی دارند", "خیر، فقط برای کل لایه است", "فقط در افترافکت", "فقط برای متن"],
      ans: 0,
    },

    // ==========================================
    // B2: Graphics (8 Questions)
    // ==========================================
    {
      text: "پنل مدرن برای ساخت متن و اشکال گرافیکی در پریمیر چیست؟",
      subject: "Graphics",
      level: "B2",
      opts: ["Essential Graphics", "Legacy Title", "Effects", "Library"],
      ans: 0,
    },
    {
      text: "فایل‌های MOGRT چه نوع فایل‌هایی هستند؟",
      subject: "Graphics",
      level: "B2",
      opts: ["قالب‌های گرافیکی متحرک ساخته شده در افترافکت یا پریمیر", "فایل‌های صوتی", "پروژه‌های کامل تدوین", "فرمت خروجی وب"],
      ans: 0,
    },
    {
      text: "چگونه می‌توان فونت یک متن را در پریمیر تغییر داد؟",
      subject: "Graphics",
      level: "B2",
      opts: ["بخش Edit در پنل Essential Graphics", "منوی File", "پنل History", "ابزار Razor"],
      ans: 0,
    },
    {
      text: "قابلیت Responsive Design - Time در گرافیک چیست؟",
      subject: "Graphics",
      level: "B2",
      opts: ["حفظ زمان انیمیشن‌های ورودی و خروجی هنگام تغییر طول کلیپ", "تغییر رنگ خودکار", "هماهنگی با صدا", "کاهش حجم"],
      ans: 0,
    },
    {
      text: "برای تراز کردن متن در مرکز تصویر از کدام گزینه استفاده می‌شود؟",
      subject: "Graphics",
      level: "B2",
      opts: ["Align and Transform در Essential Graphics", "ابزار Pen", "ابزار Hand", "کی‌فریم"],
      ans: 0,
    },
    {
      text: "آیا می‌توان لایه‌های گرافیکی (مثل متن و دایره) را با هم گروه (Group) کرد؟",
      subject: "Graphics",
      level: "B2",
      opts: ["بله، در داخل پنل Essential Graphics", "خیر", "فقط در فتوشاپ", "فقط با ماسک"],
      ans: 0,
    },
    {
      text: "Roll در تنظیمات متن چه کاربردی دارد؟",
      subject: "Graphics",
      level: "B2",
      opts: ["ایجاد تیتراژ متحرک که از پایین به بالا می‌رود", "چرخش متن", "بزرگنمایی", "تغییر فونت"],
      ans: 0,
    },
    {
      text: "برای استفاده از طرح‌های آماده گرافیکی Adobe Stock به کدام تب در Essential Graphics برویم؟",
      subject: "Graphics",
      level: "B2",
      opts: ["Browse", "Edit", "Layers", "Styles"],
      ans: 0,
    },

    // ==========================================
    // C1: Workflow (8 Questions)
    // ==========================================
    {
      text: "دستور Nest چه کاری انجام می‌دهد؟",
      subject: "Workflow",
      level: "C1",
      opts: ["تبدیل چندین کلیپ انتخاب شده به یک سکانس واحد در دل سکانس اصلی", "برش کلیپ", "خروجی گرفتن", "حذف صدا"],
      ans: 0,
    },
    {
      text: "Dynamic Link چه ارتباطی بین پریمیر و افترافکت ایجاد می‌کند؟",
      subject: "Workflow",
      level: "C1",
      opts: ["ویرایش زنده و بدون نیاز به رندر گرفتن بین دو نرم‌افزار", "فقط ارسال فایل صوتی", "بستن خودکار برنامه", "کاهش کیفیت برای سرعت"],
      ans: 0,
    },
    {
      text: "پروکسی (Proxy) در تدوین چه مزیتی دارد؟",
      subject: "Workflow",
      level: "C1",
      opts: ["استفاده از نسخه‌های سبک و کم‌حجم ویدیو برای تدوین روان فایل‌های سنگین (4K/8K)", "بالا بردن کیفیت نهایی", "تغییر مد رنگی", "حذف نویز"],
      ans: 0,
    },
    {
      text: "کاربرد Adjustment Layer در گردش کار حرفه‌ای چیست؟",
      subject: "Workflow",
      level: "C1",
      opts: ["اعمال افکت یا اصلاح رنگ روی تمام لایه‌های زیرین به صورت یکجا", "برش تصویر", "ذخیره پروژه", "تغییر فونت"],
      ans: 0,
    },
    {
      text: "Project Manager چه وظیفه‌ای دارد؟",
      subject: "Workflow",
      level: "C1",
      opts: [
        "جمع‌آوری تمام فایل‌های استفاده شده در پروژه در یک پوشه برای جابجایی یا آرشیو",
        "نصب برنامه",
        "پاک کردن کش",
        "تغییر زبان",
      ],
      ans: 0,
    },
    {
      text: "Labels (رنگ‌بندی لایه‌ها) چه کمکی به تدوینگر می‌کند؟",
      subject: "Workflow",
      level: "C1",
      opts: ["سازماندهی بصری و تشخیص سریع انواع فایل‌ها (صدا، ویدیو، گرافیک) در تایم‌لاین", "تغییر رنگ واقعی ویدیو", "رندر سریع‌تر", "افزایش بلندی صدا"],
      ans: 0,
    },
    {
      text: "تفاوت میانبر Paste و Paste Attributes چیست؟",
      subject: "Workflow",
      level: "C1",
      opts: ["Paste خود فایل را می‌چسباند، Paste Attributes افکت‌های کپی شده را", "فرقی ندارند", "اولی مخصوص متن است", "دومی صدا را پاک می‌کند"],
      ans: 0,
    },
    {
      text: "تکنیک Pancake Timeline چیست؟",
      subject: "Workflow",
      level: "C1",
      opts: ["قرار دادن دو تایم‌لاین روی هم برای درگ کردن راحت محتوا از یکی به دیگری", "استفاده از دو مانیتور", "خروجی گرفتن همزمان", "نوعی ترنزیشن"],
      ans: 0,
    },

    // ==========================================
    // C1: Multicam (8 Questions)
    // ==========================================
    {
      text: "اولین قدم برای ساخت یک پروژه چند دوربین (Multicam) چیست؟",
      subject: "Multicam",
      level: "C1",
      opts: ["انتخاب ویدیوها و ساخت Multi-Camera Source Sequence", "برش ویدیوها", "اعمال افکت Blur", "خروجی گرفتن"],
      ans: 0,
    },
    {
      text: "بهترین روش برای همگام‌سازی (Sync) خودکار چند دوربین چیست؟",
      subject: "Multicam",
      level: "C1",
      opts: ["استفاده از Audio (صدای مشترک)", "استفاده از Marker دستی", "تطبیق فریم به فریم", "چشمی تنظیم کردن"],
      ans: 0,
    },
    {
      text: "چگونه می‌توان پنل مشاهده همزمان تمام دوربین‌ها را فعال کرد؟",
      subject: "Multicam",
      level: "C1",
      opts: ["دکمه Toggle Multi-Camera View در Program Monitor", "پنل Effects", "پنل Layers", "منوی File"],
      ans: 0,
    },
    {
      text: "در حال پخش ویدیو، چگونه بین دوربین‌ها سوئیچ کنیم؟",
      subject: "Multicam",
      level: "C1",
      opts: ["استفاده از کلیدهای اعداد (1, 2, 3...) یا کلیک روی تصویر دوربین", "فشردن Space", "استفاده از ابزار Pen", "تغییر لایه"],
      ans: 0,
    },
    {
      text: "آیا بعد از اتمام تدوین مالتی‌کم، می‌توان زاویه دوربین یک بخش را عوض کرد؟",
      subject: "Multicam",
      level: "C1",
      opts: ["بله، با راست کلیک روی کلیپ و انتخاب یک دوربین دیگر", "خیر، باید از اول ضبط شود", "فقط با Ctrl+Z", "فقط در نسخه جدید"],
      ans: 0,
    },
    {
      text: "Flatten کردن در مالتی‌کم به چه معناست؟",
      subject: "Multicam",
      level: "C1",
      opts: ["تبدیل سکانس مالتی‌کم به کلیپ‌های ویدیویی عادی انتخاب شده", "حذف تمام دوربین‌ها", "سیاه و سفید کردن", "کاهش حجم"],
      ans: 0,
    },
    {
      text: "حداکثر چند دوربین را می‌توان در پریمیر به صورت مالتی‌کم مدیریت کرد؟",
      subject: "Multicam",
      level: "C1",
      opts: ["بسته به توان سخت‌افزار، اما تا ۶۴ دوربین پشتیبانی می‌شود", "فقط ۴ عدد", "فقط ۲ عدد", "محدودیتی ندارد حتی با سیستم ضعیف"],
      ans: 0,
    },
    {
      text: "اگر یکی از دوربین‌ها صدا نداشته باشد، سینک کردن با کدام روش بهتر است؟",
      subject: "Multicam",
      level: "C1",
      opts: ["Timecode یا In-point دستی", "Audio", "Waveform", "امکان‌پذیر نیست"],
      ans: 0,
    },

    // ==========================================
    // C2: Export (8 Questions)
    // ==========================================
    {
      text: "کدام فرمت خروجی برای اشتراک‌گذاری در وب و یوتیوب استاندارد است؟",
      subject: "Export",
      level: "C2",
      opts: ["H.264 (MP4)", "QuickTime Apple ProRes", "AVI", "Animated GIF"],
      ans: 0,
    },
    {
      text: "تفاوت VBR 1-Pass و VBR 2-Pass در چیست؟",
      subject: "Export",
      level: "C2",
      opts: [
        "2-Pass ویدیو را یکبار آنالیز و بار دوم رندر می‌کند که کیفیت و دقت حجم بهتری دارد",
        "فرقی ندارند",
        "1-Pass کیفیت بیشتری دارد",
        "2-Pass فقط برای صداست",
      ],
      ans: 0,
    },
    {
      text: "قابلیت Queue در پنجره Export چه کاری انجام می‌دهد؟",
      subject: "Export",
      level: "C2",
      opts: ["ارسال پروژه به Adobe Media Encoder برای رندر در پس‌زمینه", "بستن برنامه", "حذف کلیپ‌های اضافی", "ذخیره پروژه"],
      ans: 0,
    },
    {
      text: "Bitrate در خروجی ویدیو تعیین‌کننده چیست؟",
      subject: "Export",
      level: "C2",
      opts: ["رابطه مستقیم بین کیفیت و حجم فایل نهایی", "تعداد لایه‌ها", "سرعت پخش", "رزولوشن"],
      ans: 0,
    },
    {
      text: "استفاده از Use Maximum Render Quality چه زمانی توصیه می‌شود؟",
      subject: "Export",
      level: "C2",
      opts: ["هنگام تغییر مقیاس (Scale) ویدیوها برای حفظ جزئیات لبه‌ها", "همیشه", "فقط برای ویدیوهای سیاه سفید", "برای کاهش سرعت رندر"],
      ans: 0,
    },
    {
      text: "فرمت خروجی مناسب برای ارسال به تدوینگر دیگر جهت کارهای حرفه‌ای (بدون افت کیفیت) چیست؟",
      subject: "Export",
      level: "C2",
      opts: ["Apple ProRes 422 یا GoPro CineForm", "H.264 Low Bitrate", "MP3", "JPEG Sequence"],
      ans: 0,
    },
    {
      text: "مفهوم Metadata در هنگام Export چیست؟",
      subject: "Export",
      level: "C2",
      opts: ["اطلاعات جانبی مثل نام نویسنده، کپی‌رایت و مشخصات فنی فایل", "رنگ‌های ویدیو", "صدای محیط", "فریم‌های کلیدی"],
      ans: 0,
    },
    {
      text: "خروجی گرفتن با فرمت Alpha Channel به چه معناست؟",
      subject: "Export",
      level: "C2",
      opts: ["خروجی ویدیو با پس‌زمینه شفاف (Transparent)", "خروجی سیاه و سفید", "خروجی فقط صدا", "خروجی مخصوص اینستاگرام"],
      ans: 0,
    },

    // ==========================================
    // C2: TimeRemapping (8 Questions)
    // ==========================================
    {
      text: "Time Remapping در پریمیر چه تفاوتی با Speed/Duration معمولی دارد؟",
      subject: "TimeRemapping",
      level: "C2",
      opts: ["اجازه تغییر سرعت متغیر و تدریجی (Speed Ramping) را می‌دهد", "فرقی ندارند", "فقط برای تند کردن است", "دقت کمتری دارد"],
      ans: 0,
    },
    {
      text: "برای دسترسی به خط Time Remapping در تایم‌لاین چه باید کرد؟",
      subject: "TimeRemapping",
      level: "C2",
      opts: ["راست کلیک روی آیکون fx کلیپ > Time Remapping > Speed", "استفاده از ابزار Pen", "رفتن به پنل صدا", "استفاده از ابزار Razor"],
      ans: 0,
    },
    {
      text: "چگونه در حالت Time Remapping یک نقطه تغییر سرعت ایجاد کنیم؟",
      subject: "TimeRemapping",
      level: "C2",
      opts: ["نگه داشتن Ctrl و کلیک روی خط سفید لایه", "فشردن کلید S", "پاک کردن لایه", "استفاده از ابزار Hand"],
      ans: 0,
    },
    {
      text: "دو نیم کردن کی‌فریم در Time Remapping چه مزیتی دارد؟",
      subject: "TimeRemapping",
      level: "C2",
      opts: ["ایجاد یک منحنی برای تغییر سرعت نرم (نه ناگهانی)", "حذف تغییر سرعت", "ایجاد مکث", "تغییر رنگ"],
      ans: 0,
    },
    {
      text: "قابلیت Optical Flow در تنظیمات زمان چه کاربردی دارد؟",
      subject: "TimeRemapping",
      level: "C2",
      opts: ["ساخت فریم‌های میانی با هوش مصنوعی برای نرم کردن ویدیوهای خیلی آهسته", "تغییر رنگ", "حذف لرزش", "افزایش بلندی صدا"],
      ans: 0,
    },
    {
      text: "اگر سرعت را به زیر ۱۰۰٪ برسانیم، طول کلیپ در تایم‌لاین چه تغییری می‌کند؟",
      subject: "TimeRemapping",
      level: "C2",
      opts: ["طول کلیپ افزایش می‌یابد (کشیده می‌شود)", "کم می‌شود", "ثابت می‌ماند", "لایه ناپدید می‌شود"],
      ans: 0,
    },
    {
      text: "Frame Sampling ساده‌ترین روش تغییر زمان است؛ روش پیشرفته‌تر از آن چیست؟",
      subject: "TimeRemapping",
      level: "C2",
      opts: ["Frame Blending", "Optical Flow", "Set To Size", "Rasterize"],
      ans: 0,
    },
    {
      text: "در Time Remapping، بالا کشیدن خط سفید نشانه چیست؟",
      subject: "TimeRemapping",
      level: "C2",
      opts: ["افزایش سرعت (Fast Motion)", "کاهش سرعت", "معکوس کردن ویدیو", "تغییر شفافیت"],
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
      `Successfully imported ${formattedQuestions.length} Adobe Premiere questions!`,
    );
  } catch (err) {
    console.error("Adobe Premiere Import failed:", err);
  }
};

export default AdobePrQuestions;