import prisma from "../../../config/prisma";

const questionsData = [
  // Vocabulary
  {
    subject: "Vocabulary",
    level: "C1",
    text: "Su discurso fue muy ___ y convincente.",
    options: ["persuasivo", "pequeño", "lento", "débil"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C1",
    text: "El informe presenta datos ___ y fiables.",
    options: ["precisos", "cortos", "vacíos", "pobres"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C1",
    text: "Es una persona muy ___ en su trabajo.",
    options: ["meticulosa", "rápida", "débil", "tímida"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C1",
    text: "El proyecto fue ___ con éxito.",
    options: ["implementado", "imprimir", "imprime", "imprimiendo"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C1",
    text: "Mostró una actitud ___ ante los problemas.",
    options: ["proactiva", "pequeña", "débil", "rápida"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C1",
    text: "El resultado fue ___ a lo esperado.",
    options: ["superior", "bajo", "débil", "lento"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C1",
    text: "Su propuesta fue ___ por el comité.",
    options: ["aprobada", "aprobar", "aprueba", "aprobando"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C1",
    text: "Tiene una gran capacidad de ___.",
    options: ["análisis", "analizar", "analiza", "analizando"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C1",
    text: "El profesor destacó la ___ del estudiante.",
    options: ["dedicación", "dedicar", "dedica", "dedicando"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C1",
    text: "El acuerdo fue firmado por ambas ___.",
    options: ["partes", "personas", "casas", "ciudades"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C1",
    text: "Su explicación fue clara y ___.",
    options: ["coherente", "rápida", "lenta", "débil"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C1",
    text: "La empresa busca soluciones ___.",
    options: ["innovadoras", "antiguas", "simples", "lentas"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C1",
    text: "El informe contiene información ___.",
    options: ["relevante", "pequeña", "débil", "vacía"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C1",
    text: "Es una medida ___ para evitar riesgos.",
    options: ["preventiva", "pequeña", "débil", "rápida"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "C1",
    text: "Su desempeño fue sumamente ___.",
    options: ["profesional", "infantil", "tímido", "débil"],
    correct: 0,
  },

  // Grammar
  {
    subject: "Grammar",
    level: "C1",
    text: "Es imprescindible que todos ___ presentes.",
    options: ["estén", "están", "estuvieron", "estarán"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C1",
    text: "No parecía que él ___ consciente del problema.",
    options: ["fuera", "fue", "es", "será"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C1",
    text: "Dudo que ellos ___ terminado el proyecto.",
    options: ["hayan", "han", "habían", "tendrán"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C1",
    text: "Buscábamos a alguien que ___ experiencia internacional.",
    options: ["tuviera", "tiene", "tendrá", "tuvo"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C1",
    text: "No aceptó que le ___ de esa manera.",
    options: ["hablaran", "hablan", "hablaron", "hablarán"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C1",
    text: "Ojalá ___ podido asistir a la reunión.",
    options: ["hubiera", "he", "había", "tendré"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C1",
    text: "No era lógico que ellos ___ tan tarde.",
    options: ["llegaran", "llegan", "llegaron", "llegarán"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C1",
    text: "Me sorprendió que no me lo ___.",
    options: ["dijera", "dijo", "dice", "dirá"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C1",
    text: "Prefería que me ___ informado antes.",
    options: ["hubieras", "has", "habrás", "tendrías"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C1",
    text: "Era poco probable que ___ éxito.",
    options: ["tuviera", "tiene", "tendrá", "tuvo"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C1",
    text: "Insistieron en que ___ el contrato.",
    options: ["firmáramos", "firmamos", "firmaremos", "firmar"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C1",
    text: "No creía que ella ___ tan preparada.",
    options: ["estuviera", "está", "estuvo", "estará"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C1",
    text: "Era necesario que todo ___ perfectamente organizado.",
    options: ["estuviera", "está", "esté", "estará"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C1",
    text: "Dudaba que me ___ dicho la verdad.",
    options: ["hubiera", "ha", "haya", "tendrá"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "C1",
    text: "No permitieron que se ___ sin permiso.",
    options: ["marchara", "marcha", "marchó", "marchará"],
    correct: 0,
  },

  // Prepositions
  {
    subject: "Preposition",
    level: "C1",
    text: "Estoy satisfecho ___ el resultado final.",
    options: ["con", "de", "en", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C1",
    text: "Se encargó ___ supervisar el proyecto.",
    options: ["de", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C1",
    text: "No estaba de acuerdo ___ la propuesta.",
    options: ["con", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C1",
    text: "Tiene facilidad ___ aprender idiomas.",
    options: ["para", "en", "de", "con"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C1",
    text: "Se quejó ___ la mala organización.",
    options: ["de", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C1",
    text: "Está comprometido ___ su trabajo.",
    options: ["con", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C1",
    text: "Se dio cuenta ___ su error.",
    options: ["de", "a", "en", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C1",
    text: "Está acostumbrado ___ trabajar bajo presión.",
    options: ["a", "de", "en", "por"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C1",
    text: "Lucharon ___ mejorar las condiciones.",
    options: ["por", "de", "en", "a"],
    correct: 0,
  },
  {
    subject: "Preposition",
    level: "C1",
    text: "Confío plenamente ___ tu criterio.",
    options: ["en", "a", "de", "por"],
    correct: 0,
  },
];

const SpanishC1Data = async (typeId: string) => {
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
      `Successfully imported ${formattedQuestions.length} Spanish C1 questions!`,
    );
  } catch (err) {
    console.error("Spanish C1 Import failed:", err);
  }
};

export default SpanishC1Data;
