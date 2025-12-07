import { useEffect, useMemo, useState } from 'react';
import { flashcardsAPI } from '../api/learningAPI';

const STORAGE_KEY = 'ai-learning-flashcards';
const HOUR_MS = 1000 * 60 * 60;
const DAY_MS = HOUR_MS * 24;

const defaultDeckState = {
  flashcards: [],
  keyConcepts: [],
};

const sanitizeJSON = (raw) => {
  if (!raw) return null;
  const cleaned = raw.replace(/```json|```/gi, '').trim();

  const tryParse = (text) => {
    try {
      return JSON.parse(text);
    } catch (err) {
      return null;
    }
  };

  const direct = tryParse(cleaned);
  if (direct) {
    return direct;
  }

  // Attempt to recover from truncated payloads by dropping the last incomplete card
  const recoveryTarget = cleaned.lastIndexOf('{"question"');
  if (recoveryTarget !== -1) {
    let truncated = cleaned.slice(0, recoveryTarget).replace(/,\s*$/, '');
    const trimmed = truncated.trimEnd();
    if (!trimmed.endsWith(']')) {
      truncated = `${truncated}]`;
    }
    const secondTrim = truncated.trimEnd();
    const repaired = secondTrim.endsWith('}') ? truncated : `${truncated}}`;
    const parsed = tryParse(repaired);
    if (parsed) {
      console.warn('Recovered truncated flashcard payload from Groq. Final card was discarded.');
      return parsed;
    }
  }

  console.error('Failed to parse Groq response', cleaned);
  return null;
};

const createCardModel = (card, index, sourceTitle) => {
  const now = Date.now();
  return {
    id: `${now}-${index}`,
    question: card.question?.trim() || 'Untitled question',
    answer: card.answer?.trim() || 'Answer unavailable',
    hint: card.hint?.trim() || '',
    concept: card.concept?.trim() || card.topic?.trim() || '',
    difficulty: card.difficulty?.toLowerCase() || 'medium',
    mastery: 0,
    repetitions: 0,
    interval: 1,
    easiness: 2.5,
    nextReview: now,
    createdAt: now,
    lastReviewed: null,
    reviewHistory: [],
    sourceTitle,
  };
};

const updateSchedule = (card, grade) => {
  const now = Date.now();
  let easiness = card.easiness ?? 2.5;
  let repetitions = card.repetitions ?? 0;
  let interval = card.interval ?? 1;
  let nextReview = card.nextReview ?? now;

  if (grade < 3) {
    repetitions = 0;
    interval = 1;
    nextReview = now + 4 * HOUR_MS;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 3;
    } else {
      interval = Math.round(interval * easiness);
    }
    easiness = easiness + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (easiness < 1.3) {
      easiness = 1.3;
    }
    nextReview = now + interval * DAY_MS;
  }

  const masteryDelta = grade >= 5 ? 25 : grade === 4 ? 18 : grade === 3 ? 10 : -15;
  const mastery = Math.max(0, Math.min(100, (card.mastery ?? 0) + masteryDelta));

  return {
    ...card,
    easiness,
    repetitions,
    interval,
    nextReview,
    mastery,
    lastReviewed: now,
    reviewHistory: [...(card.reviewHistory ?? []), { grade, reviewedAt: now }],
  };
};

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'Not scheduled';
  const delta = timestamp - Date.now();
  if (delta <= 0) return 'Due now';
  const days = Math.floor(delta / DAY_MS);
  if (days > 0) return `${days} day${days === 1 ? '' : 's'}`;
  const hours = Math.floor(delta / HOUR_MS);
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'}`;
  const minutes = Math.floor(delta / (1000 * 60));
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  return 'Soon';
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Flashcards = () => {
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [numberOfCards, setNumberOfCards] = useState(8);
  const [flashcards, setFlashcards] = useState([]);
  const [keyConcepts, setKeyConcepts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    loadExistingFlashcards();
  }, []);

  const loadExistingFlashcards = async () => {
    // Load from database first
    try {
      const response = await flashcardsAPI.getDecks();
      const decks = response.data || response || [];
      
      if (Array.isArray(decks) && decks.length > 0) {
        const allCards = [];
        const allConcepts = [];
        
        decks.forEach(deck => {
          if (deck.flashcards && Array.isArray(deck.flashcards)) {
            allCards.push(...deck.flashcards);
          }
          if (deck.keyConcepts && Array.isArray(deck.keyConcepts)) {
            allConcepts.push(...deck.keyConcepts);
          }
        });
        
        setFlashcards(allCards);
        setKeyConcepts([...new Set(allConcepts)]); // Remove duplicates
        return; // Successfully loaded from database
      }
    } catch (err) {
      console.log('No flashcard decks found in database, checking localStorage');
    }

    // Fallback to localStorage
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFlashcards(parsed.flashcards ?? defaultDeckState.flashcards);
        setKeyConcepts(parsed.keyConcepts ?? defaultDeckState.keyConcepts);
      }
    } catch (err) {
      console.error('Failed to restore flashcards', err);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const payload = JSON.stringify({ flashcards, keyConcepts });
      window.localStorage.setItem(STORAGE_KEY, payload);
    } catch (err) {
      console.error('Failed to persist flashcards', err);
    }
  }, [flashcards, keyConcepts]);

  const dueFlashcards = useMemo(() => {
    const now = Date.now();
    return flashcards
      .filter((card) => (card.nextReview ?? 0) <= now)
      .sort((a, b) => (a.nextReview ?? 0) - (b.nextReview ?? 0));
  }, [flashcards]);

  const averageMastery = useMemo(() => {
    if (!flashcards.length) return 0;
    const total = flashcards.reduce((sum, card) => sum + (card.mastery ?? 0), 0);
    return Math.round(total / flashcards.length);
  }, [flashcards]);

  const currentReviewCard = reviewMode && reviewQueue.length
    ? flashcards.find((card) => card.id === reviewQueue[Math.min(activeIndex, reviewQueue.length - 1)])
    : null;

  const handleGenerate = async () => {
    if (!sourceText.trim()) {
      setError('Paste some content or notes to generate flashcards.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer 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`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          temperature: 0.4,
          max_tokens: 1500,
          messages: [
            {
              role: 'system',
              content: 'You are an expert instructional designer who creates flashcards using spaced repetition best practices. Always respond with minified JSON only.',
            },
            {
              role: 'user',
              content: `Create ${numberOfCards} flashcards from the content below. Return strictly valid JSON following this schema:
{
  "keyConcepts": ["concept"...],
  "flashcards": [
    {
      "question": "",
      "answer": "",
      "concept": "",
      "difficulty": "beginner | intermediate | advanced",
      "hint": "optional short recall hint"
    }
  ]
}
Prioritize concise questions, step-by-step answers, and actionable hints.
Content title: ${sourceTitle || 'Untitled Resource'}
Content:\n${sourceText.trim()}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to reach Groq.');
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content;
      const parsed = sanitizeJSON(raw);

      if (!parsed || !Array.isArray(parsed.flashcards)) {
        throw new Error('The AI response was incomplete. Try again or request fewer flashcards.');
      }

      const cards = parsed.flashcards.map((card, index) => createCardModel(card, index, sourceTitle.trim()));
      const newConcepts = Array.isArray(parsed.keyConcepts) ? parsed.keyConcepts.filter(Boolean) : [];

      // Save deck to database
      try {
        const deckData = {
          title: sourceTitle.trim() || 'Untitled Deck',
          description: `Generated from ${sourceTitle || 'content'} - ${cards.length} cards`,
          sourceTitle: sourceTitle.trim(),
          keyConcepts: newConcepts,
          flashcards: cards,
          createdAt: new Date().toISOString()
        };
        
        const savedDeck = await flashcardsAPI.createDeck(deckData);
        console.log('Flashcard deck saved to database:', savedDeck);
      } catch (saveErr) {
        console.error('Failed to save flashcard deck to database:', saveErr);
        // Continue anyway - user still sees the flashcards
      }

      setFlashcards((prev) => [...cards, ...prev]);
      setKeyConcepts((prev) => {
        const merged = [...prev];
        newConcepts.forEach((concept) => {
          if (!merged.some((item) => item.toLowerCase() === concept.toLowerCase())) {
            merged.push(concept);
          }
        });
        return merged.slice(0, 40);
      });

      setSourceText('');
      setSourceTitle('');
      setReviewMode(false);
      setReviewQueue([]);
      setActiveIndex(0);
      setShowAnswer(false);
    } catch (err) {
      console.error('Flashcard generation failed', err);
      setError(err.message || 'Generation failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const startReview = () => {
    if (!dueFlashcards.length) {
      setError('No flashcards are due yet. Generate new cards or wait until review time.');
      return;
    }
    setError('');
    setReviewMode(true);
    setReviewQueue(dueFlashcards.map((card) => card.id));
    setActiveIndex(0);
    setShowAnswer(false);
  };

  const exitReview = () => {
    setReviewMode(false);
    setReviewQueue([]);
    setActiveIndex(0);
    setShowAnswer(false);
  };

  const handleGrade = (grade) => {
    if (!currentReviewCard) {
      exitReview();
      return;
    }

    const updatedCard = updateSchedule(currentReviewCard, grade);

    setFlashcards((prev) => prev.map((card) => (card.id === updatedCard.id ? updatedCard : card)));

    setReviewQueue((prev) => {
      if (grade < 3) {
        return [...prev, updatedCard.id];
      }
      return prev;
    });

    setShowAnswer(false);
    setActiveIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (!reviewMode) return;
    if (activeIndex >= reviewQueue.length) {
      exitReview();
    }
  }, [activeIndex, reviewMode, reviewQueue.length]);

  const masteryBuckets = useMemo(() => {
    const buckets = { novice: 0, learning: 0, proficient: 0, master: 0 };
    flashcards.forEach((card) => {
      const score = card.mastery ?? 0;
      if (score >= 80) buckets.master += 1;
      else if (score >= 60) buckets.proficient += 1;
      else if (score >= 40) buckets.learning += 1;
      else buckets.novice += 1;
    });
    return buckets;
  }, [flashcards]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Flashcard Studio</h1>
            <p className="text-slate-500 mt-1">Turn any content into AI-powered flashcards with smart review scheduling.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-400">Due today</p>
              <p className="text-lg font-semibold text-indigo-600">{dueFlashcards.length}</p>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-400">Avg mastery</p>
              <p className="text-lg font-semibold text-indigo-600">{averageMastery}%</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[2fr,3fr] gap-6">
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Content Intake</h2>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Cards</span>
                    <input
                      type="number"
                      min="4"
                      max="20"
                      value={numberOfCards}
                      onChange={(event) => setNumberOfCards(Number(event.target.value))}
                      className="w-16 px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={sourceTitle}
                  onChange={(event) => setSourceTitle(event.target.value)}
                  placeholder="Optional title or topic"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
                <textarea
                  value={sourceText}
                  onChange={(event) => setSourceText(event.target.value)}
                  placeholder="Paste lecture notes, article text, or summaries..."
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
                />
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating flashcards...
                    </>
                  ) : (
                    <>
                      <span>Generate flashcards</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5h8" />
                      </svg>
                    </>
                  )}
                </button>
                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Key Concepts</h2>
                <span className="text-xs text-slate-400 uppercase tracking-wide">{keyConcepts.length} tracked</span>
              </div>
              {keyConcepts.length ? (
                <div className="flex flex-wrap gap-2">
                  {keyConcepts.map((concept) => (
                    <span
                      key={concept}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Generate flashcards to see extracted key concepts here.</p>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Mastery Snapshot</h2>
                <span className="text-xs text-slate-400 uppercase tracking-wide">{flashcards.length} cards</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <p className="text-xs text-slate-400 uppercase">Novice</p>
                  <p className="mt-1 text-xl font-semibold text-slate-600">{masteryBuckets.novice}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-blue-50/60 p-3">
                  <p className="text-xs text-slate-400 uppercase">Building</p>
                  <p className="mt-1 text-xl font-semibold text-slate-600">{masteryBuckets.learning}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-green-50/60 p-3">
                  <p className="text-xs text-slate-400 uppercase">Proficient</p>
                  <p className="mt-1 text-xl font-semibold text-slate-600">{masteryBuckets.proficient}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-indigo-50/60 p-3">
                  <p className="text-xs text-slate-400 uppercase">Master</p>
                  <p className="mt-1 text-xl font-semibold text-slate-600">{masteryBuckets.master}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Review Queue</h2>
                  <p className="text-sm text-slate-500">{dueFlashcards.length ? 'Ready when you are. Start a session to keep recall strong.' : 'All caught up for now.'}</p>
                </div>
                <button
                  onClick={reviewMode ? exitReview : startReview}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    dueFlashcards.length
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-500/30'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  } ${reviewMode ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : ''}`}
                  disabled={!dueFlashcards.length && !reviewMode}
                >
                  {reviewMode ? 'End session' : 'Start review'}
                </button>
              </div>

              {reviewMode && currentReviewCard ? (
                <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-indigo-50 p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wide">
                    <span>{currentReviewCard.concept || 'General concept'}</span>
                    <span>Due {formatRelativeTime(currentReviewCard.nextReview)}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-slate-900">{currentReviewCard.question}</h3>
                    <button
                      onClick={() => setShowAnswer((prev) => !prev)}
                      className="text-sm text-indigo-600 font-semibold"
                    >
                      {showAnswer ? 'Hide answer' : 'Reveal answer'}
                    </button>
                    {showAnswer && (
                      <div className="bg-white border border-indigo-100 rounded-xl p-4 text-slate-700 text-sm leading-relaxed">
                        <p>{currentReviewCard.answer}</p>
                        {currentReviewCard.hint && (
                          <p className="mt-3 text-xs text-slate-500">Hint: {currentReviewCard.hint}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => handleGrade(1)}
                      className="px-3 py-2 rounded-lg bg-red-100 text-red-600 text-sm font-semibold"
                    >
                      Again
                    </button>
                    <button
                      onClick={() => handleGrade(3)}
                      className="px-3 py-2 rounded-lg bg-orange-100 text-orange-600 text-sm font-semibold"
                    >
                      Hard
                    </button>
                    <button
                      onClick={() => handleGrade(4)}
                      className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-600 text-sm font-semibold"
                    >
                      Good
                    </button>
                    <button
                      onClick={() => handleGrade(5)}
                      className="px-3 py-2 rounded-lg bg-indigo-100 text-indigo-600 text-sm font-semibold"
                    >
                      Easy
                    </button>
                  </div>
                  <div className="text-xs text-slate-400 text-right">Card {Math.min(activeIndex + 1, reviewQueue.length)} of {reviewQueue.length}</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {dueFlashcards.slice(0, 5).map((card) => (
                    <div key={card.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                      <div className="mt-1">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
                          {card.concept ? card.concept[0]?.toUpperCase() : '#'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">{card.question}</h3>
                        <p className="text-xs text-slate-500 mt-1">Next review: {formatDateTime(card.nextReview)}</p>
                      </div>
                      <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-200 text-slate-600 capitalize">{card.difficulty}</span>
                    </div>
                  ))}
                  {!dueFlashcards.length && (
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
                      You have no cards due right now. Keep generating new flashcards or come back later for spaced review.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Flashcard Library</h2>
                <span className="text-xs text-slate-400 uppercase tracking-wide">{flashcards.length} total</span>
              </div>
              {flashcards.length ? (
                <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
                  {flashcards.map((card) => (
                    <div key={card.id} className="border border-slate-200 rounded-xl p-4 hover:border-indigo-200 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-slate-500">
                        <span className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-semibold capitalize">
                          {card.difficulty}
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600">Mastery {card.mastery}%</span>
                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600">Next {formatRelativeTime(card.nextReview)}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">{card.question}</h3>
                      <p className="text-sm text-slate-600 line-clamp-3">{card.answer}</p>
                      {card.sourceTitle && (
                        <p className="mt-3 text-xs text-slate-400">Source: {card.sourceTitle}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Generate your first deck to build a spaced repetition plan tailored to you.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
