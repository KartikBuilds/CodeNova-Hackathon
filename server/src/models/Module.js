import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required']
    },
    order: {
      type: Number,
      required: [true, 'Module order is required'],
      min: [0, 'Order must be a positive number']
    },
    contentItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContentItem'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound index to ensure unique module order within a course
moduleSchema.index({ courseId: 1, order: 1 }, { unique: true });

// Index for efficient querying
moduleSchema.index({ courseId: 1 });

// Virtual for content item count
moduleSchema.virtual('contentItemCount').get(function () {
  return this.contentItems ? this.contentItems.length : 0;
});

const Module = mongoose.model('Module', moduleSchema);

export default Module;
