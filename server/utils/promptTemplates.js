module.exports = {
  quizPrompt: (topic, level) =>
    `Generate a quiz on ${topic} for a ${level} level student.`,

  learningPlanPrompt: (weaknesses) =>
    `Generate a 7-day learning plan based on weaknesses: ${weaknesses}`,
};
