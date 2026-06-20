import prisma from "../../../config/prisma";

const questionsData = [
  // Vocabulary
  {
    subject: "Vocabulary",
    level: "C2",
    text: "Su argumento fue tan ___ que convenció a todos los presentes.",
    options: ["contundente", "débil", "lento", "confuso"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C2",
    text: "El informe ofrece una visión ___ y pormenorizada del problema.",
    options: ["exhaustiva", "pequeña", "parcial", "limitada"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C2",
    text: "Es un investigador sumamente ___; no deja nada al azar.",
    options: ["riguroso", "simple", "lento", "débil"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C2",
    text: "Mostró una actitud ___ y calmada ante la crisis.",
    options: ["serenidad", "serena", "serenamente", "serenar"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "C2",
    text: "La propuesta fue ___ por unanimidad en la junta.",
    options: ["aprobada", "aprobar", "aprueba", "aprobando"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C2",
    text: "Tiene una capacidad ___ de análisis crítico.",
    options: ["excepcional", "baja", "lenta", "débil"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C2",
    text: "El resultado fue ___ a todas las expectativas iniciales.",
    options: ["superior", "inferior", "igual", "peor"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C2",
    text: "El acuerdo quedó ___ tras largas y arduas negociaciones.",
    options: ["sellado", "roto", "perdido", "dañado"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C2",
    text: "Su estilo de escritura es muy ___, propio de un erudito.",
    options: ["depurado", "simple", "básico", "pobre"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C2",
    text: "El informe carece ___ fundamentos sólidos que lo respalden.",
    options: ["de", "a", "en", "con"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C2",
    text: "La empresa atraviesa una situación extremadamente ___.",
    options: ["delicada", "pequeña", "fácil", "rápida"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C2",
    text: "Presentó una defensa ___ e impecable ante el tribunal.",
    options: ["sólida", "débil", "lenta", "básica"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C2",
    text: "El debate fue ___ por expertos de talla internacional.",
    options: ["liderado", "lento", "débil", "básico"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C2",
    text: "Es una decisión ___ que podría cambiar el rumbo de la industria.",
    options: ["audaz", "débil", "simple", "lenta"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C2",
    text: "El análisis resultó ___ y sumamente preciso.",
    options: ["profundo", "bajo", "débil", "vago"],
    correct: 0,
  },

  // Grammar
  {
    subject: "Grammar",
    level: "C2",
    text: "De haberlo sabido con antelación, no ___ aceptado el trato.",
    options: ["habría", "hubiera", "tendría", "he"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C2",
    text: "No parecía que el director ___ dispuesto a negociar.",
    options: ["estuviera", "estaba", "está", "estará"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C2",
    text: "Dudo que me ___ dicho toda la verdad en aquella ocasión.",
    options: ["haya", "ha", "hubo", "tendrá"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C2",
    text: "Aun cuando ___ cansado, siguió adelante con el plan.",
    options: ["estuviera", "estaba", "está", "estará"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C2",
    text: "Insistieron en que se ___ una investigación de oficio.",
    options: ["abriera", "abre", "abrió", "abrirá"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C2",
    text: "No era lógico que ella ___ tan tarde sin avisar.",
    options: ["llegara", "llega", "llegó", "llegará"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C2",
    text: "Preferiría que no me lo ___ de esa forma tan brusca.",
    options: ["dijeras", "dices", "dirás", "dijiste"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C2",
    text: "Dudaba que ellos ___ previsto este escenario.",
    options: ["hubieran", "han", "hayan", "tendrán"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C2",
    text: "Era imprescindible que todo ___ correctamente durante el evento.",
    options: ["funcionara", "funciona", "funcionó", "funcionará"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C2",
    text: "No aceptó que se le ___ injustamente frente a sus colegas.",
    options: ["tratara", "trata", "trató", "tratará"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C2",
    text: "Ojalá ___ contado con más apoyo institucional en aquel entonces.",
    options: ["hubiera", "he", "habré", "tengo"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C2",
    text: "No concebía que ___ posible tal error en el sistema.",
    options: ["fuera", "fue", "es", "será"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C2",
    text: "A menos que ___ pruebas fehacientes, no habrá juicio.",
    options: ["existan", "existen", "existían", "existirán"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C2",
    text: "Negó que se ___ cometido irregularidades durante su gestión.",
    options: ["hubieran", "han", "hayan", "tendrán"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C2",
    text: "Temía que no me ___ comprendido del todo.",
    options: ["hubieran", "hayan", "han", "tendrán"],
    correct: 0,
  },

  // Prepositions
  {
    subject: "Preposition",
    level: "C2",
    text: "Está plenamente convencido ___ su inocencia.",
    options: ["de", "en", "a", "con"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C2",
    text: "El éxito depende ___ múltiples factores exógenos.",
    options: ["de", "en", "a", "con"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C2",
    text: "Se mostró reacio ___ aceptar la propuesta de fusión.",
    options: ["a", "de", "en", "con"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C2",
    text: "No cabe duda ___ su intachable profesionalismo.",
    options: ["de", "en", "a", "con"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C2",
    text: "Está familiarizado ___ este tipo de procesos complejos.",
    options: ["con", "a", "de", "en"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C2",
    text: "Carece ___ la experiencia necesaria para el cargo.",
    options: ["de", "a", "en", "con"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C2",
    text: "Es consciente ___ los riesgos inherentes a la operación.",
    options: ["de", "en", "a", "con"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C2",
    text: "Se responsabilizó ___ los errores cometidos por su equipo.",
    options: ["de", "a", "en", "con"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C2",
    text: "Está comprometido ___ alcanzar la excelencia operativa.",
    options: ["con", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C2",
    text: "Procedieron ___ revisar el documento minuciosamente.",
    options: ["a", "de", "en", "con"],
    correct: 0,
  },
];

const SpanishC2Data = async (typeId: string) => {
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
      `Successfully imported ${formattedQuestions.length} Spanish C2 questions!`,
    );
  } catch (err) {
    console.error("Spanish C2 Import failed:", err);
  }
};

export default SpanishC2Data;
