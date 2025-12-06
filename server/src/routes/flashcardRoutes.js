import express from 'express';
import { 
  getFlashcardDecks,
  createFlashcardDeck,
  getFlashcardDeck,
  updateFlashcardDeck,
  deleteFlashcardDeck,
  updateCardReview,
  getCardsDue
} from '../controllers/flashcardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
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