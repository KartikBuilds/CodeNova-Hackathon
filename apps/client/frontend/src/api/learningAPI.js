import { api } from './apiClient';

/**
 * Learning Plans API methods
 */
export const learningPlansAPI = {
  // Get all learning plans for the user
  getPlans: async () => {
    const response = await api.get('/learning/plans');
    return response.data;
  },

  // Create a new learning plan
  createPlan: async (planData) => {
    const response = await api.post('/learning/plans', planData);
    return response.data;
  },

  // Update a learning plan
  updatePlan: async (planId, planData) => {
    const response = await api.put(`/learning/plans/${planId}`, planData);
    return response.data;
  },

  // Delete a learning plan
  deletePlan: async (planId) => {
    const response = await api.delete(`/learning/plans/${planId}`);
    return response.data;
  },
};

/**
 * Flashcards API methods
 */
export const flashcardsAPI = {
  // Get all flashcard decks for the user
  getDecks: async () => {
    const response = await api.get('/learning/flashcards');
    return response.data;
  },

  // Create a new flashcard deck
  createDeck: async (deckData) => {
    const response = await api.post('/learning/flashcards', deckData);
    return response.data;
  },

  // Update flashcard deck
  updateDeck: async (deckId, deckData) => {
    const response = await api.put(`/learning/flashcards/${deckId}`, deckData);
    return response.data;
  },

  // Delete a flashcard deck
  deleteDeck: async (deckId) => {
    const response = await api.delete(`/learning/flashcards/${deckId}`);
    return response.data;
  },

  // Update card progress (for spaced repetition)
  updateCardProgress: async (deckId, cardId, progressData) => {
    const response = await api.put(`/learning/flashcards/${deckId}/cards/${cardId}/progress`, progressData);
    return response.data;
  },
};

export default { learningPlansAPI, flashcardsAPI };