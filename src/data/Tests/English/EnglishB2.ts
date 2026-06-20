import prisma from "../../../config/prisma";

const questionsData = [
  // Vocabulary
  { subject: "Vocabulary", level: "B2", text: "I have serious doubts ___ the effectiveness of the new plan.", options: ["About", "On", "Of", "In"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "It is necessary to comply ___ all health and safety regulations.", options: ["With", "On", "In", "At"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "The project was implemented ___ international quality standards.", options: ["According to", "On", "In", "By"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "I have some reservations ___ the proposed method of distribution.", options: ["About", "On", "By", "In"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "I think the solution ___ the problem will be highly effective.", options: ["To", "On", "For", "At"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "He often talks ___ environmental and social issues.", options: ["About", "On", "In", "With"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "We will consult ___ the executive team before final decisions.", options: ["With", "On", "In", "At"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "If we face difficulties, we will stick ___ the original plan.", options: ["To", "On", "At", "With"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "The results must be evaluated ___ accuracy and objectivity.", options: ["For", "On", "In", "By"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "The manager decided to ___ the task to her most trusted assistant.", options: ["Delegate", "Give", "Divide", "Subtract"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "The company is looking for a ___ candidate with at least five years of experience.", options: ["Suitable", "Likely", "Fitting", "Proper"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "We need to ___ the data thoroughly before making a final decision.", options: ["Analyze", "Look", "Search", "Check"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "He was forced to ___ from his position following the scandal.", options: ["Resign", "Leave", "Fire", "Withdraw"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "The new marketing ___ proved to be highly successful in increasing sales.", options: ["Strategy", "Plan", "Way", "Method"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "It took me a long time to ___ around to writing that report.", options: ["Get", "Go", "Come", "Turn"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "We ran ___ some unexpected problems during the implementation phase.", options: ["Into", "Over", "Against", "Through"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "You should ___ up on your French before you go to Paris.", options: ["Brush", "Clean", "Wash", "Fix"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "I can't ___ up with that constant noise anymore!", options: ["Put", "Stay", "Keep", "Stand"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "The results of the study were ___ with our initial hypothesis.", options: ["Consistent", "Constant", "Continual", "Connected"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "There is a significant ___ between the two versions of the story.", options: ["Discrepancy", "Difference", "Gap", "Change"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "The government has promised to ___ the current tax system.", options: ["Reform", "Repair", "Renew", "Restore"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "His argument was quite ___, but it lacked supporting evidence.", options: ["Persuasive", "Winning", "Strong", "Forcing"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "The project was a ___ success, exceeding all expectations.", options: ["Resounding", "Loud", "Huge", "Strong"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "The instructions were extremely ___ and easy to follow.", options: ["Concise", "Short", "Small", "Little"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "She has a ___ memory and can recall dates very easily.", options: ["Remarkable", "Good", "Strong", "Big"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "The negotiations were ___, but we finally reached an agreement.", options: ["Strenuous", "Hard", "Difficult", "Heavy"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "I would like to ___ an objection to the proposed changes.", options: ["Raise", "Make", "Give", "Put"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "He has a wide ___ of interests, ranging from jazz to physics.", options: ["Range", "Group", "Collection", "Set"], correct: 0 },
  { subject: "Vocabulary", level: "B2", text: "The medicine should ___ the pain within thirty minutes.", options: ["Alleviate", "Decrease", "Drop", "Lower"], correct: 0 },

  // Grammar
  { subject: "Grammar", level: "B2", text: "If I had known that, I ___ acted differently.", options: ["Would have", "Will", "Was", "Would"], correct: 0 },
  { subject: "Grammar", level: "B2", text: "I am convinced ___ good communication is the primary key to success.", options: ["That", "On", "Of", "With"], correct: 0 },
  { subject: "Grammar", level: "B2", text: "Students are expected to ___ the assignment by the end of the week.", options: ["Finish", "Will finish", "Have finished", "Finishing"], correct: 2 },
  { subject: "Grammar", level: "B2", text: "I think if I studied harder, my results ___ better.", options: ["Would be", "Is", "Was", "Will be"], correct: 0 },
  { subject: "Grammar", level: "B2", text: "It is necessary that all documents ___ checked before submission.", options: ["Are", "Be", "Were", "Will be"], correct: 1 },
  { subject: "Grammar", level: "B2", text: "He didn’t know exactly ___ to solve the complex problem.", options: ["How", "When", "If", "What"], correct: 0 },
  { subject: "Grammar", level: "B2", text: "I am sure the final decision ___ correct in the long run.", options: ["Is", "Will be", "Was", "Has been"], correct: 1 },
  { subject: "Grammar", level: "B2", text: "If he attended the meeting yesterday, he ___ important notes.", options: ["Would have taken", "Took", "Takes", "Will take"], correct: 0 },
  { subject: "Grammar", level: "B2", text: "I want to ensure that everyone ___ aware of the new procedures.", options: ["Is", "Was", "Be", "Has been"], correct: 2 },
  { subject: "Grammar", level: "B2", text: "The project is expected to ___ by the end of next month.", options: ["Be completed", "Complete", "Was completed", "Completing"], correct: 0 },
  { subject: "Grammar", level: "B2", text: "If the plan is executed well, the results ___ positive.", options: ["Will be", "Are", "Were", "Has been"], correct: 0 },
  { subject: "Grammar", level: "B2", text: "I don’t know exactly ___ to handle this difficult situation.", options: ["How", "When", "If", "What"], correct: 0 },
  { subject: "Grammar", level: "B2", text: "I asked him to ___ me the full information before the report.", options: ["Give", "Gives", "Giving", "Gave"], correct: 0 },
  { subject: "Grammar", level: "B2", text: "He is sure he ___ the task successfully by tomorrow.", options: ["Will complete", "Completes", "Completed", "Has completed"], correct: 0 },
  { subject: "Grammar", level: "B2", text: "If I had more time, I ___ the project more thoroughly.", options: ["Would have completed", "Complete", "Would complete", "Completed"], correct: 0 },
  { subject: "Grammar", level: "B2", text: "I cannot be sure ___ all the details are accurate.", options: ["That", "Of", "In", "With"], correct: 1 },

  // Prepositions / Expressions
  { subject: "Preposition", level: "B2", text: "We are fully committed ___ achieving the goals set by the board.", options: ["To", "In", "On", "With"], correct: 0 },
  { subject: "Preposition", level: "B2", text: "I am interested ___ politics and economics.", options: ["In", "On", "At", "With"], correct: 0 },
  { subject: "Preposition", level: "B2", text: "We are well aware ___ the possible consequences of this decision.", options: ["Of", "In", "On", "With"], correct: 0 },
  { subject: "Preposition", level: "B2", text: "We must focus ___ improving performance in all technical areas.", options: ["On", "In", "At", "With"], correct: 0 },
  { subject: "Preposition", level: "B2", text: "Employees are responsible ___ meeting strict deadlines.", options: ["For", "On", "In", "At"], correct: 0 },
  { subject: "Preposition", level: "B2", text: "He is rightfully proud ___ his significant academic achievements.", options: ["Of", "On", "In", "With"], correct: 0 },
  { subject: "Preposition", level: "B2", text: "I am excited ___ participating in the upcoming global conference.", options: ["About", "On", "In", "At"], correct: 0 },
  { subject: "Preposition", level: "B2", text: "We must adapt ___ new economic conditions quickly to survive.", options: ["To", "With", "On", "At"], correct: 0 },
  { subject: "Preposition", level: "B2", text: "I am extremely interested ___ current international politics.", options: ["In", "On", "At", "With"], correct: 0 },
  { subject: "Preposition", level: "B2", text: "I remember well the details ___ my first university experience.", options: ["Of", "In", "About", "At"], correct: 0 },
  { subject: "Preposition", level: "B2", text: "I dream ___ continuously improving my professional skills.", options: ["Of", "About", "To", "On"], correct: 0 },
  { subject: "Preposition", level: "B2", text: "He is proud ___ his team and their collective achievements.", options: ["Of", "On", "At", "With"], correct: 0 },
  { subject: "Preposition", level: "B2", text: "I pay close attention ___ all minor details at work.", options: ["To", "On", "At", "With"], correct: 0 },
  { subject: "Preposition", level: "B2", text: "I am excited ___ attending the international conference next week.", options: ["About", "On", "In", "At"], correct: 0 },
  { subject: "Preposition", level: "B2", text: "We are responsible ___ following all safety instructions carefully.", options: ["For", "About", "In", "At"], correct: 0 },
];

const EnglishB2Data = async (typeId: string) => {
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
      `Successfully imported ${formattedQuestions.length} English B2 questions!`,
    );
  } catch (err) {
    console.error("English B2 Import failed:", err);
    process.exit(1);
  }
};

export default EnglishB2Data;