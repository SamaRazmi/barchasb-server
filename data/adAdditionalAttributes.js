// ==============================
// additionalAdCategoriesData (فیلدهای هر دسته - بدون قیمت)
// ==============================
const additionalAdCategoriesData = [
  // ----- املاک و زیرمجموعه‌ها (از متن) -----
  {
    id: 11,
    name: "فروش مسکونی",
    parent: 1,
    fields: [
      { name: "rooms", label: "تعداد اتاق خواب", type: "number" },
      { name: "area", label: "متراژ بنا (متر مربع)", type: "number" },
      { name: "floor", label: "شماره طبقه", type: "number" },
      { name: "address", label: "آدرس دقیق ملک", type: "text" },
    ],
  },
  {
    id: 12,
    name: "اجاره مسکونی",
    parent: 1,
    fields: [
      { name: "area", label: "متراژ بنا (متر مربع)", type: "number" },
      { name: "deposit", label: "ودیعه (رهن)", type: "number" },
      { name: "rent", label: "اجاره ماهانه", type: "number" },
      { name: "floor", label: "طبقه", type: "number" },
      { name: "address", label: "آدرس", type: "text" },
    ],
  },
  {
    id: 13,
    name: "فروش اداری و تجاری",
    parent: 1,
    fields: [
      { name: "area", label: "مساحت (متر مربع)", type: "number" },
      { name: "floor", label: "طبقه", type: "number" },
      {
        name: "usageType",
        label: "نوع کاربری (اداری، مغازه، ...)",
        type: "text",
      },
      { name: "address", label: "آدرس", type: "text" },
    ],
  },
  {
    id: 14,
    name: "اجاره اداری و تجاری",
    parent: 1,
    fields: [
      { name: "area", label: "مساحت", type: "number" },
      { name: "deposit", label: "ودیعه", type: "number" },
      { name: "rent", label: "اجاره ماهانه", type: "number" },
      { name: "usageType", label: "نوع کاربری", type: "text" },
    ],
  },
  {
    id: 15,
    name: "اجاره کوتاه مدت",
    parent: 1,
    fields: [
      { name: "area", label: "متراژ", type: "number" },
      { name: "dailyRent", label: "اجاره روزانه", type: "number" },
      { name: "furnished", label: "مبله؟", type: "boolean" },
      { name: "address", label: "آدرس", type: "text" },
    ],
  },
  {
    id: 16,
    name: "پروژه‌های ساخت وساز",
    parent: 1,
    fields: [
      {
        name: "projectType",
        label: "نوع پروژه (ساختمانی، راهسازی، ...)",
        type: "text",
      },
      { name: "area", label: "مساحت زمین", type: "number" },
      { name: "budget", label: "بودجه پروژه", type: "number" },
      { name: "location", label: "موقعیت", type: "text" },
    ],
  },

  // ----- وسایل نقلیه -----
  {
    id: 17,
    name: "خودرو",
    parent: 2,
    fields: [
      { name: "brand", label: "برند خودرو", type: "text" },
      { name: "model", label: "مدل", type: "text" },
      { name: "year", label: "سال ساخت", type: "number" },
      { name: "km", label: "کارکرد (کیلومتر)", type: "number" },
      { name: "color", label: "رنگ", type: "text" },
    ],
  },
  {
    id: 18,
    name: "موتورسیکلت",
    parent: 2,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "model", label: "مدل", type: "text" },
      { name: "year", label: "سال تولید", type: "number" },
      { name: "cc", label: "حجم موتور (سی‌سی)", type: "number" },
    ],
  },
  {
    id: 19,
    name: "قطعات یدکی و لوازم جانبی",
    parent: 2,
    fields: [
      { name: "name", label: "نام قطعه", type: "text" },
      { name: "compatibleWith", label: "سازگار با (مدل/برند)", type: "text" },
    ],
  },
  {
    id: 20,
    name: "قایق و سایر وسایل نقلیه",
    parent: 2,
    fields: [
      { name: "type", label: "نوع وسیله (قایق، جت‌اسکی، ...)", type: "text" },
      { name: "brand", label: "برند", type: "text" },
      { name: "year", label: "سال ساخت", type: "number" },
    ],
  },

  // ----- کالای دیجیتال -----
  {
    id: 21,
    name: "موبایل و تبلت",
    parent: 3,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "model", label: "مدل", type: "text" },
      { name: "storage", label: "حافظه داخلی (گیگابایت)", type: "number" },
      { name: "ram", label: "رم", type: "number" },
    ],
  },
  {
    id: 22,
    name: "رایانه",
    parent: 3,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "model", label: "مدل", type: "text" },
      { name: "cpu", label: "پردازنده", type: "text" },
      { name: "ram", label: "رم", type: "number" },
      { name: "storage", label: "حافظه ذخیره‌سازی", type: "number" },
    ],
  },
  {
    id: 23,
    name: "کنسول، بازی ویدئویی و آنلاین",
    parent: 3,
    fields: [
      { name: "consoleType", label: "نوع کنسول یا پلتفرم", type: "text" },
      { name: "gameName", label: "نام بازی", type: "text" },
    ],
  },
  {
    id: 24,
    name: "صوتی و تصویری",
    parent: 3,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "type", label: "نوع دستگاه (هدفون، اسپیکر، ...)", type: "text" },
      { name: "model", label: "مدل", type: "text" },
    ],
  },
  {
    id: 25,
    name: "تلفن رومیزی",
    parent: 3,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "model", label: "مدل", type: "text" },
      { name: "features", label: "ویژگی‌ها", type: "text" },
    ],
  },

  // ----- خانه و آشپزخانه (اکنون کامل شامل ۲۷ تا ۳۷) -----
  {
    id: 26,
    name: "لوازم خانگی برقی",
    parent: 4,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      {
        name: "type",
        label: "نوع وسیله (یخچال، ماشین لباسشویی، ...)",
        type: "text",
      },
      { name: "power", label: "توان مصرفی", type: "text" },
    ],
  },
  {
    id: 27,
    name: "ظروف و لوازم آشپزخانه",
    parent: 4,
    fields: [
      { name: "type", label: "نوع ظرف یا وسیله", type: "text" },
      { name: "material", label: "جنس", type: "text" },
    ],
  },
  // اضافه شدن ۱۰ دسته‌ای که قبلاً缺失 بودند (id 28 تا 37)
  {
    id: 28,
    name: "خوردنی و آشامیدنی",
    parent: 4,
    fields: [
      { name: "productName", label: "نام محصول", type: "text" },
      { name: "brand", label: "برند", type: "text" },
      { name: "weight", label: "وزن یا حجم", type: "text" },
      { name: "expiration", label: "تاریخ انقضا", type: "date" },
    ],
  },
  {
    id: 29,
    name: "خیاطی و بافتنی",
    parent: 4,
    fields: [
      {
        name: "toolType",
        label: "نوع ابزار (چرخ خیاطی، سوزن، نخ، ...)",
        type: "text",
      },
      { name: "brand", label: "برند", type: "text" },
      { name: "material", label: "جنس پارچه یا نخ", type: "text" },
    ],
  },
  {
    id: 30,
    name: "مبلمان و صنایع چوب",
    parent: 4,
    fields: [
      {
        name: "type",
        label: "نوع مبلمان (میز، صندلی، کمد، ...)",
        type: "text",
      },
      { name: "material", label: "جنس (چوب، ام‌دی‌اف، فلز)", type: "text" },
      { name: "color", label: "رنگ", type: "text" },
      { name: "dimensions", label: "ابعاد (طول×عرض×ارتفاع)", type: "text" },
    ],
  },
  {
    id: 31,
    name: "نور و روشنایی",
    parent: 4,
    fields: [
      {
        name: "type",
        label: "نوع محصول (آویز، آباژور، چراغ دیواری، ...)",
        type: "text",
      },
      { name: "color", label: "رنگ", type: "text" },
      { name: "lightType", label: "نوع لامپ (LED، هالوژن، ...)", type: "text" },
    ],
  },
  {
    id: 32,
    name: "فرش، گلیم، موکت",
    parent: 4,
    fields: [
      { name: "type", label: "نوع (فرش، گلیم، موکت، تابلوفرش)", type: "text" },
      { name: "dimensions", label: "ابعاد (متر)", type: "text" },
      { name: "material", label: "جنس (پشم، ابریشم، پلی‌استر)", type: "text" },
    ],
  },
  {
    id: 33,
    name: "تشک، روتختی، رختخواب",
    parent: 4,
    fields: [
      {
        name: "type",
        label: "نوع محصول (تشک، تشکچه، روتختی، بالش)",
        type: "text",
      },
      { name: "size", label: "سایز (تختی، یک نفره، دو نفره)", type: "text" },
      { name: "material", label: "جنس رویه و پرکننده", type: "text" },
    ],
  },
  {
    id: 34,
    name: "لوازم دکوری و تزئینی",
    parent: 4,
    fields: [
      {
        name: "type",
        label: "نوع دکوری (گلدان، تندیس، تابلو، شمع)",
        type: "text",
      },
      { name: "material", label: "جنس (شیشه، چوب، رزین)", type: "text" },
      { name: "color", label: "رنگ", type: "text" },
    ],
  },
  {
    id: 35,
    name: "تهویه، سرمایش، گرمایش",
    parent: 4,
    fields: [
      {
        name: "type",
        label: "نوع دستگاه (کولر، بخاری، پنکه، تصفیه هوا)",
        type: "text",
      },
      { name: "brand", label: "برند", type: "text" },
      { name: "power", label: "توان (وات یا BTU)", type: "text" },
    ],
  },
  {
    id: 36,
    name: "شستوشو و نظافت",
    parent: 4,
    fields: [
      {
        name: "type",
        label: "نوع وسیله (جاروبرقی، تی، مواد شوینده)",
        type: "text",
      },
      { name: "brand", label: "برند", type: "text" },
      {
        name: "capacity",
        label: "ظرفیت (برای جاروبرقی و ماشین)",
        type: "text",
      },
    ],
  },
  {
    id: 37,
    name: "حمام و سرویس بهداشتی",
    parent: 4,
    fields: [
      {
        name: "type",
        label: "نوع محصول (سرویس بهداشتی، شیرآلات، آینه)",
        type: "text",
      },
      { name: "material", label: "جنس (سرامیک، استیل، شیشه)", type: "text" },
      { name: "color", label: "رنگ", type: "text" },
    ],
  },

  // ----- خدمات (ادامه از id 38 به بعد، بدون تغییر) -----
  {
    id: 38,
    name: "موتور و ماشین",
    parent: 5,
    fields: [
      {
        name: "serviceType",
        label: "نوع خدمات (تعمیرات، نظافت، ...)",
        type: "text",
      },
      { name: "brand", label: "برند خودرو", type: "text" },
    ],
  },
  {
    id: 39,
    name: "پذیرایی، مراسم",
    parent: 5,
    fields: [
      {
        name: "eventType",
        label: "نوع مراسم (عروسی، مهمانی، ...)",
        type: "text",
      },
      { name: "capacity", label: "ظرفیت پذیرایی", type: "number" },
    ],
  },
  {
    id: 40,
    name: "رایانه‌ای و موبایل",
    parent: 5,
    fields: [
      {
        name: "serviceType",
        label: "نوع خدمات (برنامه‌نویسی، تعمیرات، ...)",
        type: "text",
      },
    ],
  },
  {
    id: 41,
    name: "مالی، حسابداری، بیمه",
    parent: 5,
    fields: [
      { name: "serviceType", label: "نوع خدمات مالی", type: "text" },
      { name: "expertise", label: "حوزه تخصص", type: "text" },
    ],
  },
  {
    id: 42,
    name: "حمل و نقل",
    parent: 5,
    fields: [
      { name: "vehicleType", label: "نوع وسیله نقلیه", type: "text" },
      { name: "capacity", label: "ظرفیت بار/مسافر", type: "text" },
    ],
  },
  {
    id: 43,
    name: "پیشه و مهارت",
    parent: 5,
    fields: [
      { name: "skill", label: "نام مهارت یا پیشه", type: "text" },
      { name: "experience", label: "سابقه کار", type: "text" },
    ],
  },
  {
    id: 44,
    name: "آرایشگری و زیبایی",
    parent: 5,
    fields: [
      {
        name: "serviceType",
        label: "نوع خدمات (کوتاهی، آرایش، ...)",
        type: "text",
      },
    ],
  },
  {
    id: 45,
    name: "نظافت",
    parent: 5,
    fields: [
      {
        name: "serviceType",
        label: "نوع نظافت (ساختمان، فرش، ...)",
        type: "text",
      },
    ],
  },
  {
    id: 46,
    name: "باغبانی و درختکاری",
    parent: 5,
    fields: [{ name: "serviceType", label: "نوع خدمات باغبانی", type: "text" }],
  },
  {
    id: 47,
    name: "آموزشی",
    parent: 5,
    fields: [
      { name: "subject", label: "موضوع آموزش", type: "text" },
      { name: "level", label: "سطح یا مقطع", type: "text" },
    ],
  },

  // ----- وسایل شخصی (ادامه) -----
  {
    id: 48,
    name: "کیف، کفش، لباس",
    parent: 6,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "size", label: "سایز", type: "text" },
      { name: "color", label: "رنگ", type: "text" },
    ],
  },
  {
    id: 49,
    name: "زیورآلات و اکسسوری",
    parent: 6,
    fields: [
      { name: "type", label: "نوع زیورآلات", type: "text" },
      { name: "material", label: "جنس", type: "text" },
    ],
  },
  {
    id: 50,
    name: "آرایشی، بهداشتی، درمانی",
    parent: 6,
    fields: [
      { name: "productName", label: "نام محصول", type: "text" },
      { name: "brand", label: "برند", type: "text" },
    ],
  },
  {
    id: 51,
    name: "کفش و لباس بچه",
    parent: 6,
    fields: [
      { name: "type", label: "نوع (کفش، لباس، ...)", type: "text" },
      { name: "age", label: "محدوده سنی", type: "text" },
      { name: "size", label: "سایز", type: "text" },
    ],
  },
  {
    id: 52,
    name: "وسایل بچه و اسباب‌بازی",
    parent: 6,
    fields: [
      { name: "type", label: "نوع وسیله یا اسباب‌بازی", type: "text" },
      { name: "brand", label: "برند", type: "text" },
      { name: "age", label: "سن مناسب", type: "text" },
    ],
  },
  {
    id: 53,
    name: "لوازم التحریر",
    parent: 6,
    fields: [
      { name: "type", label: "نوع (خودکار، دفتر، ...)", type: "text" },
      { name: "brand", label: "برند", type: "text" },
    ],
  },

  // ----- سرگرمی و فراغت -----
  {
    id: 54,
    name: "بلیت",
    parent: 7,
    fields: [
      { name: "eventName", label: "نام رویداد", type: "text" },
      { name: "date", label: "تاریخ برگزاری", type: "date" },
      { name: "seat", label: "شماره صندلی", type: "text" },
    ],
  },
  {
    id: 55,
    name: "تور و چارتر",
    parent: 7,
    fields: [
      { name: "destination", label: "مقصد", type: "text" },
      { name: "duration", label: "مدت سفر (روز)", type: "number" },
      { name: "hotel", label: "هتل", type: "text" },
    ],
  },
  {
    id: 56,
    name: "کتاب و مجله",
    parent: 7,
    fields: [
      { name: "title", label: "عنوان", type: "text" },
      { name: "author", label: "نویسنده", type: "text" },
    ],
  },
  {
    id: 57,
    name: "دوچرخه، اسکیت، اسکوتر",
    parent: 7,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "type", label: "نوع وسیله", type: "text" },
    ],
  },
  {
    id: 58,
    name: "حیوانات",
    parent: 7,
    fields: [
      { name: "animalType", label: "نوع حیوان", type: "text" },
      { name: "age", label: "سن", type: "number" },
      { name: "gender", label: "جنسیت", type: "text" },
    ],
  },
  {
    id: 59,
    name: "کلکسیون و سرگرمی",
    parent: 7,
    fields: [{ name: "collectionType", label: "نوع کلکسیون", type: "text" }],
  },
  {
    id: 60,
    name: "آلات موسیقی",
    parent: 7,
    fields: [
      { name: "instrument", label: "نام ساز", type: "text" },
      { name: "brand", label: "برند", type: "text" },
    ],
  },
  {
    id: 61,
    name: "ورزش و تناسب اندام",
    parent: 7,
    fields: [
      { name: "equipmentType", label: "نوع وسیله ورزشی", type: "text" },
      { name: "brand", label: "برند", type: "text" },
    ],
  },
  {
    id: 62,
    name: "اسباب‌بازی",
    parent: 7,
    fields: [
      { name: "toyType", label: "نوع اسباب‌بازی", type: "text" },
      { name: "ageRange", label: "گروه سنی", type: "text" },
    ],
  },

  // ----- اجتماعی -----
  {
    id: 63,
    name: "رویداد",
    parent: 8,
    fields: [
      { name: "eventName", label: "نام رویداد", type: "text" },
      { name: "date", label: "تاریخ", type: "date" },
      { name: "location", label: "مکان", type: "text" },
    ],
  },
  {
    id: 64,
    name: "داوطلبانه",
    parent: 8,
    fields: [
      { name: "opportunity", label: "عنوان فرصت داوطلبانه", type: "text" },
      { name: "organization", label: "سازمان", type: "text" },
    ],
  },
  {
    id: 65,
    name: "گمشده‌ها",
    parent: 8,
    fields: [
      { name: "itemType", label: "نوع (شیء، حیوان، شخص)", type: "text" },
      { name: "description", label: "توضیحات", type: "textarea" },
      { name: "location", label: "محل گم شدن", type: "text" },
    ],
  },

  // ----- تجهیزات و صنعتی -----
  {
    id: 66,
    name: "مصالح و تجهیزات ساختمان",
    parent: 9,
    fields: [
      { name: "materialType", label: "نوع مصالح", type: "text" },
      { name: "quantity", label: "مقدار", type: "number" },
      { name: "unit", label: "واحد (کیلو، متر، ...)", type: "text" },
    ],
  },
  {
    id: 67,
    name: "ابزارآلات",
    parent: 9,
    fields: [
      { name: "toolName", label: "نام ابزار", type: "text" },
      { name: "brand", label: "برند", type: "text" },
    ],
  },
  {
    id: 68,
    name: "ماشین‌آلات صنعتی",
    parent: 9,
    fields: [
      { name: "machineType", label: "نوع ماشین‌آلات", type: "text" },
      { name: "brand", label: "برند", type: "text" },
      { name: "capacity", label: "ظرفیت", type: "text" },
    ],
  },
  {
    id: 69,
    name: "تجهیزات کسب‌وکار",
    parent: 9,
    fields: [
      { name: "equipmentType", label: "نوع تجهیزات", type: "text" },
      { name: "brand", label: "برند", type: "text" },
    ],
  },
  {
    id: 70,
    name: "عمده‌فروشی",
    parent: 9,
    fields: [
      { name: "productType", label: "نوع محصول", type: "text" },
      { name: "minQuantity", label: "حداقل تعداد سفارش", type: "number" },
    ],
  },

  // ----- استخدام و کاریابی -----
  {
    id: 71,
    name: "اداری و مدیریت",
    parent: 10,
    fields: [
      { name: "jobTitle", label: "عنوان شغلی", type: "text" },
      { name: "experience", label: "سابقه کار مورد نیاز", type: "text" },
      { name: "location", label: "موقعیت مکانی", type: "text" },
    ],
  },
  {
    id: 72,
    name: "سرایداری و نظافت",
    parent: 10,
    fields: [
      { name: "jobType", label: "نوع (ساعتی، تمام وقت)", type: "text" },
      { name: "location", label: "آدرس محل کار", type: "text" },
    ],
  },
  {
    id: 73,
    name: "معماری، عمران و ساختمانی",
    parent: 10,
    fields: [
      { name: "jobTitle", label: "عنوان شغلی", type: "text" },
      { name: "field", label: "زمینه (معماری، عمران، ...)", type: "text" },
    ],
  },
  {
    id: 74,
    name: "خدمات فروشگاه و رستوران",
    parent: 10,
    fields: [
      { name: "jobTitle", label: "عنوان شغلی", type: "text" },
      { name: "workHours", label: "ساعت کاری", type: "text" },
    ],
  },
  {
    id: 75,
    name: "رایانه و فناوری اطلاعات",
    parent: 10,
    fields: [
      { name: "jobTitle", label: "عنوان شغلی", type: "text" },
      { name: "skills", label: "مهارت‌های مورد نیاز", type: "text" },
    ],
  },
  {
    id: 76,
    name: "مالی، حسابداری، حقوقی",
    parent: 10,
    fields: [
      { name: "jobTitle", label: "عنوان شغلی", type: "text" },
      { name: "degree", label: "مدرک تحصیلی", type: "text" },
    ],
  },
  {
    id: 77,
    name: "بازاریابی و فروش",
    parent: 10,
    fields: [
      { name: "jobTitle", label: "عنوان شغلی", type: "text" },
      { name: "experience", label: "سابقه", type: "text" },
    ],
  },
  {
    id: 78,
    name: "صنعتی، فنی، مهندسی",
    parent: 10,
    fields: [
      { name: "jobTitle", label: "عنوان شغلی", type: "text" },
      { name: "specialty", label: "تخصص", type: "text" },
    ],
  },
  {
    id: 79,
    name: "آموزشی",
    parent: 10,
    fields: [
      { name: "subject", label: "زمینه تدریس", type: "text" },
      { name: "level", label: "مقطع تحصیلی", type: "text" },
    ],
  },
  {
    id: 80,
    name: "حمل و نقل",
    parent: 10,
    fields: [
      { name: "jobTitle", label: "عنوان شغلی (راننده، ...)", type: "text" },
      { name: "licenseType", label: "نوع گواهینامه", type: "text" },
    ],
  },
  {
    id: 81,
    name: "درمانی، زیبایی، بهداشتی",
    parent: 10,
    fields: [
      { name: "jobTitle", label: "عنوان شغلی", type: "text" },
      { name: "specialization", label: "تخصص", type: "text" },
    ],
  },
  {
    id: 82,
    name: "هنری و رسانه",
    parent: 10,
    fields: [
      { name: "jobTitle", label: "عنوان شغلی", type: "text" },
      { name: "artField", label: "زمینه هنری", type: "text" },
    ],
  },

  // ========== دسته‌های اضافی (از نمونه اولیه) ==========
  {
    id: 83,
    name: "مسکونی",
    parent: 1,
    fields: [
      { name: "rooms", label: "تعداد اتاق خواب", type: "number" },
      { name: "area", label: "متراژ بنا", type: "number" },
      { name: "floor", label: "شماره طبقه", type: "number" },
    ],
  },
  {
    id: 84,
    name: "تجاری",
    parent: 1,
    fields: [
      { name: "area", label: "مساحت واحد تجاری", type: "number" },
      { name: "floor", label: "طبقه قرارگیری", type: "number" },
      { name: "usageType", label: "نوع کاربری", type: "text" },
    ],
  },
  {
    id: 85,
    name: "رهن و اجاره",
    parent: 1,
    fields: [
      { name: "area", label: "متراژ ملک", type: "number" },
      { name: "deposit", label: "مبلغ رهن", type: "number" },
      { name: "rent", label: "اجاره ماهانه", type: "number" },
    ],
  },
  {
    id: 86,
    name: "زمین و باغ",
    parent: 1,
    fields: [
      { name: "area", label: "مساحت زمین", type: "number" },
      { name: "location", label: "موقعیت مکانی", type: "text" },
    ],
  },
  {
    id: 87,
    name: "موتور سیکلت",
    parent: 2,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "model", label: "مدل", type: "text" },
      { name: "year", label: "سال تولید", type: "number" },
      { name: "cc", label: "حجم موتور (سی‌سی)", type: "number" },
    ],
  },
  {
    id: 88,
    name: "دوچرخه و اسکیت",
    parent: 2,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "type", label: "نوع وسیله", type: "text" },
    ],
  },
  {
    id: 89,
    name: "قطعات و لوازم جانبی",
    parent: 2,
    fields: [
      { name: "name", label: "نام قطعه", type: "text" },
      { name: "compatibleWith", label: "سازگار با", type: "text" },
    ],
  },
  {
    id: 90,
    name: "گوشی و تبلت",
    parent: 3,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "model", label: "مدل", type: "text" },
      { name: "storage", label: "حافظه داخلی", type: "number" },
      { name: "ram", label: "رم", type: "number" },
    ],
  },
  {
    id: 91,
    name: "کامپیوتر و لپ‌تاپ",
    parent: 3,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "model", label: "مدل", type: "text" },
      { name: "cpu", label: "پردازنده", type: "text" },
      { name: "ram", label: "رم", type: "number" },
      { name: "storage", label: "حافظه ذخیره‌سازی", type: "number" },
    ],
  },
  {
    id: 92,
    name: "گجت‌ها و پوشیدنی‌ها",
    parent: 3,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "type", label: "نوع گجت", type: "text" },
    ],
  },
  {
    id: 93,
    name: "مبلمان",
    parent: 4,
    fields: [
      { name: "type", label: "نوع مبلمان", type: "text" },
      { name: "material", label: "جنس", type: "text" },
      { name: "color", label: "رنگ", type: "text" },
    ],
  },
  {
    id: 94,
    name: "لوازم آشپزخانه",
    parent: 4,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "type", label: "نوع وسیله", type: "text" },
    ],
  },
  {
    id: 95,
    name: "لوازم خانگی کوچک",
    parent: 4,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "type", label: "نوع دستگاه", type: "text" },
      { name: "power", label: "توان مصرفی", type: "text" },
    ],
  },
  {
    id: 96,
    name: "دکوراسیون و روشنایی",
    parent: 4,
    fields: [
      { name: "type", label: "نوع محصول", type: "text" },
      { name: "material", label: "جنس", type: "text" },
      { name: "color", label: "رنگ", type: "text" },
    ],
  },
  {
    id: 97,
    name: "سلامت و پزشکی",
    parent: 5,
    fields: [
      { name: "serviceType", label: "نوع خدمات درمانی", type: "text" },
      { name: "specialist", label: "تخصص", type: "text" },
    ],
  },
  {
    id: 98,
    name: "تعمیرات و فنی",
    parent: 5,
    fields: [
      { name: "serviceType", label: "نوع خدمات فنی", type: "text" },
      { name: "brand", label: "برند دستگاه", type: "text" },
    ],
  },
  {
    id: 99,
    name: "مشاوره و کسب‌وکار",
    parent: 5,
    fields: [
      { name: "serviceType", label: "نوع مشاوره", type: "text" },
      { name: "experience", label: "سابقه", type: "text" },
    ],
  },
  {
    id: 100,
    name: "مد و پوشاک",
    parent: 6,
    fields: [
      { name: "brand", label: "برند", type: "text" },
      { name: "size", label: "سایز", type: "text" },
      { name: "color", label: "رنگ", type: "text" },
    ],
  },
  {
    id: 101,
    name: "جواهرات و اکسسوری",
    parent: 6,
    fields: [
      { name: "type", label: "نوع زیورآلات", type: "text" },
      { name: "material", label: "جنس", type: "text" },
    ],
  },
  {
    id: 102,
    name: "وسایل کودک",
    parent: 6,
    fields: [
      { name: "type", label: "نوع وسیله", type: "text" },
      { name: "brand", label: "برند", type: "text" },
      { name: "age", label: "محدوده سنی", type: "text" },
    ],
  },
  {
    id: 103,
    name: "وسایل بهداشتی و زیبایی",
    parent: 6,
    fields: [
      { name: "type", label: "نوع محصول", type: "text" },
      { name: "brand", label: "برند", type: "text" },
    ],
  },
  {
    id: 104,
    name: "تجهیزات صنعتی",
    parent: null,
    fields: [],
  },
  {
    id: 105,
    name: "ماشین‌آلات",
    parent: 104,
    fields: [
      { name: "type", label: "نوع ماشین‌آلات", type: "text" },
      { name: "brand", label: "برند", type: "text" },
      { name: "capacity", label: "ظرفیت", type: "text" },
    ],
  },
  {
    id: 106,
    name: "ابزار و تجهیزات",
    parent: 104,
    fields: [
      { name: "type", label: "نوع ابزار", type: "text" },
      { name: "brand", label: "برند", type: "text" },
    ],
  },
  {
    id: 107,
    name: "قطعات و مواد اولیه",
    parent: 104,
    fields: [
      { name: "name", label: "نام قطعه یا ماده", type: "text" },
      { name: "brand", label: "برند", type: "text" },
    ],
  },
  {
    id: 108,
    name: "تجهیزات ایمنی و حفاظت",
    parent: 104,
    fields: [
      { name: "type", label: "نوع تجهیزات ایمنی", type: "text" },
      { name: "brand", label: "برند", type: "text" },
    ],
  },
  {
    id: 109,
    name: "ورزش و بازی",
    parent: 7,
    fields: [
      { name: "type", label: "نوع وسیله ورزشی یا بازی", type: "text" },
      { name: "brand", label: "برند", type: "text" },
    ],
  },
  {
    id: 110,
    name: "موسیقی و هنر",
    parent: 7,
    fields: [
      { name: "instrument", label: "نام ساز یا ابزار هنری", type: "text" },
      { name: "brand", label: "برند", type: "text" },
    ],
  },
  {
    id: 111,
    name: "بلیط رویداد و تفریح",
    parent: 7,
    fields: [
      { name: "eventName", label: "نام رویداد", type: "text" },
      { name: "date", label: "تاریخ برگزاری", type: "date" },
    ],
  },
];

// فیلدهای عمومی برای دسته‌های بدون فیلد (در صورت نیاز)
const defaultFields = [
  { name: "title", label: "عنوان آگهی", type: "text" },
  { name: "description", label: "توضیحات", type: "textarea" },
];

module.exports = additionalAdCategoriesData;
