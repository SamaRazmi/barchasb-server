import prisma from "../../../config/prisma";

const questionsData = [
  // Vocabulary
  {
    subject: "Vocabulary",
    level: "B1",
    text: "Me gustaría ___ en una empresa internacional.",
    options: ["trabajar", "trabajo", "trabajé", "trabaja"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B1",
    text: "Estoy buscando ___ nuevo apartamento.",
    options: ["un", "una", "el", "la"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B1",
    text: "Ayer tuve una ___ interesante con mi jefe.",
    options: ["conversación", "canción", "comida", "calle"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B1",
    text: "Prefiero vivir ___ el campo que en la ciudad.",
    options: ["en", "a", "por", "con"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B1",
    text: "Tomé la decisión ___ cambiar de trabajo.",
    options: ["de", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B1",
    text: "Mi jefe me pidió ___ llegara temprano.",
    options: ["que", "si", "porque", "cuando"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B1",
    text: "Tengo miedo ___ perder mi empleo.",
    options: ["de", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B1",
    text: "El tráfico es peor ___ la mañana.",
    options: ["por", "en", "a", "con"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "B1",
    text: "Me siento orgulloso ___ mis logros.",
    options: ["de", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B1",
    text: "Estoy cansado ___ trabajar tantas horas.",
    options: ["de", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B1",
    text: "Es importante ___ estudies todos los días.",
    options: ["de", "que", "a", "si"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "B1",
    text: "El curso empieza ___ septiembre.",
    options: ["en", "a", "por", "con"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B1",
    text: "A pesar ___ la lluvia, salimos.",
    options: ["de", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B1",
    text: "Siempre trato ___ ser puntual.",
    options: ["de", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "B1",
    text: "Me interesa mucho ___ historia.",
    options: ["la", "el", "un", "una"],
    correct: 0,
  },

  // Grammar
  {
    subject: "Grammar",
    level: "B1",
    text: "Si tuviera más tiempo, ___ más libros.",
    options: ["leerá", "leeré", "leería", "leo"],
    correct: 2,
  },
  {
    subject: "Grammar",
    level: "B1",
    text: "Cuando llegué, ellos ya ___.",
    options: ["salieron", "habían salido", "salen", "saldrán"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "B1",
    text: "No sabía ___ hacer.",
    options: ["qué", "que", "quién", "cual"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B1",
    text: "Espero que me ___ pronto.",
    options: ["llamas", "llames", "llamaste", "llamar"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "B1",
    text: "Hace años que no ___ a María.",
    options: ["veo", "vi", "he visto", "ver"],
    correct: 2,
  },
  {
    subject: "Grammar",
    level: "B1",
    text: "Me dijo que ___ ocupado.",
    options: ["está", "estaba", "está", "esté"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "B1",
    text: "Si llueve, no ___ al parque.",
    options: ["vamos", "iremos", "fuimos", "íbamos"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B1",
    text: "Antes ___ en una fábrica.",
    options: ["trabajo", "trabajaba", "trabajé", "trabajar"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "B1",
    text: "No creo que él ___ razón.",
    options: ["tiene", "tenga", "tendrá", "tuvo"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "B1",
    text: "Ya ___ terminado el informe.",
    options: ["he", "has", "ha", "han"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B1",
    text: "¿Me preguntó ___ venía hoy?",
    options: ["si", "que", "qué", "cuando"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B1",
    text: "Cuando era niño, ___ con mis amigos.",
    options: ["jugaba", "jugué", "juego", "jugar"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B1",
    text: "No estoy seguro de ___ vendrá.",
    options: ["que", "si", "qué", "cuando"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "B1",
    text: "Aunque ___ cansado, sigo trabajando. (Fact)",
    options: ["estoy", "esté", "estaba", "estaré"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "B1",
    text: "Me alegré de que ___ bien.",
    options: ["estás", "estés", "estuviste", "estás"],
    correct: 1,
  },

  // Prepositions
  {
    subject: "Preposition",
    level: "B1",
    text: "Estoy de acuerdo ___ tu opinión.",
    options: ["con", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B1",
    text: "Se preocupa mucho ___ su familia.",
    options: ["por", "de", "en", "con"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B1",
    text: "Depende ___ la situación.",
    options: ["de", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B1",
    text: "Confío ___ ti.",
    options: ["en", "a", "de", "con"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B1",
    text: "Se enamoró ___ su compañero.",
    options: ["de", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B1",
    text: "Estoy acostumbrado ___ levantarme temprano.",
    options: ["a", "de", "en", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B1",
    text: "Se quejó ___ el servicio.",
    options: ["de", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B1",
    text: "Insiste ___ pagar la cuenta.",
    options: ["en", "a", "de", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B1",
    text: "Me llevo bien ___ mis vecinos.",
    options: ["con", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "B1",
    text: "Sueño ___ vivir en otro país.",
    options: ["con", "a", "en", "por"],
    correct: 0,
  },
];

const SpanishB1Data = async (typeId: string) => {
  try {
    const formattedQuestions = questionsData.map((q) => ({
      typeId,
      subject: q.subject,
      level: q.level,
      questionText: q.text,
      options: q.options.map((opt, index) => ({
        text: opt,
        isCorrect: index === q.correct,
      })),
    }));

    await prisma.question.createMany({
      data: formattedQuestions,
      skipDuplicates: true,
    });

    console.log(
      `Successfully imported ${formattedQuestions.length} Spanish B1 questions!`,
    );
  } catch (err) {
    console.error("Spanish B1 Import failed:", err);
  }
};

export default SpanishB1Data;
