import prisma from "../../../config/prisma";

const questionsData = [
  // Vocabulary
  { subject: "Vocabulary", level: "A2", text: "I eat ___ every morning.", options: ["Dinner", "Breakfast", "Lunch", "Snack"], correct: 1 },
  { subject: "Vocabulary", level: "A2", text: "Yesterday I bought ___ book.", options: ["Book", "One", "Books", "A book"], correct: 3 },
  { subject: "Vocabulary", level: "A2", text: "Can you ___ the light?", options: ["Turn on", "Turn off", "Open", "Close"], correct: 0 },
  { subject: "Vocabulary", level: "A2", text: "I worked ___ all day yesterday.", options: ["Hard", "Hardly", "Well", "Little"], correct: 0 },
  { subject: "Vocabulary", level: "A2", text: "If you want to buy bread, you go to the ___.", options: ["Pharmacy", "Bakery", "Library", "Museum"], correct: 1 },
  { subject: "Vocabulary", level: "A2", text: "My father's sister is my ___.", options: ["Uncle", "Cousin", "Aunt", "Niece"], correct: 2 },
  { subject: "Vocabulary", level: "A2", text: "I'm very ___ because I have a big exam tomorrow.", options: ["Bored", "Nervous", "Angry", "Thirsty"], correct: 1 },
  { subject: "Vocabulary", level: "A2", text: "The weather is ___ today, so don't forget your umbrella.", options: ["Sunny", "Cloudy", "Rainy", "Windy"], correct: 2 },
  { subject: "Vocabulary", level: "A2", text: "A person who designs buildings is an ___.", options: ["Artist", "Architect", "Engineer", "Accountant"], correct: 1 },
  { subject: "Vocabulary", level: "A2", text: "I forgot my ___ at home, so I can't pay for the coffee.", options: ["Key", "Wallet", "Passport", "Ticket"], correct: 1 },
  { subject: "Vocabulary", level: "A2", text: "He is very ___ because he exercises every day.", options: ["Weak", "Fit", "Lazy", "Sick"], correct: 1 },
  { subject: "Vocabulary", level: "A2", text: "Can you ___ the door? It's very cold outside.", options: ["Open", "Break", "Shut", "Push"], correct: 2 },
  { subject: "Vocabulary", level: "A2", text: "A ___ works in a hospital and helps doctors.", options: ["Chef", "Nurse", "Pilot", "Lawyer"], correct: 1 },
  { subject: "Vocabulary", level: "A2", text: "I need to ___ a table for two people at 8 PM.", options: ["Order", "Book", "Buy", "Keep"], correct: 1 },
  { subject: "Vocabulary", level: "A2", text: "The opposite of 'Expensive' is ___.", options: ["Rich", "Cheap", "Easy", "Fast"], correct: 1 },
  { subject: "Vocabulary", level: "A2", text: "We use a ___ to cut meat.", options: ["Spoon", "Fork", "Knife", "Plate"], correct: 2 },
  { subject: "Vocabulary", level: "A2", text: "I usually ___ my teeth twice a day.", options: ["Wash", "Clean", "Brush", "Comb"], correct: 2 },
  { subject: "Vocabulary", level: "A2", text: "The movie was so ___ that I fell asleep.", options: ["Exciting", "Boring", "Funny", "Scary"], correct: 1 },
  { subject: "Vocabulary", level: "A2", text: "An ___ is a fruit that is usually red or green.", options: ["Orange", "Apple", "Banana", "Grape"], correct: 1 },

  // Grammar
  { subject: "Grammar", level: "A2", text: "I ___ in France before.", options: ["Was", "Went", "Have been", "Had been"], correct: 2 },
  { subject: "Grammar", level: "A2", text: "We have a test next week, so we ___ for it.", options: ["Prepare", "Prepares", "Are preparing", "Prepared"], correct: 2 },
  { subject: "Grammar", level: "A2", text: "I have learned English ___ two years.", options: ["One", "Year", "For", "Since"], correct: 2 },
  { subject: "Grammar", level: "A2", text: "If I have time, I ___ to the cinema.", options: ["Go", "Goes", "Went", "Will go"], correct: 3 },
  { subject: "Grammar", level: "A2", text: "He said he ___ tomorrow.", options: ["Will not come", "Does not come", "Did not come", "Comes"], correct: 0 },
  { subject: "Grammar", level: "A2", text: "I want to ___ a pizza.", options: ["Eat", "Eats", "Eating", "Ate"], correct: 0 },
  { subject: "Grammar", level: "A2", text: "Yesterday we ___ a lot of fun.", options: ["Was", "Were", "Had", "Have"], correct: 2 },
  { subject: "Grammar", level: "A2", text: "I have never ___ to Paris before.", options: ["Go", "Went", "Been", "Going"], correct: 2 },
  { subject: "Grammar", level: "A2", text: "Have you read ___ this book?", options: ["Read", "Reads", "Reading", "Read it"], correct: 3 },
  { subject: "Grammar", level: "A2", text: "We play football every day.", options: ["We play", "You play", "He plays", "They play"], correct: 0 },
  { subject: "Grammar", level: "A2", text: "I think he ___ right.", options: ["Is", "Are", "Was", "Has"], correct: 0 },
  { subject: "Grammar", level: "A2", text: "I ___ tired after the movie.", options: ["Am", "Is", "Are", "Were"], correct: 0 },
  { subject: "Grammar", level: "A2", text: "We went to France two years ago.", options: ["Yes", "No", "Maybe", "Don't know"], correct: 0 },
  { subject: "Grammar", level: "A2", text: "If you want, we ___ together.", options: ["Eat", "Will eat", "Eating", "Ate"], correct: 1 },
  { subject: "Grammar", level: "A2", text: "I don't know when he ___ come.", options: ["Will", "Is", "Do", "Did"], correct: 0 },
  { subject: "Grammar", level: "A2", text: "Yesterday I ___ my friends.", options: ["See", "Saw", "Sees", "Seen"], correct: 1 },
  { subject: "Grammar", level: "A2", text: "Tomorrow we ___ to London.", options: ["Go", "Goes", "Went", "Going"], correct: 0 },
  { subject: "Grammar", level: "A2", text: "I ___ coffee every morning.", options: ["Drink", "Drinks", "Is drinking", "Drank"], correct: 0 },

  // Prepositions & Expressions
  { subject: "Preposition", level: "A2", text: "I am interested ___ music.", options: ["In", "At", "On", "With"], correct: 0 },
  { subject: "Preposition", level: "A2", text: "He often talks ___ his summer holiday.", options: ["About", "In", "On", "With"], correct: 0 },
  { subject: "Preposition", level: "A2", text: "I wait ___ the bus.", options: ["On", "In", "For", "At"], correct: 2 },
  { subject: "Preposition", level: "A2", text: "She is afraid ___ spiders.", options: ["Of", "At", "In", "With"], correct: 0 },
  { subject: "Preposition", level: "A2", text: "Tomorrow we will go ___ the beach.", options: ["To", "In", "At", "On"], correct: 0 },
  { subject: "Preposition", level: "A2", text: "I take care ___ the cat.", options: ["Of", "In", "On", "With"], correct: 0 },
  { subject: "Preposition", level: "A2", text: "He dreams ___ a trip to Japan.", options: ["Of", "On", "To", "At"], correct: 0 },
  { subject: "Preposition", level: "A2", text: "I am excited ___ your visit.", options: ["About", "On", "In", "With"], correct: 0 },
  { subject: "Preposition", level: "A2", text: "Tomorrow we will talk ___ the teacher.", options: ["With", "About", "To", "In"], correct: 1 },
  { subject: "Preposition", level: "A2", text: "I wait ___ the reply.", options: ["For", "At", "In", "On"], correct: 0 },
  { subject: "Preposition", level: "A2", text: "Tomorrow I will go ___ the cinema.", options: ["To", "On", "At", "In"], correct: 0 },
  { subject: "Preposition", level: "A2", text: "Can you help me ___ my homework?", options: ["On", "At", "With", "By"], correct: 2 },
  { subject: "Preposition", level: "A2", text: "We live ___ the school.", options: ["Near", "In", "On", "At"], correct: 0 },
  { subject: "Preposition", level: "A2", text: "On weekends I visit ___ my parents.", options: ["To", "At", "On", "In"], correct: 1 },
  { subject: "Preposition", level: "A2", text: "Yesterday I went ___ the doctor.", options: ["In", "To", "At", "On"], correct: 1 },
  { subject: "Preposition", level: "A2", text: "We speak ___ English and French.", options: ["On", "About", "In", "With"], correct: 3 },
  { subject: "Preposition", level: "A2", text: "I am excited ___ the gift.", options: ["For", "At", "About", "On"], correct: 0 },
  { subject: "Preposition", level: "A2", text: "I went ___ holiday to Spain.", options: ["To", "In", "At", "On"], correct: 0 },
];

const EnglishA2Data = async (typeId: string) => {
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
      `Successfully imported ${formattedQuestions.length} English A2 questions!`,
    );
  } catch (err) {
    console.error("English A2 Import failed:", err);
    process.exit(1);
  }
};

export default EnglishA2Data;