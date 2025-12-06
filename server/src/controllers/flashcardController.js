import FlashcardDeck from '../models/FlashcardDeck.js';

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