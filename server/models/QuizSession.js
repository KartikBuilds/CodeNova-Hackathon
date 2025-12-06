const mongoose = require("mongoose");

const QuizSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // improves query speed on dashboard
    },

    moduleId: {
      type: String, // optional: if you use module-based learning
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    // AI-generated questions
    questions: [
      {
        question: { type: String, required: true },
        options: { type: Array, required: true },
        correctAnswer: { type: String }, // optional: store correct key
      },
    ],

    // User answer submissions
    userAnswers: [
      {
        questionId: Number,
        answer: String,
      },
    ],

    // Performance metrics
    score: { type: Number, default: 0 },

    strengths: { type: [String], default: [] },

    weaknesses: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizSession", QuizSessionSchema);
