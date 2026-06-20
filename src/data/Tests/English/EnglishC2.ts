import prisma from "../../../config/prisma";

const questionsData = [
  // Vocabulary
  { subject: "Vocabulary", level: "C2", text: "The results must be analyzed with the utmost ___ and accuracy.", options: ["Thoroughness", "On", "In", "By"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The board expressed serious reservations ___ the proposed long-term strategy.", options: ["About", "On", "By", "In"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "I cannot easily ascertain ___ whether all the minor details provided are correct.", options: ["That", "Of", "In", "With"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The discussion revolved ___ the legal implications of the new legislation.", options: ["Around", "On", "About", "With"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "I liaised ___ several departments to ensure the report was finalized.", options: ["With", "On", "At", "In"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "We will consult ___ the advisory board prior to making any final decisions.", options: ["With", "On", "In", "At"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "I am currently uncertain ___ the most prudent course of action to take.", options: ["As to", "Of", "On", "With"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The diplomat sought to ___ the tension between the two nations through subtle negotiation.", options: ["Ameliorate", "Fix", "Better", "Adjust"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The evidence provided was so ___ that the jury reached a verdict in minutes.", options: ["Compelling", "Strong", "Big", "Good"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "He has an ___ ability to predict market trends before they happen.", options: ["Uncanny", "Strange", "High", "Learned"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The professor's lecture was so ___ that even the experts found it challenging.", options: ["Abstruse", "Hard", "Long", "Wordy"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The company’s reputation was ___ by the recent environmental scandal.", options: ["Tarnished", "Broken", "Changed", "Lowered"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The new legislation had a ___ effect on the economy, causing a complete standstill.", options: ["Deleterious", "Bad", "Poor", "Weak"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "His writing is characterized by a ___ wit that often borders on sarcasm.", options: ["Trenchant", "Sharp", "Fast", "Cutting"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The view from the penthouse was truly ___, overlooking the entire city skyline.", options: ["Panoramic", "Wide", "Big", "Broad"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "After the merger, the two corporate cultures proved to be utterly ___.", options: ["Incompatible", "Different", "Wrong", "Loose"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The witness gave a ___ account of the events, leaving out no detail.", options: ["Graphic", "Clear", "Drawn", "Visual"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The CEO decided to take the ___ share of the profits for reinvestment.", options: ["Lion's", "Big", "Best", "Main"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The project was a ___ failure, despite the immense funding it received.", options: ["Dismal", "Sad", "Poor", "Low"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "She has an ___ thirst for knowledge, constantly reading new research papers.", options: ["Insatiable", "Big", "Full", "Strong"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The government's response was criticized for being too ___ and lacking conviction.", options: ["Tepid", "Warm", "Slow", "Weak"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The philosopher argued that true ___ can only be found through self-reflection.", options: ["Enlightenment", "Knowing", "Smartness", "Light"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "There is an ___ amount of work to be done before the grand opening.", options: ["Inordinate", "Large", "High", "Much"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The sudden ___ of the stock market left many investors bankrupt.", options: ["Volatility", "Change", "Movement", "Speed"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "His success is a ___ to his unwavering persistence.", options: ["Testament", "Sign", "Story", "Result"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "The report offers a ___ critique of the current healthcare system.", options: ["Scathing", "Bad", "Hard", "Angry"], correct: 0 },
  { subject: "Vocabulary", level: "C2", text: "We must ensure that our actions are in ___ with international law.", options: ["Compliance", "Meeting", "Agreement", "Check"], correct: 0 },

  // Grammar
  { subject: "Grammar", level: "C2", text: "Had I known the full extent of the consequences, I ___ acted differently.", options: ["Would have", "Will", "Would", "Was"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "I am fully convinced ___ effective leadership is what truly drives organizational success.", options: ["That", "On", "In", "Of"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "Despite ___ numerous challenges, the team eventually accomplished its objectives.", options: ["The", "Of", "In", "For"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "He succeeded ___ resolving the complex logistical problem with high efficiency.", options: ["In", "On", "At", "By"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "Despite ___ the initial challenges, the project was completed successfully.", options: ["The", "Of", "In", "For"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "Had they prepared more adequately, they ___ won the competition handily.", options: ["Would have", "Could", "Can", "Would"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "I am firmly convinced ___ this strategy will yield substantial long-term benefits.", options: ["That", "On", "Of", "With"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "It is imperative that the instructions ___ followed to the letter.", options: ["Be", "Are", "Were", "Have been"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "I am confident ___ the strategy will achieve its primary objectives.", options: ["That", "On", "Of", "With"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "She has always excelled ___ handling complex, high-stakes negotiations.", options: ["In", "On", "At", "By"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "The team is expected to ___ the project by the end of the current fiscal month.", options: ["Have completed", "Complete", "Will complete", "Completing"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "It is essential that all sensitive documentation ___ thoroughly reviewed before submission.", options: ["Be", "Are", "Was", "Have been"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "He claims ___ having completed the task well within the specified deadline.", options: ["To", "That", "For", "About"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "Provided that all contractual conditions are met, the plan ___ proceed.", options: ["Will", "Would", "Can", "Did"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "I requested that he ___ me with the full report before the deadline.", options: ["Provide", "Provides", "Providing", "Provided"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "It is crucial that everyone ___ kept informed of any updated policies.", options: ["Be", "Is", "Was", "Has been"], correct: 0 },
  { subject: "Grammar", level: "C2", text: "I recall vividly ___ the keynote speech at my first international conference.", options: ["Hearing", "Of", "In", "About"], correct: 0 },

  // Prepositions / Advanced Expressions
  { subject: "Preposition", level: "C2", text: "The company is unswervingly committed ___ upholding ethical standards in all operations.", options: ["To", "In", "On", "With"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "I have rarely been so impressed ___ a presentation as I was by yours.", options: ["By", "With", "At", "On"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "The CEO insisted ___ implementing the structural reforms immediately.", options: ["On", "In", "At", "By"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "Researchers are acutely aware ___ the far-reaching implications of their findings.", options: ["Of", "On", "With", "About"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "I am eager ___ participating in the international symposium next month.", options: ["For", "About", "On", "In"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "I dream ___ continuously advancing my professional skills in this field.", options: ["Of", "About", "To", "On"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "He is immensely proud ___ his team’s unprecedented achievements.", options: ["Of", "On", "At", "With"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "I pay meticulous attention ___ even the most minor details in the work.", options: ["To", "On", "At", "With"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "Should unforeseen difficulties arise, we will adhere ___ the contingency plan.", options: ["To", "On", "At", "With"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "I am enthusiastic ___ presenting our findings at the global forum.", options: ["About", "On", "In", "At"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "We are held accountable ___ executing the instructions with utmost precision.", options: ["For", "On", "In", "At"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "She is deeply involved ___ groundbreaking research on climate change.", options: ["In", "On", "At", "With"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "The presentation was highly praised ___ the board members for its clarity.", options: ["By", "With", "At", "On"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "He remains committed ___ fostering a culture of innovation.", options: ["To", "In", "On", "With"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "We must adhere strictly ___ the ethical guidelines established last year.", options: ["To", "On", "At", "With"], correct: 0 },
  { subject: "Preposition", level: "C2", text: "The team was justly praised ___ their exceptional performance.", options: ["For", "On", "At", "With"], correct: 0 },
];

const EnglishC2Data = async (typeId: string) => {
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
      `Successfully imported ${formattedQuestions.length} English C2 questions!`,
    );
  } catch (err) {
    console.error("English C2 Import failed:", err);
    process.exit(1);
  }
};

export default EnglishC2Data;