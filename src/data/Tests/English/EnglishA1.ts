import prisma from "../../../config/prisma";

const questionsData = [
  // Vocabulary (1-15)
  {
    subject: "Vocabulary",
    level: "A1",
    text: '"House" means:',
    options: ["Car", "House", "Book", "School"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: '"Cat" means:',
    options: ["Cat", "Dog", "Tree", "Chair"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "In the morning, we eat:",
    options: ["Dinner", "Breakfast", "Lunch", "Snack"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: '"Mother" is:',
    options: ["Sister", "Mother", "Father", "Friend"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: '"Father" is a:',
    options: ["Man", "Woman", "Child", "Teacher"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: 'A "book" is for:',
    options: ["Reading", "Eating", "Drinking", "Sleeping"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "Water is a:",
    options: ["Fruit", "Drink", "Chair", "Animal"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "A school is a:",
    options: ["Building", "Country", "House", "Restaurant"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "A teacher works at:",
    options: ["Kitchen", "Bank", "Factory", "School"],
    correct: 3,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "A chair is:",
    options: ["Food", "Furniture", "Animal", "Drink"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "A table is usually made of:",
    options: ["Wood", "Water", "Bread", "Paper"],
    correct: 0,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "A window is in the:",
    options: ["Door", "Street", "School", "Wall"],
    correct: 3,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "A door can be:",
    options: ["Hot", "Sweet", "Open or closed", "Loud"],
    correct: 2,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "The sun rises in the:",
    options: ["Night", "Morning", "Evening", "Noon"],
    correct: 1,
  },
  {
    subject: "Vocabulary",
    level: "A1",
    text: "I live ___ Canada.",
    options: ["On", "At", "From", "In"],
    correct: 3,
  },

  // Grammar (16-30)
  {
    subject: "Grammar",
    level: "A1",
    text: "I ___ a student.",
    options: ["am", "is", "are", "be"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "You ___ English.",
    options: ["am", "is", "are", "be"],
    correct: 2,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "He ___ a teacher.",
    options: ["am", "is", "are", "be"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "We ___ in New York.",
    options: ["am", "is", "be", "are"],
    correct: 3,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "They ___ at home.",
    options: ["am", "is", "are", "be"],
    correct: 2,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "I ___ water every morning.",
    options: ["drink", "drinks", "drinking", "drank"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "She ___ English.",
    options: ["learn", "learns", "learning", "learned"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "He ___ a book.",
    options: ["read", "reading", "reads", "readed"],
    correct: 2,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "We ___ to school.",
    options: ["go", "goes", "going", "gone"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "They ___ coffee.",
    options: ["drinks", "drink", "drinking", "drank"],
    correct: 1,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "___ name is John.",
    options: ["My", "I", "Me", "Mine"],
    correct: 0,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "You ___ tired today.",
    options: ["am", "is", "are", "be"],
    correct: 2,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "He ___ here.",
    options: ["am", "are", "be", "is"],
    correct: 3,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "We ___ friends.",
    options: ["am", "is", "are", "be"],
    correct: 2,
  },
  {
    subject: "Grammar",
    level: "A1",
    text: "They ___ from Canada.",
    options: ["am", "is", "are", "be"],
    correct: 2,
  },

  // Prepositions & Expressions (31-40)
  {
    subject: "Expressions",
    level: "A1",
    text: "Hello =",
    options: ["Hi", "Good night", "Good evening", "Goodbye"],
    correct: 0,
  },
  {
    subject: "Expressions",
    level: "A1",
    text: "Good night =",
    options: ["Good morning", "Sleep well", "Good evening", "Hello"],
    correct: 1,
  },
  {
    subject: "Expressions",
    level: "A1",
    text: "How ___ you?",
    options: ["is", "am", "be", "are"],
    correct: 3,
  },
  {
    subject: "Expressions",
    level: "A1",
    text: "I ___ fine, thank you.",
    options: ["am", "is", "are", "be"],
    correct: 0,
  },
  {
    subject: "Expressions",
    level: "A1",
    text: "Thank you ___ your help.",
    options: ["in", "with", "for", "at"],
    correct: 2,
  },
  {
    subject: "Expressions",
    level: "A1",
    text: "I live ___ London.",
    options: ["in", "on", "at", "from"],
    correct: 0,
  },
  {
    subject: "Expressions",
    level: "A1",
    text: "We go ___ school.",
    options: ["on", "to", "in", "at"],
    correct: 1,
  },
  {
    subject: "Expressions",
    level: "A1",
    text: "I have ___ book.",
    options: ["an", "one", "some", "a"],
    correct: 3,
  },
  {
    subject: "Expressions",
    level: "A1",
    text: "The book is ___ the table.",
    options: ["in", "on", "under", "between"],
    correct: 1,
  },
  {
    subject: "Expressions",
    level: "A1",
    text: "How many hours are in a day?",
    options: ["12", "24", "20", "30"],
    correct: 1,
  },
];

const EnglishA1Data = async (typeId: string) => {
  try {
    const formattedQuestions = questionsData.map((q) => ({
      typeId: typeId,
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
      `Successfully imported ${formattedQuestions.length} English A1 questions!`,
    );
  } catch (err) {
    console.error("English A1 Import failed:", err);
    process.exit(1);
  }
};

export default EnglishA1Data;
