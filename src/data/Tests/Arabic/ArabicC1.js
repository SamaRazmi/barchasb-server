const Question = require('../../../models/Question');

const questionsData = [
    // Vocabulary & Advanced Expressions - المفردات والتعبيرات المتقدمة
    { subject: "Vocabulary", level: "C1", text: "أنا مقتنعٌ تماماً ___ أهمية دور التعليم في صقل شخصية الإنسان.", options: ["بـ", "على", "من", "في"], correct: 0 },
    { subject: "Vocabulary", level: "C1", text: "تساورني بعض الشكوك ___ مدى فعالية الخطة الاستراتيجية الجديدة.", options: ["حول", "على", "بـ", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C1", text: "نحن ملتزمون كلياً ___ تحقيق الأهداف المحددة في الميزانية.", options: ["بـ", "في", "على", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C1", text: "من الضروري بمكان أن نلتزم ___ كافة القوانين واللوائح التنظيمية.", options: ["بـ", "على", "في", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C1", text: "تم تنفيذ هذا المشروع الضخم ___ للمعايير الدولية المطلوبة.", options: ["وفقاً", "لـ", "على", "بـ"], correct: 0 },
    { subject: "Vocabulary", level: "C1", text: "أنا متحمسٌ للغاية ___ المشاركة في أعمال المؤتمر الدولي القادم.", options: ["لـ", "على", "في", "بـ"], correct: 0 },
    { subject: "Vocabulary", level: "C1", text: "يتعين علينا التكيف ___ هذه الظروف الاستثنائية بسرعة وكفاءة.", options: ["مع", "بـ", "على", "في"], correct: 0 },
    { subject: "Vocabulary", level: "C1", text: "لديّ بعض التحفظات الجوهرية ___ الطريقة المقترحة للتنفيذ.", options: ["بشأن", "على", "بـ", "في"], correct: 0 },
    { subject: "Vocabulary", level: "C1", text: "نحن على وعيٍ تام ___ العواقب المحتملة المترتبة على هذا القرار.", options: ["بـ", "في", "على", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C1", text: "إنه فخورٌ جداً ___ إنجازاته الأكاديمية والبحثية المرموقة.", options: ["بـ", "على", "في", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C1", text: "أعتقد أن الحل الأمثل ___ هذه المشكلة المعقدة سيكون جذرياً.", options: ["لـ", "على", "في", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C1", text: "أنا مقتنعٌ ___ أن التواصل الفعال هو الركيزة الأساسية للنجاح.", options: ["بـ", "على", "في", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C1", text: "علينا التركيز انصباباً ___ تحسين جودة الأداء في كافة القطاعات.", options: ["على", "بـ", "في", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C1", text: "الطلبة مسؤولون مباشرة ___ الالتزام الصارم بمواعيد التسليم.", options: ["عن", "بـ", "في", "على"], correct: 0 },
    { subject: "Vocabulary", level: "C1", text: "لا بد من تقييم النتائج المحققة ___ دقة وموضوعية تامة.", options: ["بـ", "على", "في", "من"], correct: 0 },

    // Grammar & Advanced Tenses - القواعد والأزمنة المتقدمة
    { subject: "Grammar", level: "C1", text: "لو كنتُ أعلمُ بتلك التطورات مسبقاً، ___ تصرفتُ بطريقة مغايرة تماماً.", options: ["كنتُ", "لكنتُ قد", "سأكون", "سأ"], correct: 1 },
    { subject: "Grammar", level: "C1", text: "من المتوقع أن ___ الطلاب من المهام الموكلة إليهم بحلول الأسبوع القادم.", options: ["ينتهون", "قد أنهوا", "سينتهون", "يتم انتهاء"], correct: 2 },
    { subject: "Grammar", level: "C1", text: "أعتقد أنه لو درستَ بجدية أكبر، ___ النتيجة النهائية مرضية أكثر.", options: ["لكانت", "كان", "يكون", "ستكون قد"], correct: 0 },
    { subject: "Grammar", level: "C1", text: "من الضروري أن ___ جميع الوثائق الرسمية فحصاً دقيقاً قبل تقديمها.", options: ["تُفحصَ", "فحصت", "تفحص", "يتم فحص"], correct: 0 },
    { subject: "Grammar", level: "C1", text: "لم يكن المرشح يعلم آنذاك ___ كيفية التعامل مع تلك المسألة الشائكة.", options: ["كيف", "متى", "إذا", "ماذا"], correct: 0 },
    { subject: "Grammar", level: "C1", text: "أنا على يقين من أن القرار المتخذ ___ صائباً في نهاية المطاف.", options: ["سيكون", "كان", "يكون", "كان قد"], correct: 0 },
    { subject: "Grammar", level: "C1", text: "لو حضر المدير الاجتماع، ___ الملاحظات الجوهرية التي أشرنا إليها.", options: ["لقدمَ", "قدم", "يقدم", "كان قد"], correct: 0 },
    { subject: "Grammar", level: "C1", text: "أريد التأكد من أن جميع الموظفين ___ على دراية تامة بالإجراءات.", options: ["يكون", "كان", "يكونوا", "كانوا"], correct: 2 },
    { subject: "Grammar", level: "C1", text: "من المتوقع أن ___ المشروع كافة مراحله خلال الشهر المنصرم.", options: ["يكتمل", "اكتمل", "يكمل", "قد اكتمل"], correct: 0 },
    { subject: "Grammar", level: "C1", text: "إذا ما تم تنفيذ الخطة بدقة، ___ النتائج حتماً إيجابية ومبهرة.", options: ["ستكون", "كان", "يكون", "قد تكون"], correct: 0 },
    { subject: "Grammar", level: "C1", text: "لا أدرك تماماً ___ كيفية التعاطي مع هذا الموقف المحرج.", options: ["كيف", "متى", "إذا", "ماذا"], correct: 0 },
    { subject: "Grammar", level: "C1", text: "أرجو منك أن ___ الفريق بكافة المعلومات المحدثة قبل صياغة التقرير.", options: ["تزود", "يزود", "تزودَ", "تزودون"], correct: 2 },
    { subject: "Grammar", level: "C1", text: "إنه واثقٌ تماماً من أنه ___ المهمة الموكلة إليه بنجاح منقطع النظير.", options: ["أنجز", "ينهي", "سينهي", "أنجزوا"], correct: 2 },
    { subject: "Grammar", level: "C1", text: "لو أتيح لي متسعٌ من الوقت، ___ المشروع بشكل أكثر احترافية.", options: ["لكنتُ أكملتُ", "سأكمل", "أكمل", "كنت أكمل"], correct: 0 },
    { subject: "Grammar", level: "C1", text: "لا يسعني التأكد ___ كافة التفاصيل الدقيقة في هذا الوقت الضيق.", options: ["من", "بـ", "على", "في"], correct: 0 },

    // Prepositions & Advanced Expressions - حروف الجر والتعابير المتقدمة
    { subject: "Preposition", level: "C1", text: "أنا مهتمٌ بعمق ___ قضايا الدراسات الاقتصادية المعاصرة.", options: ["بـ", "في", "على", "من"], correct: 0 },
    { subject: "Preposition", level: "C1", text: "غالباً ما يتمحور نقاشنا ___ القضايا البيئية والاجتماعية الراهنة.", options: ["حول", "على", "بـ", "في"], correct: 0 },
    { subject: "Preposition", level: "C1", text: "سنتشاور مستفيضاً ___ أعضاء الفريق قبل اتخاذ أي قرار نهائي.", options: ["مع", "على", "بـ", "في"], correct: 0 },
    { subject: "Preposition", level: "C1", text: "أنا أسترجع بوضوح تفاصيل ___ تجربتي الأولى في الحرم الجامعي.", options: ["من", "في", "بـ", "على"], correct: 1 },
    { subject: "Preposition", level: "C1", text: "أصبو دوماً ___ تطوير مهاراتي القيادية بشكل مستدام.", options: ["إلى", "على", "في", "بـ"], correct: 0 },
    { subject: "Preposition", level: "C1", text: "إنه يشعر بالفخر والاعتزاز ___ فريقه لما حققوه من إنجازات.", options: ["بـ", "على", "من", "في"], correct: 0 },
    { subject: "Preposition", level: "C1", text: "أنا أولِي اهتماماً بالغاً ___ التفاصيل الدقيقة في سير العمل.", options: ["بـ", "على", "في", "من"], correct: 0 },
    { subject: "Preposition", level: "C1", text: "إذا ما واجهنا عقبات، سنبقى متمسكين ___ خطة عمل واضحة.", options: ["بـ", "على", "في", "من"], correct: 0 },
    { subject: "Preposition", level: "C1", text: "أنا متحمسٌ غاية الحماس ___ حضور فعاليات المؤتمر الدولي.", options: ["لـ", "على", "في", "بـ"], correct: 0 },
    { subject: "Preposition", level: "C1", text: "نحن مسؤولون نظاماً ___ تطبيق كافة التعليمات بدقة متناهية.", options: ["عن", "بـ", "في", "على"], correct: 0 }
];

const ArabicC1Data = async (typeId) => {
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
        console.log(`Successfully imported ${formattedQuestions.length} Arabic C1 questions!`);
    } catch (err) {
        console.error("Arabic C1 Import failed:", err);
    }
}

module.exports = ArabicC1Data;