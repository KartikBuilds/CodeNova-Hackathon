import aiService from '../services/aiService.js';

// @desc    Chat with AI tutor
// @route   POST /api/tutor/chat
// @access  Public (auth optional)
export const chat = async (req, res, next) => {
  try {
    const { message, context = {} } = req.body;

    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Message is required and must be a non-empty string',
          status: 400
        }
      });
    }

    // Validate message length
    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Message cannot exceed 2000 characters',
          status: 400
        }
      });
    }

    // Validate context if provided
    if (context && typeof context !== 'object') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Context must be an object',
          status: 400
        }
      });
    }

    // Prepare context with user info if authenticated
    const chatContext = {
      ...context,
      topic: context.topic || 'general',
      history: context.history || [],
      conversationId: context.conversationId || null,
      userId: req.user?.id || null,
      userProfile: req.user ? {
        name: req.user.name,
        email: req.user.email
      } : null
    };

    // Call AI service for tutor chat
    const tutorResponse = await aiService.tutorChat(message.trim(), chatContext);

    res.status(200).json({
      success: true,
      data: {
        response: tutorResponse.message,
        suggestions: tutorResponse.suggestions || [],
        conversationId: tutorResponse.conversationId,
        timestamp: tutorResponse.timestamp
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat history for authenticated user
// @route   GET /api/tutor/history
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    const { conversationId, limit = 50 } = req.query;

    // This would fetch chat history from database
    // For now, return a placeholder response
    res.status(200).json({
      success: true,
      data: {
        message: 'Chat history retrieval coming soon',
        conversationId,
        limit: parseInt(limit),
        note: 'Will store and retrieve conversation history for authenticated users'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start a new conversation topic
// @route   POST /api/tutor/conversation
// @access  Public (auth optional)
export const startConversation = async (req, res, next) => {
  try {
    const { topic, initialMessage } = req.body;

    // Validate topic
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Topic is required',
          status: 400
        }
      });
    }

    // Generate conversation ID
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // If initial message provided, get tutor response
    let tutorResponse = null;
    if (initialMessage) {
      const chatContext = {
        topic: topic.trim(),
        history: [],
        conversationId,
        userId: req.user?.id || null
      };

      tutorResponse = await aiService.tutorChat(initialMessage.trim(), chatContext);
    }

    res.status(201).json({
      success: true,
      data: {
        conversationId,
        topic: topic.trim(),
        response: tutorResponse ? tutorResponse.message : null,
        suggestions: tutorResponse ? tutorResponse.suggestions : [
          'Tell me more about the basics',
          'Can you give me an example?',
          'What should I learn first?'
        ],
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get suggested topics for learning
// @route   GET /api/tutor/topics
// @access  Public
export const getSuggestedTopics = async (req, res, next) => {
  try {
    const { domain } = req.query;

    // Mock suggested topics based on domain
    const topicsByDomain = {
      mathematics: [
        'Algebra basics',
        'Geometry fundamentals',
        'Calculus introduction',
        'Statistics and probability',
        'Linear equations'
      ],
      programming: [
        'Variables and data types',
        'Functions and methods',
        'Object-oriented programming',
        'Data structures',
        'Algorithms'
      ],
      science: [
        'Scientific method',
        'Physics concepts',
        'Chemistry basics',
        'Biology fundamentals',
        'Environmental science'
      ],
      default: [
        'Getting started',
        'Study techniques',
        'Problem-solving strategies',
        'Time management',
        'Goal setting'
      ]
    };

    const topics = topicsByDomain[domain?.toLowerCase()] || topicsByDomain.default;

    res.status(200).json({
      success: true,
      data: {
        domain: domain || 'general',
        topics,
        count: topics.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Provide feedback on tutor response
// @route   POST /api/tutor/feedback
// @access  Public (auth optional)
export const provideFeedback = async (req, res, next) => {
  try {
    const { conversationId, messageId, rating, comment } = req.body;

    // Validate inputs
    if (!conversationId || !messageId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Conversation ID and message ID are required',
          status: 400
        }
      });
    }

    if (rating && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Rating must be a number between 1 and 5',
          status: 400
        }
      });
    }

    // This would store feedback in database for improving AI responses
    res.status(200).json({
      success: true,
      data: {
        message: 'Feedback received',
        conversationId,
        messageId,
        rating,
        note: 'Feedback will be used to improve AI tutor responses'
      }
    });
  } catch (error) {
    next(error);
  }
};
