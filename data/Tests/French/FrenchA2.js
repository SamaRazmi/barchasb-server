const Question = require('../../../models/Question');

const questionsData = [
    // Vocabulary
    { subject: "Vocabulary", level: "A2", text: "Je mange le ___ chaque matin.", options: ["petit-déjeuner", "dîner", "goûter", "déjeuner"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Peux-tu ___ la lumière ?", options: ["allumer", "éteindre", "ouvrir", "fermer"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Je dois faire les ___ pour préparer le dîner.", options: ["courses", "devoirs", "vélos", "sports"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "J'ai mal à la ___ car j'ai trop lu.", options: ["tête", "jambe", "main", "pied"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Le ___ est en retard de dix minutes.", options: ["train", "chemin", "temps", "soleil"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Je ___ mes clés partout, mais je ne les trouve pas.", options: ["cherche", "trouve", "perds", "donne"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Il fait froid, je vais mettre un ___.", options: ["manteau", "maillot", "short", "chapeau"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Pour aller au troisième étage, je prends l'___.", options: ["ascenseur", "escalier", "entrée", "avion"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Pouvez-vous me ___ le sel, s'il vous plaît ?", options: ["passer", "manger", "boire", "partir"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "J'ai besoin d'un ___ pour couper la viande.", options: ["couteau", "verre", "assiette", "cuillère"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Quel est ton ___ de téléphone ?", options: ["numéro", "nom", "adresse", "code"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Elle est très ___ car elle a gagné le match.", options: ["heureuse", "triste", "fatiguée", "fâchée"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Le ciel est ___ aujourd'hui, il ne va pas pleuvoir.", options: ["bleu", "gris", "noir", "vert"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Nous avons ___ une chambre d'hôtel pour ce soir.", options: ["réservé", "acheté", "vendu", "donné"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Je ___ mon vélo tous les jours pour aller au travail.", options: ["utilise", "mange", "regarde", "écoute"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Il est important de ___ les mains avant de manger.", options: ["laver", "couper", "fermer", "ouvrir"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "C'est une ville très ___ avec beaucoup de voitures.", options: ["bruyante", "calme", "petite", "vide"], correct: 0 },
    { subject: "Vocabulary", level: "A2", text: "Elle a travaillé ___ toute la journée hier.", options: ["beaucoup", "beaucoup de", "bien", "beaucoup des"], correct: 0 },

    // Grammar
    { subject: "Grammar", level: "A2", text: "Je ___ déjà en France.", options: ["suis", "ai été", "étais", "serai"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "Nous ___ un test la semaine prochaine.", options: ["faisons", "ferons", "faisions", "fait"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "Peux-tu m’___ aider ?", options: ["le", "la", "me", "nous"], correct: 2 },
    { subject: "Grammar", level: "A2", text: "J’___ le français depuis un an.", options: ["apprends", "appris", "apprendrai", "ai appris"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Je ___ au cinéma demain.", options: ["vais", "va", "vont", "allez"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Je ___ du café chaque matin.", options: ["bois", "boit", "buvons", "boivent"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Hier, j’___ mes amis.", options: ["vois", "ai vu", "voit", "vu"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "Hier, j’ai acheté ___ livre.", options: ["un", "une", "des", "du"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Demain, nous ___ à Paris.", options: ["allons", "allez", "va", "vont"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Si j’ai le temps, je ___ au cinéma.", options: ["vais", "va", "vont", "aller"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Il a dit qu’il ___ demain.", options: ["ne vient pas", "ne viendra pas", "n’est pas venu", "ne vient"], correct: 1 },
    { subject: "Grammar", level: "A2", text: "Je ___ volontiers une pizza.", options: ["mange", "manges", "mangeons", "mangent"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Hier, nous ___ beaucoup de plaisir.", options: ["avons eu", "avons", "avons été", "avons fait"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Je n’___ jamais à Paris.", options: ["suis allé", "ai été", "suis", "vais"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "As-tu déjà ___ ce livre ?", options: ["lu", "lire", "lis", "lisez"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Nous ___ au football tous les jours.", options: ["jouons", "joue", "jouez", "jouent"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Je crois qu’il ___ raison.", options: ["a", "ai", "avoir", "a eu"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Je ___ fatigué après le film.", options: ["suis", "es", "est", "sommes"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Nous ___ en France il y a deux ans.", options: ["sommes allés", "allons", "sommes", "allé"], correct: 0 },
    { subject: "Grammar", level: "A2", text: "Si tu veux, nous ___ ensemble.", options: ["mangeons", "mange", "mangerons", "mangions"], correct: 2 },
    { subject: "Grammar", level: "A2", text: "Je ne sais pas ___ il vient.", options: ["quand", "comment", "si", "où"], correct: 0 },

    // Preposition
    { subject: "Preposition", level: "A2", text: "Je m’intéresse ___ la musique.", options: ["à", "pour", "de", "sur"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Il raconte souvent ___ ses vacances.", options: ["de", "sur", "à", "en"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Nous habitons ___ la gare.", options: ["près de", "sur", "à", "chez"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "J’attends ___ le bus.", options: ["pour", "à", "de", "le"], correct: 3 },
    { subject: "Preposition", level: "A2", text: "Elle a peur ___ les araignées.", options: ["de", "à", "sur", "en"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Le week-end, je vais ___ mes parents.", options: ["à", "chez", "sur", "dans"], correct: 1 },
    { subject: "Preposition", level: "A2", text: "Je suis allé ___ médecin la semaine dernière.", options: ["à", "chez", "dans", "sur"], correct: 1 },
    { subject: "Preposition", level: "A2", text: "Nous parlons ___ français et anglais.", options: ["de", "en", "sur", "avec"], correct: 1 },
    { subject: "Preposition", level: "A2", text: "Je me réjouis ___ le cadeau.", options: ["de", "pour", "avec", "sur"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Je suis parti ___ vacances en Espagne.", options: ["en", "à", "sur", "chez"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Nous allons demain ___ la mer.", options: ["à", "en", "sur", "chez"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Je m’occupe ___ mon chat.", options: ["de", "à", "pour", "avec"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Il rêve ___ un voyage au Japon.", options: ["de", "sur", "à", "pour"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Je me réjouis ___ ta visite.", options: ["de", "à", "pour", "avec"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "Nous parlons demain ___ le professeur.", options: ["avec", "sur", "à", "de"], correct: 0 },
    { subject: "Preposition", level: "A2", text: "J’attends ___ la réponse.", options: ["pour", "la", "à", "sur"], correct: 1 }
];

const FrenchA2Data = async (typeId) => {
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
        console.log(`Successfully imported ${formattedQuestions.length} French A2 questions!`);
    } catch (err) {
        console.error("French A2 Import failed:", err);
    }
}

module.exports = FrenchA2Data;