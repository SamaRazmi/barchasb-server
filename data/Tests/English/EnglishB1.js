const Question = require('../../../models/Question');

const questionsData = [
    // Vocabulary
    { subject: "Vocabulary", level: "B1", text: "I want to buy a ___ car because mine is too old.", options: ["House", "Book", "Chair", "Reliable"], correct: 3 },
    { subject: "Vocabulary", level: "B1", text: "I usually have a light ___ before going to work.", options: ["Breakfast", "Lunch", "Dinner", "Snack"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "Yesterday I watched an interesting ___ about nature on TV.", options: ["Book", "Documentary", "Dog", "Table"], correct: 1 },
    { subject: "Vocabulary", level: "B1", text: "I like to read ___ before I go to sleep.", options: ["Newspapers", "Book", "A book", "Articles"], correct: 2 },
    { subject: "Vocabulary", level: "B1", text: "I want to learn ___ about traditional Italian cooking.", options: ["In", "To","More", "For"], correct: 2 },
    { subject: "Vocabulary", level: "B1", text: "We had to ___ off the meeting because the manager was sick.", options: ["Put", "Call", "Take", "Set"], correct: 1 },
    { subject: "Vocabulary", level: "B1", text: "I need to ___ up a hobby to stay active during the winter.", options: ["Take", "Get", "Make", "Give"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "She decided to ___ for the job even though she lacked experience.", options: ["Request", "Apply", "Demand", "Ask"], correct: 1 },
    { subject: "Vocabulary", level: "B1", text: "The company decided to ___ a new product next month.", options: ["Launch", "Start", "Begin", "Open"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "I can't ___ to buy that laptop; it's far too expensive.", options: ["Pay", "Spend", "Afford", "Cost"], correct: 2 },
    { subject: "Vocabulary", level: "B1", text: "He has a very busy ___, so he rarely has time for lunch.", options: ["Timing", "Schedule", "Calendar", "Routine"], correct: 1 },
    { subject: "Vocabulary", level: "B1", text: "You need to provide a ___ to show you have worked elsewhere.", options: ["Reference", "Report", "Result", "Requirement"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "The training course was very ___; I learned many new skills.", options: ["Useful", "Useless", "Used", "Using"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "What is the ___ for entering this competition?", options: ["Fee", "Price", "Cost", "Value"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "The hotel was quite ___, but it was clean and near the center.", options: ["Traditional", "Ordinary", "Average", "Ancient"], correct: 1 },
    { subject: "Vocabulary", level: "B1", text: "The view from the top of the mountain was absolutely ___.", options: ["Breathtaking", "Tiring", "Breathless", "Standard"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "We were delayed because of a heavy traffic ___ on the highway.", options: ["Block", "Crowd", "Jam", "Stop"], correct: 2 },
    { subject: "Vocabulary", level: "B1", text: "Is there a direct ___ from London to Paris?", options: ["Flight", "Flying", "Fly", "Flew"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "I was very ___ when I heard the news about their accident.", options: ["Shocked", "Excited", "Pleasant", "Interested"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "She is a very ___ person; she always helps everyone.", options: ["Generous", "Greedy", "Selfish", "Serious"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "It's ___ to tip the waiter in this country.", options: ["Regular", "Common", "Customary", "Habit"], correct: 2 },
    { subject: "Vocabulary", level: "B1", text: "He didn't mean to ___ you; he was just joking.", options: ["Offend", "Offer", "Oppose", "Occur"], correct: 0 },
    { subject: "Vocabulary", level: "B1", text: "There is no ___ that he stole the money.", options: ["Reason", "Evidence", "Account", "Fact"], correct: 1 },
    { subject: "Vocabulary", level: "B1", text: "Technology has ___ rapidly in the last decade.", options: ["Increased", "Developed", "Grown", "Expanded"], correct: 1 },
    { subject: "Vocabulary", level: "B1", text: "I'll give you a ___ if you help me with this project.", options: ["Reward", "Award", "Present", "Prize"], correct: 0 },
    
    // Grammar
    { subject: "Grammar", level: "B1", text: "If my brother comes, we ___ to the cinema together.", options: ["Go", "Will go", "Went", "Goes"], correct: 1 },
    { subject: "Grammar", level: "B1", text: "I don’t know exactly ___ called you yesterday.", options: ["When", "If", "How","Who"], correct: 3 },
    { subject: "Grammar", level: "B1", text: "I think he ___ right about the solution.", options: ["Is", "Was", "Will be", "Has"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "Yesterday I ___ for a long time with my friends.", options: ["Talk","Talked", "Talking", "Talks"], correct: 1 },
    { subject: "Grammar", level: "B1", text: "Have you finished reading ___ this book yet?", options: ["You", "This", "The", "It"], correct: 3 },
    { subject: "Grammar", level: "B1", text: "We ___ football every Sunday in the park.", options: ["Play", "Plays", "Playing", "Played"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "I am sure he ___ the correct answer to your question.", options: ["Know", "Knew", "Knows", "Known"], correct: 2 },
    { subject: "Grammar", level: "B1", text: "I hope the weather ___ pleasant tomorrow.", options: ["Will be", "Is", "Was", "Be"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "Yesterday I ___ my old friends in the park by chance.", options: ["See", "Meeting", "Met", "Saw"], correct: 2 },
    { subject: "Grammar", level: "B1", text: "If I arrive early, I ___ the start of the match.", options: ["Watch", "Watched", "Watches", "Will watch"], correct: 3 },
    { subject: "Grammar", level: "B1", text: "I don’t know exactly ___ I can finish this task.", options: ["How", "When", "If", "What"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "I asked him if he could ___ it to me.", options: ["Explain", "Him", "Us", "He"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "I am confident that he ___ the exam.", options: ["Passes", "Passed","Will pass", "Has passed"], correct: 2 },
    { subject: "Grammar", level: "B1", text: "If I had more time, I ___ the project more carefully.", options: ["Could complete", "Complete", "Will complete", "Completed"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "I am sure ___ the information provided is correct.", options: ["That", "On", "About", "In"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "If you study hard, you ___ pass the final exam easily.", options: ["Was", "Will", "Would", "Do"], correct: 1 },
    { subject: "Grammar", level: "B1", text: "Can you explain ___ the main point of the lesson?", options: ["Me", "In", "On", "At"], correct: 0 },
    { subject: "Grammar", level: "B1", text: "I don’t know exactly how to ___ this problem.", options: ["When", "If", "What", "Solve"], correct: 3 },

    // Prepositions & Expressions
    { subject: "Preposition", level: "B1", text: "We plan to go ___ a trip next summer.", options: ["To", "At", "In", "On",], correct: 3 },
    { subject: "Preposition", level: "B1", text: "I am very interested ___ current international politics.", options: ["On", "At", "In", "With"], correct: 2 },
    { subject: "Preposition", level: "B1", text: "He often talks ___ his experiences while living abroad.", options: ["About", "In", "On", "With"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "We will speak ___ the teacher about the results tomorrow.", options: ["With", "About", "To", "In"], correct: 2 },
    { subject: "Preposition", level: "B1", text: "I remember many things ___ my childhood.", options: ["From", "Of", "In", "On"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "I often dream ___ traveling around the whole world.", options: ["About", "To", "On", "Of"], correct: 3 },
    { subject: "Preposition", level: "B1", text: "She is extremely proud ___ her daughter's success.", options: ["Of", "On", "With", "In"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "It is important to take care ___ the environment.", options: ["On", "In", "Of", "With"], correct: 2 },
    { subject: "Preposition", level: "B1", text: "If it rains, we will have to stay ___ home.", options: ["At", "On", "In", "By"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "I am really excited ___ your upcoming visit.", options: ["About", "On", "In", "At"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "I have always been interested ___ learning new languages.", options: ["In", "On", "At", "Of"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "Could you help me ___ this difficult exercise?", options: ["On", "With", "At", "For"], correct: 1 },
    { subject: "Preposition", level: "B1", text: "He is responsible ___ managing the new project.", options: ["In", "At", "On", "For"], correct: 3 },
    { subject: "Preposition", level: "B1", text: "I am interested ___ learning several foreign languages.", options: ["In", "At", "On", "With"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "Tomorrow we will go ___ the local market to buy fruit.", options: ["To", "In", "On", "At"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "We need to talk ___ the new project with the manager.", options: ["About", "On", "In", "At"], correct: 0 },
    { subject: "Preposition", level: "B1", text: "We are all responsible ___ following the safety rules.", options: ["For", "About", "In", "On"], correct: 0 }
];

const EnglishB1Data = async (typeId) => {
    try {
        // Prepare and Insert Questions
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
        console.log(`Successfully imported ${formattedQuestions.length} English B1 questions!`);
    } catch (err) {
        console.error("English B1 Import failed:", err);
        process.exit(1);
    }
}

// EnglishB1Data();
module.exports = EnglishB1Data;