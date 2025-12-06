import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningPlanAPI } from '../api/learningPlanAPI';
import { learningPlansAPI } from '../api/learningAPI';
import { analysisAPI } from '../api/analysisAPI';
import { profileAPI } from '../api/profileAPI';
import Toast from '../components/Toast';
import './LearningPlan.css';

const LearningPlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'detail' or 'create'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [config, setConfig] = useState({
    topic: '',
    days: 7,
    hoursPerDay: 2,
    difficulty: 'medium',
    goals: ''
  });
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  useEffect(() => {
    loadAllPlans();
  }, []);

  const loadAllPlans = async () => {
    setLoading(true);
    try {
      const response = await learningPlansAPI.getPlans();
      const savedPlans = response.data || response;
      setPlans(Array.isArray(savedPlans) ? savedPlans : []);
      setError('');
    } catch (err) {
      console.error('Error fetching plans:', err);
      setPlans([]);
      setError('Failed to load learning plans');
    } finally {
      setLoading(false);
    }
  };

  const viewPlanDetails = (plan) => {
    setSelectedPlan(plan);
    setView('detail');
  };

  const backToList = () => {
    setView('list');
    setSelectedPlan(null);
  };

  const showCreateForm = () => {
    setView('create');
    setConfig({
      topic: '',
      days: 7,
      hoursPerDay: 2,
      difficulty: 'medium',
      goals: ''
    });
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateNewPlan = async (e) => {
    if (e) e.preventDefault();
    
    setGenerating(true);
    setError('');
    
    try {
      // Get user profile for additional context
      let profileTopic = config.topic;
      
      if (!profileTopic) {
        try {
          const profile = await profileAPI.getProfile();
          profileTopic = profile.primaryDomain || 'Web Development';
        } catch (err) {
          profileTopic = 'Web Development'; // Default
        }
      }

      // Try to get strengths/weaknesses from analysis
      let strengths = [];
      let weaknesses = [];
      
      try {
        const analysis = await analysisAPI.getStrengthsWeaknesses();
        strengths = analysis.strengths || [];
        weaknesses = analysis.weaknesses || [];
      } catch (err) {
        console.log('No analysis found');
      }

      // Generate plan using createPlan API
      const planData = await learningPlanAPI.createPlan({
        topic: profileTopic,
        strengths,
        weaknesses,
        difficulty: config.difficulty,
        goals: config.goals ? [config.goals] : [`Master ${profileTopic}`],
        days: parseInt(config.days),
        hoursPerDay: parseFloat(config.hoursPerDay)
      });

      console.log('Generated plan data:', planData); // Debug log

      // Extract the actual plan from nested data structure
      const actualPlan = planData.plan || planData.data?.plan || planData;
      
      // Save plan to database
      try {
        const savedPlan = await learningPlansAPI.createPlan({
          title: actualPlan.title || `${profileTopic} Learning Plan`,
          description: actualPlan.description || `${config.days}-day learning plan for ${profileTopic}`,
          domain: profileTopic,
          level: config.difficulty,
          duration: config.days,
          hoursPerDay: config.hoursPerDay,
          goals: config.goals ? [config.goals] : [`Master ${profileTopic}`],
          plan: actualPlan,
          createdAt: new Date().toISOString()
        });
        console.log('Plan saved to database:', savedPlan);
      } catch (saveErr) {
        console.error('Failed to save plan to database:', saveErr);
        // Continue anyway - user still sees the plan
      }
      
      setPlan(actualPlan);
      setShowConfigForm(false);
      setError('');
      showToast('Learning plan generated and saved successfully!', 'success');
    } catch (err) {
      console.error('Error generating plan:', err);
      setError(err.response?.data?.error?.message || 'Failed to generate learning plan');
      showToast('Failed to generate learning plan', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleRegeneratePlan = async () => {
    setShowConfigForm(true);
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

  // Show configuration form
  if (showConfigForm) {
    return (
      <div className="learning-plan-container">
        <div className="plan-config-form">
          <h1>Create Your Learning Plan</h1>
          <p className="form-subtitle">Customize your learning journey based on your schedule and goals</p>

          <form onSubmit={generateNewPlan}>
            <div className="form-group">
              <label htmlFor="topic">Topic / Domain *</label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={config.topic}
                onChange={handleConfigChange}
                placeholder="e.g., Web Development, Data Science, Machine Learning"
                required
              />
              <small>What subject do you want to learn?</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="days">Duration (Days) *</label>
                <input
                  type="number"
                  id="days"
                  name="days"
                  value={config.days}
                  onChange={handleConfigChange}
                  min="1"
                  max="30"
                  required
                />
                <small>1-30 days</small>
              </div>

              <div className="form-group">
                <label htmlFor="hoursPerDay">Hours per Day *</label>
                <input
                  type="number"
                  id="hoursPerDay"
                  name="hoursPerDay"
                  value={config.hoursPerDay}
                  onChange={handleConfigChange}
                  min="0.5"
                  max="12"
                  step="0.5"
                  required
                />
                <small>0.5-12 hours</small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty Level *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={config.difficulty}
                onChange={handleConfigChange}
                required
              >
                <option value="beginner">Beginner - New to this topic</option>
                <option value="intermediate">Intermediate - Some experience</option>
                <option value="advanced">Advanced - Deep dive & mastery</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="goals">Your Learning Goals</label>
              <textarea
                id="goals"
                name="goals"
                value={config.goals}
                onChange={handleConfigChange}
                placeholder="What do you want to achieve? (e.g., Build a portfolio project, Get job-ready, Pass certification exam)"
                rows="4"
              />
              <small>Optional - helps personalize your plan</small>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              {plan && (
                <button
                  type="button"
                  onClick={() => setShowConfigForm(false)}
                  className="cancel-button"
                  disabled={generating}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="generate-button"
                disabled={generating}
              >
                {generating ? (
                  <>
                    <span className="spinner-small"></span>
                    Generating Plan...
                  </>
                ) : (
                  '🚀 Generate Learning Plan'
                )}
              </button>
            </div>
          </form>
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

  const days = plan.plan || plan.days || plan.schedule || [];
  const planTopic = plan.domain || plan.topic || plan.title || 'Your Learning Journey';
  const totalDays = plan.totalDays || days.length;
  const hoursPerDay = plan.estimatedHoursPerDay || 0;

  return (
    <div className="learning-plan-container">
      <div className="plan-header">
        <div className="plan-header-content">
          <h1>{planTopic}</h1>
          <p className="plan-description">
            {plan.description || `A personalized ${totalDays}-day learning plan tailored to your needs`}
          </p>
          
          <div className="plan-meta">
            <span className="plan-duration">📅 {totalDays} days</span>
            {hoursPerDay > 0 && (
              <span className="plan-hours">⏱️ {hoursPerDay.toFixed(1)} hrs/day</span>
            )}
            {plan.difficulty && (
              <span className={`plan-difficulty ${plan.difficulty?.toLowerCase()}`}>
                {plan.difficulty}
              </span>
            )}
          </div>
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
          Browse Catalogue
        </button>
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default LearningPlanPage;
