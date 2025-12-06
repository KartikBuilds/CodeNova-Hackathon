import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { catalogAPI } from '../api/catalogAPI';
import { quizAPI, analysisAPI } from '../api/quizAPI';
import Toast from '../components/Toast';
import './QuizPage.css';

const QuizPage = () => {
  const { moduleId } = useParams();
  const location = useLocation();
  
  const [module, setModule] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  useEffect(() => {
    const fetchModuleAndGenerateQuiz = async () => {
      setLoading(true);
      try {
        // Fetch module details to get topic
        const moduleData = await catalogAPI.getModuleById(moduleId);
        const fetchedModule = moduleData.module || moduleData;
        setModule(fetchedModule);

        // Get topic from location state or module data
        const topic = location.state?.topic || 
                      fetchedModule.topic || 
                      fetchedModule.title || 
                      fetchedModule.name;

        // Generate quiz
        const quizData = await quizAPI.generateQuiz({
          topic,
          difficulty: 'medium',
          weaknesses: [],
          count: 5,
        });

        setQuiz(quizData.quiz || quizData);
        setError('');
      } catch (err) {
        console.error('Error generating quiz:', err);
        setError(err.response?.data?.message || 'Failed to generate quiz. Please try again.');
        showToast('Failed to generate quiz', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchModuleAndGenerateQuiz();
    }
  }, [moduleId, location.state]);

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setAnswers({
      ...answers,
      [questionIndex]: selectedOption,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all questions are answered
    const questions = quiz.questions || quiz;
    if (Object.keys(answers).length < questions.length) {
      showToast('Please answer all questions before submitting', 'error');
      return;
    }

    setSubmitting(true);

    try {
      // Submit quiz for grading
      const submitData = {
        answers: Object.values(answers),
        original_questions: questions,
      };

      const resultData = await quizAPI.submitQuiz(submitData);
      setResult(resultData);
      showToast('Quiz submitted successfully!', 'success');

      // Prepare performance analysis data
      await analyzePerformance(questions, resultData);

    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError(err.response?.data?.message || 'Failed to submit quiz. Please try again.');
      showToast('Failed to submit quiz', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const analyzePerformance = async (questions, quizResult) => {
    try {
      // Prepare performance data for analysis
      const performanceData = {
        topic: module.topic || module.title || module.name,
        domain: module.domain || 'General',
        score: quizResult.score || calculateScore(quizResult),
        total_questions: questions.length,
        correct_answers: quizResult.correct_count || 0,
        time_taken: quizResult.time_taken || 300, // Default 5 minutes if not tracked
        question_results: questions.map((q, index) => ({
          question: q.question || q.text,
          topic: q.topic || module.topic || module.title,
          difficulty: q.difficulty || 'medium',
          correct: quizResult.results?.[index]?.correct || false,
          user_answer: answers[index],
          correct_answer: q.correctAnswer || q.correct_answer,
        })),
      };

      const analysisData = await analysisAPI.analyzePerformance(performanceData);
      setAnalysis(analysisData);
    } catch (err) {
      console.error('Error analyzing performance:', err);
      // Don't show error to user, analysis is optional
    }
  };

  const calculateScore = (resultData) => {
    if (resultData.score !== undefined) return resultData.score;
    const total = resultData.results?.length || 0;
    const correct = resultData.results?.filter(r => r.correct).length || 0;
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  const retakeQuiz = () => {
    setQuiz(null);
    setAnswers({});
    setResult(null);
    setAnalysis(null);
    setError('');
    
    // Reload the page to generate a new quiz
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Generating quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="quiz-container">
        <div className="error-container">
          <p>{error}</p>
          <Link to={`/module/${moduleId}`} className="back-link">
            ← Back to Module
          </Link>
        </div>
      </div>
    );
  }

  // Show results view
  if (result) {
    const questions = quiz.questions || quiz;
    const score = result.score ?? calculateScore(result);
    const correctCount = result.correct_count || result.results?.filter(r => r.correct).length || 0;

    return (
      <div className="quiz-container">
        <div className="quiz-results">
          <div className="results-header">
            <h1>Quiz Results</h1>
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{score}%</span>
              </div>
              <p className="score-text">
                You got {correctCount} out of {questions.length} questions correct
              </p>
            </div>
          </div>

          {/* Question Review */}
          <div className="results-review">
            <h2>Review Your Answers</h2>
            {questions.map((question, index) => {
              const isCorrect = result.results?.[index]?.correct || false;
              const userAnswer = answers[index];
              const correctAnswer = question.correctAnswer || question.correct_answer;

              return (
                <div key={index} className={`question-review ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="question-review-header">
                    <span className="question-number">Question {index + 1}</span>
                    <span className={`question-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <p className="question-text">{question.question || question.text}</p>
                  
                  <div className="answer-review">
                    <div className="answer-item">
                      <strong>Your answer:</strong>
                      <span className={!isCorrect ? 'wrong-answer' : ''}>{userAnswer}</span>
                    </div>
                    {!isCorrect && (
                      <div className="answer-item">
                        <strong>Correct answer:</strong>
                        <span className="correct-answer">{correctAnswer}</span>
                      </div>
                    )}
                  </div>

                  {question.explanation && (
                    <div className="explanation">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Performance Analysis */}
          {analysis && (
            <div className="performance-analysis">
              <h2>Performance Analysis</h2>
              
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div className="analysis-section strengths">
                  <h3>💪 Strengths</h3>
                  <ul>
                    {analysis.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                <div className="analysis-section weaknesses">
                  <h3>📚 Areas for Improvement</h3>
                  <ul>
                    {analysis.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className="analysis-section recommendations">
                  <h3>💡 Recommendations</h3>
                  <ul>
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="results-actions">
            <button onClick={retakeQuiz} className="retake-button">
              Retake Quiz
            </button>
            <Link to={`/module/${moduleId}`} className="back-button">
              Back to Module
            </Link>
            <Link to="/dashboard" className="dashboard-button">
              Go to Dashboard
            </Link>
          </div>
        </div>

        {toast.show && <Toast message={toast.message} type={toast.type} />}
      </div>
    );
  }

  // Show quiz form
  const questions = quiz?.questions || quiz || [];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <Link to={`/module/${moduleId}`} className="back-link">
          ← Back to Module
        </Link>
        <h1>Quiz: {module?.title || module?.name}</h1>
        <p className="quiz-info">Answer all {questions.length} questions and submit</p>
      </div>

      <form onSubmit={handleSubmit} className="quiz-form">
        {questions.map((question, index) => (
          <div key={index} className="question-card">
            <h3 className="question-title">
              Question {index + 1} of {questions.length}
            </h3>
            <p className="question-text">{question.question || question.text}</p>

            <div className="options-list">
              {(question.options || []).map((option, optionIndex) => (
                <label key={optionIndex} className="option-label">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleAnswerChange(index, option)}
                    required
                  />
                  <span className="option-text">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="quiz-submit">
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </form>

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default QuizPage;
