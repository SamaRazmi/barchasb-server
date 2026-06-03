const Question = require('../../../models/Question');

const questionsData = [
    // Vocabulary
    { subject: "Vocabulary", level: "C2", text: "Er ist sich völlig ___, dass er die richtige Entscheidung getroffen hat.", options: ["bewusst", "sicher", "überzeugt", "klar"], correct: 2 },
    { subject: "Vocabulary", level: "C2", text: "Man geht davon aus, dass das Team die Vorgaben korrekt ___ hat.", options: ["umgesetzt", "setzt", "setzen", "gesetzt"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "Die Verhandlungen sind leider völlig zum ___ gekommen.", options: ["Erliegen", "Stehen", "Halten", "Liegen"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "Er hat seine Kompetenzen bei diesem Projekt maßlos ___.", options: ["überschritten", "überlaufen", "übergegangen", "überfahren"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "Es ist unumgänglich, dass wir diesen Vorfall lückenlos ___.", options: ["aufklären", "erklären", "verklären", "abklären"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "Der Minister wollte sich zu den Gerüchten nicht ___.", options: ["äußern", "sagen", "berichten", "mitteilen"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "Die neue Regelung stieß bei der Bevölkerung auf ___ Widerstand.", options: ["erbitterten", "bitteren", "scharfen", "harten"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "Er hat die Gabe, komplizierte Sachverhalte ___ darzustellen.", options: ["prägnant", "kurz", "klein", "eng"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "Wir müssen den Tatsachen ins Auge ___.", options: ["blicken", "sehen", "schauen", "gucken"], correct: 1 },
    { subject: "Vocabulary", level: "C2", text: "Die Entscheidung wurde hinter verschlossenen ___ getroffen.", options: ["Türen", "Toren", "Fenstern", "Wänden"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "Er hat sich durch sein Verhalten ins Abseits ___.", options: ["manövriert", "gestellt", "gesetzt", "gefahren"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "Die Wirtschaftslage ist momentan äußerst ___.", options: ["prekär", "schwer", "eng", "dunkel"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "Man sollte das Kind nicht mit dem Bade ___.", options: ["ausschütten", "ausgießen", "rauswerfen", "wegschütten"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "Diese Entdeckung hat weitreichende ___ für die Forschung.", options: ["Implikationen", "Folgen", "Gründe", "Sachen"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "Er hat versucht, die Wogen zu ___.", options: ["glätten", "ebnen", "flachen", "beruhigen"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "Die Argumente des Gegners wurden im Keime ___.", options: ["erstickt", "getötet", "beendet", "gebrochen"], correct: 0 },
    { subject: "Vocabulary", level: "C2", text: "Nach dem Skandal war sein Ruf ___ geschädigt.", options: ["nachhaltig", "lang", "tief", "stark"], correct: 0 },
    
    // Grammar
    { subject: "Grammar", level: "C2", text: "Hätte ich damals gewusst, ___ die Konsequenzen sein würden...", options: ["was", "wie", "dass", "ob"], correct: 1 },
    { subject: "Grammar", level: "C2", text: "Wäre er früher informiert worden, ___ das Problem vermieden werden können.", options: ["hätte", "würde", "wäre", "kann"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "Ich wünschte, ich ___ die Möglichkeit, länger zu reisen.", options: ["hätte", "habe", "würde", "hätte gehabt"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "Es wird berichtet, dass die Vorschläge bereits umgesetzt ___ sind.", options: ["haben", "sein", "worden", "seien"], correct: 2 },
    { subject: "Grammar", level: "C2", text: "Ich hoffe, dass wir die Herausforderungen erfolgreich ___.", options: ["bewältigen werden", "seien", "wäre", "haben"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "Wenn er mehr Support erhalten hätte, ___ er die Aufgabe erledigen können.", options: ["hätte", "würde", "wäre", "sein"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "Ich weiß nicht genau, ___ die Entscheidung getroffen wurde.", options: ["wie", "wann", "ob", "dass"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "Hätte sie früher reagiert, ___ die Krise verhindert werden können.", options: ["hätte", "würde", "wäre", "wäre gewesen"], correct: 2 },
    { subject: "Grammar", level: "C2", text: "Es wird erwartet, dass die Teilnehmer aktiv ___.", options: ["beitragen", "seien", "haben", "wären"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "Ich bin überzeugt, dass die Maßnahmen nachhaltig wirken ___.", options: ["werden", "seien", "hätte", "gewesen"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "Hätten wir die Dokumente früher erhalten, ___ wir den Bericht fertiggestellt.", options: ["hätten", "haben", "würden", "wären"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "Ich wünschte, er ___ mich rechtzeitig informiert.", options: ["hätte", "hat", "wäre", "hätte gehabt"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "Es ist notwendig, dass alle Unterlagen sorgfältig geprüft ___.", options: ["werden", "sein", "wurden", "seien"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "Hätte er die Situation besser analysiert, ___ die Entscheidung anders ausgefallen.", options: ["wäre", "würde", "hätte", "sein"], correct: 0 },
    { subject: "Grammar", level: "C2", text: "Wir gehen davon aus, dass das Projekt fristgerecht ___.", options: ["abgeschlossen wird", "sei", "wäre", "habe"], correct: 0 },

    // Preposition
    { subject: "Preposition", level: "C2", text: "Ich interessiere mich sehr ___ aktuelle politische Entwicklungen.", options: ["für", "an", "über", "bei"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Er hat Bedenken ___ die vorgeschlagene Strategie.", options: ["gegen", "über", "an", "bei"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Wir diskutierten ___ die Konsequenzen der Entscheidung.", options: ["über", "von", "bei", "an"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Ich interessiere mich sehr ___ philosophische Fragestellungen.", options: ["für", "über", "an", "bei"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Die Ergebnisse müssen ___ der Kriterien überprüft werden.", options: ["nach", "vor", "gemäß", "an"], correct: 2 },
    { subject: "Preposition", level: "C2", text: "Er äußerte Zweifel ___ die Richtigkeit der Angaben.", options: ["an", "über", "auf", "bei"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Sie ist verantwortlich ___ die Koordination der Abteilung.", options: ["für", "über", "an", "bei"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Ich habe mich ___ dem Vorschlag der Kollegen kritisch geäußert.", options: ["zu", "über", "auf", "an"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Wir müssen die Pläne ___ den neuen Vorschriften anpassen.", options: ["nach", "gemäß", "über", "zu"], correct: 1 },
    { subject: "Preposition", level: "C2", text: "Er ist stolz ___ seine wissenschaftlichen Leistungen.", options: ["auf", "über", "an", "bei"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Ich freue mich ___ die Möglichkeit, daran teilzunehmen (Future).", options: ["über", "auf", "an", "bei"], correct: 1 },
    { subject: "Preposition", level: "C2", text: "Es besteht Unsicherheit ___ die Umsetzung der Reform.", options: ["an", "über", "von", "bei"], correct: 1 },
    { subject: "Preposition", level: "C2", text: "Ich habe Bedenken ___ die vorgeschlagene Vorgehensweise.", options: ["über", "bei", "gegen", "zu"], correct: 2 },
    { subject: "Preposition", level: "C2", text: "Das Projekt wird ___ allen relevanten Richtlinien durchgeführt.", options: ["nach", "gemäß", "bei", "an"], correct: 1 },
    { subject: "Preposition", level: "C2", text: "Er zweifelte ___ die Effektivität des Programms.", options: ["an", "über", "auf", "bei"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Wir sind überzeugt ___ den Erfolg der Maßnahmen.", options: ["von", "über", "an", "bei"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Sie ist verantwortlich ___ die Einhaltung der Sicherheitsstandards.", options: ["für", "über", "an", "bei"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Sie ist stolz ___ ihre wissenschaftlichen Publikationen.", options: ["auf", "über", "bei", "an"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Ich freue mich ___ die Einladung zur Konferenz.", options: ["über", "auf", "bei", "an"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Es bestehen Zweifel ___ die Richtigkeit der Ergebnisse.", options: ["an", "über", "auf", "bei"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Wir haben uns ___ die Umsetzung der Empfehlungen geeinigt.", options: ["auf", "über", "bei", "an"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Ich erinnere mich noch genau ___ meine erste Präsentation.", options: ["an", "über", "bei", "auf"], correct: 0 },
    { subject: "Preposition", level: "C2", text: "Ich bin verantwortlich ___ die Einhaltung der Qualitätsstandards.", options: ["für", "auf", "bei", "an"], correct: 0 }
];

const GermanC2Data = async (typeId) => {
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
        console.log(`Successfully imported ${formattedQuestions.length} German C2 questions!`);
    } catch (err) {
        console.error("German C2 Import failed:", err);
    }
}

module.exports = GermanC2Data;