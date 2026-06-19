const Question = require('../../../models/Question');

const questionsData = [
    // Vocabulary
    { subject: "Vocabulary", level: "A1", text: "“Casa” significa:", options: ["Carro", "Casa", "Libro", "Escuela"], correct: 1 },
    { subject: "Vocabulary", level: "A1", text: "“Gato” significa:", options: ["Gato", "Perro", "Árbol", "Silla"], correct: 0 },
    { subject: "Vocabulary", level: "A1", text: "Por la mañana, comemos:", options: ["Cena", "Desayuno", "Almuerzo", "Merienda"], correct: 1 },
    { subject: "Vocabulary", level: "A1", text: "“Madre” es:", options: ["Hermana", "Madre", "Padre", "Amiga"], correct: 1 },
    { subject: "Vocabulary", level: "A1", text: "“Padre” es:", options: ["Hombre", "Mujer", "Niño", "Profesor"], correct: 0 },
    { subject: "Vocabulary", level: "A1", text: "Un “libro” sirve para:", options: ["Leer", "Comer", "Beber", "Dormir"], correct: 0 },
    { subject: "Vocabulary", level: "A1", text: "El agua es:", options: ["Fruta", "Bebida", "Silla", "Animal"], correct: 1 },
    { subject: "Vocabulary", level: "A1", text: "Una escuela es un:", options: ["Edificio", "País", "Casa", "Restaurante"], correct: 0 },
    { subject: "Vocabulary", level: "A1", text: "Un maestro trabaja en:", options: ["Escuela", "Cocina", "Banco", "Fábrica"], correct: 0 },
    { subject: "Vocabulary", level: "A1", text: "Una silla es:", options: ["Mueble", "Comida", "Animal", "Bebida"], correct: 0 },
    { subject: "Vocabulary", level: "A1", text: "Una mesa usualmente está hecha de:", options: ["Madera", "Agua", "Pan", "Papel"], correct: 0 },
    { subject: "Vocabulary", level: "A1", text: "Una ventana está en la:", options: ["Puerta", "Pared", "Calle", "Escuela"], correct: 1 },
    { subject: "Vocabulary", level: "A1", text: "Una puerta puede estar:", options: ["Abierta o cerrada", "Caliente", "Dulce", "Ruidosa"], correct: 0 },
    { subject: "Vocabulary", level: "A1", text: "El sol sale en la:", options: ["Mañana", "Noche", "Tarde", "Mediodía"], correct: 0 },
    { subject: "Vocabulary", level: "A1", text: "Vivo ___ España.", options: ["En", "Sobre", "A", "Desde"], correct: 0 },

    // Grammar
    { subject: "Grammar", level: "A1", text: "Yo ___ estudiante.", options: ["Eres", "Soy", "Somos", "Son"], correct: 1 },
    { subject: "Grammar", level: "A1", text: "¿Tú ___ español?", options: ["Soy", "Es", "Eres", "Somos"], correct: 2 },
    { subject: "Grammar", level: "A1", text: "Él ___ maestro.", options: ["Soy", "Es", "Eres", "Son"], correct: 1 },
    { subject: "Grammar", level: "A1", text: "Nosotros ___ en Madrid.", options: ["Estamos", "Estoy", "Está", "Están"], correct: 0 },
    { subject: "Grammar", level: "A1", text: "Ellos ___ en casa.", options: ["Está", "Estamos", "Están", "Estás"], correct: 2 },
    { subject: "Grammar", level: "A1", text: "Yo ___ agua todas las mañanas.", options: ["Bebo", "Bebes", "Bebe", "Bebemos"], correct: 0 },
    { subject: "Grammar", level: "A1", text: "Tú ___ español.", options: ["Aprendes", "Aprende", "Aprendo", "Aprendemos"], correct: 0 },
    { subject: "Grammar", level: "A1", text: "Él ___ un libro.", options: ["Lee", "Leo", "Leemos", "Lees"], correct: 0 },
    { subject: "Grammar", level: "A1", text: "Nosotros ___ a la escuela.", options: ["Vamos", "Va", "Van", "Voy"], correct: 0 },
    { subject: "Grammar", level: "A1", text: "Ellos ___ café.", options: ["Bebes", "Bebe", "Beben", "Bebemos"], correct: 2 },
    { subject: "Grammar", level: "A1", text: "Mi nombre ___ Juan.", options: ["es", "soy", "eres", "somos"], correct: 0 },
    { subject: "Grammar", level: "A1", text: "Tú ___ cansado hoy.", options: ["estás", "estoy", "está", "estamos"], correct: 0 },
    { subject: "Grammar", level: "A1", text: "Él ___ aquí.", options: ["estoy", "estás", "está", "están"], correct: 2 },
    { subject: "Grammar", level: "A1", text: "Nosotros ___ amigos.", options: ["somos", "soy", "eres", "son"], correct: 0 },
    { subject: "Grammar", level: "A1", text: "Ellos ___ de México.", options: ["son", "soy", "es", "somos"], correct: 0 },

    // Prepositions & Expressions
    { subject: "Preposition", level: "A1", text: "Hola =", options: ["Hola", "Buenas noches", "Buenas tardes", "Adiós"], correct: 0 },
    { subject: "Preposition", level: "A1", text: "Buenas noches =", options: ["Buenos días", "Buenas noches", "Buenas tardes", "Hola"], correct: 1 },
    { subject: "Preposition", level: "A1", text: "¿Cómo ___ tú?", options: ["estás", "está", "estoy", "ser"], correct: 0 },
    { subject: "Preposition", level: "A1", text: "Yo ___ bien, gracias.", options: ["estoy", "está", "estamos", "están"], correct: 0 },
    { subject: "Preposition", level: "A1", text: "Gracias ___ tu ayuda.", options: ["por", "en", "con", "a"], correct: 0 },
    { subject: "Preposition", level: "A1", text: "Vivo ___ Madrid.", options: ["en", "sobre", "a", "desde"], correct: 0 },
    { subject: "Preposition", level: "A1", text: "Vamos ___ la escuela.", options: ["a", "sobre", "en", "hacia"], correct: 0 },
    { subject: "Preposition", level: "A1", text: "Tengo ___ libro.", options: ["una", "uno", "unos", "un"], correct: 3 },
    { subject: "Preposition", level: "A1", text: "El libro está ___ la mesa.", options: ["en", "sobre", "debajo", "entre"], correct: 1 },
    { subject: "Preposition", level: "A1", text: "¿Cuántas horas hay en un día?", options: ["12", "24", "20", "30"], correct: 1 }
];

const SpanishA1Data = async (typeId) => {
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
        console.log(`Successfully imported ${formattedQuestions.length} Spanish A1 questions!`);
    } catch (err) {
        console.error("Spanish A1 Import failed:", err);
    }
}

module.exports = SpanishA1Data;