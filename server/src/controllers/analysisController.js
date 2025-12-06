import aiService from '../services/aiService.js';

// @desc    Analyze quiz performance using AI
// @route   POST /api/analysis/performance
// @access  Private
export const analyzePerformance = async (req, res, next) => {
  try {
    const { topic, difficulty, questions } = req.body;

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

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Questions must be provided as an array',
          status: 400
        }
      });
    }

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'At least one question must be provided',
          status: 400
        }
      });
    }

    // Validate each question has required fields
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.id || !q.question || !q.correct_answer) {
        return res.status(400).json({
          success: false,
          error: {
            message: `Question ${i + 1} is missing required fields (id, question, correct_answer)`,
            status: 400
          }
        });
      }
    }

    // Calculate score and total
    let score = 0;
    const total = questions.length;
    const answers = [];

    questions.forEach(q => {
      const isCorrect = q.selected_answer === q.correct_answer;
      if (isCorrect) {
        score++;
      }
      answers.push(q.selected_answer);
    });

    // Prepare results for AI analysis
    const resultsJson = {
      topic,
      difficulty: difficulty || 'medium',
      score,
      total,
      questions,
      answers
    };

    // Call AI service for analysis
    const analysis = await aiService.analyzePerformance(resultsJson);

    res.status(200).json({
      success: true,
      data: {
        analysis,
        userId: req.user.id,
        analyzedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get performance trends over time
// @route   GET /api/analysis/trends
// @access  Private
export const getPerformanceTrends = async (req, res, next) => {
  try {
    const { topic, timeframe = '30d' } = req.query;

    // This would typically fetch QuizSession data and analyze trends
    // For now, return a placeholder response
    res.status(200).json({
      success: true,
      data: {
        message: 'Performance trends analysis coming soon',
        topic,
        timeframe,
        note: 'Will analyze quiz sessions to show improvement over time'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get strengths and weaknesses summary
// @route   GET /api/analysis/summary
// @access  Private
export const getAnalysisSummary = async (req, res, next) => {
  try {
    const { domain } = req.query;

    // This would aggregate data from multiple quiz sessions
    // For now, return a placeholder response
    res.status(200).json({
      success: true,
      data: {
        message: 'Analysis summary coming soon',
        domain,
        note: 'Will aggregate strengths and weaknesses from all quiz sessions'
      }
    });
  } catch (error) {
    next(error);
  }
};
