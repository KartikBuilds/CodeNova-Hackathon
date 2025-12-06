import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    domain: {
      type: String,
      required: [true, 'Course domain is required'],
      trim: true,
      maxlength: [100, 'Domain cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    level: {
      type: String,
      required: [true, 'Course level is required'],
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: '{VALUE} is not a valid level'
      },
      lowercase: true
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
courseSchema.index({ domain: 1, level: 1 });
courseSchema.index({ title: 'text', description: 'text' });

// Virtual for module count
courseSchema.virtual('moduleCount').get(function () {
  return this.modules ? this.modules.length : 0;
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
