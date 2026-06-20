import prisma from "../../../config/prisma";

const questionsData = [
  // Vocabulary - المفردات
  {
    subject: "Vocabulary",
    level: "A1",
    text: "كلمة 'بيت' تعني:",
    options: ["سيارة", "بيت", "كتاب", "مدرسة"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "كلمة 'قطة' تعني:",
    options: ["قطة", "كلب", "شجرة", "كرسي"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "في الصباح، نأكل:",
    options: ["العشاء", "الإفطار", "الغداء", "وجبة خفيفة"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "كلمة 'أُم' تعني:",
    options: ["أخت", "أُم", "أب", "صديقة"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "كلمة 'أب' تعني:",
    options: ["رجل", "امرأة", "طفل", "مدرس"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "نستخدم 'الكتاب' لـ:",
    options: ["القراءة", "الأكل", "الشرب", "النوم"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "الماء هو:",
    options: ["فاكهة", "مشروب", "كرسي", "حيوان"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "المدرسة هي:",
    options: ["مبنى", "بلد", "بيت", "مطعم"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "المدرس يعمل في:",
    options: ["المطبخ", "البنك", "المصنع", "المدرسة"],
    correct: 3,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "الكرسي هو نوع من:",
    options: ["الطعام", "الأثاث", "الحيوانات", "المشروبات"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "الطاولة عادة مصنوعة من:",
    options: ["خشب", "ماء", "خبز", "ورق"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "النافذة تكون في:",
    options: ["الباب", "الشارع", "المدرسة", "الحائط"],
    correct: 3,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "الباب يمكن أن يكون:",
    options: ["ساخناً", "حلواً", "مفتوحاً أو مغلقاً", "صاخباً"],
    correct: 2,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "تشرق الشمس في:",
    options: ["الليل", "الصباح", "المساء", "الظهيرة"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "أنا أسكن ___ مصر.",
    options: ["على", "عند", "من", "في"],
    correct: 3,
  },

  // Grammar - القواعد
  {
    subject: "Grammar",
    level: "A1",
    text: "___ طالبٌ مجتهد.",
    options: ["هو", "أنا", "نحن", "أنت"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "هل ___ عربي؟",
    options: ["أنا", "هو", "أنتَ", "نحن"],
    correct: 2,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "___ مدرسٌ في المدرسة.",
    options: ["أنا", "هو", "نحن", "أنت"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "___ نعيش في القاهرة.",
    options: ["نحن", "أنا", "هو", "أنت"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "___ في المنزل الآن.",
    options: ["أنا", "هو", "هم", "نحن"],
    correct: 2,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "أنا ___ الماء كل صباح.",
    options: ["أشربُ", "تشربُ", "يشربُ", "نشربُ"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "هي ___ اللغة العربية.",
    options: ["تتعلمُ", "يتعلمُ", "نتعلمُ", "تعلمت"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "هو ___ الكتاب.",
    options: ["أقرأُ", "يقرأُ", "نقرأُ", "قرأتُ"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "نحن ___ إلى المدرسة.",
    options: ["نذهبُ", "تذهبُ", "يذهبُ", "ذهبتُ"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "هم ___ القهوة.",
    options: ["يشربون", "يشرب", "يشربن", "نشرب"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "ما ___ اسمك؟",
    options: ["هو", "أنا", "أنت", "هذا"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "أنتَ ___ متعبٌ اليوم.",
    options: ["هو", "أنا", "تبدو", "نحن"],
    correct: 2,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "___ مدرسةٌ نشيطة.",
    options: ["هي", "هو", "أنا", "هم"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "نحن ___ أصدقاء.",
    options: ["أنا", "أنت", "نحن", "هو"],
    correct: 2,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "هم ___ من كندا.",
    options: ["أنا", "هو", "أنت", "هم"],
    correct: 3,
  },

  // Prepositions & Expressions - التعبيرات وحروف الجر
  {
    subject: "Preposition",
    level: "A1",
    text: "مرحباً =",
    options: ["أهلاً", "تصبح على خير", "مساء الخير", "وداعاً"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "A1",
    text: "تصبح على خير =",
    options: ["صباح الخير", "طاب يومك", "تصبح على خير", "مرحباً"],
    correct: 2,
  },
  {
    subject: "Preposition",
    level: "A1",
    text: "كيف ___؟",
    options: ["هو", "أنا", "أنت", "حالُك"],
    correct: 3,
  },
  {
    subject: "Preposition",
    level: "A1",
    text: "أنا ___ بخير، شكراً.",
    options: ["أنا", "نحن", "هو", "أنت"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "A1",
    text: "شكراً ___ مساعدتك.",
    options: ["في", "مع", "على", "عند"],
    correct: 2,
  },
  {
    subject: "Preposition",
    level: "A1",
    text: "أسكن ___ لندن.",
    options: ["في", "على", "عند", "من"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "A1",
    text: "نذهب ___ المدرسة.",
    options: ["عن", "إلى", "في", "من"],
    correct: 1,
  },
  {
    subject: "Preposition",
    level: "A1",
    text: "معي ___ واحد.",
    options: ["هذا", "هذه", "بعض", "كتابٌ"],
    correct: 3,
  },
  {
    subject: "Preposition",
    level: "A1",
    text: "الكتاب ___ الطاولة.",
    options: ["في", "على", "تحت", "بين"],
    correct: 1,
  },
  {
    subject: "Preposition",
    level: "A1",
    text: "كم ساعة في اليوم؟",
    options: ["12", "24", "20", "30"],
    correct: 1,
  },
];

const ArabicA1Data = async (typeId: string) => {
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
      `Successfully imported ${formattedQuestions.length} Arabic A1 questions!`,
    );
  } catch (err) {
    console.error("Arabic A1 Import failed:", err);
  }
};

export default ArabicA1Data;
