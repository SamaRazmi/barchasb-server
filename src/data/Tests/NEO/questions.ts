import prisma from "../../../config/prisma";

const NEOQuestions = async (typeId: string) => {
  const options = [
    { text: "کاملاً مخالفم", value: 1 },
    { text: "مخالفم", value: 2 },
    { text: "نه مخالفم نه موافقم", value: 3 },
    { text: "موافقم", value: 4 },
    { text: "کاملاً موافقم", value: 5 },
  ];

  const dbOptions = options.map((opt) => ({
    text: opt.text,
    value: opt.value,
    isCorrect: false,
  }));

  const rawQuestions = [
    // N: Neuroticism (روان‌رنجوری)
    { dim: "N", rev: false, text: "اغلب احساس تنش و عصبی بودن می‌کنم." },
    {
      dim: "N",
      rev: true,
      text: "من معمولاً آدم آرام و خونسردی هستم و به راحتی تحت تأثیر قرار نمی‌گیرم.",
    },
    {
      dim: "N",
      rev: false,
      text: "گاهی اوقات آنقدر احساس ترس یا اضطراب می‌کنم که بدنم می‌لرزد.",
    },
    {
      dim: "N",
      rev: false,
      text: "من اغلب از نحوه برخورد دیگران با خودم رنجیده‌خاطر می‌شوم.",
    },
    { dim: "N", rev: true, text: "به ندرت احساس تنهایی یا افسردگی می‌کنم." },
    {
      dim: "N",
      rev: false,
      text: "اغلب احساس می‌کنم که از دیگران کمتر هستم و اعتمادبه‌نفس پایینی دارم.",
    },
    {
      dim: "N",
      rev: false,
      text: "وقتی تحت فشار استرس هستم، گاهی احساس می‌کنم دارم از هم می‌پاشم.",
    },
    { dim: "N", rev: true, text: "من به ندرت عصبانی یا خشمگین می‌شوم." },
    {
      dim: "N",
      rev: false,
      text: "گاهی اوقات احساس می‌کنم کاملاً بی‌ارزش هستم.",
    },
    {
      dim: "N",
      rev: false,
      text: "من اغلب نگران اتفاقات بدی هستم که ممکن است در آینده بیفتد.",
    },
    {
      dim: "N",
      rev: true,
      text: "حتی وقتی اوضاع بد پیش می‌رود، من معمولاً شاد هستم.",
    },
    {
      dim: "N",
      rev: false,
      text: "تغییرات ناگهانی در زندگی من را بسیار مضطرب می‌کند.",
    },

    // E: Extraversion (برون‌گرایی)
    { dim: "E", rev: false, text: "من واقعاً از گفتگو با مردم لذت می‌برم." },
    {
      dim: "E",
      rev: true,
      text: "من ترجیح می‌دهم در جمع‌ها در حاشیه بمانم و جلب توجه نکنم.",
    },
    { dim: "E", rev: false, text: "من دوست دارم همیشه اطرافم پر از آدم باشد." },
    {
      dim: "E",
      rev: false,
      text: "من آدم بسیار فعالی هستم و همیشه سرم شلوغ است.",
    },
    {
      dim: "E",
      rev: true,
      text: "من فردی نیستم که به دنبال هیجان و ماجراجویی‌های خطرناک باشد.",
    },
    { dim: "E", rev: false, text: "من معمولاً فردی شاد و پرانرژی هستیم." },
    {
      dim: "E",
      rev: true,
      text: "من ترجیح می‌دهم کارهایم را به تنهایی انجام دهم تا با دیگران.",
    },
    {
      dim: "E",
      rev: false,
      text: "من به راحتی می‌توانم رهبری یک گروه را بر عهده بگیرم.",
    },
    { dim: "E", rev: true, text: "من آدم کم‌حرفی هستم و زیاد اهل صحبت نیستم." },
    {
      dim: "E",
      rev: false,
      text: "من عاشق رفتن به مهمانی‌های بزرگ و شلوغ هستم.",
    },
    { dim: "E", rev: true, text: "سرعت زندگی من معمولاً آرام و یکنواخت است." },
    { dim: "E", rev: false, text: "من فردی بسیار خوش‌بین هستم." },

    // O: Openness (گشودگی)
    { dim: "O", rev: false, text: "من از تخیل و رویاپردازی لذت می‌برم." },
    {
      dim: "O",
      rev: true,
      text: "من علاقه چندانی به بحث‌های فلسفی یا انتزاعی ندارند.",
    },
    {
      dim: "O",
      rev: false,
      text: "من عاشق امتحان کردن غذاهای جدید و عجیب هستم.",
    },
    {
      dim: "O",
      rev: false,
      text: "هنر و زیبایی برای من اهمیت بسیار زیادی دارد.",
    },
    {
      dim: "O",
      rev: true,
      text: "من ترجیح می‌دهم به روش‌های قدیمی و سنتی عمل کنم.",
    },
    {
      dim: "O",
      rev: false,
      text: "من اغلب نسبت به احساسات درونی خودم کنجکاو هستم.",
    },
    {
      dim: "O",
      rev: false,
      text: "من از تماشای آثار هنری که ساختارشکنی می‌کنند لذت می‌برم.",
    },
    {
      dim: "O",
      rev: true,
      text: "من فکر می‌کنم تخیل زیاد باعث دور شدن آدم از واقعیت می‌شود.",
    },
    {
      dim: "O",
      rev: false,
      text: "من به یادگیری موضوعات متنوع و جدید علاقه زیادی دارم.",
    },
    { dim: "O", rev: true, text: "من به ندرت در رویاهایم غرق می‌شوم." },
    {
      dim: "O",
      rev: false,
      text: "من معتقدم که باید در مورد باورهای مذهبی و اخلاقی بازاندیشی کرد.",
    },
    {
      dim: "O",
      rev: false,
      text: "تنوع در زندگی برای من بسیار مهم‌تر از ثبات و یکنواختی است.",
    },

    // A: Agreeableness (توافق‌پذیری)
    {
      dim: "A",
      rev: false,
      text: "من سعی می‌کنم با همه مودب و مهربان باشم.",
    },
    {
      dim: "A",
      rev: true,
      text: "من فکر می‌کنم بیشتر مردم اگر فرصت پیدا کنند، از شما سوءاستفاده می‌کنند.",
    },
    {
      dim: "A",
      rev: false,
      text: "من واقعاً از کمک کردن به دیگران لذت می‌برم.",
    },
    {
      dim: "A",
      rev: true,
      text: "من تمایل دارم در مورد اشتباهات دیگران سخت‌گیر و منتقد باشم.",
    },
    {
      dim: "A",
      rev: false,
      text: "من به نیت خیر اکثر آدم‌ها اعتماد دارم.",
    },
    {
      dim: "A",
      rev: true,
      text: "گاهی اوقات برای رسیدن به چیزی که می‌خواهم، دیگران را فریب می‌دهم.",
    },
    {
      dim: "A",
      rev: false,
      text: "من از بحث و جدل با دیگران به شدت بیزارم.",
    },
    {
      dim: "A",
      rev: true,
      text: "من فکر می‌کنم آدم‌های ضعیف لیاقت دلسوزی ندارند.",
    },
    {
      dim: "A",
      rev: false,
      text: "من همیشه سعی می‌کنم با دیگران همکاری کنم نه رقابت.",
    },
    {
      dim: "A",
      rev: true,
      text: "من خودم را برتر از بسیاری از اطرافیانم می‌بینم.",
    },
    {
      dim: "A",
      rev: false,
      text: "اگر کسی مرا آزار دهد، به راحتی او را می‌بخشم.",
    },
    {
      dim: "A",
      rev: false,
      text: "من به احساسات اطرافیانم بسیار اهمیت می‌دهم.",
    },

    // C: Conscientiousness (وظیفه‌شناسی)
    {
      dim: "C",
      rev: false,
      text: "من همیشه وسایلم را تمیز و مرتب نگه می‌دارم.",
    },
    {
      dim: "C",
      rev: true,
      text: "من اغلب کارها را به لحظه آخر واگذار می‌کنم.",
    },
    {
      dim: "C",
      rev: false,
      text: "من قبل از انجام هر کاری، به دقت برنامه‌ریزی می‌کنم.",
    },
    {
      dim: "C",
      rev: false,
      text: "من برای رسیدن به اهدافم بسیار سخت‌کوش هستم.",
    },
    {
      dim: "C",
      rev: true,
      text: "گاهی اوقات آنقدرها که باید، مسئولیت‌پذیر نیستم.",
    },
    {
      dim: "C",
      rev: false,
      text: "من همیشه به قول‌هایی که می‌دهم عمل می‌کنم.",
    },
    {
      dim: "C",
      rev: true,
      text: "من در زندگی روزمره آدم بی‌نظمی هستم.",
    },
    {
      dim: "C",
      rev: false,
      text: "من در انجام وظایفم بسیار دقیق و وسواسی هستم.",
    },
    {
      dim: "C",
      rev: true,
      text: "من اغلب بدون فکر کردن و ناگهانی تصمیم می‌گیرم.",
    },
    {
      dim: "C",
      rev: false,
      text: "من فردی بسیار منضبط و با اراده هستم.",
    },
    {
      dim: "C",
      rev: true,
      text: "وقت‌شناسی یکی از نقاط ضعف من است.",
    },
    {
      dim: "C",
      rev: false,
      text: "من همیشه سعی می‌کنم هر کاری را به بهترین نحو انجام دهم.",
    },
  ];

  const formattedQuestions = rawQuestions.map((q) => ({
    typeId,
    subject: "General",
    level: "General",
    dimension: q.dim,
    isReverseScored: q.rev,
    questionText: q.text,
    options: dbOptions,
  }));

  try {
    await prisma.question.createMany({
      data: formattedQuestions,
      skipDuplicates: true,
    });
    console.log(
      `NEO Test: Successfully synchronized ${rawQuestions.length} questions.`,
    );
  } catch (err) {
    console.error("NEO Questions Sync Failed:", err);
  }
};

export default NEOQuestions;
