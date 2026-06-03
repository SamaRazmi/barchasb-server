const Question = require('../../../models/Question');

const questionsData = [
    // Vocabulary
    { subject: "Vocabulary", level: "A2", text: "Ich ___ gern ins Kino.", options: ["gehe", "geht", "gehst", "gehen"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Kannst du bitte das Licht ___?", options: ["anmachen", "ausschalten", "einschalten", "aufmachen"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Ich möchte ein Zimmer ___. Hast du ein Hotel gefunden?", options: ["mieten", "buchen", "besuchen", "wohnen"], correct: 1 },
    { subject: "Vocabulary", level: "A2", text: "Der Weg ist zu weit. Wir müssen den Bus ___.", options: ["fahren", "nehmen", "gehen", "bringen"], correct: 1 },
    { subject: "Vocabulary", level: "A2", text: "Können Sie mir den Weg zum Bahnhof ___?", options: ["sagen", "beschreiben", "sprechen", "wissen"], correct: 1 },
    { subject: "Vocabulary", level: "A2", text: "Ich habe mein Portemonnaie ___. Ich kann nicht bezahlen.", options: ["verloren", "vergessen", "verkauft", "verlassen"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Das Wetter ist heute ___. Es regnet den ganzen Tag.", options: ["schrecklich", "wunderbar", "sonnig", "trocken"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Ich muss heute länger arbeiten. Ich habe viele ___.", options: ["Termine", "Hobbys", "Ferien", "Geschenke"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Mein Computer ist ___. Ich muss ihn reparieren lassen.", options: ["kaputt", "leer", "fertig", "müde"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Darf ich Sie etwas ___? Haben Sie kurz Zeit?", options: ["antworten", "fragen", "erzählen", "reden"], correct: 1 },
    { subject: "Vocabulary", level: "A2", text: "Nach der Arbeit bin ich oft sehr ___.", options: ["müde", "langsam", "schwer", "reich"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Können Sie das bitte ___? Ich verstehe es nicht.", options: ["wiederholen", "vorstellen", "ankommen", "aufhören"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Ich möchte ein ___ Wasser bestellen.", options: ["leises", "stilles", "ruhiges", "stummes"], correct: 1 },
    { subject: "Vocabulary", level: "A2", text: "Ich bin leider ___. Ich kann heute nicht kommen.", options: ["krank", "gesund", "stark", "fit"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Wo kann ich Fahrkarten ___?", options: ["kaufen", "verkaufen", "geben", "nehmen"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Der Film war sehr ___. Ich habe viel gelacht.", options: ["lustig", "traurig", "langweilig", "kompliziert"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Ich muss den Müll ___.", options: ["rausbringen", "aufräumen", "waschen", "putzen"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Ich ___ jeden Morgen Kaffee.", options: ["trinke", "trinkt", "trinken", "trinkst"], correct: 0 },
    
    // Grammar
    { subject: "Grammar", level: "A2", text: "Ich ___ schon in Deutschland gewesen.", options: ["bin", "habe", "war", "werde"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Wir ___ nächste Woche einen Test schreiben.", options: ["schreiben", "schreiben wird", "werden", "würden"], correct: 2 },
    { subject: "Grammar", level: "A2", text: "Gestern ___ ich meine Freunde getroffen.", options: ["treffe", "habe", "bin", "treffen"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "Sie hat gestern lange ___.", options: ["gearbeitet", "arbeiten", "arbeitet", "arbeitetet"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Ich habe gestern ___ Buch gekauft.", options: ["ein", "eine", "einen", "einem"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Morgen ___ wir nach Berlin fahren.", options: ["fährt", "fahre", "werden", "fahrt"], correct: 2 },
    { subject: "Grammar", level: "A2", text: "Ich esse gern ___ Frühstück.", options: ["das", "die", "der", "den"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Kannst du ___ bitte helfen?", options: ["mir", "mich", "ihm", "sie"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Ich ___ seit einem Jahr Deutsch.", options: ["lerne", "lernte", "habe gelernt", "bin lernen"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Wenn ich Zeit habe, ___ ich ins Kino.", options: ["gehe", "geht", "gehst", "gehen"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Er hat gesagt, dass er ___ kommt.", options: ["nicht", "kein", "nichts", "nie"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Ich ___ gern Pizza.", options: ["esse", "essen", "isst", "esst"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Wir ___ gestern viel Spaß gehabt.", options: ["haben", "hatten", "sein", "waren"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "Ich ___ noch nie in Paris gewesen.", options: ["bin", "habe", "war", "werde"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Hast du das Buch schon ___?", options: ["gelesen", "lese", "lesen", "liest"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Wir ___ jeden Tag zusammen Fußball.", options: ["spielen", "spielt", "spielst", "gespielt"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Ich glaube, dass er ___ Recht ___.", options: ["hat", "ist", "habe", "hast"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Ich ___ nach dem Film müde.", options: ["war", "ist", "seid", "bist"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Wir ___ vor zwei Jahren nach Deutschland gezogen.", options: ["sind", "haben", "waren", "ziehen"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Wenn du willst, ___ wir zusammen essen.", options: ["gehen", "geht", "gehst", "gehe"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Ich weiß nicht, ___ er kommt.", options: ["wenn", "wann", "wie", "wo"], correct: 1 },

    // Preposition
    { subject: "Preposition", level: "A2", text: "Ich interessiere mich ___ Musik.", options: ["für", "an", "über", "bei"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Wir wohnen ___ der Nähe vom Bahnhof.", options: ["auf", "an", "in", "bei"], correct: 2 },
    { subject: "Preposition", level: "A2", text: "Am Wochenende gehe ich ___ meinen Eltern.", options: ["zu", "auf", "nach", "in"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Ich war letzte Woche ___ Arzt.", options: ["bei", "zu", "nach", "in"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Wir sprechen ___ Deutsch und Englisch.", options: ["über", "auf", "mit", "von"], correct: 1 },
    { subject: "Preposition", level: "A2", text: "Ich freue mich ___ das Geschenk (Past/Present).", options: ["auf", "über", "an", "mit"], correct: 1 },
    { subject: "Preposition", level: "A2", text: "Ich war ___ Urlaub in Spanien.", options: ["im", "in", "auf", "zu"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Er erzählt gern ___ seinen Urlaub.", options: ["von", "über", "zu", "an"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Ich warte ___ den Bus.", options: ["an", "auf", "zu", "für"], correct: 1 },
    { subject: "Preposition", level: "A2", text: "Sie hat Angst ___ Spinnen.", options: ["vor", "auf", "zu", "an"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Wir fahren morgen ___ das Meer.", options: ["an", "auf", "nach", "zu"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Ich kümmere mich ___ meine Katze.", options: ["auf", "an", "um", "bei"], correct: 2 },
    { subject: "Preposition", level: "A2", text: "Er träumt ___ einer Reise nach Japan.", options: ["von", "über", "an", "zu"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Ich freue mich ___ deinen Besuch (Future).", options: ["auf", "über", "an", "mit"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Wir sprechen morgen ___ dem Lehrer.", options: ["mit", "über", "von", "an"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Ich warte ___ die Antwort.", options: ["auf", "über", "für", "an"], correct: 0 }
];

const GermanA2Data = async (typeId) => {
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
        console.log(`Successfully imported ${formattedQuestions.length} German A2 questions!`);
    } catch (err) {
        console.error("German A2 Import failed:", err);
    }
}

module.exports = GermanA2Data;