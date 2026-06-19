const Question = require('../../../models/Question');

const questionsData = [
    // Vocabulary & Daily Phrases - المفردات والعبارات اليومية
    { subject: "Vocabulary", level: "B1", text: "أريدُ أن أشتري ___ جديداً.", options: ["سيارةً", "بيت", "كتاب", "كرسي"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "نحن نخطط للذهاب ___ الصيف القادم.", options: ["في", "إلى", "عند", "على"], correct: 1 },
    { subject: "Vocabulary", level: "B1", text: "البارحة ___ أصدقائي في الحديقة العامة.", options: ["قابلتُ", "أرى", "نلتقي", "رأيتُ"], correct: 3 },
    { subject: "Vocabulary", level: "B1", text: "أتناول ___ كل صباح قبل الذهاب للعمل.", options: ["الغداء", "الإفطار", "العشاء", "وجبة خفيفة"], correct: 1 },
    { subject: "Vocabulary", level: "B1", text: "هل يمكنني مساعدتك ___ الواجب المنزلي؟", options: ["في", "على", "بـ", "من"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "هو مسؤول ___ هذا المشروع الكبير.", options: ["عن", "في", "بـ", "على"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "أنا مهتم ___ تعلم اللغات الأجنبية.", options: ["بـ", "في", "على", "من"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "غداً سوف نذهب ___ السوق معاً.", options: ["في", "إلى", "عند", "على"], correct: 1 },
    { subject: "Vocabulary", level: "B1", text: "البارحة شاهدت ___ ممتعاً في التلفاز.", options: ["فيلماً", "كتب", "كلب", "طاولة"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "أحب أن أقرأ ___ قبل النوم.", options: ["كتب", "كتاب", "كتباً", "كتاباً"], correct: 3 },
    { subject: "Vocabulary", level: "B1", text: "أنا متأكد ___ صحة هذه المعلومات.", options: ["من", "على", "بـ", "في"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "إذا درستَ بجد، ___ النجاح مضموناً.", options: ["سيكون", "كان", "يكون", "تكون"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "أريد أن أتعلم الكثير ___ الطهي.", options: ["بـ", "عن", "في", "على"], correct: 1 },
    { subject: "Vocabulary", level: "B1", text: "هل تستطيع أن تشرح لي ___ هذا الدرس؟", options: ["عن", "في", "بـ", "على"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "نحن نتحدث ___ المشروع الجديد مع المدير.", options: ["عن", "بـ", "في", "على"], correct: 0 },

    // Grammar & Tenses - القواعد والأزمنة
    { subject: "Grammar", level: "B1", text: "إذا جاء أخي، ___ إلى السينما معاً.", options: ["نذهب", "سنذهبُ", "نذهبنا", "يذهب"], correct: 1 },
    { subject: "Grammar", level: "B1", text: "أنا لا أعرف ___ جاء الضيوف أمس.", options: ["متى", "كيف", "إذا", "لماذا"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "أعتقد أنه ___ على حق.", options: ["يكون", "كان", "هو", "لديه"], correct: 2 },
    { subject: "Grammar", level: "B1", text: "البارحة ___ طويلاً مع أصدقائي.", options: ["تحدثتُ", "أتحدث", "تحدث", "نتحدث"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "هل ___ هذا الكتاب الرائع؟", options: ["أنت", "قرأتَ", "كتاب", "كتاباً"], correct: 1 },
    { subject: "Grammar", level: "B1", text: "نحن ___ كرة القدم في النادي كل يوم.", options: ["نلعبُ", "يلعب", "تلعب", "يلعبون"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "أنا متأكد أنه ___ الإجابة الصحيحة.", options: ["يعرفُ", "يعرفون", "كان", "لديه"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "آمل أن ___ الطقس غداً جيداً.", options: ["يكون", "هو", "جيد", "جميل"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "إذا وصلتَ مبكراً، ___ المباراة من البداية.", options: ["شاهدنا", "سنشاهدُ", "نرى", "رأينا"], correct: 1 },
    { subject: "Grammar", level: "B1", text: "أنا مهتم ___ تعلم لغات جديدة دائماً.", options: ["بـ", "في", "على", "من"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "لا أعرف بالضبط ___ يمكنني فعل ذلك.", options: ["كيف", "متى", "إذا", "ماذا"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "طلبتُ منه أن ___ الأمر لي مرة أخرى.", options: ["لي", "يشرحَ", "لنا", "هو"], correct: 1 },
    { subject: "Grammar", level: "B1", text: "أنا متأكد أنه ___ في الامتحان.", options: ["نجحَ", "ينجح", "سينجح", "نجاح"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "إذا درستَ أكثر، ___ نجاحك أفضل.", options: ["سيكون", "كان", "يكون", "سيكون قد"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "لا أعرف بالضبط ___ هي الطريقة لحل المشكلة.", options: ["كيف", "متى", "إذا", "ماذا"], correct: 0 },

    // Prepositions & Expressions - حروف الجر والتعابير
    { subject: "Preposition", level: "B1", text: "أنا مهتم ___ السياسة الحالية في المنطقة.", options: ["بـ", "في", "على", "من"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "غالباً ما يتحدث ___ تجاربه في الخارج.", options: ["عن", "على", "في", "بـ"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "سنتحدث غداً ___ المدير عن تفاصيل المشروع.", options: ["مع", "إلى", "عن", "في"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "أنا أتذكر جيداً أشياء ___ طفولتي.", options: ["بـ", "من", "في", "على"], correct: 1 },
    { subject: "Preposition", level: "B1", text: "أحلم ___ رحلة طويلة حول العالم.", options: ["بـ", "على", "في", "إلى"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "هي فخورة جداً ___ ابنتها المتفوقة.", options: ["بـ", "على", "من", "في"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "أنا أعتني ___ الضيوف منذ وصولهم.", options: ["بـ", "على", "من", "في"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "إذا أمطرت، سنبقى ___ المنزل.", options: ["في", "على", "بـ", "عند"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "أنا متحمس جداً ___ زيارتك القادمة لنا.", options: ["لـ", "على", "بـ", "في"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "أنا مسؤول ___ احترام قواعد السلامة هنا.", options: ["عن", "بـ", "في", "على"], correct: 0 }
];

const ArabicB1Data = async (typeId) => {
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
        console.log(`Successfully imported ${formattedQuestions.length} Arabic B1 questions!`);
    } catch (err) {
        console.error("Arabic B1 Import failed:", err);
    }
}

module.exports = ArabicB1Data;