import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true
    },
    // Profile setup fields
    primaryDomain: {
      type: String,
      trim: true,
      default: ''
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', ''],
      default: ''
    },
    goals: {
      type: String,
      trim: true,
      maxlength: [1000, 'Goals cannot exceed 1000 characters'],
      default: ''
    },
    // Additional profile fields
    profileImage: {
      type: String, // Store base64 encoded image
      default: ''
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
