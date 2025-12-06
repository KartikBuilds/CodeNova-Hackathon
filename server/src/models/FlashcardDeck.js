import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema(
  {
    front: {
      type: String,
      required: [true, 'Front content is required'],
      trim: true,
      maxlength: [500, 'Front content cannot exceed 500 characters']
    },
    back: {
      type: String,
      required: [true, 'Back content is required'],
      trim: true,
      maxlength: [1000, 'Back content cannot exceed 1000 characters']
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    reviewCount: {
      type: Number,
      default: 0,
      min: 0
    },
    correctCount: {
      type: Number,
      default: 0,
      min: 0
    },
    lastReviewed: {
      type: Date,
      default: null
    },
    nextReview: {
      type: Date,
      default: Date.now
    },
    interval: {
      type: Number,
      default: 1, // days
      min: 1
    },
    easeFactor: {
      type: Number,
      default: 2.5,
      min: 1.3
    }
  },
  {
    timestamps: true
  }
);

const flashcardDeckSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    name: {
      type: String,
      required: [true, 'Deck name is required'],
      trim: true,
      maxlength: [100, 'Deck name cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true
    },
    cards: [flashcardSchema],
    metadata: {
      totalCards: {
        type: Number,
        default: 0
      },
      studiedToday: {
        type: Number,
        default: 0
      },
      averageScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'medium'],
        default: 'beginner'
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
flashcardDeckSchema.index({ userId: 1, createdAt: -1 });
flashcardDeckSchema.index({ userId: 1, topic: 1 });
flashcardDeckSchema.index({ userId: 1, isActive: 1 });

// Update total cards count when cards are modified
flashcardDeckSchema.pre('save', function (next) {
  this.metadata.totalCards = this.cards.length;
  
  // Calculate average score
  if (this.cards.length > 0) {
    const cardsWithReviews = this.cards.filter(card => card.reviewCount > 0);
    if (cardsWithReviews.length > 0) {
      const avgScore = cardsWithReviews.reduce((sum, card) => {
        return sum + ((card.correctCount / card.reviewCount) * 100);
      }, 0) / cardsWithReviews.length;
      this.metadata.averageScore = Math.round(avgScore);
    }
  }
  
  next();
});

// Virtual for cards due for review
flashcardDeckSchema.virtual('cardsDue').get(function () {
  const now = new Date();
  return this.cards.filter(card => card.nextReview <= now).length;
});

// Method to get cards due for review
flashcardDeckSchema.methods.getCardsDue = function () {
  const now = new Date();
  return this.cards.filter(card => card.nextReview <= now);
};

// Method to update card review
flashcardDeckSchema.methods.updateCardReview = function (cardId, correct) {
  const card = this.cards.id(cardId);
  if (card) {
    card.reviewCount += 1;
    card.lastReviewed = new Date();
    
    if (correct) {
      card.correctCount += 1;
      // Increase interval using spaced repetition algorithm
      card.interval = Math.ceil(card.interval * card.easeFactor);
      card.easeFactor = Math.max(1.3, card.easeFactor + 0.1);
    } else {
      // Reset interval and decrease ease factor
      card.interval = 1;
      card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);
    }
    
    // Calculate next review date
    card.nextReview = new Date(Date.now() + card.interval * 24 * 60 * 60 * 1000);
  }
  return this.save();
};

const FlashcardDeck = mongoose.model('FlashcardDeck', flashcardDeckSchema);

export default FlashcardDeck;