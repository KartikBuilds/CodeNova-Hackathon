/**
 * AI Service - Handles all AI-powered features using LangChain + Groq
 * 
 * This service provides:
 * - Quiz generation based on topic and difficulty
 * - Performance analysis from quiz results
 * - Personalized learning plan creation
 * - AI tutor chat functionality
 */

import { getGroqLLM } from '../config/langchain.js';
import { PromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';

// Check if AI is available
const isAIAvailable = () => {
  return getGroqLLM() !== null;
};

// Mock delay to simulate API call (for fallback)
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate a quiz based on topic, difficulty, and learner weaknesses
 * 
 * @param {Object} params - Quiz generation parameters
 * @param {string} params.topic - The topic for the quiz
 * @param {string} params.difficulty - Difficulty level (easy, medium, hard)
 * @param {Array<string>} params.weaknesses - Array of known weaknesses to focus on
 * @param {number} params.count - Number of questions to generate (default: 5)
 * @returns {Promise<Object>} Quiz object with questions array
 */
export const generateQuiz = async ({ topic, difficulty = 'medium', weaknesses = [], count = 5 }) => {
  const llm = getGroqLLM();
  
  // Fallback to mock if LLM not available
  if (!llm || !isAIAvailable()) {
    return generateQuizMock({ topic, difficulty, weaknesses, count });
  }

  try {
    const quizPrompt = PromptTemplate.fromTemplate(`
You are an expert educator creating high-quality quiz questions.

Generate exactly {count} multiple-choice questions about the topic: "{topic}"
Difficulty level: {difficulty}
{weaknessContext}

CRITICAL REQUIREMENTS:
1. Each question must have exactly 4 options
2. Only ONE option should be correct
3. Provide a clear explanation for each answer
4. Make questions progressively challenging
5. Avoid yes/no questions

Return ONLY valid JSON with this EXACT structure:
{{
  "questions": [
    {{
      "id": "q1",
      "question": "Your question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "The exact text of the correct option",
      "explanation": "Why this is correct and others are wrong"
    }}
  ]
}}

Generate {count} questions now.
`);

    const weaknessContext = weaknesses.length > 0 
      ? `Focus areas (learner weaknesses): ${weaknesses.join(', ')}`
      : 'Cover a broad range of concepts';

    const formattedPrompt = await quizPrompt.format({
      count,
      topic,
      difficulty,
      weaknessContext
    });

    const parser = new JsonOutputParser();
    const response = await llm.invoke(formattedPrompt);
    
    let quizData;
    try {
      // Try parsing the response content
      quizData = JSON.parse(response.content);
    } catch (parseError) {
      console.error('Failed to parse AI response, using mock data:', parseError);
      return generateQuizMock({ topic, difficulty, weaknesses, count });
    }

    // Validate and ensure correct structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error('Invalid quiz structure returned from AI');
    }

    // Add IDs if missing
    quizData.questions = quizData.questions.map((q, idx) => ({
      ...q,
      id: q.id || `q${idx + 1}`
    }));

    return {
      topic,
      difficulty,
      count: quizData.questions.length,
      questions: quizData.questions,
      generatedAt: new Date().toISOString(),
      source: 'groq-ai'
    };

  } catch (error) {
    console.error('Error generating quiz with AI:', error);
    // Fallback to mock on error
    return generateQuizMock({ topic, difficulty, weaknesses, count });
  }
};

/**
 * Analyze learner's performance from quiz results
 * 
 * @param {Object} resultsJson - Quiz results to analyze
 * @param {number} resultsJson.score - Number of correct answers
 * @param {number} resultsJson.total - Total number of questions
 * @param {Array} resultsJson.questions - Original questions
 * @param {Array} resultsJson.answers - User's answers
 * @returns {Promise<Object>} Performance analysis with strengths, weaknesses, and recommendations
 */
export const analyzePerformance = async (resultsJson) => {
  const llm = getGroqLLM();
  
  if (!llm || !isAIAvailable()) {
    return analyzePerformanceMock(resultsJson);
  }

  try {
    const { score, total, questions = [], answers = [] } = resultsJson;
    const percentage = total > 0 ? (score / total) * 100 : 0;

    // Build analysis context
    const wrongAnswers = questions
      .map((q, idx) => ({
        question: q.question,
        userAnswer: answers[idx],
        correctAnswer: q.correct_answer,
        isWrong: answers[idx] !== q.correct_answer
      }))
      .filter(item => item.isWrong);

    const analysisPrompt = PromptTemplate.fromTemplate(`
You are an expert educational analyst. Analyze this quiz performance:

Score: {score}/{total} ({percentage}%)
Wrong Answers: {wrongAnswersCount}

{wrongAnswersDetails}

Provide a detailed analysis in this EXACT JSON format:
{{
  "score": {score},
  "total": {total},
  "percentage": {percentage},
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "mistake_patterns": ["pattern 1", "pattern 2"],
  "recommended_difficulty": "easy|medium|hard",
  "insights": "Detailed personalized feedback paragraph"
}}

Be encouraging but honest. Provide actionable insights.
`);

    const wrongAnswersDetails = wrongAnswers.length > 0
      ? wrongAnswers.map((wa, idx) => 
          `${idx + 1}. Q: ${wa.question}\n   Your answer: ${wa.userAnswer}\n   Correct: ${wa.correctAnswer}`
        ).join('\n\n')
      : 'All answers were correct!';

    const formattedPrompt = await analysisPrompt.format({
      score,
      total,
      percentage: Math.round(percentage),
      wrongAnswersCount: wrongAnswers.length,
      wrongAnswersDetails
    });

    const response = await llm.invoke(formattedPrompt);
    
    let analysisData;
    try {
      analysisData = JSON.parse(response.content);
    } catch (parseError) {
      console.error('Failed to parse AI analysis, using mock:', parseError);
      return analyzePerformanceMock(resultsJson);
    }

    return {
      ...analysisData,
      analyzedAt: new Date().toISOString(),
      source: 'groq-ai'
    };

  } catch (error) {
    console.error('Error analyzing performance with AI:', error);
    return analyzePerformanceMock(resultsJson);
  }
};

/**
 * Create a personalized learning plan based on user profile
 * 
 * @param {Object} profileJson - User profile and learning preferences
 * @param {string} profileJson.domain - Subject domain
 * @param {string} profileJson.currentLevel - Current skill level
 * @param {Array<string>} profileJson.weaknesses - Known weaknesses
 * @param {number} profileJson.studyTimePerDay - Available study time in minutes
 * @param {string} profileJson.learningStyle - Preferred learning style
 * @returns {Promise<Object>} Learning plan with daily breakdown
 */
export const createLearningPlan = async (profileJson) => {
  const llm = getGroqLLM();
  
  if (!llm || !isAIAvailable()) {
    return createLearningPlanMock(profileJson);
  }

  try {
    const { 
      domain = 'General Learning', 
      currentLevel = 'beginner',
      weaknesses = [],
      studyTimePerDay = 30,
      learningStyle = 'visual',
      days = 7 
    } = profileJson;

    const planPrompt = PromptTemplate.fromTemplate(`
You are an expert learning advisor. Create a {days}-day personalized learning plan.

Profile:
- Domain: {domain}
- Current Level: {currentLevel}
- Study Time: {studyTimePerDay} minutes/day
- Learning Style: {learningStyle}
{weaknessContext}

CRITICAL: Return ONLY a valid JSON object. No markdown, no code blocks, no explanations.

Format:
{{
  "domain": "{domain}",
  "totalDays": {days},
  "estimatedHoursPerDay": {hoursPerDay},
  "plan": [
    {{
      "day": 1,
      "topics": ["Topic name"],
      "tasks": ["Study topic for X minutes", "Practice exercises", "Review notes"],
      "notes": "Day 1 guidance"
    }}
  ]
}}

Generate {days} days of structured learning. Output valid JSON only.
`);

    const weaknessContext = weaknesses.length > 0
      ? `\n- Focus Areas: ${weaknesses.join(', ')}`
      : '';

    const formattedPrompt = await planPrompt.format({
      days,
      domain,
      currentLevel,
      studyTimePerDay,
      learningStyle,
      weaknessContext,
      hoursPerDay: (studyTimePerDay / 60).toFixed(1)
    });

    const response = await llm.invoke(formattedPrompt);
    
    let planData;
    try {
      // Clean up response - remove markdown code blocks if present
      let jsonString = response.content.trim();
      
      // Remove markdown code blocks
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }
      
      // Try to find JSON object in the response
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      
      planData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse learning plan:', parseError);
      console.error('AI Response:', response.content.substring(0, 500));
      return createLearningPlanMock(profileJson);
    }

    // Validate structure
    if (!planData.plan || !Array.isArray(planData.plan)) {
      throw new Error('Invalid learning plan structure');
    }

    return {
      ...planData,
      createdAt: new Date().toISOString(),
      source: 'groq-ai'
    };

  } catch (error) {
    console.error('Error creating learning plan with AI:', error);
    return createLearningPlanMock(profileJson);
  }
};

/**
 * AI Tutor chat - Answer questions and provide guidance
 * 
 * @param {string} message - User's question or message
 * @param {Object} context - Conversation context
 * @param {string} context.topic - Current topic being discussed
 * @param {Array<Object>} context.history - Previous messages
 * @param {Object} context.userProfile - User's learning profile
 * @returns {Promise<Object>} AI tutor response
 */
export const tutorChat = async (message, context = {}) => {
  const llm = getGroqLLM();
  
  if (!llm || !isAIAvailable()) {
    return tutorChatMock(message, context);
  }

  try {
    const { topic = 'general', history = [], userProfile = {} } = context;

    // Build conversation history for context
    const historyContext = history.length > 0
      ? history.slice(-3).map(h => `${h.role}: ${h.message}`).join('\n')
      : 'No previous conversation';

    const tutorPrompt = PromptTemplate.fromTemplate(`
You are an encouraging, patient AI tutor helping a student learn {topic}.

Previous conversation:
{historyContext}

Student asks: "{message}"

Respond as a helpful tutor. Provide:
1. A clear, concise answer
2. An explanation if needed
3. 2-3 follow-up suggestions

Return ONLY valid JSON:
{{
  "message": "Your detailed response here",
  "suggestions": ["Question 1?", "Question 2?", "Question 3?"]
}}

Be encouraging, clear, and educational.
`);

    const formattedPrompt = await tutorPrompt.format({
      topic,
      message,
      historyContext
    });

    const response = await llm.invoke(formattedPrompt);
    
    let chatData;
    try {
      chatData = JSON.parse(response.content);
    } catch (parseError) {
      console.error('Failed to parse tutor chat, using mock:', parseError);
      return tutorChatMock(message, context);
    }

    return {
      ...chatData,
      conversationId: context.conversationId || `conv_${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'groq-ai'
    };

  } catch (error) {
    console.error('Error in tutor chat with AI:', error);
    return tutorChatMock(message, context);
  }
};

// ==================== MOCK FALLBACK FUNCTIONS ====================

const generateQuizMock = async ({ topic, difficulty, weaknesses, count }) => {
  await mockDelay();
  const questions = [];
  
  for (let i = 0; i < count; i++) {
    questions.push({
      id: `q${i + 1}`,
      question: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} question about ${topic}${weaknesses.length > 0 ? ` (focusing on ${weaknesses[0]})` : ''} - Question ${i + 1}`,
      options: [
        "Option A - Correct answer",
        "Option B - Distractor",
        "Option C - Common mistake",
        "Option D - Another distractor"
      ],
      correct_answer: "Option A - Correct answer",
      explanation: `This tests your understanding of ${topic}. The correct approach is to apply the fundamental concepts.`
    });
  }

  return {
    topic,
    difficulty,
    count: questions.length,
    questions,
    generatedAt: new Date().toISOString(),
    source: 'mock-fallback',
    note: "[MOCK DATA] Groq API key not configured"
  };
};

const analyzePerformanceMock = async (resultsJson) => {
  await mockDelay();
  const { score, total } = resultsJson;
  const percentage = total > 0 ? (score / total) * 100 : 0;

  let recommendedDifficulty = 'medium';
  let strengths = ['Problem solving', 'Basic concepts'];
  let weaknesses = ['Advanced topics', 'Complex scenarios'];
  let mistakePatterns = ['Selecting distractor options', 'Time management'];

  if (percentage >= 80) {
    recommendedDifficulty = 'hard';
    strengths = ['Strong conceptual understanding', 'Excellent problem-solving'];
    weaknesses = ['Minor gaps in advanced topics'];
    mistakePatterns = ['Occasional calculation errors'];
  } else if (percentage >= 60) {
    recommendedDifficulty = 'medium';
    strengths = ['Good grasp of fundamentals', 'Consistent performance'];
    weaknesses = ['Complex problems need practice', 'Speed and accuracy'];
    mistakePatterns = ['Rushing through problems', 'Missing key details'];
  } else {
    recommendedDifficulty = 'easy';
    strengths = ['Willingness to learn', 'Basic understanding'];
    weaknesses = ['Fundamentals need reinforcement', 'Problem-solving strategies'];
    mistakePatterns = ['Conceptual misunderstandings', 'Need more practice'];
  }

  return {
    score,
    total,
    percentage: Math.round(percentage),
    strengths,
    weaknesses,
    mistake_patterns: mistakePatterns,
    recommended_difficulty: recommendedDifficulty,
    insights: `Based on your performance (${score}/${total}), you demonstrate ${percentage >= 70 ? 'strong' : percentage >= 50 ? 'moderate' : 'developing'} understanding. Focus on improving ${weaknesses[0]}.`,
    analyzedAt: new Date().toISOString(),
    source: 'mock-fallback',
    note: "[MOCK DATA] Groq API key not configured"
  };
};

const createLearningPlanMock = async (profileJson) => {
  await mockDelay();
  const { 
    domain = 'General Learning', 
    weaknesses = ['Various topics'],
    studyTimePerDay = 30,
    days = 7 
  } = profileJson;

  const plan = [];
  const topicsToFocus = weaknesses.length > 0 ? weaknesses : ['Fundamentals', 'Practice', 'Review'];

  for (let day = 1; day <= days; day++) {
    const topicIndex = (day - 1) % topicsToFocus.length;
    const topic = topicsToFocus[topicIndex];
    
    plan.push({
      day,
      topics: [topic],
      tasks: [
        `Study ${topic} for ${Math.round(studyTimePerDay * 0.6)} minutes`,
        `Practice ${topic} exercises for ${Math.round(studyTimePerDay * 0.3)} minutes`,
        `Review and take notes for ${Math.round(studyTimePerDay * 0.1)} minutes`
      ],
      notes: day === 1 
        ? "Start with fundamentals. Take your time to understand core concepts."
        : day === days 
        ? "Final review day. Consolidate everything you've learned."
        : `Build on previous day's foundation. ${day > days / 2 ? 'Increase difficulty gradually.' : 'Focus on understanding.'}`
    });
  }

  return {
    domain,
    totalDays: days,
    estimatedHoursPerDay: studyTimePerDay / 60,
    plan,
    createdAt: new Date().toISOString(),
    source: 'mock-fallback',
    note: "[MOCK DATA] Groq API key not configured"
  };
};

const tutorChatMock = async (message, context = {}) => {
  await mockDelay(300);
  const { topic = 'general' } = context;
  const messageLower = message.toLowerCase();

  let response = '';
  let suggestions = [];

  if (messageLower.includes('help') || messageLower.includes('how')) {
    response = `I'd be happy to help you with ${topic}! Let me break this down:\n\n1. Understand the basic concept\n2. Look at examples\n3. Practice with problems\n4. Review mistakes\n\nWhat specific part would you like me to explain?`;
    suggestions = ['Explain the basics', 'Show me an example', 'Give me practice problems'];
  } else if (messageLower.includes('explain') || messageLower.includes('what is')) {
    response = `Great question! In ${topic}, this concept is fundamental. Think of it as building blocks - each part contributes to the whole understanding.\n\nWould you like a practical example?`;
    suggestions = ['Yes, show me an example', 'I need more clarification', 'What should I practice next?'];
  } else {
    response = `I understand you're asking about "${message}". The key is to focus on fundamental principles and see how they apply to different scenarios.\n\nIs there a specific aspect you'd like me to focus on?`;
    suggestions = ['Tell me more', 'Give me practice problems', 'What should I study next?'];
  }

  return {
    message: response,
    suggestions,
    conversationId: context.conversationId || `conv_${Date.now()}`,
    timestamp: new Date().toISOString(),
    source: 'mock-fallback',
    note: "[MOCK DATA] Groq API key not configured"
  };
};

// Export all AI service functions
export default {
  generateQuiz,
  analyzePerformance,
  createLearningPlan,
  tutorChat
};
