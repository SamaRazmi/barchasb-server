const Question = require('../../../models/Question');

const questionsData = [
    // Vocabulary
    { subject: "Vocabulary", level: "B2", text: "Le gouvernement a pris des mesures pour ___ le chômage.", options: ["endiguer", "finir", "arrêter", "fermer"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Son argument est ___, il n'y a aucune preuve.", options: ["infondé", "faux", "mauvais", "petit"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Il a fallu ___ les efforts pour réussir ce projet.", options: ["redoubler", "refaire", "ajouter", "multiplier"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Cette réforme a suscité une vive ___ au sein de la population.", options: ["polémique", "discussion", "parole", "question"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Il est resté ___ face aux critiques.", options: ["impassible", "calme", "tranquille", "immobile"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Nous devons ___ ce contrat avant la fin du mois.", options: ["ratifier", "signer", "faire", "écrire"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Le projet a été ___ en raison du manque de budget.", options: ["avorté", "fini", "arrêté", "parti"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Il a un talent ___ pour la diplomatie.", options: ["inné", "bon", "nouveau", "grand"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "L'entreprise cherche à ___ son marché à l'international.", options: ["accroître", "grandir", "monter", "faire"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Il s'est ___ de ses fonctions hier matin.", options: ["démis", "enlevé", "sorti", "parti"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Il ne faut pas ___ les bras dès la première difficulté.", options: ["baisser", "lâcher", "tomber", "perdre"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Cette nouvelle a fait l'effet d'une ___ dans le milieu politique.", options: ["bombe", "vague", "pluie", "tempête"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Elle a un esprit très ___ ; elle comprend tout immédiatement.", options: ["vif", "rapide", "intelligent", "clair"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Nous avons dû ___ face aux exigences du client.", options: ["céder", "donner", "dire", "perdre"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Le succès de ce produit est ___ ; tout le monde l'achète.", options: ["fulgurant", "rapide", "bon", "grand"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "L'inflation risque d'___ le pouvoir d'achat.", options: ["éroder", "manger", "baisser", "finir"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Ce témoignage vient ___ les doutes des enquêteurs.", options: ["étayer", "aider", "dire", "montrer"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Il a réussi à ___ la confiance de son équipe.", options: ["instaurer", "faire", "mettre", "donner"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "La situation s'est ___ au cours des dernières heures.", options: ["détériorée", "cassée", "finie", "changée"], correct: 0 },
    { subject: "Vocabulary", level: "B2", text: "Il est ___ de penser que tout sera simple.", options: ["illusoire", "faux", "difficile", "bizarre"], correct: 0 },

    // Grammar
    { subject: "Grammar", level: "B2", text: "Si j’avais plus de temps, je ___ un livre.", options: ["écris", "écrirais", "écrira", "écrivais"], correct: 1 },
    { subject: "Grammar", level: "B2", text: "J’ignore ___ il est arrivé hier.", options: ["quand", "comment", "si", "que"], correct: 2 },
    { subject: "Grammar", level: "B2", text: "Je crois qu’il ___ raison.", options: ["a", "ai", "être", "avait"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Il affirme qu’il ___ tout correctement.", options: ["a fait", "a", "faire", "avait fait"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Si tu avais fait cela, nous ___ le projet plus tôt terminé.", options: ["aurions", "avons", "serions", "étions"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Il est important que nous ___ les règles.", options: ["respectons", "respections", "avons respecté", "respecterons"], correct: 1 },
    { subject: "Grammar", level: "B2", text: "Je ne sais pas exactement ___ la décision a été prise.", options: ["comment", "quand", "si", "que"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Je suis sûr qu’il ___ la tâche correctement.", options: ["a fait", "fait", "fera", "aurait fait"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Nous supposons que l’équipe ___ ponctuelle.", options: ["sera", "soit", "était", "serait"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "J’espère que tu ___ m’aider.", options: ["peux", "pourras", "pourrais", "puisses"], correct: 1 },
    { subject: "Grammar", level: "B2", text: "Aurais-tu le temps ___ nous rencontrer demain ?", options: ["que", "si", "quand", "comment"], correct: 1 },
    { subject: "Grammar", level: "B2", text: "J’espère que nous ___ relever les défis avec succès.", options: ["allons", "allons pouvoir", "pourrons", "pouvons"], correct: 2 },
    { subject: "Grammar", level: "B2", text: "Il demande si je peux ___ expliquer.", options: ["lui", "le", "la", "moi"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Je suis convaincu qu’il ___ réussi l’examen.", options: ["a", "a eu", "a fait", "avait"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Si nous avions eu plus d’informations, nous ___ la décision mieux prise.", options: ["aurions", "avons", "serions", "étions"], correct: 0 },
    { subject: "Grammar", level: "B2", text: "Je ne sais pas exactement ___ résoudre le problème.", options: ["comment", "quand", "si", "que"], correct: 0 },

    // Preposition
    { subject: "Preposition", level: "B2", text: "Je m’intéresse beaucoup ___ la politique internationale.", options: ["à", "pour", "sur", "de"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Il parle souvent ___ ses expériences à l’étranger.", options: ["de", "sur", "à", "avec"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Nous devons être conscients ___ les conséquences de nos décisions.", options: ["de", "sur", "à", "pour"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Il est très intéressé ___ l’art et la musique.", options: ["pour", "à", "par", "sur"], correct: 2 },
    { subject: "Preposition", level: "B2", text: "Je ne peux pas me décider ___ ta proposition.", options: ["sur", "pour", "à", "de"], correct: 1 },
    { subject: "Preposition", level: "B2", text: "Nous devons discuter ___ le problème selon les nouvelles règles.", options: ["de", "sur", "à", "avec"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Je suis convaincu ___ son opinion.", options: ["de", "à", "sur", "par"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Je rêve souvent ___ un voyage autour du monde.", options: ["de", "sur", "à", "pour"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Je me suis inscrit ___ le cours.", options: ["à", "pour", "chez", "sur"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Nous discutons ___ les avantages et les inconvénients du plan.", options: ["de", "sur", "à", "avec"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Je me souviens bien ___ mon enfance.", options: ["de", "sur", "à", "dans"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Je suis fier ___ mes réussites.", options: ["de", "sur", "à", "pour"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Je m’occupe ___ l’organisation du projet.", options: ["de", "à", "pour", "avec"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Elle est responsable ___ les finances de l’entreprise.", options: ["de", "pour", "sur", "à"], correct: 1 },
    { subject: "Preposition", level: "B2", text: "Nous devons vérifier tous les documents ___ les détails.", options: ["pour", "sur", "à", "de"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Je me réjouis ___ le concert à venir.", options: ["de", "pour", "à", "sur"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Il est très satisfait ___ les résultats.", options: ["de", "sur", "à", "avec"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Nous devons être conscients ___ les conséquences de nos actes.", options: ["de", "pour", "à", "sur"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Elle est fière ___ ses réussites scientifiques.", options: ["de", "sur", "à", "pour"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Je me réjouis ___ l’invitation à la conférence.", options: ["de", "à", "pour", "sur"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Il a peur ___ la réaction du public.", options: ["de", "sur", "à", "chez"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Nous avons convenu ___ la mise en œuvre des recommandations.", options: ["de", "sur", "à", "pour"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Je me souviens encore ___ ma première présentation.", options: ["de", "sur", "à", "dans"], correct: 0 },
    { subject: "Preposition", level: "B2", text: "Je suis responsable ___ le respect des règles de sécurité.", options: ["de", "pour", "sur", "à"], correct: 0 }
];

const FrenchB2Data = async (typeId) => {
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
        console.log(`Successfully imported ${formattedQuestions.length} French B2 questions!`);
    } catch (err) {
        console.error("French B2 Import failed:", err);
    }
}

module.exports = FrenchB2Data;