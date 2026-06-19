const Question = require('../../../models/Question');

const questionsData = [
    // Vocabulary & Highly Advanced Expressions - المفردات والتعبيرات المتقدمة جداً
    { subject: "Vocabulary", level: "C2", text: "أنا مقتنعٌ يقيناً ___ أن التعليم النوعي هو الركيزة الأساسية للتقدم الحضاري.", options: ["بـ", "على", "في", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "تساور الأوساط العلمية شكوكٌ كثيفة ___ مدى جدوى المشروع التقني الجديد.", options: ["حول", "على", "بـ", "في"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "نحن ملتزمون التزاماً قاطعاً ___ تحقيق المستهدفات بدقة وموضوعية.", options: ["بـ", "في", "على", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "من الأهمية بمكان الالتزام الصارم ___ القوانين واللوائح التنفيذية الصارمة.", options: ["بـ", "على", "في", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "تم تنفيذ هذا المشروع المحوري استناداً ___ للمعايير الدولية الأكثر صرامة.", options: ["وفقاً", "لـ", "على", "بـ"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "أنا متحمسٌ غاية الحماس ___ المشاركة في أعمال المؤتمر العلمي الدولي.", options: ["لـ", "في", "على", "بـ"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "يتعين علينا التكيف الآني ___ المتغيرات الجيوسياسية والاقتصادية المتسارعة.", options: ["مع", "بـ", "في", "على"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "لديّ تحفظاتٌ جوهرية ___ الآلية التي تم بها إنفاذ الخطة الاستراتيجية.", options: ["بشأن", "على", "بـ", "في"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "إننا على وعيٍ تام وإدراكٍ عميق ___ التبعات المحتملة لكل قرار سيادي.", options: ["بـ", "في", "على", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "إنه فخورٌ أيما فخر ___ إنجازاته الأكاديمية والمهنية المرموقة.", options: ["بـ", "على", "في", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "أعتقد أن النجاعة في الحل ___ هذه المعضلة تكمن في التنفيذ الدقيق.", options: ["لـ", "على", "في", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "أنا مقتنعٌ تمام الاقتناع ___ أن التواصل المؤسسي هو حجر الزاوية للنجاح.", options: ["بـ", "على", "في", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "ينبغي علينا التركيز بشكل مطرد ___ تحسين كفاءة الأداء المؤسسي.", options: ["على", "بـ", "في", "من"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "الموظفون مسؤولون مسؤولية كاملة ___ الالتزام الصارم ببروتوكولات التسليم.", options: ["عن", "بـ", "في", "على"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "لا بد من إخضاع النتائج لتقييم يتسم ___ الدقة والموضوعية المتناهية.", options: ["بـ", "على", "في", "من"], correct: 0 },

    // Grammar & Masterful Tenses - القواعد والصيغ المتقدمة (مستوى الإتقان)
    { subject: "Grammar", level: "C2", text: "لو كنتُ على درايةٍ بالتبعات مسبقاً، ___ تصرفتُ حتماً بمنحىً مغاير.", options: ["كنتُ", "لكنتُ قد", "سأكون", "سأ"], correct: 1 },
    { subject: "Grammar", level: "C2", text: "من المتوقع أن ___ المتدربون من إنجاز المهام بحلول نهاية الشهر الجاري.", options: ["ينتهوا", "قد أنهوا", "يتم انتهاؤهم", "أنهوا"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "أعتقدُ جازماً أنه لو استثمرتَ جهداً أكبر، ___ النتيجةُ أكثر إبهاراً.", options: ["لكانت", "كان", "يكون", "ستكون قد"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "من مقتضيات العمل أن ___ كافة الوثائق الرسمية فحصاً دقيقاً ومستفيضاً.", options: ["تُفحصَ", "فحصت", "تفحص", "يتم فحص"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "لم يكن يتسنى له إدراك ___ الكيفية المثلى للتعامل مع هذا المأزق.", options: ["كيف", "متى", "إذا", "ماذا"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "أنا على يقينٍ تام بأن القرار المتخذ ___ صائباً وحكيماً.", options: ["سيكون", "كان", "يكون", "كان قد"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "لو قُدّر له حضور الاجتماع، ___ الملاحظات التي أغفلها الجميع.", options: ["لقدمَ", "قدم", "يقدم", "كان قد"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "أريد التحقق من كون كافة الحاضرين ___ على اطلاعٍ وافٍ بالبروتوكولات.", options: ["يكون", "كان", "يكونوا", "كانوا"], correct: 2 },
    { subject: "Grammar", level: "C2", text: "يُنتظر من هذا المشروع أن ___ كافة مراحله الإنشائية الشهر المقبل.", options: ["يستكمل", "اكتمل", "يكمل", "قد اكتمل"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "إذا ما تم إنفاذ الخطة بمنهجية، ___ النتائج حتماً إيجابية ومثمرة.", options: ["ستكون", "كان", "يكون", "قد تكون"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "لا أدرك كنه ___ الطريقة الأنجع للتعامل مع الموقف المعقد.", options: ["كيف", "متى", "إذا", "ماذا"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "أهيبُ بك أن ___ الفريق بالمعلومات المحدثة قبل صياغة التقرير النهائي.", options: ["تزود", "يزود", "تزودَ", "تزودون"], correct: 2 },
    { subject: "Grammar", level: "C2", text: "إنه واثقٌ من قدرته على أن ___ المهمة بنجاح باهر وفي وقت قياسي.", options: ["أنجز", "ينهي", "يتممَ", "أنجزوا"], correct: 2 },
    { subject: "Grammar", level: "C2", text: "لو تسنى لي متسعٌ من الوقت، ___ المشروع بشكل أكثر شمولية.", options: ["لكنتُ أكملتُ", "سأكمل", "أكمل", "كنت أكمل"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "لا ينبغي لي الجزم بصحة ___ كافة التفاصيل قبل تدقيقها نهائياً.", options: ["من", "بـ", "على", "في"], correct: 0 },

    // Prepositions & Nuanced Expressions - حروف الجر والتعبيرات الدقيقة
    { subject: "Preposition", level: "C2", text: "أنا مهتمٌ بشغفٍ منقطع النظير ___ الدراسات السياسية المقارنة.", options: ["بـ", "على", "في", "من"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "غالباً ما نسهبُ في الحديث ___ القضايا السوسيولوجية المعقدة.", options: ["عن", "على", "بـ", "في"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "سنتشاور ملياً ___ الطاقم التنفيذي قبل الإقدام على أي خطوة.", options: ["مع", "على", "بـ", "في"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "أنا أستحضر جلياً تفاصيل ___ تلك التجربة الميدانية الرائدة.", options: ["من", "في", "بـ", "على"], correct: 1 },
    { subject: "Preposition", level: "C2", text: "أطمحُ دوماً ___ صقل مهاراتي اللغوية والقيادية بلا هوادة.", options: ["إلى", "على", "في", "بـ"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "إنه يشعر بالاعتزاز والزهو ___ فريقه لما حققوه من سبقٍ مهني.", options: ["بـ", "على", "من", "في"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "أنا أولِي عنايةً فائقة ___ التفاصيل الدقيقة والمستترة في العمل.", options: ["بـ", "على", "في", "من"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "إذا ما واجهتنا عقبات، سنعكف ___ رسم خطة بديلة ومنظمة.", options: ["على", "في", "بـ", "من"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "أنا أتوقُ بشوق ___ حضور فعاليات هذا المحفل الدولي المرموق.", options: ["إلى", "على", "في", "بـ"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "نحن مطالبون نظاماً ___ تطبيق كافة المعايير بدقة واحترافية.", options: ["بـ", "على", "عن", "في"], correct: 0 }
];

const ArabicC2Data = async (typeId) => {
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
        console.log(`Successfully imported ${formattedQuestions.length} Arabic C2 questions!`);
    } catch (err) {
        console.error("Arabic C2 Import failed:", err);
    }
}

module.exports = ArabicC2Data;