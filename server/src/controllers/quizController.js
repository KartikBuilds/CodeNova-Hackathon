import aiService from '../services/aiService.js';
import QuizSession from '../models/QuizSession.js';

// @desc    Generate a quiz using AI
// @route   POST /api/quiz/generate
// @access  Public (auth optional)
export const generateQuiz = async (req, res, next) => {
  try {
    const { topic, difficulty = 'medium', weaknesses = [], count = 5 } = req.body;

    // Validate required fields
    if (!topic) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Topic is required',
          status: 400
        }
      });
    }

    // Validate count
    if (count < 1 || count > 20) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Question count must be between 1 and 20',
          status: 400
        }
      });
    }

    // Validate difficulty
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Difficulty must be one of: easy, medium, hard',
          status: 400
        }
      });
    }

    // Validate weaknesses is an array
    if (weaknesses && !Array.isArray(weaknesses)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Weaknesses must be an array',
          status: 400
        }
      });
    }

    // Call AI service to generate quiz
    const quiz = await aiService.generateQuiz({
      topic,
      difficulty: difficulty.toLowerCase(),
      weaknesses,
      count: parseInt(count)
    });

    res.status(200).json({
      success: true,
      data: {
        quiz
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz and calculate score
// @route   POST /api/quiz/submit
// @access  Private
export const submitQuiz = async (req, res, next) => {
  try {
    const { 
      quizId, 
      moduleId, 
      topic, 
      answers, 
      original_questions 
    } = req.body;

    // Validate required fields
    if (!topic) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Topic is required',
          status: 400
        }
      });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Answers must be provided as an array',
          status: 400
        }
      });
    }

    if (!original_questions || !Array.isArray(original_questions)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Original questions must be provided as an array',
          status: 400
        }
      });
    }

    if (answers.length !== original_questions.length) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Number of answers must match number of questions',
          status: 400
        }
      });
    }

    // Validate moduleId if provided
    if (moduleId && !moduleId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid module ID format',
          status: 400
        }
      });
    }

    // Calculate score
    let score = 0;
    const total = original_questions.length;
    const details = [];

    original_questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const correctAnswer = question.correct_answer;
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) {
        score++;
      }

      details.push({
        questionId: question.id || `q${index + 1}`,
        question: question.question,
        userAnswer: userAnswer || null,
        correctAnswer: correctAnswer,
        isCorrect,
        explanation: question.explanation || 'No explanation provided'
      });
    });

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    // Create QuizSession document
    const quizSession = await QuizSession.create({
      userId: req.user.id,
      moduleId: moduleId || null,
      topic,
      questions: original_questions,
      answers,
      score,
      total
    });

    res.status(201).json({
      success: true,
      data: {
        sessionId: quizSession._id,
        score,
        total,
        percentage,
        details,
        createdAt: quizSession.createdAt
      }
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: {
          message: error.message,
          status: 400
        }
      });
    }
    next(error);
  }
};

// @desc    Get user's quiz history
// @route   GET /api/quiz/history
// @access  Private
export const getQuizHistory = async (req, res, next) => {
  try {
    const { moduleId, topic, page = 1, limit = 10 } = req.query;

    // Build query filter
    const filter = { userId: req.user.id };

    if (moduleId) {
      // Validate ObjectId
      if (!moduleId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid module ID format',
            status: 400
          }
        });
      }
      filter.moduleId = moduleId;
    }

    if (topic) {
      filter.topic = { $regex: topic, $options: 'i' };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get quiz sessions
    const sessions = await QuizSession.find(filter)
      .select('topic score total moduleId createdAt')
      .populate({
        path: 'moduleId',
        select: 'title courseId',
        populate: {
          path: 'courseId',
          select: 'title domain'
        }
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count
    const total = await QuizSession.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: sessions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: {
        sessions
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz session details
// @route   GET /api/quiz/session/:id
// @access  Private
export const getQuizSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid session ID format',
          status: 400
        }
      });
    }

    // Find quiz session
    const session = await QuizSession.findById(id)
      .populate({
        path: 'moduleId',
        select: 'title courseId',
        populate: {
          path: 'courseId',
          select: 'title domain'
        }
      });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Quiz session not found',
          status: 404
        }
      });
    }

    // Check if session belongs to user
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to access this quiz session',
          status: 403
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        session
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz statistics for user
// @route   GET /api/quiz/stats
// @access  Private
export const getQuizStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all user's quiz sessions
    const sessions = await QuizSession.find({ userId });

    if (sessions.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalQuizzes: 0,
          averageScore: 0,
          totalQuestionsAnswered: 0,
          totalCorrectAnswers: 0
        }
      });
    }

    // Calculate statistics
    const totalQuizzes = sessions.length;
    const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
    const totalQuestions = sessions.reduce((sum, s) => sum + s.total, 0);
    const averageScore = Math.round((totalScore / totalQuestions) * 100);

    res.status(200).json({
      success: true,
      data: {
        totalQuizzes,
        averageScore,
        totalQuestionsAnswered: totalQuestions,
        totalCorrectAnswers: totalScore,
        recentSessions: sessions.slice(-5).reverse().map(s => ({
          id: s._id,
          topic: s.topic,
          score: s.score,
          total: s.total,
          percentage: s.scorePercentage,
          createdAt: s.createdAt
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
