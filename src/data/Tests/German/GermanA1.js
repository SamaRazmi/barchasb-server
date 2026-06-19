const Question = require('../../../models/Question');

const questionsData = [
    // Vocabulary
    { subject: "Vocabulary", level: "A1", text: "Was ist ein Haus?", options: ["ein Auto", "ein Gebäude", "ein Tier", "ein Essen"], correct: 1 },
    { subject: "Vocabulary", level: "A1", text: "Was ist ein Apfel?", options: ["ein Getränk", "ein Obst", "ein Gemüse", "ein Brot"], correct: 1 },
    { subject: "Vocabulary", level: "A1", text: "Brot ist ein(e):", options: ["Getränk", "Obst", "Essen", "Tier"], correct: 2 },
    { subject: "Vocabulary", level: "A1", text: "Die Mutter ist:", options: ["der Vater", "die Schwester", "die Mutter", "der Bruder"], correct: 2 },
    { subject: "Vocabulary", level: "A1", text: "Der Vater ist:", options: ["der Mann", "die Frau", "das Kind", "der Lehrer"], correct: 0 },
    { subject: "Vocabulary", level: "A1", text: "Ein Hund ist ein:", options: ["Vogel", "Fisch", "Tier", "Mensch"], correct: 2 },
    { subject: "Vocabulary", level: "A1", text: "Eine Katze ist ein:", options: ["Auto", "Tier", "Tisch", "Haus"], correct: 1 },
    { subject: "Vocabulary", level: "A1", text: "Ein Buch ist zum:", options: ["Essen", "Trinken", "Lesen", "Schlafen"], correct: 2 },
    { subject: "Vocabulary", level: "A1", text: "Wasser ist ein:", options: ["Essen", "Getränk", "Möbel", "Tier"], correct: 1 },
    { subject: "Vocabulary", level: "A1", text: "Die Schule ist ein:", options: ["Haus", "Gebäude", "Land", "Essen"], correct: 1 },
    { subject: "Vocabulary", level: "A1", text: "Ein Lehrer arbeitet in der:", options: ["Küche", "Schule", "Bank", "Fabrik"], correct: 1 },
    { subject: "Vocabulary", level: "A1", text: "Der Stuhl ist ein:", options: ["Möbel", "Essen", "Tier", "Getränk"], correct: 0 },
    { subject: "Vocabulary", level: "A1", text: "Der Tisch ist aus:", options: ["Wasser", "Holz", "Brot", "Papier"], correct: 1 },
    { subject: "Vocabulary", level: "A1", text: "Ein Tag hat:", options: ["12 Stunden", "20 Stunden", "24 Stunden", "30 Stunden"], correct: 2 },
    { subject: "Vocabulary", level: "A1", text: "Das Fenster ist an der:", options: ["Tür", "Wand", "Straße", "Schule"], correct: 1 },
    { subject: "Vocabulary", level: "A1", text: "Die Tür ist:", options: ["offen oder zu", "heiß", "süß", "laut"], correct: 0 },

    // Grammar
    { subject: "Grammar", level: "A1", text: "Ich ___ Student.", options: ["bin", "bist", "ist", "sind"], correct: 0 },
    { subject: "Grammar", level: "A1", text: "Du ___ aus Deutschland.", options: ["bin", "bist", "ist", "sind"], correct: 1 },
    { subject: "Grammar", level: "A1", text: "Er ___ Lehrer.", options: ["bin", "bist", "ist", "sind"], correct: 2 },
    { subject: "Grammar", level: "A1", text: "Wir ___ in Berlin.", options: ["bin", "bist", "ist", "sind"], correct: 3 },
    { subject: "Grammar", level: "A1", text: "Sie (Plural) ___ zu Hause.", options: ["bin", "bist", "ist", "sind"], correct: 3 },
    { subject: "Grammar", level: "A1", text: "Ich ___ Wasser.", options: ["trinke", "trinkst", "trinkt", "trinken"], correct: 0 },
    { subject: "Grammar", level: "A1", text: "Du ___ Deutsch.", options: ["lerne", "lernst", "lernt", "lernen"], correct: 1 },
    { subject: "Grammar", level: "A1", text: "Er ___ ein Buch.", options: ["lese", "liest", "lesen", "lest"], correct: 1 },
    { subject: "Grammar", level: "A1", text: "Wir ___ zur Schule.", options: ["geht", "gehe", "gehen", "gehst"], correct: 2 },
    { subject: "Grammar", level: "A1", text: "Sie (Singular) ___ Kaffee.", options: ["trinken", "trinkt", "trinkst", "trinke"], correct: 1 },
    { subject: "Grammar", level: "A1", text: "Ich ___ Ali.", options: ["heiße", "heiß", "heißt", "heißen"], correct: 0 },
    { subject: "Grammar", level: "A1", text: "Du ___ müde.", options: ["bist", "bin", "ist", "seid"], correct: 0 },
    { subject: "Grammar", level: "A1", text: "Er ___ nicht hier.", options: ["ist", "sind", "bin", "seid"], correct: 0 },
    { subject: "Grammar", level: "A1", text: "Wir ___ Freunde.", options: ["bin", "bist", "ist", "sind"], correct: 3 },
    { subject: "Grammar", level: "A1", text: "Ich habe ___ Buch.", options: ["ein", "eine", "einen", "einem"], correct: 0 },
    { subject: "Grammar", level: "A1", text: "Sie (Plural) ___ aus Iran.", options: ["bin", "bist", "ist", "sind"], correct: 3 },

    // Preposition
    { subject: "Preposition", level: "A1", text: "Guten ___!", options: ["Tag", "Nacht", "Abend", "Morgen"], correct: 0 },
    { subject: "Preposition", level: "A1", text: "Gute ___!", options: ["Morgen", "Nacht", "Tag", "Hallo"], correct: 1 },
    { subject: "Preposition", level: "A1", text: "Wie ___ es dir?", options: ["geht", "bist", "sind", "sein"], correct: 0 },
    { subject: "Preposition", level: "A1", text: "Mir ___ es gut.", options: ["geht", "gehe", "gehen", "bin"], correct: 0 },
    { subject: "Preposition", level: "A1", text: "Danke ___ deine Hilfe.", options: ["für", "mit", "von", "bei"], correct: 0 },
    { subject: "Preposition", level: "A1", text: "Ich wohne ___ Berlin.", options: ["auf", "in", "an", "mit"], correct: 1 },
    { subject: "Preposition", level: "A1", text: "Wir gehen ___ Schule.", options: ["zur", "von", "mit", "bei"], correct: 0 },
    { subject: "Preposition", level: "A1", text: "Das Buch liegt ___ dem Tisch.", options: ["in", "auf", "aus", "mit"], correct: 1 },
];

const GermanA1Data = async (typeId) => {
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
        console.log(`Successfully imported ${formattedQuestions.length} German A1 questions!`);
    } catch (err) {
        console.error("German A1 Import failed:", err);
    }
}

module.exports = GermanA1Data;