import mongoose from 'mongoose';

const contentItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Content type is required'],
      enum: {
        values: ['video', 'article', 'quiz'],
        message: '{VALUE} is not a valid content type'
      },
      lowercase: true
    },
    provider: {
      type: String,
      required: [true, 'Content provider is required'],
      trim: true,
      maxlength: [100, 'Provider name cannot exceed 100 characters']
    },
    title: {
      type: String,
      required: [true, 'Content title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters']
    },
    url: {
      type: String,
      required: [true, 'Content URL is required'],
      trim: true,
      validate: {
        validator: function (v) {
          // Basic URL validation
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid URL'
      }
    },
    duration: {
      type: Number,
      min: [0, 'Duration must be a positive number'],
      default: null
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true
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
contentItemSchema.index({ type: 1, provider: 1 });
contentItemSchema.index({ tags: 1 });
contentItemSchema.index({ title: 'text' });

// Virtual for formatted duration (in minutes)
contentItemSchema.virtual('durationInMinutes').get(function () {
  return this.duration ? Math.ceil(this.duration / 60) : null;
});

const ContentItem = mongoose.model('ContentItem', contentItemSchema);

export default ContentItem;
