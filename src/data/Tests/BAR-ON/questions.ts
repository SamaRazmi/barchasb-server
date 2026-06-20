import prisma from "../../../config/prisma";

const BarOnQuestions = async (typeId: string) => {
  const options = [
    { text: "کاملاً مخالفم", value: 1 },
    { text: "مخالفم", value: 2 },
    { text: "نه موافقم نه مخالفم", value: 3 },
    { text: "موافقم", value: 4 },
    { text: "کاملاً موافقم", value: 5 },
  ];

  const rawQuestions = [
    // Group 1: Emotional Self-Awareness
    {
      text: "اغلب می دانم چه احساسی دارم",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "توصیف احساساتم برایم دشوار است",
      dim: "Emotional Self-Awareness",
      reverse: true,
    },
    {
      text: "به احساساتم توجه کافی دارم",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "اغلب از تغییرات خلق و خوی خود بی‌خبر هستم",
      dim: "Emotional Self-Awareness",
      reverse: true,
    },
    {
      text: "میدانم چه چیزهایی باعث خوشحالی یا ناراحتی‌ام می شوند",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "توانایی توصیف احساساتم را دارم",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "میتوانم احساساتم را تحلیل کنم",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "اغلب می دانم چرا احساسم تغییر کرده است",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "به احساساتم احترام می گذارم و آنها را نادیده نمی‌گیرم",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "میتوانم افکار و احساساتم را از هم تفکیک کنم",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "احساسات من بر تصمیم‌هایم تأثیر می‌گذارند",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "نسبت به واکنش‌های هیجانی خود حساس هستم",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "میتوانم الگوهای هیجانی خود را تشخیص دهم",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "اغلب احساساتم را با دقت بررسی میکنم",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "میدانم چه چیزهایی مرا تحت فشار قرار می دهند",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "توانایی شناسایی احساسات مثبت و منفی خود را دارم",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "میتوانم لحظات استرس‌زا را قبل از اوج گرفتن احساس کنم",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "نسبت به هیجانات خود واقع‌بین هستم",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "میدانم چه عواملی باعث ناراحتی یا خشم من می شوند",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },
    {
      text: "به احساساتم اجازه می دهم خود را نشان دهند بدون اینکه کنترلشان را از دست بدهم",
      dim: "Emotional Self-Awareness",
      reverse: false,
    },

    // Group 2: Stress Management
    {
      text: "کنترل خشم یا ناراحتی برایم سخت است",
      dim: "Stress Management",
      reverse: true,
    },
    {
      text: "در شرایط استرس‌زا به راحتی دستپاچه می‌شوم",
      dim: "Stress Management",
      reverse: true,
    },
    {
      text: "توانایی مدیریت اضطراب و فشار را دارم",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "اغلب قبل از فکر کردن، واکنش نشان می‌دهم",
      dim: "Stress Management",
      reverse: true,
    },
    {
      text: "نمی‌دانم چگونه احساسات منفی‌ام را تخلیه کنم",
      dim: "Stress Management",
      reverse: true,
    },
    {
      text: "در برابر انتقاد مقاومت هیجانی دارم",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "میتوانم به راحتی با موقعیت‌های دشوار کنار بیایم",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "کنترل احساساتم باعث میشود تصمیمات بهتری بگیرم",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "توانایی بازیابی آرامش پس از ناراحتی دارم",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "احساساتم بر عملکردم غالب نمی‌شوند",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "توانایی تحمل فشارهای کاری و شخصی را دارم",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "میتوانم احساسات خود را به شیوه سالم بیان کنم",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "در مواجهه با مشکلات هیجانی تعادل خود را حفظ می کنم",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "میتوانم احساسات خود را درک کنم بدون اینکه تحت تأثیرشان قرار بگیرم",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "احساسات من به جای مانع، انگیزه من هستند",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "میتوانم هیجانات خود را به شکل مؤثر کنترل کنم",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "در موقعیت‌های پراسترس رفتار منطقی دارم",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "توانایی مدیریت هیجانات باعث اعتماد به نفس من میشود",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "احساسات من مانع دستیابی به اهدافم نمی شوند",
      dim: "Stress Management",
      reverse: false,
    },
    {
      text: "کنترل هیجاناتم باعث رضایت شخصی و اجتماعی من است",
      dim: "Stress Management",
      reverse: false,
    },

    // Group 3: Interpersonal Skills
    {
      text: "درک احساسات دیگران برایم دشوار است",
      dim: "Interpersonal Skills",
      reverse: true,
    },
    {
      text: "به نیازهای دیگران توجه کافی دارم",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "برقراری ارتباط صمیمانه با دیگران برایم سخت است",
      dim: "Interpersonal Skills",
      reverse: true,
    },
    {
      text: "در ارتباط با دیگران کم‌طاقت هستم",
      dim: "Interpersonal Skills",
      reverse: true,
    },
    {
      text: "توانایی ایجاد روابط مثبت دارم",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "دیگران میتوانند روی حمایت من حساب کنند",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "اغلب می توانم به احساسات دیگران واکنش مناسبی نشان دهم",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "به دیگران کمک میکنم بدون انتظار متقابل",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "توانایی حل اختلاف و ایجاد تفاهم را دارم",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "به دیگران احترام می گذارم حتی اگر با آنها اختلاف نظر داشته باشم",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "میتوانم به راحتی ارتباط مؤثر برقرار کنم",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "روابط اجتماعی برای من اهمیت دارند",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "اغلب در گروه ها نقش حمایتی دارم",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "توانایی تشخیص نیازهای عاطفی دیگران را دارم",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "از تعامل با دیگران انرژی می گیرم",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "دیگران مرا فرد قابل اعتماد و همدل میدانند",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "در گروه‌ها میتوانم نقش سازنده داشته باشم",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "اغلب می توانم احساسات دیگران را پیش‌بینی کنم",
      dim: "Interpersonal Skills",
      reverse: false,
    },
    {
      text: "مهارت‌های اجتماعی و بین‌فردی باعث موفقیت من هستند",
      dim: "Interpersonal Skills",
      reverse: false,
    },

    // Group 4: Decision Making
    {
      text: "هنگام تصمیم‌گیری، هیجاناتم مرا گیج می‌کنند",
      dim: "Decision Making",
      reverse: true,
    },
    {
      text: "در شرایط دشوار نمی‌توانم منطقی فکر کنم",
      dim: "Decision Making",
      reverse: true,
    },
    {
      text: "از اطلاعات هیجانی برای حل مسئله استفاده میکنم",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "تصمیم‌گیری برای من فرآیندی اضطراب‌آور است",
      dim: "Decision Making",
      reverse: true,
    },
    {
      text: "معمولاً در حل مشکلات فلج می‌شوم",
      dim: "Decision Making",
      reverse: true,
    },
    {
      text: "در حل مسئله انعطاف‌پذیر هستم",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "توانایی اولویت‌بندی مسائل را دارم",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "هیجانات من مانع تصمیم‌گیری نمی‌شوند",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "میتوانم تصمیمات مناسب برای خود و دیگران بگیرم",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "از تجربه‌های گذشته برای حل مسائل استفاده میکنم",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "تصمیماتم معمولاً موفقیت‌آمیز و سازنده هستند",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "در شرایط پراسترس تصمیمات منطقی میگیرم",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "میتوانم مشکلات پیچیده را تحلیل کنم",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "توانایی حل مسئله باعث اعتماد به نفس من میشود",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "در مواجهه با چالش ها آرامش و تمرکز خود را حفظ میکنم",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "میتوانم مشکلات را به شیوه‌ای عملی و مؤثر حل کنم",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "تصمیماتم معمولاً رضایت شخصی و اجتماعی ایجاد میکنند",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "توانایی حل مسئله و تصمیم‌گیری بر اساس هیجانات سازنده دارم",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "از تفکر تحلیلی و منطقی برای حل مشکلات استفاده میکنم",
      dim: "Decision Making",
      reverse: false,
    },
    {
      text: "میتوانم هیجانات خود و دیگران را در تصمیم‌گیری تلفیق کنم",
      dim: "Decision Making",
      reverse: false,
    },

    // Group 5: Adaptability
    {
      text: "تغییر کردن برای من بسیار سخت است",
      dim: "Adaptability",
      reverse: true,
    },
    {
      text: "در کنترل رفتارهای ناگهانی‌ام ضعیف هستم",
      dim: "Adaptability",
      reverse: true,
    },
    {
      text: "در مواجهه با مشکلات واقع‌بین هستم",
      dim: "Adaptability",
      reverse: false,
    },
    {
      text: "وقتی برنامه‌هایم تغییر می‌کند، به شدت مضطرب می‌شوم",
      dim: "Adaptability",
      reverse: true,
    },
    {
      text: "رها کردن عادت‌های قدیمی برایم غیرممکن است",
      dim: "Adaptability",
      reverse: true,
    },
    {
      text: "از اشتباهات خود درس میگیرم و انعطاف‌پذیرم",
      dim: "Adaptability",
      reverse: false,
    },
    {
      text: "میتوانم رفتارهای مناسب با موقعیت انتخاب کنم",
      dim: "Adaptability",
      reverse: false,
    },
    {
      text: "کنترل هیجانات باعث تصمیمات بهتر من میشود",
      dim: "Adaptability",
      reverse: false,
    },
    {
      text: "میتوانم واقعیت‌ها را بدون تعصب تحلیل کنم",
      dim: "Adaptability",
      reverse: false,
    },
    {
      text: "سازگاری و انعطاف در زندگی روزمره برایم مهم است",
      dim: "Adaptability",
      reverse: false,
    },
    {
      text: "میتوانم رفتار و واکنش‌های خود را مدیریت کنم",
      dim: "Adaptability",
      reverse: false,
    },
    {
      text: "در مواجهه با تغییرات سریع آرامش خود را حفظ میکنم",
      dim: "Adaptability",
      reverse: false,
    },
    {
      text: "توانایی کنترل تکانه‌ها باعث رضایت شخصی من می شود",
      dim: "Adaptability",
      reverse: false,
    },
    {
      text: "انعطاف‌پذیری به من کمک میکند با دیگران بهتر کنار بیایم",
      dim: "Adaptability",
      reverse: false,
    },
    {
      text: "میتوانم مشکلات غیرمنتظره را منطقی حل کنم",
      dim: "Adaptability",
      reverse: false,
    },
    {
      text: "سازگاری و کنترل رفتار باعث موفقیت من میشود",
      dim: "Adaptability",
      reverse: false,
    },
    {
      text: "به راحتی رفتارهای مناسب موقعیتی را انتخاب میکنم",
      dim: "Adaptability",
      reverse: false,
    },
    {
      text: "توانایی کنترل هیجانات و تکانه‌ها برایم ارزشمند است",
      dim: "Adaptability",
      reverse: false,
    },
    {
      text: "میتوانم بین واقعیت و احساساتم تعادل ایجاد کنم",
      dim: "Adaptability",
      reverse: false,
    },
  ];

  const formattedQuestions = rawQuestions.map((q) => ({
    typeId: typeId,
    subject: "Psychology",
    level: "General",
    questionText: q.text,
    dimension: q.dim,
    isReverseScored: q.reverse,
    options: options,
  }));

  try {
    await prisma.question.createMany({
      data: formattedQuestions,
      skipDuplicates: true,
    });
    console.log("BAR-ON Questions synchronized.");
  } catch (err) {
    console.error("BulkWrite Error:", err);
  }
};

export default BarOnQuestions;
