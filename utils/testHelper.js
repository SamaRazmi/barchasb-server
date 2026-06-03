const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

exports.pickQuestions = (allQuestions, blueprint) => {
    let selectedQuestions = [];
    const { structure } = blueprint;

    for (const [key, value] of Object.entries(structure)) {
        
        // CASE 1: Nested Structure (Language: Level -> Subject)
        if (typeof value === 'object' && value !== null) {
            for (const [subject, count] of Object.entries(value)) {
                const pool = allQuestions.filter(q => q.level === key && q.subject === subject);
                selectedQuestions.push(...shuffle(pool).slice(0, count));
            }
        } 
        
        // CASE 2: Flat Structure (Psychology: Dimension -> Count)
        else {
            const count = value;
            // Filter by dimension (Gardner) or level (Bar-On/General)
            const pool = allQuestions.filter(q => q.dimension === key || q.level === key);
            selectedQuestions.push(...shuffle(pool).slice(0, count));
        }
    }

    return shuffle(selectedQuestions);
};