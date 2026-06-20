import prisma from "../../../config/prisma";

const questionsData = [
  // Vocabulary & Expressions - المفردات والتعبيرات المتقدمة
  {
    subject: "Vocabulary",
    level: "B2",
    text: "أنا مهتمٌ ___ السياسة والاقتصاد العالمي.",
    options: ["في", "بـ", "على", "من"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "B2",
    text: "لا أستطيع أن أقرر ___ اقتراحك الآن.",
    options: ["على", "في", "بشأن", "من"],
    correct: 2,
  },
  {
    subject: "Vocabulary",
    level: "B2",
    text: "علينا مناقشة المشكلة ___ القواعد الجديدة.",
    options: ["بـ", "عن", "حول", "على"],
    correct: 2,
  },
  {
    subject: "Vocabulary",
    level: "B2",
    text: "أنا مقتنعٌ تماماً ___ رأيه.",
    options: ["بـ", "على", "من", "بشأن"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B2",
    text: "أنا أحلمُ كثيراً ___ السفر حول العالم.",
    options: ["بـ", "عن", "في", "إلى"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B2",
    text: "سجلتُ اسمي ___ الدورة التدريبية.",
    options: ["على", "في", "بـ", "إلى"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "B2",
    text: "سوف نناقش ___ مزايا وعيوب الخطة.",
    options: ["حول", "بـ", "مزايا", "في"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B2",
    text: "أنا أتذكر جيداً تفاصيل ___ طفولتي.",
    options: ["من", "في", "بـ", "على"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B2",
    text: "أنا فخورٌ جداً ___ إنجازاتي الأخيرة.",
    options: ["بـ", "في", "على", "من"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B2",
    text: "أنا أعتني ___ تنظيم هذا المشروع.",
    options: ["بـ", "على", "في", "عن"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B2",
    text: "هي مسؤولةٌ ___ الشؤون المالية للشركة.",
    options: ["عن", "بـ", "على", "في"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B2",
    text: "علينا التحقق من جميع الوثائق ___ التفاصيل.",
    options: ["بـ", "حول", "عن", "على"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B2",
    text: "أنا أتذكر ___ عطلتي الماضية بكثير من الشوق.",
    options: ["من", "في", "بـ", "على"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B2",
    text: "أنا مقتنعٌ ___ نجاح هذه الإجراءات.",
    options: ["بـ", "على", "من", "بشأن"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B2",
    text: "هي مسؤولةٌ ___ احترام قواعد السلامة العامة.",
    options: ["عن", "بـ", "على", "في"],
    correct: 0,
  },

  // Grammar & Tenses - القواعد والصيغ المتقدمة
  {
    subject: "Grammar",
    level: "B2",
    text: "لو كنتُ غنياً، ___ منزلاً كبيراً على البحر.",
    options: ["أشتري", "كنت أشتري", "لاشتريتُ", "سأشتري"],
    correct: 2,
  },
  {
    subject: "Grammar",
    level: "B2",
    text: "لا أعرف بالضبط ___ الذي جاء أمس.",
    options: ["متى", "مَن", "كيف", "لماذا"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "B2",
    text: "أعتقدُ أنه ___ على صواب.",
    options: ["هو", "كان", "يكون", "لديه"],
    correct: 2,
  },
  {
    subject: "Grammar",
    level: "B2",
    text: "البارحة ___ مع أصدقائي طويلاً.",
    options: ["تحدثتُ", "أتحدث", "نتحدث", "تحدث"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B2",
    text: "هل ___ هذا الكتاب من قبل؟",
    options: ["قرأتَ", "كتاباً", "يقرأ", "كتب"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B2",
    text: "نحن ___ كرة القدم في النادي بانتظام.",
    options: ["نلعبُ", "يلعب", "تلعب", "يلعبون"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B2",
    text: "أنا متأكدٌ أنه ___ الإجابة الصحيحة.",
    options: ["يعرفُ", "كان", "لديهم", "يعرفون"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B2",
    text: "آملُ أن ___ الطقس غداً جميلاً.",
    options: ["يكون", "هو", "جيد", "جميل"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B2",
    text: "لو وصلتَ مبكراً، ___ المباراة معنا.",
    options: ["شاهدنا", "لشاهدتَ", "نرى", "رأينا"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "B2",
    text: "أنا مهتمٌ جداً ___ تعلم لغات جديدة.",
    options: ["بـ", "على", "في", "من"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B2",
    text: "لا أعرف بالضبط ___ يمكنني القيام بذلك.",
    options: ["كيف", "إذا", "متى", "ماذا"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B2",
    text: "طلبتُ منه أن ___ لي الأمر بوضوح.",
    options: ["لي", "يشرحَ", "لنا", "هو"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "B2",
    text: "أنا متأكدٌ أنه ___ في الامتحان بجدارة.",
    options: ["نجحَ", "ينجح", "سينجح", "نجاح"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B2",
    text: "لو درستَ أكثر، ___ نجاحك أفضل بكثير.",
    options: ["لكانَ", "كان", "يكون", "سيكون قد"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B2",
    text: "لا أعرف بالضبط ما هو ___ حل المشكلة.",
    options: ["كيف", "متى", "إذا", "أفضل"],
    correct: 3,
  },

  // Prepositions & Expressions - حروف الجر والتعابير
  {
    subject: "Preposition",
    level: "B2",
    text: "أنا مهتمٌ بشدة ___ السياسة الحالية.",
    options: ["بـ", "على", "في", "من"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B2",
    text: "غالباً ما يتحدث الكاتب ___ تجاربه في الخارج.",
    options: ["عن", "في", "بـ", "على"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B2",
    text: "سنتحدث غداً ___ المدير بشأن المشروع.",
    options: ["مع", "عن", "إلى", "في"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B2",
    text: "أنا أتذكر جيداً أيام ___ طفولتي.",
    options: ["من", "في", "بـ", "على"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B2",
    text: "أحلم دائماً ___ رحلة استكشافية حول العالم.",
    options: ["بـ", "على", "في", "إلى"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B2",
    text: "هي فخورةٌ جداً ___ ابنتها الصغرى.",
    options: ["بـ", "على", "من", "في"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B2",
    text: "أنا أعتني ___ الضيوف الكرام.",
    options: ["بـ", "على", "من", "في"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B2",
    text: "إذا أمطرت بغزارة، سنبقى ___ المنزل.",
    options: ["في", "على", "بـ", "عند"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B2",
    text: "أنا متحمسٌ للغاية ___ زيارتك القادمة.",
    options: ["لـ", "على", "بـ", "في"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B2",
    text: "أنا مسؤولٌ ___ تنفيذ قواعد السلامة.",
    options: ["عن", "بـ", "في", "على"],
    correct: 0,
  },
];

const ArabicB2Data = async (typeId: string) => {
  try {
    const formattedQuestions = questionsData.map((q) => ({
      typeId: typeId,
      subject: q.subject,
      level: q.level,
      questionText: q.text,
      options: q.options.map((opt, index) => ({
        text: opt,
        isCorrect: index === q.correct,
      })),
    }));

    await prisma.question.createMany({
      data: formattedQuestions,
      skipDuplicates: true,
    });

    console.log(
      `Successfully imported ${formattedQuestions.length} Arabic B2 questions!`,
    );
  } catch (err) {
    console.error("Arabic B2 Import failed:", err);
  }
};

export default ArabicB2Data;
