import QuizSession from '../models/QuizSession.js';
import LearningPath from '../models/LearningPath.js';
import UserProfile from '../models/UserProfile.js';

// @desc    Get user dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch all quiz sessions for the user
    const quizSessions = await QuizSession.find({ userId })
      .select('topic score total createdAt')
      .sort({ createdAt: -1 });

    // Calculate total quizzes
    const total_quizzes = quizSessions.length;

    // Calculate average score
    let avg_score = 0;
    if (total_quizzes > 0) {
      const totalScore = quizSessions.reduce((sum, session) => sum + session.score, 0);
      const totalQuestions = quizSessions.reduce((sum, session) => sum + session.total, 0);
      avg_score = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    }

    // Analyze topics performance
    const topicPerformance = {};
    
    quizSessions.forEach(session => {
      const topic = session.topic;
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = {
          topic,
          totalQuizzes: 0,
          totalScore: 0,
          totalQuestions: 0,
          averagePercentage: 0
        };
      }
      
      topicPerformance[topic].totalQuizzes++;
      topicPerformance[topic].totalScore += session.score;
      topicPerformance[topic].totalQuestions += session.total;
    });

    // Calculate average percentage for each topic
    Object.values(topicPerformance).forEach(perf => {
      if (perf.totalQuestions > 0) {
        perf.averagePercentage = Math.round((perf.totalScore / perf.totalQuestions) * 100);
      }
    });

    // Determine mastered topics (>= 80% average) and weak topics (< 60% average)
    const topics_mastered = Object.values(topicPerformance)
      .filter(perf => perf.averagePercentage >= 80)
      .map(perf => perf.topic);

    const weak_topics = Object.values(topicPerformance)
      .filter(perf => perf.averagePercentage < 60)
      .map(perf => perf.topic);

    // Create history array (recent quiz sessions)
    const history = quizSessions.slice(0, 10).map(session => ({
      topic: session.topic,
      score: session.score,
      total: session.total,
      percentage: Math.round((session.score / session.total) * 100),
      date: session.createdAt
    }));

    // Fetch learning paths to get progress information
    const learningPaths = await LearningPath.find({ userId })
      .select('domain path');

    // Calculate learning path progress
    const learning_progress = learningPaths.map(path => {
      const total = path.path.length;
      const completed = path.path.filter(item => item.status === 'completed').length;
      const inProgress = path.path.filter(item => item.status === 'in-progress').length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        domain: path.domain,
        totalModules: total,
        completedModules: completed,
        inProgressModules: inProgress,
        progressPercentage: percentage
      };
    });

    // Create score_history for charts (last 10 quizzes with date formatting)
    const score_history = quizSessions.slice(0, 10).reverse().map((session, index) => ({
      date: session.createdAt.toISOString().split('T')[0],
      score: Math.round((session.score / session.total) * 100),
      quiz: `Quiz ${index + 1}`
    }));

    // Create recent_activity
    const recent_activity = quizSessions.slice(0, 5).map(session => ({
      type: 'quiz',
      title: `${session.topic} Quiz`,
      date: session.createdAt.toISOString().split('T')[0],
      score: Math.round((session.score / session.total) * 100)
    }));

    // Calculate learning streak (mock for now - would need daily tracking)
    const learning_streak = quizSessions.length > 0 ? Math.min(quizSessions.length, 7) : 0;

    // Calculate total learning time (estimate based on quizzes)
    const total_learning_time = Math.round(quizSessions.length * 0.5); // Estimate 30 min per quiz

    // Fetch user profile for additional info
    const userProfile = await UserProfile.findOne({ userId })
      .select('stats preferences');

    res.status(200).json({
      success: true,
      data: {
        total_quizzes,
        avg_score,
        topics_mastered,
        weak_topics,
        score_history,
        recent_activity,
        learning_streak,
        total_learning_time,
        history,
        learning_progress,
        profile_stats: userProfile ? {
          totalCoursesCompleted: userProfile.stats?.totalCoursesCompleted || 0,
          totalQuizzesTaken: userProfile.stats?.totalQuizzesTaken || 0,
          averageQuizScore: userProfile.stats?.averageQuizScore || 0,
          totalStudyTime: userProfile.stats?.totalStudyTime || 0
        } : null,
        summary: {
          total_topics_attempted: Object.keys(topicPerformance).length,
          total_domains_active: learningPaths.length,
          overall_performance: avg_score >= 80 ? 'Excellent' : avg_score >= 60 ? 'Good' : avg_score >= 40 ? 'Fair' : 'Needs Improvement'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user activity timeline
// @route   GET /api/dashboard/activity
// @access  Private
export const getActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { days = 7 } = req.query;

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Fetch recent quiz sessions
    const quizSessions = await QuizSession.find({
      userId,
      createdAt: { $gte: startDate }
    })
      .select('topic score total createdAt')
      .sort({ createdAt: -1 });

    // Group activities by date
    const activityByDate = {};
    
    quizSessions.forEach(session => {
      const dateKey = session.createdAt.toISOString().split('T')[0];
      if (!activityByDate[dateKey]) {
        activityByDate[dateKey] = {
          date: dateKey,
          quizzes: 0,
          totalQuestions: 0,
          correctAnswers: 0
        };
      }
      
      activityByDate[dateKey].quizzes++;
      activityByDate[dateKey].totalQuestions += session.total;
      activityByDate[dateKey].correctAnswers += session.score;
    });

    // Convert to array and sort by date
    const activity = Object.values(activityByDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      data: {
        days: parseInt(days),
        activity,
        total_active_days: activity.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get topic-wise performance breakdown
// @route   GET /api/dashboard/topics
// @access  Private
export const getTopicBreakdown = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch all quiz sessions
    const quizSessions = await QuizSession.find({ userId })
      .select('topic score total createdAt');

    // Analyze performance by topic
    const topicStats = {};
    
    quizSessions.forEach(session => {
      const topic = session.topic;
      if (!topicStats[topic]) {
        topicStats[topic] = {
          topic,
          attempts: 0,
          totalScore: 0,
          totalQuestions: 0,
          averageScore: 0,
          bestScore: 0,
          worstScore: 100,
          lastAttempt: session.createdAt,
          trend: 'stable'
        };
      }
      
      const percentage = Math.round((session.score / session.total) * 100);
      
      topicStats[topic].attempts++;
      topicStats[topic].totalScore += session.score;
      topicStats[topic].totalQuestions += session.total;
      topicStats[topic].bestScore = Math.max(topicStats[topic].bestScore, percentage);
      topicStats[topic].worstScore = Math.min(topicStats[topic].worstScore, percentage);
      
      if (session.createdAt > topicStats[topic].lastAttempt) {
        topicStats[topic].lastAttempt = session.createdAt;
      }
    });

    // Calculate average scores
    Object.values(topicStats).forEach(stat => {
      stat.averageScore = stat.totalQuestions > 0 
        ? Math.round((stat.totalScore / stat.totalQuestions) * 100)
        : 0;
      
      // Simple trend calculation: compare best and worst scores
      if (stat.bestScore - stat.worstScore > 20) {
        stat.trend = 'improving';
      } else if (stat.worstScore - stat.bestScore > 20) {
        stat.trend = 'declining';
      }
      
      // Clean up temporary fields
      delete stat.totalScore;
      delete stat.totalQuestions;
    });

    // Sort by average score descending
    const topics = Object.values(topicStats)
      .sort((a, b) => b.averageScore - a.averageScore);

    res.status(200).json({
      success: true,
      count: topics.length,
      data: {
        topics
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get learning recommendations
// @route   GET /api/dashboard/recommendations
// @access  Private
export const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch quiz sessions
    const quizSessions = await QuizSession.find({ userId })
      .select('topic score total')
      .sort({ createdAt: -1 })
      .limit(20);

    // Fetch learning paths
    const learningPaths = await LearningPath.find({ userId })
      .select('domain path')
      .populate({
        path: 'path.moduleId',
        select: 'title courseId'
      });

    const recommendations = [];

    // Recommend topics that need improvement
    const topicPerformance = {};
    quizSessions.forEach(session => {
      if (!topicPerformance[session.topic]) {
        topicPerformance[session.topic] = { score: 0, total: 0 };
      }
      topicPerformance[session.topic].score += session.score;
      topicPerformance[session.topic].total += session.total;
    });

    Object.entries(topicPerformance).forEach(([topic, perf]) => {
      const percentage = (perf.score / perf.total) * 100;
      if (percentage < 60) {
        recommendations.push({
          type: 'improvement',
          priority: 'high',
          message: `Focus on improving ${topic} (current score: ${Math.round(percentage)}%)`,
          action: 'Take more quizzes or review learning materials'
        });
      }
    });

    // Recommend continuing learning paths
    learningPaths.forEach(path => {
      const inProgress = path.path.filter(item => item.status === 'in-progress').length;
      if (inProgress > 0) {
        recommendations.push({
          type: 'continue_learning',
          priority: 'medium',
          message: `Continue your ${path.domain} learning path`,
          action: `You have ${inProgress} module(s) in progress`
        });
      }
    });

    // If no recent activity, recommend starting
    if (quizSessions.length === 0) {
      recommendations.push({
        type: 'get_started',
        priority: 'high',
        message: 'Start your learning journey',
        action: 'Take a quiz or create a learning path'
      });
    }

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: {
        recommendations
      }
    });
  } catch (error) {
    next(error);
  }
};
