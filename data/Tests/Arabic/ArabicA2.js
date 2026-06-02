const Question = require('../../../models/Question');

const questionsData = [
    // Vocabulary & Daily Phrases - المفردات والعبارات
    { subject: "Vocabulary", level: "A2", text: "غداً سأذهب ___ السينما.", options: ["إلى", "على", "عند", "من"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "البارحة ___ أصدقائي في الحديقة.", options: ["رأيتُ", "أرى", "يرى", "نشاهد"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "نحن ___ إلى القاهرة غداً.", options: ["سنسافرُ", "يذهب", "تذهب", "ذهبنا"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "أتناول ___ كل صباح قبل العمل.", options: ["الإفطار", "الغداء", "العشاء", "وجبة خفيفة"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "هل تستطيع ___ مساعدتي؟", options: ["لي", "أنا", "أن", "نحن"], correct: 2 },
    { subject: "Vocabulary", level: "A2", text: "نحن نسكن ___ المدرسة.", options: ["قرب", "في", "على", "عند"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "البارحة اشتريتُ ___ جديداً.", options: ["كتاب", "واحدة", "كتب", "كتاباً"], correct: 3 },
    { subject: "Vocabulary", level: "A2", text: "في عطلة نهاية الأسبوع أزور ___ والدي.", options: ["إلى", "بيت", "على", "في"], correct: 1 },
    { subject: "Vocabulary", level: "A2", text: "البارحة ذهبتُ ___ الطبيب لأنني مريض.", options: ["في", "إلى", "عند", "على"], correct: 2 },
    { subject: "Vocabulary", level: "A2", text: "نحن نتحدث ___ اللغة العربية بطلاقة.", options: ["في", "عن", "بـ", "مع"], correct: 2 },
    { subject: "Vocabulary", level: "A2", text: "أنا متحمس ___ هذه الرحلة.", options: ["من", "لـ", "على", "في"], correct: 1 },
    { subject: "Vocabulary", level: "A2", text: "ذهبتُ ___ عطلة إلى إسبانيا الصيف الماضي.", options: ["في", "إلى", "عند", "على"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "هل تستطيع ___ الضوء؟ الدنيا مظلمة.", options: ["تشغيل", "إطفاء", "فتح", "غلق"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "أنا ___ القهوة كل صباح.", options: ["أشربُ", "تشربُ", "يشربُ", "نشربُ"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "عملتُ ___ طوال اليوم البارحة.", options: ["كثيراً", "كثير", "جيداً", "قليل"], correct: 0 },

    // Grammar & Tenses - القواعد والأزمنة
    { subject: "Grammar", level: "A2", text: "أنا ___ في فرنسا قبل سنتين.", options: ["كنتُ", "ذهبتُ", "سأكون", "يذهب"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "لدينا اختبار الأسبوع المقبل، لذلك نحن ___ له.", options: ["نستعدُ", "استعد", "يستعد", "استعددنا"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "أتعلم العربية منذ ___ واحد.", options: ["سنة", "سنين", "عامٍ", "سنوات"], correct: 2 },
    { subject: "Grammar", level: "A2", text: "إذا كان لدي وقت، ___ إلى السينما.", options: ["سأذهبُ", "يذهب", "تذهب", "ذهب"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "قال محمد إنه ___ غداً.", options: ["لا يأتي", "لن يأتي", "لم يأتِ", "يأتي"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "أريد أن ___ بيتزا.", options: ["آكلَ", "يأكل", "أكل", "أكلتُ"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "البارحة ___ وقتاً ممتعاً مع العائلة.", options: ["كان", "كانت", "لدينا", "قضينا"], correct: 3 },
    { subject: "Grammar", level: "A2", text: "أنا لم ___ إلى باريس من قبل.", options: ["أذهبْ", "ذهبتُ", "أذهبنا", "ذهب"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "هل ___ هذا الكتاب من قبل؟", options: ["قرأتَ", "يقرأ", "قراءة", "قرأ"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "نحن ___ كرة القدم كل يوم.", options: ["نلعبُ", "تلعبُ", "يلعبُ", "يلعبون"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "أعتقد أنه ___ على حق.", options: ["يكون", "هو", "كان", "لديه"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "أنا ___ متعب جداً اليوم.", options: ["أشعرُ أنني", "أنت", "هو", "نحن"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "___ إلى فرنسا قبل سنتين.", options: ["سافرنا", "سأافر", "يسافر", "تسافر"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "إذا كنت تريد، ___ الغداء معاً.", options: ["نأكل", "تأكل", "سنتناول", "أكلنا"], correct: 2 },
    { subject: "Grammar", level: "A2", text: "لا أعرف متى ___ سيصل الضيوف.", options: ["هو", "أنا", "أنت", "نحن"], correct: 0 },

    // Prepositions & Expressions - حروف الجر والتعابير
    { subject: "Preposition", level: "A2", text: "أنا مهتم ___ الموسيقى الكلاسيكية.", options: ["بـ", "في", "على", "من"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "غالباً ما يتحدث ___ عطلة الصيف.", options: ["عن", "في", "على", "مع"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "أنا أنتظر ___ الحافلة منذ ساعة.", options: ["في", "على", "وصول", "عند"], correct: 2 },
    { subject: "Preposition", level: "A2", text: "هي تخاف ___ العناكب.", options: ["من", "على", "في", "بـ"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "سنذهب غداً ___ البحر.", options: ["إلى", "في", "عند", "على"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "أنا أعتني ___ قطتي الصغيرة.", options: ["بـ", "من", "في", "على"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "هو يحلم ___ رحلة حول العالم.", options: ["بـ", "في", "إلى", "على"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "أنا متحمس ___ زيارتك لنا.", options: ["لـ", "على", "في", "بـ"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "غداً سنتحدث ___ المدرس الجديد.", options: ["مع", "عن", "إلى", "في"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "أنا أنتظر الرد ___ رسالتي.", options: ["على", "لـ", "في", "من"], correct: 0 }
];

const ArabicA2Data = async (typeId) => {
    try {
        const formattedQuestions = questionsData.map(q => ({
            typeId: typeId,
            subject: q.subject,
            level: q.level,
            questionText: q.text,
            options: q.options.map((opt, index) => ({
                text: opt,
                isCorrect: index === q.correct
            })),
        }));
        
        await Question.insertMany(formattedQuestions);
        console.log(`Successfully imported ${formattedQuestions.length} Arabic A2 questions!`);
    } catch (err) {
        console.error("Arabic A2 Import failed:", err);
    }
}

module.exports = ArabicA2Data;