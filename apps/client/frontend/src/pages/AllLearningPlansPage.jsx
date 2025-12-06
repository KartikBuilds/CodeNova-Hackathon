import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningPlanAPI } from '../api/learningPlanAPI';
import { learningPlansAPI } from '../api/learningAPI';
import { analysisAPI } from '../api/analysisAPI';
import { profileAPI } from '../api/profileAPI';
import Toast from '../components/Toast';

const AllLearningPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'detail', or 'create'
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
        goals: config.goals ? [config.goals] : [],
        days: parseInt(config.days),
        hoursPerDay: parseFloat(config.hoursPerDay)
      });

      // Refresh the plans list to get the newly created plan
      await loadAllPlans();
      
      // The response should contain the saved plan
      if (planData && planData.learningPlan) {
        setSelectedPlan(planData.learningPlan);
        setView('detail');
      } else {
        // Find the newly created plan (should be the first one after sorting by date)
        const updatedPlans = await learningPlansAPI.getPlans();
        const allPlans = updatedPlans.data || updatedPlans;
        if (allPlans && allPlans.length > 0) {
          setSelectedPlan(allPlans[0]);
          setView('detail');
        }
      }

      showToast('Learning plan generated and saved successfully!', 'success');
    } catch (err) {
      console.error('Error generating plan:', err);
      setError(err.response?.data?.error?.message || 'Failed to generate learning plan');
      showToast('Failed to generate learning plan', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // List View - Show all plans
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Learning Plans</h1>
                <p className="text-indigo-100">Your personalized AI-generated learning paths</p>
              </div>
              <button 
                onClick={showCreateForm}
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:shadow-lg hover:shadow-white/20 transform hover:-translate-y-0.5 transition-all"
              >
                + Create New Plan
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <button 
                onClick={loadAllPlans}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Learning Plans Yet</h3>
              <p className="text-slate-600 mb-6">Create your first personalized learning plan to get started!</p>
              <button 
                onClick={showCreateForm}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Create Your First Plan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, index) => {
                const duration = plan.duration || `${plan.metadata?.estimatedHours || 0} hours`;
                const difficulty = plan.metadata?.difficulty || 'medium';
                const progress = plan.progress?.progressPercentage || 0;
                
                return (
                  <div 
                    key={plan._id || index}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group"
                    onClick={() => viewPlanDetails(plan)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {plan.title || plan.domain || 'Learning Plan'}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        difficulty === 'intermediate' || difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {difficulty}
                      </span>
                    </div>

                    {plan.description && (
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {plan.description}
                      </p>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {plan.metadata?.hoursPerDay || 2} hrs/day
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Progress</span>
                          <span className="text-sm font-medium text-slate-800">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                        Created {formatDate(plan.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {toast.show && <Toast message={toast.message} type={toast.type} />}
      </div>
    );
  }

  // Create View - Form to generate new plan
  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <button 
                onClick={backToList}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Plans
              </button>
              <h2 className="text-2xl font-bold text-slate-900">🎯 Generate Your Learning Plan</h2>
              <p className="text-slate-600 mt-2">Tell us about your learning goals and we'll create a personalized plan just for you!</p>
            </div>
            
            <form onSubmit={generateNewPlan} className="p-6 space-y-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-2">Learning Topic *</label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={config.topic}
                  onChange={handleConfigChange}
                  placeholder="e.g., React.js, Data Science, Python, Machine Learning"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
                <p className="text-sm text-slate-500 mt-1">What technology or skill do you want to learn?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="days" className="block text-sm font-medium text-slate-700 mb-2">Plan Duration (days) *</label>
                  <input
                    type="number"
                    id="days"
                    name="days"
                    value={config.days}
                    onChange={handleConfigChange}
                    min="1"
                    max="30"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                  <p className="text-sm text-slate-500 mt-1">1-30 days</p>
                </div>

                <div>
                  <label htmlFor="hoursPerDay" className="block text-sm font-medium text-slate-700 mb-2">Hours per Day *</label>
                  <input
                    type="number"
                    id="hoursPerDay"
                    name="hoursPerDay"
                    value={config.hoursPerDay}
                    onChange={handleConfigChange}
                    min="0.5"
                    max="12"
                    step="0.5"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                  <p className="text-sm text-slate-500 mt-1">0.5-12 hours</p>
                </div>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 mb-2">Difficulty Level *</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={config.difficulty}
                  onChange={handleConfigChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                  required
                >
                  <option value="beginner">Beginner - New to this topic</option>
                  <option value="medium">Medium - Some experience</option>
                  <option value="intermediate">Intermediate - Some experience</option>
                  <option value="advanced">Advanced - Deep dive & mastery</option>
                </select>
              </div>

              <div>
                <label htmlFor="goals" className="block text-sm font-medium text-slate-700 mb-2">Your Learning Goals</label>
                <textarea
                  id="goals"
                  name="goals"
                  value={config.goals}
                  onChange={handleConfigChange}
                  placeholder="What do you want to achieve? (e.g., Build a portfolio project, Get job-ready, Pass certification exam)"
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
                <p className="text-sm text-slate-500 mt-1">Optional - helps personalize your plan</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={backToList}
                  disabled={generating}
                  className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      Generate Learning Plan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {toast.show && <Toast message={toast.message} type={toast.type} />}
      </div>
    );
  }

  // Detail View - Show individual plan
  if (view === 'detail' && selectedPlan) {
    // Handle different plan structures
    const planData = selectedPlan.plan || selectedPlan;
    let days = [];
    
    // Try different possible structures
    if (Array.isArray(planData)) {
      days = planData;
    } else if (planData.plan && Array.isArray(planData.plan)) {
      days = planData.plan;
    } else if (planData.days && Array.isArray(planData.days)) {
      days = planData.days;
    } else if (planData.schedule && Array.isArray(planData.schedule)) {
      days = planData.schedule;
    }
    
    const planTopic = selectedPlan.domain || selectedPlan.title || planData.domain || 'Learning Plan';
    const totalDays = selectedPlan.duration || days.length;
    const hoursPerDay = selectedPlan.metadata?.hoursPerDay || planData.estimatedHoursPerDay || 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button 
              onClick={backToList}
              className="flex items-center gap-2 text-indigo-100 hover:text-white mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to All Plans
            </button>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{planTopic}</h1>
            <p className="text-indigo-100 mb-4">
              {selectedPlan.description || 'A personalized learning plan tailored to your needs'}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                📅 {totalDays}
              </span>
              {hoursPerDay > 0 && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  ⏱️ {hoursPerDay} hrs/day
                </span>
              )}
              {selectedPlan.metadata?.difficulty && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  🎯 {selectedPlan.metadata.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Plan Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {days.length > 0 ? (
            <div className="space-y-6">
              {days.map((day, dayIndex) => {
                const dayNumber = day.day || dayIndex + 1;
                const dayTopic = day.topic || day.title || `Day ${dayNumber}`;
                const tasks = day.tasks || day.activities || [];

                return (
                  <div key={dayIndex} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {dayNumber}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{dayTopic}</h3>
                        <p className="text-sm text-slate-500">Day {dayNumber}</p>
                      </div>
                    </div>

                    {day.description && (
                      <p className="text-slate-600 mb-4">{day.description}</p>
                    )}

                    {/* Display topics if available */}
                    {day.topics && Array.isArray(day.topics) && day.topics.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-slate-800 mb-2">Topics:</h4>
                        <div className="flex flex-wrap gap-2">
                          {day.topics.map((topic, topicIndex) => (
                            <span key={topicIndex} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {tasks.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-800 mb-3">Tasks:</h4>
                        {tasks.map((task, taskIndex) => {
                          const taskText = typeof task === 'string' ? task : task.description || task.title || task.task;
                          return (
                            <div key={taskIndex} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-slate-700">{taskText}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {day.notes && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <strong className="text-yellow-800">📝 Notes:</strong>
                        <p className="text-yellow-700 mt-1">{day.notes}</p>
                      </div>
                    )}

                    {day.resources && day.resources.length > 0 && (
                      <div className="mt-4">
                        <strong className="text-slate-800 block mb-2">📚 Resources:</strong>
                        <ul className="space-y-1">
                          {day.resources.map((resource, index) => (
                            <li key={index} className="text-slate-600">
                              {typeof resource === 'string' ? (
                                resource
                              ) : (
                                <a 
                                  href={resource.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:text-indigo-700 underline"
                                >
                                  {resource.title || resource.name}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">No detailed plan content available.</p>
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        {toast.show && <Toast message={toast.message} type={toast.type} />}
      </div>
    );
  }

  return null;
};

export default AllLearningPlansPage;