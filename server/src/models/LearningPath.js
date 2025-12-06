import mongoose from 'mongoose';

const learningPathSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
      trim: true,
      maxlength: [100, 'Domain cannot exceed 100 characters']
    },
    path: [
      {
        moduleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Module',
          required: true
        },
        status: {
          type: String,
          enum: {
            values: ['not-started', 'in-progress', 'completed'],
            message: '{VALUE} is not a valid status'
          },
          default: 'not-started',
          lowercase: true
        },
        startedAt: {
          type: Date,
          default: null
        },
        completedAt: {
          type: Date,
          default: null
        }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound index to ensure one learning path per user per domain
learningPathSchema.index({ userId: 1, domain: 1 }, { unique: true });

// Index for efficient querying
learningPathSchema.index({ userId: 1 });

// Virtual for progress percentage
learningPathSchema.virtual('progressPercentage').get(function () {
  if (!this.path || this.path.length === 0) return 0;
  
  const completed = this.path.filter(item => item.status === 'completed').length;
  return Math.round((completed / this.path.length) * 100);
});

// Virtual for total modules
learningPathSchema.virtual('totalModules').get(function () {
  return this.path ? this.path.length : 0;
});

// Virtual for completed modules count
learningPathSchema.virtual('completedModules').get(function () {
  return this.path ? this.path.filter(item => item.status === 'completed').length : 0;
});

// Method to update module status
learningPathSchema.methods.updateModuleStatus = function (moduleId, status) {
  const moduleIndex = this.path.findIndex(
    item => item.moduleId.toString() === moduleId.toString()
  );
  
  if (moduleIndex !== -1) {
    this.path[moduleIndex].status = status;
    
    if (status === 'in-progress' && !this.path[moduleIndex].startedAt) {
      this.path[moduleIndex].startedAt = new Date();
    }
    
    if (status === 'completed') {
      this.path[moduleIndex].completedAt = new Date();
    }
  }
  
  return this.save();
};

const LearningPath = mongoose.model('LearningPath', learningPathSchema);

export default LearningPath;
