import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningPlanAPI } from '../api/learningPlanAPI';
import { analysisAPI } from '../api/analysisAPI';
import { profileAPI } from '../api/profileAPI';
import Toast from '../components/Toast';
import './LearningPlan.css';

const LearningPlanPage = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  useEffect(() => {
    fetchOrGeneratePlan();
  }, []);

  const fetchOrGeneratePlan = async () => {
    setLoading(true);
    try {
      // Try to get existing saved plans first
      const savedPlans = await learningPlanAPI.getSavedPlans();
      if (savedPlans && savedPlans.length > 0) {
        // Get the most recent plan
        setPlan(savedPlans[0]);
        setError('');
      } else {
        // Generate new plan
        await generateNewPlan();
      }
    } catch (err) {
      console.error('Error fetching plan:', err);
      // If no plan exists, generate one
      await generateNewPlan();
    } finally {
      setLoading(false);
    }
  };

  const generateNewPlan = async () => {
    try {
      // Get user profile for topic
      let topic = 'Web Development'; // Default
      let strengths = [];
      let weaknesses = [];

      try {
        const profile = await profileAPI.getProfile();
        topic = profile.primaryDomain || profile.topic || topic;
      } catch (err) {
        console.log('No profile found, using default topic');
      }

      // Try to get strengths/weaknesses from analysis
      try {
        const analysis = await analysisAPI.getStrengthsWeaknesses();
        strengths = analysis.strengths || [];
        weaknesses = analysis.weaknesses || [];
      } catch (err) {
        console.log('No analysis found, using mock data');
        // Mock data for initial generation
        strengths = ['Problem-solving', 'Quick learner'];
        weaknesses = ['Advanced algorithms', 'System design'];
      }

      // Generate plan using createPlan API
      const planData = await learningPlanAPI.createPlan({
        topic,
        strengths,
        weaknesses,
        difficulty: 'medium',
        goals: [`Master ${topic} in 7 days`],
        days: 7
      });

      setPlan(planData);
      setError('');
      showToast('Learning plan generated successfully!', 'success');
    } catch (err) {
      console.error('Error generating plan:', err);
      setError(err.response?.data?.message || 'Failed to generate learning plan');
      showToast('Failed to generate learning plan', 'error');
    }
  };

  const handleRegeneratePlan = async () => {
    setGenerating(true);
    await generateNewPlan();
    setGenerating(false);
  };

  const handleMarkComplete = async (dayIndex, taskIndex) => {
    try {
      // Update local state
      const updatedPlan = { ...plan };
      if (updatedPlan.days && updatedPlan.days[dayIndex]) {
        if (!updatedPlan.days[dayIndex].completedTasks) {
          updatedPlan.days[dayIndex].completedTasks = [];
        }
        
        const taskId = `${dayIndex}-${taskIndex}`;
        const taskAlreadyCompleted = updatedPlan.days[dayIndex].completedTasks.includes(taskId);
        
        if (taskAlreadyCompleted) {
          updatedPlan.days[dayIndex].completedTasks = 
            updatedPlan.days[dayIndex].completedTasks.filter(t => t !== taskId);
        } else {
          updatedPlan.days[dayIndex].completedTasks.push(taskId);
        }
        
        setPlan(updatedPlan);

        // Update progress on server
        await learningPlanAPI.updateProgress({
          day: dayIndex + 1,
          taskIndex,
          completed: !taskAlreadyCompleted,
        });

        showToast(
          taskAlreadyCompleted ? 'Task marked as incomplete' : 'Task completed!',
          'success'
        );
      }
    } catch (err) {
      console.error('Error updating progress:', err);
      showToast('Failed to update progress', 'error');
    }
  };

  if (loading) {
    return (
      <div className="learning-plan-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your learning plan...</p>
        </div>
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className="learning-plan-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={handleRegeneratePlan} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="learning-plan-container">
        <div className="empty-plan">
          <h2>No Learning Plan Yet</h2>
          <p>Generate a personalized learning plan based on your profile and performance</p>
          <button onClick={handleRegeneratePlan} className="generate-button">
            Generate Learning Plan
          </button>
        </div>
      </div>
    );
  }

  const days = plan.days || plan.schedule || [];
  const planTopic = plan.topic || plan.title || 'Your Learning Journey';

  return (
    <div className="learning-plan-container">
      <div className="plan-header">
        <div className="plan-header-content">
          <h1>{planTopic}</h1>
          <p className="plan-description">
            {plan.description || `A personalized ${days.length}-day learning plan tailored to your needs`}
          </p>
          
          {plan.duration && (
            <div className="plan-meta">
              <span className="plan-duration">📅 {plan.duration} days</span>
              {plan.difficulty && (
                <span className={`plan-difficulty ${plan.difficulty.toLowerCase()}`}>
                  {plan.difficulty}
                </span>
              )}
            </div>
          )}
        </div>

        <button 
          onClick={handleRegeneratePlan} 
          className="regenerate-button"
          disabled={generating}
        >
          {generating ? 'Regenerating...' : '🔄 Regenerate Plan'}
        </button>
      </div>

      {/* Strengths & Weaknesses Summary */}
      {(plan.strengths || plan.weaknesses) && (
        <div className="plan-insights">
          {plan.strengths && plan.strengths.length > 0 && (
            <div className="insights-card strengths">
              <h3>💪 Your Strengths</h3>
              <ul>
                {plan.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {plan.weaknesses && plan.weaknesses.length > 0 && (
            <div className="insights-card weaknesses">
              <h3>📚 Focus Areas</h3>
              <ul>
                {plan.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Learning Plan Timeline */}
      <div className="plan-timeline">
        {days.map((day, dayIndex) => {
          const dayNumber = day.day || dayIndex + 1;
          const dayTopic = day.topic || day.title || `Day ${dayNumber}`;
          const tasks = day.tasks || day.activities || [];
          const completedTasks = day.completedTasks || [];
          const totalTasks = tasks.length;
          const completedCount = completedTasks.length;
          const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

          return (
            <div key={dayIndex} className="timeline-day">
              <div className="timeline-marker">
                <div className="timeline-dot"></div>
                {dayIndex < days.length - 1 && <div className="timeline-line"></div>}
              </div>

              <div className="day-card">
                <div className="day-header">
                  <div className="day-info">
                    <span className="day-number">Day {dayNumber}</span>
                    <h3 className="day-topic">{dayTopic}</h3>
                  </div>
                  
                  {totalTasks > 0 && (
                    <div className="day-progress">
                      <span className="progress-text">
                        {completedCount}/{totalTasks} completed
                      </span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {day.description && (
                  <p className="day-description">{day.description}</p>
                )}

                {tasks.length > 0 && (
                  <div className="tasks-list">
                    <h4>Tasks:</h4>
                    {tasks.map((task, taskIndex) => {
                      const taskId = `${dayIndex}-${taskIndex}`;
                      const isCompleted = completedTasks.includes(taskId);
                      const taskText = typeof task === 'string' ? task : task.description || task.title;

                      return (
                        <div key={taskIndex} className={`task-item ${isCompleted ? 'completed' : ''}`}>
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => handleMarkComplete(dayIndex, taskIndex)}
                            id={`task-${taskId}`}
                          />
                          <label htmlFor={`task-${taskId}`}>
                            {taskText}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}

                {day.notes && (
                  <div className="day-notes">
                    <strong>📝 Notes:</strong> {day.notes}
                  </div>
                )}

                {day.resources && day.resources.length > 0 && (
                  <div className="day-resources">
                    <strong>📚 Resources:</strong>
                    <ul>
                      {day.resources.map((resource, index) => (
                        <li key={index}>
                          {typeof resource === 'string' ? (
                            resource
                          ) : (
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              {resource.title || resource.name}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="plan-actions">
        <button onClick={() => navigate('/dashboard')} className="dashboard-button">
          Go to Dashboard
        </button>
        <button onClick={() => navigate('/catalog')} className="catalog-button">
          Browse Catalog
        </button>
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default LearningPlanPage;
