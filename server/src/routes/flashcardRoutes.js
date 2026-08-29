import express from 'express';
import {
  getFlashcardDecks,
  createFlashcardDeck,
  getFlashcardDeck,
  updateFlashcardDeck,
  deleteFlashcardDeck,
  updateCardReview,
  getCardsDue,
  generateFlashcards
} from '../controllers/flashcardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route for flashcard generation (but can save to user deck if authenticated)
router.post('/generate', (req, res, next) => {
  // Optional auth middleware
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, () => generateFlashcards(req, res, next));
  }
  generateFlashcards(req, res, next);
});

// All other routes are protected
router.use(protect);

// Flashcard deck routes
router.route('/')
  .get(getFlashcardDecks)
  .post(createFlashcardDeck);

router.route('/:id')
  .get(getFlashcardDeck)
  .put(updateFlashcardDeck)
  .delete(deleteFlashcardDeck);

// Special routes
router.get('/:id/due', getCardsDue);
router.patch('/:deckId/cards/:cardId/review', updateCardReview);

export default router;