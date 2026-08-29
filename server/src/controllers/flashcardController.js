import FlashcardDeck from '../models/FlashcardDeck.js';
import aiService from '../services/aiService.js';

// @desc    Get all flashcard decks for user
// @route   GET /api/learning/flashcards
// @access  Private
export const getFlashcardDecks = async (req, res, next) => {
  try {
    const { topic, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { userId: req.user.id, isActive: true };
    if (topic) {
      query.topic = new RegExp(topic, 'i');
    }

    // Fetch flashcard decks from database
    const decks = await FlashcardDeck.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await FlashcardDeck.countDocuments(query);

    res.status(200).json({
      success: true,
      data: decks,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: decks.length,
        totalRecords: total
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new flashcard deck
// @route   POST /api/learning/flashcards
// @access  Private
export const createFlashcardDeck = async (req, res, next) => {
  try {
    const { name, description, topic, cards, metadata } = req.body;

    // Validate required fields
    if (!name || !topic) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Name and topic are required',
          status: 400
        }
      });
    }

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'At least one card is required',
          status: 400
        }
      });
    }

    // Create new flashcard deck
    const newDeck = new FlashcardDeck({
      userId: req.user.id,
      name,
      description,
      topic,
      cards,
      metadata: {
        ...metadata,
        totalCards: cards.length
      }
    });

    await newDeck.save();

    res.status(201).json({
      success: true,
      data: {
        deck: newDeck,
        message: 'Flashcard deck created successfully'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific flashcard deck
// @route   GET /api/learning/flashcards/:id
// @access  Private
export const getFlashcardDeck = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deck = await FlashcardDeck.findOne({
      _id: id,
      userId: req.user.id,
      isActive: true
    });

    if (!deck) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Flashcard deck not found',
          status: 404
        }
      });
    }

    res.status(200).json({
      success: true,
      data: deck
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update flashcard deck
// @route   PUT /api/learning/flashcards/:id
// @access  Private
export const updateFlashcardDeck = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const deck = await FlashcardDeck.findOneAndUpdate(
      { _id: id, userId: req.user.id, isActive: true },
      updateData,
      { new: true, runValidators: true }
    );

    if (!deck) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Flashcard deck not found',
          status: 404
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        deck,
        message: 'Flashcard deck updated successfully'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete flashcard deck
// @route   DELETE /api/learning/flashcards/:id
// @access  Private
export const deleteFlashcardDeck = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deck = await FlashcardDeck.findOneAndUpdate(
      { _id: id, userId: req.user.id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!deck) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Flashcard deck not found',
          status: 404
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'Flashcard deck deleted successfully'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update card review (spaced repetition)
// @route   PATCH /api/learning/flashcards/:deckId/cards/:cardId/review
// @access  Private
export const updateCardReview = async (req, res, next) => {
  try {
    const { deckId, cardId } = req.params;
    const { correct } = req.body;

    if (typeof correct !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Correct answer status is required (boolean)',
          status: 400
        }
      });
    }

    const deck = await FlashcardDeck.findOne({
      _id: deckId,
      userId: req.user.id,
      isActive: true
    });

    if (!deck) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Flashcard deck not found',
          status: 404
        }
      });
    }

    // Update card review using the model method
    await deck.updateCardReview(cardId, correct);

    res.status(200).json({
      success: true,
      data: {
        deck,
        message: 'Card review updated successfully'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cards due for review
// @route   GET /api/learning/flashcards/:id/due
// @access  Private
export const getCardsDue = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deck = await FlashcardDeck.findOne({
      _id: id,
      userId: req.user.id,
      isActive: true
    });

    if (!deck) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Flashcard deck not found',
          status: 404
        }
      });
    }

    const cardsDue = deck.getCardsDue();

    res.status(200).json({
      success: true,
      data: {
        cards: cardsDue,
        count: cardsDue.length,
        totalCards: deck.cards.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate flashcards from content
// @route   POST /api/learning/flashcards/generate
// @access  Public (auth optional)
export const generateFlashcards = async (req, res, next) => {
  try {
    const { content, numberOfCards = 5, saveToDeck = false, deckName = null } = req.body;

    // Validate content
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Content is required and must be a non-empty string',
          status: 400
        }
      });
    }

    if (numberOfCards < 1 || numberOfCards > 50) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Number of cards must be between 1 and 50',
          status: 400
        }
      });
    }

    // Generate flashcards using AI
    const result = await aiService.generateFlashcards({
      content: content.trim(),
      numberOfCards: parseInt(numberOfCards)
    });

    // If saveToDeck is true and user is authenticated, save to database
    let deck = null;
    if (saveToDeck && req.user) {
      try {
        const deckData = new FlashcardDeck({
          userId: req.user.id,
          name: deckName || `Generated Flashcards - ${new Date().toLocaleDateString()}`,
          description: `Auto-generated from content on ${new Date().toLocaleString()}`,
          topic: 'Generated',
          cards: result.cards.map((card, idx) => ({
            _id: card.id || `card_${idx}`,
            front: card.front,
            back: card.back,
            difficulty: card.difficulty || 'medium',
            tags: [card.topic || 'generated']
          })),
          metadata: {
            totalCards: result.cards.length,
            generatedBy: 'AI',
            source: 'user-content'
          }
        });

        deck = await deckData.save();
      } catch (dbError) {
        console.error('Error saving deck to database:', dbError);
        // Continue without saving to DB, still return generated cards
      }
    }

    res.status(200).json({
      success: true,
      data: {
        cards: result.cards,
        count: result.count,
        savedDeck: deck ? { id: deck._id, name: deck.name } : null,
        source: result.source,
        note: result.note || undefined
      }
    });
  } catch (error) {
    // Handle AI service unavailable in production (return 503)
    if (error.name === 'AIServiceUnavailableError') {
      return res.status(503).json({
        success: false,
        error: {
          message: error.message,
          status: 503
        }
      });
    }
    next(error);
  }
};