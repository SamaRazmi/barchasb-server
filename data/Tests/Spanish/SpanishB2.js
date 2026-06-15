const Question = require('../../../models/Question');

const questionsData = [
    // Vocabulary
    { subject: "Vocabulary", level: "B2", text: "Considero que este proyecto es muy ___.", options: ["importante", "pequeño", "bajo", "débil"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "La empresa decidió ___ su estrategia.", options: ["cambiar", "cambia", "cambió", "cambiando"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Es fundamental ___ la calidad del servicio.", options: ["mejorar", "mejora", "mejoró", "mejorando"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Tiene mucha experiencia ___ este campo.", options: ["en", "a", "de", "por"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Estoy convencido ___ su honestidad.", options: ["de", "en", "a", "por"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "El informe fue ___ por el director.", options: ["revisado", "revisar", "revisa", "revisando"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Me preocupa mucho ___ el futuro del planeta.", options: ["por", "de", "en", "a"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "La reunión fue ___ por problemas técnicos.", options: ["cancelada", "cancelar", "cancela", "cancelando"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "El gobierno anunció nuevas medidas ___.", options: ["económicas", "económica", "económico", "economizar"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Prefiero soluciones ___ y realistas.", options: ["prácticas", "práctica", "practicar", "practicando"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Su actitud ___ negativamente al equipo.", options: ["afectó", "afectar", "afecta", "afectando"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "El resultado fue ___ de lo esperado.", options: ["mejor", "bueno", "bien", "mejorar"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Estamos trabajando ___ un nuevo proyecto.", options: ["en", "a", "de", "por"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Su decisión fue ___ por todos.", options: ["aceptada", "aceptar", "acepta", "aceptando"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Este problema requiere una solución ___.", options: ["urgente", "rápida", "débil", "fácil"], correct: 0 },

    // Grammar
    { subject: "Grammar", level: "B2", text: "Es importante que todos ___ a tiempo.", options: ["lleguen", "llegan", "llegaron", "llegarán"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Dudo que él ___ la verdad.", options: ["diga", "dice", "dijo", "dirá"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Busco a alguien que ___ hablar japonés.", options: ["sepa", "sabe", "supo", "sabrá"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "No creo que ellos ___ listos.", options: ["estén", "están", "estuvieron", "estarán"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Ojalá ___ más vacaciones el próximo año.", options: ["tuviera", "tiene", "tendré", "tenía"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Me alegra que me ___ ayudado.", options: ["hayas", "has", "haya", "había"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Antes de que ___, avísame.", options: ["salgas", "sales", "saliste", "saldrás"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Insistió en que lo ___ inmediatamente.", options: ["hiciéramos", "hacemos", "hicimos", "haremos"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Aunque ___ cansado, siguió trabajando.", options: ["estaba", "esté", "está", "estará"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Es posible que ___ mañana.", options: ["llueva", "llueve", "llovió", "lloverá"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Me sorprendió que no ___ nada.", options: ["dijera", "dijo", "dice", "dirá"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Prefería que me lo ___ antes.", options: ["dijeras", "dices", "dijiste", "dirás"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "No permitieron que ___ tarde.", options: ["llegáramos", "llegamos", "lleguemos", "llegaremos"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Buscan empleados que ___ experiencia.", options: ["tengan", "tienen", "tuvieron", "tendrán"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Era necesario que todo ___ listo.", options: ["estuviera", "está", "esté", "estará"], correct: 0 },

    // Expresiones / Preposiciones
    { subject: "Preposition", level: "B2", text: "Estoy satisfecho ___ los resultados.", options: ["con", "de", "en", "por"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Se encargó ___ organizar el evento.", options: ["de", "a", "en", "por"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "No estoy de acuerdo ___ esa idea.", options: ["con", "a", "en", "por"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Tiene talento ___ la música.", options: ["para", "en", "de", "con"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Se quejó ___ el ruido.", options: ["de", "a", "en", "por"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Estamos comprometidos ___ el proyecto.", options: ["con", "a", "en", "por"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Se dio cuenta ___ su error.", options: ["de", "a", "en", "por"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Está acostumbrado ___ trabajar bajo presión.", options: ["a", "de", "en", "por"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Luchan ___ sus derechos.", options: ["por", "de", "en", "a"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Confío plenamente ___ tu capacidad.", options: ["en", "a", "de", "por"], correct: 0 }
];

const SpanishB2Data = async (typeId) => {
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
        console.log(`Successfully imported ${formattedQuestions.length} Spanish B2 questions!`);
    } catch (err) {
        console.error("Spanish B2 Import failed:", err);
    }
}

module.exports = SpanishB2Data;