import mongoose from 'mongoose';

const quizSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Module ID is required']
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
      maxlength: [200, 'Topic cannot exceed 200 characters']
    },
    questions: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Questions are required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Questions must be a non-empty array'
      }
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: []
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be negative'],
      default: 0
    },
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: [1, 'Total must be at least 1'],
      validate: {
        validator: function (v) {
          return v >= this.score;
        },
        message: 'Total must be greater than or equal to score'
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for efficient querying
quizSessionSchema.index({ userId: 1, moduleId: 1 });
quizSessionSchema.index({ userId: 1, createdAt: -1 });
quizSessionSchema.index({ moduleId: 1, createdAt: -1 });

// Virtual for score percentage
quizSessionSchema.virtual('scorePercentage').get(function () {
  return this.total > 0 ? Math.round((this.score / this.total) * 100) : 0;
});

// Virtual for pass/fail status (assuming 60% is passing)
quizSessionSchema.virtual('passed').get(function () {
  return this.scorePercentage >= 60;
});

// Method to calculate and update score
quizSessionSchema.methods.calculateScore = function () {
  if (!Array.isArray(this.questions) || !Array.isArray(this.answers)) {
    return;
  }
  
  let correctAnswers = 0;
  
  this.questions.forEach((question, index) => {
    if (this.answers[index] && question.correctAnswer) {
      if (this.answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    }
  });
  
  this.score = correctAnswers;
  this.total = this.questions.length;
  
  return this.save();
};

const QuizSession = mongoose.model('QuizSession', quizSessionSchema);

export default QuizSession;
