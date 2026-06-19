const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export const pickQuestions = (allQuestions: any[], blueprint: any) => {
  let selectedQuestions: any[] = [];
  const { structure } = blueprint;

  for (const [key, value] of Object.entries(structure)) {
    // CASE 1: Nested Structure (Language: Level -> Subject)
    if (typeof value === "object" && value !== null) {
      for (const [subject, count] of Object.entries(value as any)) {
        const pool = allQuestions.filter(
          (q) => q.level === key && q.subject === subject,
        );
        selectedQuestions.push(...shuffle(pool).slice(0, count as number));
      }
    }
    // CASE 2: Flat Structure (Psychology: Dimension -> Count)
    else {
      const count = value as number;
      const pool = allQuestions.filter(
        (q) => q.dimension === key || q.level === key,
      );
      selectedQuestions.push(...shuffle(pool).slice(0, count));
    }
  }

  return shuffle(selectedQuestions);
};
