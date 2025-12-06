import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: ''
    },
    interests: {
      type: [String],
      default: []
    },
    learningGoals: {
      type: [String],
      default: []
    },
    skillLevel: {
      type: Map,
      of: String, // domain -> skill level
      default: new Map()
    },
    preferences: {
      learningStyle: {
        type: String,
        enum: ['visual', 'auditory', 'reading', 'kinesthetic', ''],
        default: ''
      },
      studyTimePerDay: {
        type: Number,
        min: 0,
        default: 0 // in minutes
      },
      notificationsEnabled: {
        type: Boolean,
        default: true
      }
    },
    stats: {
      totalCoursesCompleted: {
        type: Number,
        default: 0
      },
      totalQuizzesTaken: {
        type: Number,
        default: 0
      },
      averageQuizScore: {
        type: Number,
        default: 0
      },
      totalStudyTime: {
        type: Number,
        default: 0 // in minutes
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for efficient querying
userProfileSchema.index({ userId: 1 });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
