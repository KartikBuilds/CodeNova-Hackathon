exports.generateQuiz = (req, res) => {
  res.json({ message: "Quiz generation working" });
};

exports.submitQuiz = (req, res) => {
  res.json({ message: "Quiz submission working" });
};

exports.getHistory = (req, res) => {
  res.json({ message: "Quiz history working" });
};
