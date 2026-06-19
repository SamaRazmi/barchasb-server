const Question = require('../../../models/Question');

const questionsData = [
    // Vocabulary
    { subject: "Vocabulary", level: "A2", text: "Voy ___ trabajo todos los días.", options: ["a", "en", "de", "por"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Me gusta ___ música.", options: ["escuchar", "escucho", "escucha", "escuchas"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Ayer ___ al cine con mis amigos.", options: ["voy", "fui", "iré", "iba"], correct: 1 },
    { subject: "Vocabulary", level: "A2", text: "¿Dónde ___ ayer?", options: ["estás", "estuviste", "estás siendo", "eres"], correct: 1 },
    { subject: "Vocabulary", level: "A2", text: "Siempre ___ café por la mañana.", options: ["tomo", "toma", "tomas", "tomamos"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Trabajo ___ una oficina.", options: ["en", "a", "por", "con"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "El médico trabaja en un:", options: ["hospital", "banco", "hotel", "colegio"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "El lunes viene después del:", options: ["domingo", "martes", "miércoles", "viernes"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Hace frío, necesito una:", options: ["chaqueta", "camisa", "falda", "gorra"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Mi hermano ___ en una empresa grande.", options: ["trabaja", "trabajo", "trabajamos", "trabajan"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "El supermercado está ___ la esquina.", options: ["en", "a", "por", "con"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Me gusta viajar ___ avión.", options: ["en", "a", "por", "con"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Tengo ___ hambre.", options: ["mucha", "muchos", "mucho", "muchas"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "El examen es ___ lunes.", options: ["el", "en", "a", "por"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Siempre llego ___ tiempo.", options: ["a", "en", "por", "con"], correct: 1 },

    // Grammar
    { subject: "Grammar", level: "A2", text: "Ayer ___ una película.", options: ["veo", "vi", "veía", "ver"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "Nosotros ___ español desde hace dos años.", options: ["estudiamos", "estudiáis", "estudiar", "estudiaré"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "¿___ hablado con María hoy?", options: ["has", "have", "had", "haces"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Cuando era niño, ___ fútbol.", options: ["juego", "jugaba", "jugué", "jugar"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "Mañana ___ visitar a mi abuela.", options: ["voy a", "voy", "iba", "fui"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Ellos ___ terminado el proyecto.", options: ["han", "has", "he", "hemos"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Si hace sol, ___ a la playa.", options: ["vamos", "vamos a", "iremos", "fuimos"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Nunca ___ comida japonesa.", options: ["pruebo", "probé", "he probado", "probar"], correct: 2 },
    { subject: "Grammar", level: "A2", text: "¿Cuánto tiempo ___ aquí?", options: ["estás", "has estado", "estuviste", "estar"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "Antes ___ en un pueblo pequeño.", options: ["vivo", "vivía", "viví", "vivir"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "Ya ___ mi tarea.", options: ["hice", "he hecho", "hago", "haré"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "Mientras ella estudiaba, yo ___. (Habitual)", options: ["leo", "leía", "leí", "leer"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "Todavía no ___ el correo.", options: ["recibo", "recibí", "he recibido", "recibir"], correct: 2 },
    { subject: "Grammar", level: "A2", text: "El año pasado ___ a España.", options: ["viajo", "viajé", "viajaba", "viajar"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "Cuando llegue, te ___. ", options: ["llamo", "llamaré", "llamaba", "llamé"], correct: 1 },

    // Prepositions & Expressions
    { subject: "Preposition", level: "A2", text: "Estoy cansado ___ trabajar mucho.", options: ["de", "por", "en", "con"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Gracias ___ venir.", options: ["por", "a", "en", "con"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Pienso ___ mi futuro.", options: ["en", "a", "por", "con"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Voy ___ pie al trabajo.", options: ["a", "en", "por", "con"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Hablo ___ mi jefe mañana.", options: ["con", "a", "en", "por"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Llegué tarde ___ el tráfico.", options: ["por", "en", "a", "con"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Estoy interesado ___ aprender francés.", options: ["en", "a", "por", "con"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Vivo cerca ___ la estación.", options: ["de", "a", "en", "por"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Salimos ___ las ocho.", options: ["a", "en", "por", "con"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Me llevo bien ___ mis compañeros.", options: ["con", "a", "en", "por"], correct: 0 }
];

const SpanishA2Data = async (typeId) => {
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
        console.log(`Successfully imported ${formattedQuestions.length} Spanish A2 questions!`);
    } catch (err) {
        console.error("Spanish A2 Import failed:", err);
    }
}

module.exports = SpanishA2Data;