import mongoose from 'mongoose';

const learningPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
      trim: true
    },
    duration: {
      type: String,
      required: [true, 'Duration is required']
    },
    goals: [
      {
        type: String,
        trim: true
      }
    ],
    plan: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Plan content is required']
    },
    metadata: {
      difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'medium'],
        default: 'beginner'
      },
      estimatedHours: {
        type: Number,
        min: [1, 'Estimated hours must be at least 1']
      },
      strengths: [String],
      weaknesses: [String],
      hoursPerDay: {
        type: Number,
        min: [0.5, 'Hours per day must be at least 0.5']
      }
    },
    progress: {
      completedDays: {
        type: [Number],
        default: []
      },
      totalDays: {
        type: Number,
        default: 0
      },
      progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for efficient querying
learningPlanSchema.index({ userId: 1, createdAt: -1 });
learningPlanSchema.index({ userId: 1, domain: 1 });
learningPlanSchema.index({ userId: 1, isActive: 1 });

// Virtual for completion status
learningPlanSchema.virtual('isCompleted').get(function () {
  return this.progress.progressPercentage >= 100;
});

// Method to update progress
learningPlanSchema.methods.updateProgress = function (completedDay) {
  if (!this.progress.completedDays.includes(completedDay)) {
    this.progress.completedDays.push(completedDay);
    this.progress.progressPercentage = Math.round(
      (this.progress.completedDays.length / this.progress.totalDays) * 100
    );
    this.progress.lastUpdated = new Date();
  }
  return this.save();
};

// Method to reset progress
learningPlanSchema.methods.resetProgress = function () {
  this.progress.completedDays = [];
  this.progress.progressPercentage = 0;
  this.progress.lastUpdated = new Date();
  return this.save();
};

const LearningPlan = mongoose.model('LearningPlan', learningPlanSchema);

export default LearningPlan;