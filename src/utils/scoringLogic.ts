/**
 * PERSIAN MAPPING FOR DISPLAY
 */
const DIMENSION_TRANSLATIONS: Record<string, string> = {
  "Emotional Self-Awareness": "خودآگاهی هیجانی",
  "Stress Management": "مدیریت استرس",
  "Interpersonal Skills": "مهارت‌های بین‌فردی",
  "Decision Making": "تصمیم‌گیری",
  Adaptability: "تطبیق‌پذیری",
};

const MI_NAMES_PERSIAN: Record<string, string> = {
  Linguistic: "هوش زبانی-کلامی",
  Mathematical: "هوش منطقی-ریاضی",
  Visual: "هوش بصری-فضایی",
  Kinesthetic: "هوش بدنی-حرکتی",
  Musical: "هوش موسیقایی",
  Interpersonal: "هوش بین‌فردی",
  Intrapersonal: "هوش درون‌فردی",
  Naturalistic: "هوش طبیعت‌گرا",
};

const NEO_NAMES_PERSIAN: Record<string, string> = {
  N: "روان‌رنجوری",
  E: "برون‌گرایی",
  O: "گشودگی به تجربه",
  A: "توافق‌پذیری",
  C: "وظیفه‌شناسی",
};

// -----------------------------------------------------------------------
/**
 * Analysis Texts for Bar-On EQ
 */
const BARON_ANALYSIS: Record<
  string,
  { low: string; mid: string; high: string }
> = {
  "Emotional Self-Awareness": {
    low: "شما در شناسایی و درک منشأ هیجانات خود با دشواری جدی روبرو هستید و نیاز دارید روی مهارت‌های خودآگاهی تمرکز بیشتری کنید.",
    mid: "سطح خودآگاهی هیجانی شما در وضعیت متوسط قرار دارد؛ در شرایط عادی آگاهانه عمل می‌کنید اما در لحظات بحرانی ممکن است دچار ابهام شوید.",
    high: "شما تسلط فوق‌العاده‌ای بر دنیای درونی خود دارید و به درستی ارتباط میان افکار و هیجاناتتان را تحلیل می‌کنید.",
  },
  "Stress Management": {
    low: "آستانه تحمل استرس شما پایین است. در شرایط فشردگی کار، بهره‌وری شما به شدت افت کرده و سریعاً دچار اضطراب می‌شوید.",
    mid: "توانایی شما در مدیریت استرس در سطح قابل قبولی است. می‌توانید تعادل خود را حفظ کنید مگر در فشارهای بسیار شدید و طولانی‌مدت.",
    high: "شما دارای تاب‌آوری بسیار بالایی هستید. استرس نه تنها مانع شما نیست، بلکه باعث تمرکز بیشتر شما بر روی اهدافتان می‌شود.",
  },
  "Interpersonal Skills": {
    low: "شما در برقراری ارتباط موثر و درک نیازهای عاطفی دیگران ضعیف عمل می‌کنید که می‌تواند منجر به سوءتفاهم در روابط تیمی‌تان شود.",
    mid: "مهارت‌های بین‌فردی شما در سطح متوسط است. توانایی همکاری با دیگران را دارید اما در زمینه همدلی عمیق نیازمند تمرین بیشتری هستید.",
    high: "هوش اجتماعی شما بسیار بالاست. توانمندی بالایی در حل تعارضات و ایجاد یک فضای مثبت در روابط کاری و شخصی دارید.",
  },
  "Decision Making": {
    low: "تصمیم‌گیری‌های شما به شدت تحت تأثیر تکانه‌های هیجانی آنی است. ریسک گرفتن تصمیمات غیرمنطقی در شما بالاست.",
    mid: "شما تلاش می‌کنید بین منطق و احساس تعادل برقرار کنید، اما در موقعیت‌های حساس ممکن است دچار تردید و دوگانگی شوید.",
    high: "توانایی بالایی در تحلیل واقع‌بینانه دارید. می‌توانید بدون دخالت دادن هیجانات کاذب، بهترین و منطقی‌ترین مسیر را انتخاب کنید.",
  },
  Adaptability: {
    low: "انعطاف‌پذیری شما پایین است. هرگونه تغییر ناگهانی در برنامه‌ها یا محیط، باعث بروز مقاومت و افت عملکرد در شما می‌شود.",
    mid: "شما با تغییرات سازگار می‌شوید اما پذیرش شرایط جدید برایتان زمان‌بر است و ممکن است در ابتدا کمی چالش داشته باشید.",
    high: "تطبیق‌پذیری شما بسیار بالاست. به سرعت خود را با شرایط جدید وفق می‌دهید و تغییرات را به عنوان یک فرصت جدید مدیریت می‌کنید.",
  },
};

/**
 * Analysis Texts for GARDNER MI
 */
const MI_ANALYSIS_TEXTS: Record<string, { low: string; high: string }> = {
  Linguistic: {
    low: "شما ترجیح می‌دهید از ابزارهای غیرکلامی استفاده کنید. تقویت مهارت‌های نگارشی و مطالعه فعال می‌تواند به بیان بهتر ایده‌های شما کمک کند.",
    high: "هوش زبانی شما عالی است. شما در استفاده از کلمات، متقاعد کردن دیگران و یادگیری زبان‌های جدید توانایی کم‌نظیری دارید.",
  },
  Mathematical: {
    low: "شما بیشتر بر شهود و احساسات تکیه می‌کنید تا تحلیل‌های عددی. کار بر روی حل پازل‌های منطقی می‌تواند این بخش را تقویت کند.",
    high: "شما یک تحلیل‌گر قوی هستید. توانایی شما در شناسایی الگوها، حل مسائل پیچیده و تفکر استراتژیک بسیار برجسته است.",
  },
  Visual: {
    low: "تجسم فضایی چالش شماست. استفاده از نقشه‌های ذهنی و ابزارهای بصری می‌تواند به بهبود درک محیطی شما کمک کند.",
    high: "قدرت تجسم شما فوق‌العاده است. شما به خوبی می‌توانید تصاویر را در ذهن تغییر دهید و روابط فضایی را درک کنید.",
  },
  Kinesthetic: {
    low: "شما احتمالاً فعالیت‌های فکری را به فعالیت‌های فیزیکی ترجیح می‌دهید و هماهنگی بدن و ذهن در کارهای عملی برایتان زمان‌بر است.",
    high: "هماهنگی عصب و عضله در شما بسیار بالاست. شما در یادگیری کارهای عملی، ورزش و استفاده از مهارت‌های حرکتی بسیار موفق هستید.",
  },
  Musical: {
    low: "موسیقی برای شما صرفاً یک ابزار جانبی است. حساسیت شما به ریتم و ملودی در سطح پایه قرار دارد.",
    high: "شما گوشی حساس به موسیقی دارید. درک ریتم، تن صدا و ساختارهای موسیقایی از توانمندی‌های بارز شماست.",
  },
  Interpersonal: {
    low: "تعاملات اجتماعی گسترده ممکن است برای شما خسته‌کننده باشد. تقویت همدلی و مهارت‌های شنیداری می‌تواند روابط شما را بهبود بخشد.",
    high: "شما یک رهبر و ارتباط‌ساز عالی هستید. به راحتی انگیزه‌ها و احساسات دیگران را درک کرده و در گروه‌ها مدیریت مؤثری دارید.",
  },
  Intrapersonal: {
    low: "شناخت انگیزه‌های درونی و تحلیل رفتار خودتان برایتان چالش‌برانگیز است. تمرینات خودشناسی برای شما بسیار مفید خواهد بود.",
    high: "شما خودشناسی بسیار عمیقی دارید. به خوبی از نقاط قوت و ضعف خود آگاهید و تصمیمات را بر اساس ارزش‌های درونی می‌گیرید.",
  },
  Naturalistic: {
    low: "ارتباط شما با محیط زیست و دسته‌بندی پدیده‌های طبیعی در سطح پایینی قرار دارد و محیط‌های شهری را ترجیح می‌دهید.",
    high: "شما پیوند عمیقی با طبیعت دارید. توانایی شناسایی الگوهای زیستی و درک اکوسیستم‌ها در شما بسیار بالاست.",
  },
};

/**
 * Analysis Texts for NEO
 */
const NEO_ANALYSIS_TEXTS: Record<
  string,
  { low: string; average: string; high: string }
> = {
  N: {
    low: "شما از ثبات هیجانی بالایی برخوردارید. در شرایط بحرانی و پرفشار، آرامش خود را حفظ می‌کنید و کمتر دچار نوسانات خلقی یا اضطراب می‌شوید. این ویژگی به شما کمک می‌کند تا با اعتمادبه‌نفس بالا و ذهنی شفاف، با چالش‌های زندگی روبرو شوید.",
    average:
      "ثبات هیجانی شما در سطح متعادلی قرار دارد. در شرایط عادی به خوبی بر احساسات خود مسلط هستید، اما در موقعیت‌های بسیار تنش‌زا ممکن است درجاتی از نگرانی یا استرس را تجربه کنید که کاملاً طبیعی است.",
    high: "شما دنیا را با حساسیت عاطفی بالایی تجربه می‌کنید. تمایل به تجربه هیجانات منفی مثل اضطراب، حساسیت به انتقاد و نگرانی از آینده در شما بیشتر دیده می‌شود. یادگیری تکنیک‌های مدیریت استرس و تاب‌آوری می‌تواند به شما در حفظ تعادل روانی کمک شایانی کند.",
  },
  E: {
    low: "شما فردی درون‌گرا هستید که از تنهایی یا حضور در جمع‌های کوچک و صمیمی انرژی می‌گیرید. ترجیح می‌دهید بیشتر شنونده باشید تا گوینده و قبل از صحبت کردن، افکار خود را به دقت بررسی می‌کنید. شما برای فعالیت‌های متمرکز و مستقل بسیار توانمند هستید.",
    average:
      "شما یک میان‌گرا هستید. بسته به شرایط، هم از تعاملات اجتماعی لذت می‌برید و هم به زمان‌هایی برای خلوت با خود نیاز دارید. این انعطاف‌پذیری به شما اجازه می‌دهد تا هم در کارهای تیمی و هم در فعالیت‌های انفرادی عملکرد خوبی داشته باشید.",
    high: "شما فردی بسیار پرانرژی، قاطع و اجتماعی هستید. حضور در جمع به شما انگیزه می‌دهد و به راحتی با دیگران ارتباط برقرار می‌کنید. اشتیاق شما برای تجربه هیجان و توانایی در رهبری گروه‌ها، شما را به مهره‌ای کلیدی در فعالیت‌های تیمی تبدیل می‌کند.",
  },
  O: {
    low: "شما فردی واقع‌بین و پایبند به سنت‌ها هستید. تغییرات ناگهانی را چندان نمی‌پسندید و ترجیح می‌دهید از روش‌های آزموده شده و مطمئن برای حل مسائل استفاده کنید. ثبات و ثبات قدم در باورها از ویژگی‌های بارز شماست.",
    average:
      "میزان گشودگی شما به تجربیات جدید در حد متوسط است. بین احترام به سنت‌ها و پذیرش نوآوری تعادل برقرار می‌کنید. در عین حال که به ثبات اهمیت می‌دهید، از یادگیری مطالب جدید و تغییرات ملایم در سبک زندگی نیز استقبال می‌کنید.",
    high: "شما ذهنی بسیار جستجوگر و خلاق دارید. از ایده‌های انتزاعی لذت می‌برید و همیشه به دنبال راه‌های نوآورانه برای انجام کارها هستید. هنر، فلسفه و تجربیات غیرمعمول برای شما جذابیت زیادی دارد و به شدت از یکنواختی گریزان هستید.",
  },
  A: {
    low: "شما فردی واقع‌بین، منتقد و رقابت‌جو هستید. به جای پذیرش بی‌چون و چرای نظرات دیگران، آن‌ها را با منطق خود به چالش می‌کشید. این ویژگی شما را در مذاکرات و موقعیت‌هایی که نیاز به قاطعیت و صراحت دارد، بسیار موفق می‌کند.",
    average:
      "شما در تعاملات خود تعادل را حفظ می‌کنید. در عین حال که به نیازهای دیگران اهمیت می‌دهید و سعی در همکاری دارید، اجازه نمی‌دهید حقتان پایمال شود. مهارت‌های اجتماعی شما به شما کمک می‌کند تا روابط پایداری برقرار کنید.",
    high: "شما بسیار نوع‌دوست، مهربان و متواضع هستید. تمایل قلبی شما به کمک به دیگران و ایجاد صلح در محیط پیرامون، شما را به فردی بسیار محبوب تبدیل کرده است. شما به راحتی به دیگران اعتماد می‌کنید و روحیه همکاری فوق‌العاده‌ای دارید.",
  },
  C: {
    low: "شما فردی خودجوش هستید که ترجیح می‌دهید به جای برنامه‌ریزی‌های سخت‌گیرانه، با جریان زندگی پیش بروید. انعطاف‌پذیری شما در مواجهه با اتفاقات پیش‌بینی نشده بالاست، اما ممکن است در سازماندهی بلندمدت و جزئیات دقیق با چالش روبرو شوید.",
    average:
      "نظم و انضباط در زندگی شما به صورت نسبی برقرار است. در کارهای مهم و حیاتی مسئولیت‌پذیر هستید، اما در مسائل کم‌اهمیت‌تر به خود سخت نمی‌گیرید و اجازه می‌دهید کمی آزادی عمل و بی‌برنامگی در زندگی‌تان وجود داشته باشد.",
    high: "شما فردی بسیار هدفمند، منظم و با پشتکار هستید. وجدان کاری بالایی دارید و همیشه می‌توانید بر وسوسه‌های آنی غلبه کنید تا به اهداف بزرگتان برسید. دقت در جزئیات و قابلیت اطمینان، از شما یک شخص کاملاً حرفه‌ای ساخته است.",
  },
};

/**
 * Analysis Texts for MBTI
 */
const MBTI_ANALYSIS_TEXTS: Record<
  string,
  { title: string; summary: string; suggestions: string; critiques: string }
> = {
  INTJ: {
    title: "معمار (Architect)",
    summary:
      "شما فردی استراتژیک، متفکر و با اراده‌ای پولادین هستید. دنیا برای شما شبیه به یک صفحه شطرنج است که هر حرکت در آن باید با برنامه‌ریزی و دید بلندمدت انجام شود. شما به شدت مستقل هستید و ترجیح می‌دهید به جای پیروی از سنت‌ها، مسیرهای بهینه و منطقی خود را خلق کنید.",
    suggestions:
      "قدرت تحلیل شما بی‌نظیر است؛ سعی کنید در پروژه‌ها نقش طراح استراتژی را بر عهده بگیرید. همچنین یادگیری مهارت‌های نرم و درک احساسات دیگران می‌تواند نفوذ کلام شما را چندین برابر کند.",
    critiques:
      "ممکن است در نگاه دیگران سرد، مغرور یا بیش از حد انتقادگر به نظر برسید. گاهی به دلیل غرق شدن در تئوری‌ها، از واقعیت‌های ملموس و احساسات اطرافیان غافل می‌شوید.",
  },
  INTP: {
    title: "منطق‌دان (Logician)",
    summary:
      "شما عاشق کشف الگوها، حل معماها و درک چگونگی کارکرد جهان هستید. ذهن شما هرگز از فعالیت باز نمی‌ایستد و همیشه در حال پردازش ایده‌های انتزاعی است. شما بیش از هر چیز به حقیقت و دقت منطقی اهمیت می‌دهید و از تناقضات بیزارید.",
    suggestions:
      "شما در حل مسائل پیچیده فوق‌العاده عمل می‌کنید. برای موفقیت بیشتر، سعی کنید ایده‌های درخشان خود را به مرحله اجرا برسانید و فقط در دنیای ذهن باقی نمانید.",
    critiques:
      "تمایل شما به اصلاح مداوم افکارتان ممکن است باعث وسواس فکری یا تاخیر در تصمیم‌گیری شود. همچنین ممکن است در موقعیت‌های عاطفی، کمی دست‌پاچه یا بی‌تفاوت به نظر برسید.",
  },
  ENTJ: {
    title: "فرمانده (Commander)",
    summary:
      "شما رهبری مادرزاد هستید که قدرت عجیبی در سازماندهی افراد و منابع برای رسیدن به اهداف بزرگ دارید. چالش‌ها برای شما نه مانع، بلکه فرصتی برای اثبات توانایی‌ها هستند. شما با قاطعیت تصمیم می‌گیرید و برای بهره‌وری ارزش بسیار بالایی قائل هستید.",
    suggestions:
      "شما برای مدیریت‌های کلان و استارتاپ‌ها عالی هستید. به یاد داشته باشید که تشویق و تایید تیم، بازدهی آن‌ها را بسیار بیشتر از فشار منطقی بالا می‌برد.",
    critiques:
      "صراحت لهجه و تمایل شما به کنترل همه‌چیز ممکن است باعث شود دیگران شما را فردی مستبد یا بی‌رحم تصور کنند. یاد بگیرید که گاهی عقب‌نشینی کرده و به دیگران فضا بدهید.",
  },
  ENTP: {
    title: "مناظره‌گر (Debater)",
    summary:
      "شما از به چالش کشیدن باورها و کشف راه‌های نو لذت می‌برید. ذهنی سریع و زبانی تند و تیز دارید که می‌تواند هر بن‌بستی را با خلاقیت باز کند. شما عاشق طوفان فکری هستید و از تکرار و روزمرگی به شدت فراری هستید.",
    suggestions:
      "در زمینه‌هایی که نیاز به حل مسئله خلاقانه و نوآوری دارد (مثل بازاریابی یا کارآفرینی) فعالیت کنید. تمرکز بر روی یک مسیر مشخص می‌تواند پتانسیل عظیم شما را به نتیجه برساند.",
    critiques:
      "گاهی فقط برای لذتِ بحث کردن، با دیگران مخالفت می‌کنید که این کار می‌تواند روابط شما را تخریب کند. همچنین در به پایان رساندن کارهای روتین و جزئیات اجرایی ضعیف عمل می‌کنید.",
  },
  INFJ: {
    title: "حامی (Advocate)",
    summary:
      "شما فردی آرمان‌گرا، عمیق و با بصیرت هستید. برخلاف بسیاری، شما فقط به دنبال موفقیت شخصی نیستید، بلکه می‌خواهید تاثیری مثبت و ماندگار بر جهان بگذارید. شما احساسات دیگران را مانند خودشان درک می‌کنید و ترکیبی عجیب از احساس و منطق هستید.",
    suggestions:
      "نویسندگی، مشاوره و کارهای بشردوستانه با روحیه شما سازگار است. زمانی را برای بازیابی انرژی خود در خلوت اختصاص دهید تا دچار فرسودگی عاطفی نشوید.",
    critiques:
      "به دلیل کمال‌گرایی اخلاقی، ممکن است نسبت به ناعدالتی‌ها بیش از حد حساس شوید. همچنین تمایل دارید مشکلات را درون خودتان بریزید که این امر منجر به استرس پنهان می‌شود.",
  },
  INFP: {
    title: "میانجی (Mediator)",
    summary:
      "شما فردی حساس، رویایی و وفادار به ارزش‌های درونی خود هستید. دنیای درونی شما بسیار غنی‌تر از دنیای بیرونی است. شما به دنبال معنا در همه چیز می‌گردید و همیشه نیمه پر لیوان و پتانسیل‌های مثبت انسان‌ها را می‌بینید.",
    suggestions:
      "هنر، ادبیات و فعالیت‌های یاری‌گرانه جایی است که شما در آن می‌درخشید. یاد بگیرید که ارزش‌های خود را با صدای بلند بیان کنید و از مواجهه با واقعیت‌های سخت نترسید.",
    critiques:
      "گاه در رویاهای خود غرق می‌شوید و از مسائل عملی زندگی غافل می‌مانید. حساسیت بالای شما باعث می‌شود انتقادهای سازنده را هم به عنوان حملات شخصی تلقی کنید.",
  },
  ENFJ: {
    title: "قهرمان (Protagonist)",
    summary:
      "شما پرانرژی، با محبت و به شدت اجتماعی هستید. قدرت کلام شما می‌تواند هر جمعی را مجذوب کند. شما به رشد دیگران اهمیت می‌دهید و معمولاً همان کسی هستید که اطرافیان را برای رسیدن به اهدافشان تشویق و هدایت می‌کند.",
    suggestions:
      "شما برای تدریس، مربی‌گری و مدیریت منابع انسانی فوق‌العاده هستید. سعی کنید بین نیازهای دیگران و نیازهای خودتان مرز بگذارید تا خود را فدای بقیه نکنید.",
    critiques:
      "گاهی بیش از حد درگیر مشکلات دیگران می‌شوید و ممکن است به اشتباه سعی در کنترل زندگی آن‌ها (به نیت خیر) داشته باشید. همچنین تایید گرفتن از دیگران برای شما بیش از حد مهم است.",
  },
  ENFP: {
    title: "مبارز (Campaigner)",
    summary:
      "شما روحیه آزاد، مشتاق و خلاقی دارید. زندگی برای شما پر از احتمالات و فرصت‌های هیجان‌انگیز است. شما به راحتی با افراد مختلف ارتباط می‌گیرید و می‌توانید شور و شوق خود را به هر محیطی تزریق کنید.",
    suggestions:
      "در محیط‌های پویا که نیاز به ایده‌پردازی مداوم دارد فعالیت کنید. یادگیری تکنیک‌های مدیریت زمان به شما کمک می‌کند تا ایده‌های درخشانتان را به واقعیت تبدیل کنید.",
    critiques:
      "به دلیل اشتیاق زیاد به شروع کارهای جدید، در به پایان رساندن کارهای قبلی مشکل دارید. همچنین تمرکز بر جزئیات اجرایی و تکراری، روحیه شما را به شدت فرسوده می‌کند.",
  },
  ISTJ: {
    title: "لجستیک (Logistican)",
    summary:
      "شما ستون فقرات هر سازمانی هستید؛ فردی متعهد، حقیقت‌جو و به شدت مسئولیت‌پذیر. برای شما نظم، قانون و سنت اهمیت بالایی دارد. شما با تکیه بر تجربه و واقعیت‌ها عمل می‌کنید و قولتان برای دیگران سند است.",
    suggestions:
      "مشاغل مدیریتی، نظامی و حقوقی که نیاز به دقت بالا دارند برای شما عالی هستند. گاهی سعی کنید روش‌های جدید را هم امتحان کنید و فقط به «آنچه قبلاً جواب داده» تکیه نکنید.",
    critiques:
      "ممکن است در برابر تغییرات منعطف نباشید و با کسانی که نظم شما را به هم می‌زنند برخورد سردی داشته باشید. قضاوت‌های شما گاهی بیش از حد سخت‌گیرانه است.",
  },
  ISFJ: {
    title: "مدافع (Defender)",
    summary:
      "شما فردی مهربان، متواضع و به شدت فداکار هستید. حافظه عجیبی در به یاد داشتن جزئیات مربوط به آدم‌ها دارید و همیشه در پشت صحنه تلاش می‌کنید تا امنیت و آرامش اطرافیان را تامین کنید بدون اینکه به دنبال تشویق باشید.",
    suggestions:
      "شما در پزشکی، پرستاری و کارهای حمایتی بی‌رقیب هستید. یاد بگیرید که گاهی به درخواست‌های نامعقول دیگران «نه» بگویید و از فداکاری بیش از حد پرهیز کنید.",
    critiques:
      "تمایل شما به ثبات باعث می‌شود از تغییرات ضروری بترسید. همچنین با مخفی کردن احساسات منفی خود برای حفظ آرامش، ممکن است دچار بیماری‌های عصبی شوید.",
  },
  ESTJ: {
    title: "اجرایی (Executive)",
    summary:
      "شما مدیرانی لایق هستید که به خوبی می‌دانید چطور امور را سازماندهی کنید تا به نتیجه برسید. شما به صداقت، فداکاری و کرامت انسانی معتقدید و از دیگران هم انتظار دارید به اندازه شما مسئولیت‌پذیر باشند.",
    suggestions:
      "شما برای مدیریت عملیاتی و پروژه‌های بزرگ عالی هستید. سعی کنید درک کنید که هر کس توان و سرعت متفاوتی دارد و فشار بیش از حد همیشه نتیجه مثبت نمی‌دهد.",
    critiques:
      "ممکن است بیش از حد خشک و رئیس‌مآب به نظر برسید. صراحت شما گاهی به بی‌احترامی تعبیر می‌شود و درک جنبه‌های احساسی مسائل برایتان دشوار است.",
  },
  ESFJ: {
    title: "سفیر (Consul)",
    summary:
      "شما فردی بسیار اجتماعی، خون‌گرم و هماهنگ‌کننده هستید. برای شما حفظ هارمونی در جمع اولویت است. شما به خوبی از نیازهای مادی و عاطفی اطرافیان آگاهید و همیشه برای کمک به آن‌ها پیش‌قدم می‌شوید.",
    suggestions:
      "در مشاغلی که نیاز به تعامل مستقیم با مردم دارد (مثل روابط عمومی یا آموزش) بسیار موفق خواهید بود. سعی کنید ارزش خود را بر اساس نظر دیگران تعیین نکنید.",
    critiques:
      "بسیار نسبت به جایگاه اجتماعی و نظر دیگران حساس هستید. تضاد و درگیری شما را به شدت مضطرب می‌کند و ممکن است برای جلب رضایت همگانی، حقیقت را کتمان کنید.",
  },
  ISTP: {
    title: "چیره دست (Virtuoso)",
    summary:
      "شما عاشق بررسی چگونگی کارکرد اشیاء هستید. با دستانتان فکر می‌کنید و در حل مشکلات فنی و عملی نبوغ دارید. فردی ساکت اما مشاهده‌گر هستید که در لحظه تصمیم می‌گیرید و از آزادی عمل لذت می‌برید.",
    suggestions:
      "مهندسی، مکانیک و کارهای فنی-تخصصی بهترین جایگاه برای شماست. سعی کنید کمی بیشتر در مورد برنامه‌های بلندمدت خود فکر کنید و ارتباطات کلامی‌تان را تقویت کنید.",
    critiques:
      "پیش‌بینی رفتار شما سخت است و ممکن است به طور ناگهانی تغییر مسیر دهید. همچنین به دلیل استقلال زیاد، ممکن است در روابط عاطفی کمی دور و غیرقابل دسترس به نظر برسید.",
  },
  ISFP: {
    title: "هنرمند (Adventurer)",
    summary:
      "شما فردی حساس، صلح‌جو و به شدت زیبایی‌شناس هستید. زندگی را مانند یک بوم نقاشی می‌بینید و ترجیح می‌دهید به جای برنامه‌ریزی، در لحظه زندگی کنید و از حواس پنج‌گانه خود لذت ببرید. شما به شدت به آزادی شخصی اهمیت می‌دهید.",
    suggestions:
      "طراحی، گرافیک و هر کاری که با خلاقیت بصری در ارتباط باشد برای شما عالی است. تلاش کنید کمی بیشتر به اهداف آینده فکر کنید تا در لحظه غرق نشوید.",
    critiques:
      "از رقابت و درگیری به شدت فراری هستید و این باعث می‌شود در موقعیت‌های حساس از حق خود بگذرید. همچنین برنامه‌ریزی مالی و زمانی از نقاط ضعف شماست.",
  },
  ESTP: {
    title: "کارآفرین (Entrepreneur)",
    summary:
      "شما فردی پرانرژی، عمل‌گرا و اهل ریسک هستید. ترجیح می‌دهید به جای تئوری‌پردازی، وسط معرکه باشید. شما به خوبی از محیط اطرافتان آگاهید و می‌توانید در لحظه بهترین فرصت‌ها را شکار کنید و دیگران را با خود همراه سازید.",
    suggestions:
      "فروش، معاملات بورسی و کارهای عملیاتی پرریسک برای روحیه شما ساخته شده است. قبل از پریدن، کمی هم به عواقب بلندمدت کارهایتان فکر کنید.",
    critiques:
      "قوانین و ساختارهای اداری شما را کلافه می‌کند و ممکن است برای رسیدن به هدف، آن‌ها را زیر پا بگذارید. همچنین ممکن است نسبت به احساسات عمیق دیگران بی‌توجه باشید.",
  },
  ESFP: {
    title: "سرگرم کننده (Entertainer)",
    summary:
      "شما عاشق زندگی، آدم‌ها و لذت‌های ملموس هستید. هر کجا که می‌روید با خود شور و شادی می‌برید. شما روحیه بسیار سخاوتمندی دارید و دیگران از بودن در کنار شما هرگز خسته نمی‌شوند چون همیشه چیزی برای هیجان‌زده کردن آن‌ها دارید.",
    suggestions:
      "بازیگری، هتلداری و مشاغل حوزه گردشگری و هنر با روحیه شما سازگار است. روی نظم شخصی و مدیریت مسئولیت‌های تکراری بیشتر کار کنید.",
    critiques:
      "خیلی زود تمرکزتان را از دست می‌دهید و ممکن است برای لذت‌های لحظه‌ای، مسئولیت‌های مهم زندگی‌تان را نادیده بگیرید. تحمل تنهایی برای شما بسیار سخت است.",
  },
};

/**
 * Analysis Texts for Holland Career
 */
const HOLLAND_DETAILED_ANALYSIS: Record<
  string,
  {
    label: string;
    title: string;
    desc: string;
    characteristics: string[];
    environment: string;
  }
> = {
  R: {
    label: "واقع‌گرا (Realistic)",
    title: "عمل‌گرا و فنی",
    desc: "شما فردی عمل‌گرا، رک و مادی هستید که ترجیح می‌دهید به جای کلنجار رفتن با ایده‌های انتزاعی، با اشیاء، ابزارها، ماشین‌آلات و حیوانات کار کنید. توانایی بدنی و فنی شما بالاست و از دیدن نتیجه ملموس کار خود لذت می‌برید.",
    characteristics: [
      "مهارت مکانیکی عالی",
      "علاقه به فضای باز",
      "رویکرد حل مسئله عملی",
      "ثبات قدم",
    ],
    environment:
      "محیط‌هایی که نیاز به مهارت‌های بدنی دارند، کارگاه‌های صنعتی، مزارع، فضاهای مهندسی عملیاتی و هر جایی که ابزار حرف اول را می‌زند.",
  },
  I: {
    label: "جستجوگر (Investigative)",
    title: "تحلیل‌گر و متفکر",
    desc: "شما عاشق کشف حقایق، حل معماهای پیچیده و تحقیق هستید. مشاهده، یادگیری و تجزیه و تحلیل پدیده‌ها (چه علمی و چه انسانی) اولویت شماست. ترجیح می‌دهید به تنهایی روی مسائل کار کنید تا اینکه بخواهید دیگران را متقاعد کنید یا رهبری کنید.",
    characteristics: [
      "کنجکاوی بی‌پایان",
      "دقت بالا در جزئیات",
      "تفکر منطقی و انتقادی",
      "استقلال در عمل",
    ],
    environment:
      "آزمایشگاه‌های تحقیق و توسعه، دانشگاه‌ها، مراکز تحلیل داده، محیط‌های استراتژیک و فضاهایی که تفکر عمیق را ارج می‌نهند.",
  },
  A: {
    label: "هنری (Artistic)",
    title: "خلاق و نوآور",
    desc: "شما فردی حساس، احساساتی و بسیار خلاق هستید که از ساختارهای خشک و تکراری فراری هستید. بیان خود از طریق هنر، موسیقی، نوشتن یا طراحی برای شما حیاتی است. شما به زیبایی‌شناسی اهمیت می‌دهید و نگاه متفاوتی به دنیا دارید.",
    characteristics: [
      "تخیل قوی",
      "نیاز به آزادی عمل",
      "شهودی بودن",
      "بی‌زاری از قوانین سخت‌گیرانه",
    ],
    environment:
      "آتلیه‌های هنری، دفاتر طراحی، محیط‌های تبلیغاتی، تئاتر و موسیقی، و فضاهای منعطفی که نوآوری در آن‌ها حرف اول را می‌زند.",
  },
  S: {
    label: "اجتماعی (Social)",
    title: "یاری‌گر و مهربان",
    desc: "رسالت شما در برقراری ارتباط با دیگران، آموزش، درمان و کمک به رشد انسان‌هاست. شما در درک احساسات دیگران توانمند هستید و از فعالیت‌های گروهی انرژی می‌گیرید. ترجیح می‌دهید به جای کار با ماشین‌آلات، با آدم‌ها وقت بگذرانید.",
    characteristics: [
      "همدلی بالا",
      "صبر و حوصله",
      "مهارت‌های ارتباطی قوی",
      "روحیه همکاری",
    ],
    environment:
      "مدارس و مراکز آموزشی، بیمارستان‌ها و مراکز درمانی، موسسات خیریه، مراکز مشاوره و محیط‌های مبتنی بر تیم.",
  },
  E: {
    label: "متهور (Enterprising)",
    title: "رهبر و متقاعدکننده",
    desc: "شما انرژی بالایی برای تاثیرگذاری بر دیگران دارید. مدیریت پروژه‌ها، رهبری افراد و رسیدن به اهداف مالی یا سازمانی انگیزه اصلی شماست. شما ریسک‌پذیر هستید و قدرت کلام بالایی برای متقاعد کردن دیگران دارید.",
    characteristics: [
      "اعتماد به نفس بالا",
      "جاه‌طلبی",
      "قدرت متقاعدسازی",
      "توانایی تصمیم‌گیری سریع",
    ],
    environment:
      "سازمان‌های تجاری، محیط‌های استارتاپی رقابتی، بخش‌های فروش و بازاریابی، دنیای سیاست و مدیریت اجرایی.",
  },
  C: {
    label: "قراردادی (Conventional)",
    title: "منظم و سازمان‌یافته",
    desc: "شما قهرمان نظم، دقت و مدیریت داده‌ها هستید. کار با اعداد، سوابق و پیروی از دستورالعمل‌های دقیق تخصص شماست. شما ثبات و امنیت را به تغییرات ناگهانی ترجیح می‌دهید و در سازماندهی آشفتگی‌ها بی‌نظیر عمل می‌کنید.",
    characteristics: [
      "دقت وسواسی به جزئیات",
      "قابل اعتماد بودن",
      "مهارت در سازماندهی",
      "احترام به قوانین",
    ],
    environment:
      "بانک‌ها، دفاتر حسابداری، بخش‌های بایگانی و اداری، کنترل کیفیت و هر محیطی که دقت و فرآیند در آن کلیدی است.",
  },
};

const HOLLAND_JOB_SUGGESTIONS: Record<string, string[]> = {
  R: [
    "مهندس مکانیک",
    "تکنسین برق",
    "خلبان",
    "متخصص کشاورزی",
    "نجار حرفه‌ای",
    "جراح (بخش فنی)",
    "نقشه‌بردار",
    "اپراتور ماشین‌آلات سنگین",
    "تعمیرکار خودرو",
    "تکنسین شبکه",
  ],
  I: [
    "پژوهشگر علمی",
    "برنامه‌نویس سیستم",
    "پزشک متخصص",
    "تحلیل‌گر داده",
    "شیمیدان",
    "استاد دانشگاه",
    "متخصص امنیت سایبری",
    "روان‌شناس بالینی (تحقیقی)",
    "اقتصاددان",
    "اخترشناس",
  ],
  A: [
    "طراح گرافیک",
    "نویسنده و شاعر",
    "معمار",
    "کارگردان هنری",
    "نوازنده",
    "طراح مد و لباس",
    "عکاس تبلیغاتی",
    "مجسمه‌ساز",
    "تدوین‌گر ویدیو",
    "طراح دکوراسیون",
  ],
  S: [
    "مشاور خانواده",
    "معلم یا استاد",
    "پرستار",
    "مدیر منابع انسانی",
    "مددکار اجتماعی",
    "فیزیوتراپ",
    "مربی ورزشی",
    "متخصص روابط عمومی",
    "گفتار درمانگر",
    "راهنمای تور",
  ],
  E: [
    "مدیر فروش",
    "کارآفرین",
    "وکیل",
    "مدیر بازرگانی",
    "مدیر هتل",
    "کارگزار بورس",
    "نماینده مجلس",
    "مدیر بازاریابی",
    "مشاور مدیریت",
    "رهبر تیم پروژه",
  ],
  C: [
    "حسابدار",
    "تحلیل‌گر مالی",
    "مدیر بانک",
    "کارشناس امور اداری",
    "کتابدار",
    "تکنسین بایگانی",
    "حسابرس",
    "متخصص کنترل کیفیت",
    "منشی اجرایی",
    "کارشناس آمار",
  ],
};

// -----------------------------------------------------------------------

const ScoringLogic = {
  /**
   * LANGUAGE ENGINE
   */
  processLanguage: (session: any, answers: any, testType: any) => {
    const { levelWeights, structure } = testType.blueprint;
    let earnedPoints = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let maxPossiblePoints = 0;
    const levelStats: any = {};

    // Calculate Max Possible Points
    for (const [level, subjects] of Object.entries(structure)) {
      let qInLvl = 0;
      for (const count of Object.values(subjects as any))
        qInLvl += count as number;
      const weight = levelWeights[level] || 1;
      maxPossiblePoints += qInLvl * weight;
    }

    // Map through questions and calculate points
    const updatedQuestions = session.questions.map((sq: any) => {
      const q = sq.questionId;
      const userAns = answers.find(
        (a: any) => a.questionId == q._id.toString(),
      );
      const selectedOption = q.options.find(
        (o: any) =>
          userAns?.selectedOptionId &&
          o._id.toString() === userAns.selectedOptionId.toString(),
      );

      const isCorrect = selectedOption?.isCorrect || false;
      const weightValue = levelWeights[q.level] || 1;

      if (userAns) {
        if (isCorrect) {
          earnedPoints += weightValue;
          totalCorrect++;
        } else {
          earnedPoints -= weightValue / 5;
          totalWrong++;
        }
      }

      if (!levelStats[q.level])
        levelStats[q.level] = { correct: 0, wrong: 0, total: 0 };
      levelStats[q.level].total++;
      if (isCorrect) levelStats[q.level].correct++;
      else if (userAns) levelStats[q.level].wrong++;

      return {
        questionId: q._id,
        userAnswer: userAns?.selectedOptionId,
        isCorrect: isCorrect,
        subject: q.subject,
        level: q.level,
      };
    });

    const finalEarnedPoints = Math.max(0, earnedPoints);
    const scorePercentage = (finalEarnedPoints / maxPossiblePoints) * 100;

    return {
      totalScore: scorePercentage,
      levelResults: levelStats,
      questions: updatedQuestions,
      summary: {
        totalQuestions: updatedQuestions.length,
        correctAnswers: totalCorrect,
        wrongAnswers: totalWrong,
        unanswered: updatedQuestions.length - (totalCorrect + totalWrong),
        rawPoints: finalEarnedPoints.toFixed(2),
        maxPoints: maxPossiblePoints,
      },
    };
  },

  /**
   * PSYCHOLOGY ENGINE
   */
  processPsych: (session: any, answers: any) => {
    const totalQuestions = session.questions.length;
    const answeredCount = answers.length;

    if (answeredCount < totalQuestions * 0.5) {
      throw new Error("تعداد سوالات پاسخ داده شده برای تحلیل کافی نیست.");
    }

    const dimensionRawScores: Record<string, number> = {};
    const dimensionQuestionCounts: Record<string, number> = {};

    const answerMap = new Map(
      answers.map((a: any) => [
        a.questionId.toString(),
        a.selectedOptionId.toString(),
      ]),
    );

    const updatedQuestions = session.questions
      .map((sq: any) => {
        const q = sq.questionId;
        const userSelectedId = answerMap.get(q._id.toString());
        const selectedOption = q.options.find(
          (o: any) => o._id.toString() === userSelectedId,
        );

        if (!selectedOption) return null;

        let points = selectedOption.value || 0;
        if (q.isReverseScored) {
          points = 6 - points;
        }

        const dim = q.dimension || "General";
        dimensionRawScores[dim] = (dimensionRawScores[dim] || 0) + points;
        dimensionQuestionCounts[dim] = (dimensionQuestionCounts[dim] || 0) + 1;

        return {
          questionId: q._id,
          userAnswer: userSelectedId,
          pointsEarned: points,
          dimension: dim,
          subject: q.subject,
          level: q.level,
        };
      })
      .filter(Boolean);

    const analysisProfile: any = {};
    for (const [dim, score] of Object.entries(dimensionRawScores)) {
      const count = dimensionQuestionCounts[dim] || 1;
      const maxDimScore = count * 5;
      const percentage = (score / maxDimScore) * 100;
      const texts = BARON_ANALYSIS[dim] || {
        low: "N/A",
        mid: "N/A",
        high: "N/A",
      };
      const farsiName = DIMENSION_TRANSLATIONS[dim] || dim;

      let analysisText: string;
      let level: string;

      if (percentage < 45) {
        analysisText = texts.low;
        level = "پایین";
      } else if (percentage < 75) {
        analysisText = texts.mid;
        level = "متوسط";
      } else {
        analysisText = texts.high;
        level = "بالا";
      }

      analysisProfile[farsiName] = {
        score: score,
        level: level,
        analysis: analysisText,
      };
    }

    return {
      totalScore: Object.values(dimensionRawScores).reduce((a, b) => a + b, 0),
      levelResults: analysisProfile,
      questions: updatedQuestions,
    };
  },

  /**
   * GARDNER MULTIPLE INTELLIGENCES ENGINE
   */
  processGardner: (session: any, answers: any) => {
    const totalQuestions = session.questions.length;
    const answeredCount = answers.length;
    if (answeredCount < totalQuestions * 0.5) {
      throw new Error("تعداد سوالات پاسخ داده شده برای تحلیل کافی نیست.");
    }
    const dimensionRawScores: Record<string, number> = {};
    const dimensionQuestionCounts: Record<string, number> = {};

    const updatedQuestions = session.questions.map((sq: any) => {
      const q = sq.questionId;
      const userAns = answers.find(
        (a: any) => a.questionId.toString() === q._id.toString(),
      );
      const selectedOption = q.options.find(
        (o: any) =>
          userAns?.selectedOptionId &&
          o._id.toString() === userAns.selectedOptionId.toString(),
      );

      let points = selectedOption ? selectedOption.value || 0 : 0;
      if (q.isReverseScored) {
        points = 6 - points;
      }
      const dim = q.dimension || "General";
      dimensionRawScores[dim] = (dimensionRawScores[dim] || 0) + points;
      dimensionQuestionCounts[dim] = (dimensionQuestionCounts[dim] || 0) + 1;

      return {
        questionId: q._id,
        userAnswer: userAns?.selectedOptionId,
        pointsEarned: points,
        dimension: dim,
        subject: q.subject,
        level: q.level,
      };
    });

    const analysisProfile: any = {};
    for (const dim of Object.keys(dimensionRawScores)) {
      const score = dimensionRawScores[dim];
      const count = dimensionQuestionCounts[dim];
      const maxScore = count * 5;
      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
      const threshold = percentage >= 70 ? "high" : "low";
      const analysisText =
        MI_ANALYSIS_TEXTS[dim]?.[
          threshold as keyof (typeof MI_ANALYSIS_TEXTS)[typeof dim]
        ] || "تحلیل برای این بخش موجود نیست.";

      analysisProfile[dim] = {
        rawScore: score,
        percentage: parseFloat(percentage.toFixed(2)),
        label: MI_NAMES_PERSIAN[dim] || dim,
        analysis: analysisText,
      };
    }

    const topStrengths = Object.entries(analysisProfile)
      .filter(([, data]: any) => data.percentage > 0)
      .sort((a: any, b: any) => b[1].percentage - a[1].percentage)
      .slice(0, 3)
      .map(([name, data]: any) => ({
        name: name,
        label: data.label,
        percentage: data.percentage,
      }));

    return {
      totalScore: Object.values(dimensionRawScores).reduce((a, b) => a + b, 0),
      levelResults: {
        profile: analysisProfile,
        topStrengths: topStrengths,
      },
      questions: updatedQuestions,
    };
  },

  /**
   * NEO TEST ENGINE
   */
  processNEO: (session: any, answers: any) => {
    const rawScores: Record<string, number> = { N: 0, E: 0, O: 0, A: 0, C: 0 };
    const questionCounts: Record<string, number> = {
      N: 0,
      E: 0,
      O: 0,
      A: 0,
      C: 0,
    };
    const processedQuestions: any[] = [];
    const dimensionMap: Record<string, string> = {
      N: "Neuroticism",
      E: "Extraversion",
      O: "Openness",
      A: "Agreeableness",
      C: "Conscientiousness",
    };

    session.questions.forEach((q: any) => {
      const questionDoc = q.questionId;
      const userAns = answers.find(
        (a: any) => a.questionId === questionDoc._id.toString(),
      );

      if (userAns) {
        const selectedOption = questionDoc.options.find(
          (opt: any) => opt._id.toString() === userAns.selectedOptionId,
        );
        let val = selectedOption ? selectedOption.value : 0;
        const dim = questionDoc.dimension;

        if (questionDoc.isReverseScored) {
          val = 6 - val;
        }

        if (rawScores.hasOwnProperty(dim)) {
          rawScores[dim] += val;
          questionCounts[dim] += 1;
        }

        processedQuestions.push({
          questionId: questionDoc._id,
          userAnswer: selectedOption ? selectedOption.value : null,
          finalScore: val,
          subject: questionDoc.subject,
          level: questionDoc.level,
        });
      }
    });

    const finalResults: any = {};
    for (const dim in rawScores) {
      const count = questionCounts[dim] || 1;
      const maxScore = count * 5;
      const minScore = count * 1;
      const percentage =
        ((rawScores[dim] - minScore) / (maxScore - minScore)) * 100;
      const roundedScore = Math.round(percentage);
      let levelKey: "low" | "average" | "high" = "average";
      if (roundedScore >= 70) levelKey = "high";
      else if (roundedScore <= 30) levelKey = "low";
      const fullKey = dimensionMap[dim];
      finalResults[fullKey] = {
        name: NEO_NAMES_PERSIAN[dim],
        score: roundedScore,
        status:
          levelKey === "high" ? "بالا" : levelKey === "low" ? "پایین" : "متوسط",
        analysis: NEO_ANALYSIS_TEXTS[dim][levelKey],
      };
    }

    return {
      totalScore:
        Object.values(finalResults).reduce(
          (acc: number, curr: any) => acc + curr.score,
          0,
        ) / 5,
      levelResults: finalResults,
      questions: processedQuestions,
    };
  },

  /**
   * MBTI TEST ENGINE
   */
  processMBTI: (session: any, answers: any) => {
    const counts: Record<string, number> = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };
    const processedQuestions: any[] = [];

    session.questions.forEach((q: any) => {
      const questionDoc = q.questionId;
      if (!questionDoc) return;
      const userAns = answers.find(
        (a: any) => a.questionId === questionDoc._id.toString(),
      );

      if (userAns) {
        const selectedOption = questionDoc.options.find(
          (opt: any) => opt._id.toString() === userAns.selectedOptionId,
        );

        if (selectedOption) {
          const pts = selectedOption.traitPoints;
          const traitPoints =
            pts instanceof Map ? Object.fromEntries(pts) : pts;

          if (traitPoints) {
            for (const [trait, value] of Object.entries(traitPoints)) {
              if (counts.hasOwnProperty(trait)) {
                counts[trait] += value as number;
              }
            }
          }

          processedQuestions.push({
            questionId: questionDoc._id,
            userAnswer: selectedOption.text,
            dimension: questionDoc.dimension,
            pointsEarned: 1,
            subject: questionDoc.subject,
            level: questionDoc.level,
          });
        }
      }
    });

    const getDimensionStats = (p1: string, p2: string) => {
      const s1 = counts[p1] || 0;
      const s2 = counts[p2] || 0;
      const total = s1 + s2;
      if (total === 0)
        return { winner: p1, percentages: { [p1]: 50, [p2]: 50 } };
      const p1Percent = Math.round((s1 / total) * 100);
      const p2Percent = 100 - p1Percent;
      return {
        winner: s1 >= s2 ? p1 : p2,
        percentages: { [p1]: p1Percent, [p2]: p2Percent },
      };
    };

    const d1 = getDimensionStats("E", "I");
    const d2 = getDimensionStats("S", "N");
    const d3 = getDimensionStats("T", "F");
    const d4 = getDimensionStats("J", "P");
    const type = [d1.winner, d2.winner, d3.winner, d4.winner].join("");

    return {
      totalScore: processedQuestions.length,
      levelResults: {
        type: type,
        percentages: {
          EI: d1.percentages,
          SN: d2.percentages,
          TF: d3.percentages,
          JP: d4.percentages,
        },
        report: MBTI_ANALYSIS_TEXTS[type] || {
          title: type,
          summary: "نتیجه تست",
        },
        breakdown: counts,
      },
      questions: processedQuestions,
    };
  },

  /**
   * Holland career ENGINE
   */
  processHolland: (session: any, answers: any) => {
    const scores: Record<string, number> = {
      R: 0,
      I: 0,
      A: 0,
      S: 0,
      E: 0,
      C: 0,
    };
    const maxPossiblePerDim: Record<string, number> = {
      R: 0,
      I: 0,
      A: 0,
      S: 0,
      E: 0,
      C: 0,
    };
    const processedQuestions: any[] = [];

    session.questions.forEach((q: any) => {
      const questionDoc = q.questionId;
      if (!questionDoc) return;
      const dim = questionDoc.dimension;
      const maxValInThisQuestion = Math.max(
        ...questionDoc.options.map((opt: any) => opt.value || 0),
      );
      if (maxPossiblePerDim.hasOwnProperty(dim)) {
        maxPossiblePerDim[dim] += maxValInThisQuestion;
      }
      const userAns = answers.find(
        (a: any) => a.questionId === questionDoc._id.toString(),
      );
      if (userAns) {
        const selectedOption = questionDoc.options.find(
          (opt: any) => opt._id.toString() === userAns.selectedOptionId,
        );
        if (selectedOption) {
          const value = selectedOption.value || 0;
          if (scores.hasOwnProperty(dim)) {
            scores[dim] += value;
          }
          processedQuestions.push({
            questionId: questionDoc._id,
            userAnswer: selectedOption.text,
            dimension: dim,
            pointsEarned: value,
            subject: questionDoc.subject,
            level: questionDoc.level,
          });
        }
      }
    });

    const normalizedScores: Record<string, number> = {};
    Object.keys(scores).forEach((dim) => {
      const rawScore = scores[dim];
      const maxScore = maxPossiblePerDim[dim] || 1;
      normalizedScores[dim] = Math.round((rawScore / maxScore) * 100);
    });

    const sortedTraits = Object.entries(normalizedScores).sort(
      ([, a], [, b]) => (b as number) - (a as number),
    );
    const topThreeCode = sortedTraits
      .slice(0, 3)
      .map(([trait]) => trait)
      .join("");
    const primaryCode = topThreeCode[0];

    return {
      totalScore: Math.round(
        Object.values(normalizedScores).reduce((a, b) => a + (b as number), 0) /
          6,
      ),
      levelResults: {
        topThreeCode: topThreeCode,
        radarChartData: normalizedScores,
        primaryType: HOLLAND_DETAILED_ANALYSIS[primaryCode],
        suggestedJobs: HOLLAND_JOB_SUGGESTIONS[primaryCode] || [],
        secondaryTypes: [
          HOLLAND_DETAILED_ANALYSIS[topThreeCode[1]],
          HOLLAND_DETAILED_ANALYSIS[topThreeCode[2]],
        ].filter(Boolean),
        fullBreakdown: sortedTraits.map(([trait, score]) => ({
          trait,
          score: score as number,
          label: HOLLAND_DETAILED_ANALYSIS[trait].label,
          title: HOLLAND_DETAILED_ANALYSIS[trait].title,
        })),
      },
      questions: processedQuestions,
    };
  },

  /**
   * TECHNICAL SKILLS ENGINE
   */
  processTechnical: (session: any, answers: any, testType: any) => {
    const { levelWeights, structure } = testType.blueprint;
    let earnedPoints = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let maxPossiblePoints = 0;
    const levelStats: any = {};

    for (const [level, subjects] of Object.entries(structure)) {
      let qInLvl = 0;
      for (const count of Object.values(subjects as any))
        qInLvl += count as number;
      const weight = levelWeights[level] || 1;
      maxPossiblePoints += qInLvl * weight;
    }

    const updatedQuestions = session.questions.map((sq: any) => {
      const q = sq.questionId;
      const userAns = answers.find(
        (a: any) => a.questionId.toString() === q._id.toString(),
      );
      const selectedOption = q.options.find(
        (o: any) =>
          userAns?.selectedOptionId &&
          o._id.toString() === userAns.selectedOptionId.toString(),
      );
      const isCorrect = selectedOption?.isCorrect === true;
      const weightValue = levelWeights[q.level] || 1;

      if (userAns) {
        if (isCorrect) {
          earnedPoints += weightValue;
          totalCorrect++;
        } else {
          earnedPoints -= weightValue / 5;
          totalWrong++;
        }
      }
      if (!levelStats[q.level])
        levelStats[q.level] = { correct: 0, wrong: 0, total: 0 };
      levelStats[q.level].total++;
      if (isCorrect) levelStats[q.level].correct++;
      else if (userAns) levelStats[q.level].wrong++;

      return {
        questionId: q._id,
        userAnswer: userAns?.selectedOptionId,
        isCorrect: isCorrect,
        subject: q.subject,
        level: q.level,
      };
    });

    const finalEarnedPoints = Math.max(0, earnedPoints);
    const scorePercentage = (finalEarnedPoints / maxPossiblePoints) * 100;

    let levelLabelEn = "";
    let levelLabelFa = "";

    if (scorePercentage <= 30) {
      levelLabelEn = "Beginner";
      levelLabelFa = "آشنایی اولیه";
    } else if (scorePercentage <= 60) {
      levelLabelEn = "Junior / Entry Level";
      levelLabelFa = "جونیور / آماده به کار";
    } else if (scorePercentage <= 85) {
      levelLabelEn = "Mid-level / Proficient";
      levelLabelFa = "میان‌رده / مسلط";
    } else {
      levelLabelEn = "Senior / Expert";
      levelLabelFa = "ارشد / متخصص";
    }

    return {
      totalScore: scorePercentage,
      levelResults: levelStats,
      questions: updatedQuestions,
      summary: {
        totalQuestions: updatedQuestions.length,
        correctAnswers: totalCorrect,
        wrongAnswers: totalWrong,
        unanswered: updatedQuestions.length - (totalCorrect + totalWrong),
        scorePercentage: scorePercentage.toFixed(2),
        levelEn: levelLabelEn,
        levelFa: levelLabelFa,
        rawPoints: finalEarnedPoints.toFixed(2),
        maxPoints: maxPossiblePoints,
      },
    };
  },
};

export default ScoringLogic;
