import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardAPI } from '../api/dashboardAPI';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import { learningPlansAPI, flashcardsAPI } from '../api/learningAPI';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [learningPath, setLearningPath] = useState(null);
  const [learningPlans, setLearningPlans] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
    fetchLearningData();
  }, []);

  const fetchLearningData = async () => {
    try {
      // Fetch learning path - try multiple approaches
      let pathFound = false;
      try {
        // First try without domain
        const pathResponse = await api.get('/learning/path');
        const pathData = pathResponse.data?.data?.learningPath || pathResponse.data?.learningPath || pathResponse.data;
        console.log('Dashboard learning path data (no domain):', pathData);
        
        if (pathData && (pathData.path || pathData.modules || Array.isArray(pathData))) {
          setLearningPath(pathData);
          pathFound = true;
        }
      } catch (err) {
        console.log('No learning path found without domain');
      }

      // If no path found, try with user's primary domain
      if (!pathFound) {
        try {
          const profileResponse = await api.get('/profile');
          const userProfile = profileResponse.data;
          const primaryDomain = userProfile.primaryDomain;
          
          if (primaryDomain) {
            const pathResponse = await api.get(`/learning/path?domain=${encodeURIComponent(primaryDomain)}`);
            const pathData = pathResponse.data?.data?.learningPath || pathResponse.data?.learningPath || pathResponse.data;
            console.log('Dashboard learning path data (with domain):', pathData);
            
            if (pathData && (pathData.path || pathData.modules || Array.isArray(pathData))) {
              setLearningPath(pathData);
              pathFound = true;
            }
          }
        } catch (err) {
          console.log('No learning path found with domain');
        }
      }

      if (!pathFound) {
        setLearningPath(null);
      }

      // Fetch learning plans from database
      try {
        const plansResponse = await learningPlansAPI.getPlans();
        const plansData = plansResponse.data || plansResponse || [];
        setLearningPlans(Array.isArray(plansData) ? plansData : []);
      } catch (err) {
        console.log('No learning plans found in database');
      }

      // Fetch flashcards from database and merge with localStorage
      try {
        const decksResponse = await flashcardsAPI.getDecks();
        const dbDecks = decksResponse.data || decksResponse || [];
        
        // Also get from localStorage for backwards compatibility
        let localCards = [];
        try {
          const savedFlashcards = localStorage.getItem('ai-learning-flashcards');
          if (savedFlashcards) {
            const parsed = JSON.parse(savedFlashcards);
            localCards = parsed.flashcards || [];
          }
        } catch (err) {
          console.log('No flashcards found in localStorage');
        }

        // Merge database decks with localStorage cards
        const allFlashcards = [];
        if (Array.isArray(dbDecks)) {
          dbDecks.forEach(deck => {
            if (deck.flashcards && Array.isArray(deck.flashcards)) {
              allFlashcards.push(...deck.flashcards);
            }
          });
        }
        allFlashcards.push(...localCards);

        setFlashcards(allFlashcards);
      } catch (err) {
        console.log('Error fetching flashcards:', err);
        // Fallback to localStorage only
        try {
          const savedFlashcards = localStorage.getItem('ai-learning-flashcards');
          if (savedFlashcards) {
            const parsed = JSON.parse(savedFlashcards);
            setFlashcards(parsed.flashcards || []);
          }
        } catch (err2) {
          console.log('No flashcards found anywhere');
        }
      }
    } catch (err) {
      console.error('Error fetching learning data:', err);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await dashboardAPI.getSummary();
      setDashboardData(data);
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      
      // Set mock data for development
      setDashboardData({
        total_quizzes: 12,
        avg_score: 78.5,
        topics_mastered: ['React Basics', 'JavaScript ES6', 'CSS Flexbox'],
        weak_topics: ['Algorithms', 'Data Structures', 'System Design'],
        score_history: [
          { date: '2024-11-20', score: 65, quiz: 'Quiz 1' },
          { date: '2024-11-22', score: 72, quiz: 'Quiz 2' },
          { date: '2024-11-25', score: 80, quiz: 'Quiz 3' },
          { date: '2024-11-28', score: 75, quiz: 'Quiz 4' },
          { date: '2024-12-01', score: 85, quiz: 'Quiz 5' },
          { date: '2024-12-04', score: 90, quiz: 'Quiz 6' },
        ],
        recent_activity: [
          { type: 'quiz', title: 'React Hooks Quiz', date: '2024-12-04', score: 90 },
          { type: 'course', title: 'Web Development Course', date: '2024-12-03' },
        ],
        learning_streak: 5,
        total_learning_time: 24,
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const {
    total_quizzes = 0,
    avg_score = 0,
    topics_mastered = [],
    weak_topics = [],
    score_history = [],
    recent_activity = [],
    learning_streak = 0,
    total_learning_time = 0,
  } = dashboardData || {};

  // KPI Card Component
  const KPICard = ({ icon, value, label, gradient }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${gradient} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-800">{value}</div>
          <div className="text-sm text-slate-500">{label}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="animate-fadeIn">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {user?.name || 'Learner'}! 👋
              </h1>
              <p className="text-indigo-100">Here's your learning progress overview</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/catalog" 
                className="px-5 py-2.5 bg-white text-indigo-600 font-semibold rounded-xl hover:shadow-lg hover:shadow-white/20 transform hover:-translate-y-0.5 transition-all"
              >
                Browse Courses
              </Link>
              <Link 
                to="/plan" 
                className="px-5 py-2.5 bg-white/10 backdrop-blur text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                Learning Plan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-16 mb-8">
          <KPICard 
            icon="📝" 
            value={total_quizzes} 
            label="Quizzes Taken" 
            gradient="bg-blue-100 text-blue-600"
          />
          <KPICard 
            icon="🎯" 
            value={`${avg_score.toFixed(1)}%`} 
            label="Average Score" 
            gradient="bg-green-100 text-green-600"
          />
          <KPICard 
            icon="🔥" 
            value={learning_streak} 
            label="Day Streak" 
            gradient="bg-orange-100 text-orange-600"
          />
          <KPICard 
            icon="⏱️" 
            value={`${total_learning_time}h`} 
            label="Learning Time" 
            gradient="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score History */}
          {score_history.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">📈 Score History</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={score_history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      padding: '12px 16px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="url(#lineGradient)" 
                    strokeWidth={3}
                    dot={{ fill: '#667eea', strokeWidth: 0, r: 5 }}
                    activeDot={{ r: 7, fill: '#764ba2' }}
                    name="Score (%)"
                  />
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Quiz Performance */}
          {score_history.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">📊 Quiz Performance</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={score_history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="quiz" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      padding: '12px 16px'
                    }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="url(#barGradient)" 
                    name="Score (%)"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Learning Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Learning Path */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <span className="text-2xl">🎯</span> Learning Path
              </h2>
              {(() => {
                // More comprehensive path detection
                const hasPath = learningPath && (
                  // Direct path array
                  (learningPath.path && Array.isArray(learningPath.path) && learningPath.path.length > 0) ||
                  // Modules array  
                  (learningPath.modules && Array.isArray(learningPath.modules) && learningPath.modules.length > 0) ||
                  // Direct array
                  (Array.isArray(learningPath) && learningPath.length > 0) ||
                  // Topics array
                  (learningPath.topics && Array.isArray(learningPath.topics) && learningPath.topics.length > 0) ||
                  // Has valid learning path object with any content
                  (typeof learningPath === 'object' && learningPath.domain) ||
                  // Has valid learning path ID
                  (learningPath._id || learningPath.id)
                );
                
                console.log('Dashboard hasPath check:', {
                  learningPath,
                  hasPath,
                  pathExists: learningPath?.path?.length,
                  modulesExists: learningPath?.modules?.length,
                  isArray: Array.isArray(learningPath),
                  hasId: !!(learningPath?._id || learningPath?.id)
                });
                
                return (
                  <Link 
                    to="/path" 
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    {hasPath ? 'View Path' : 'Create Path'}
                  </Link>
                );
              })()}
            </div>
            {(() => {
              // Check multiple possible learning path structures (same logic as header)
              const hasPath = learningPath && (
                (learningPath.path && Array.isArray(learningPath.path) && learningPath.path.length > 0) ||
                (learningPath.modules && Array.isArray(learningPath.modules) && learningPath.modules.length > 0) ||
                (Array.isArray(learningPath) && learningPath.length > 0) ||
                (learningPath.topics && Array.isArray(learningPath.topics) && learningPath.topics.length > 0) ||
                (typeof learningPath === 'object' && learningPath.domain) ||
                (learningPath._id || learningPath.id)
              );

              if (hasPath) {
                // Get the actual path array from various possible structures
                const pathArray = learningPath.path || learningPath.modules || learningPath.topics || (Array.isArray(learningPath) ? learningPath : []);
                
                return (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Progress</span>
                      <span>{learningPath.progressPercentage || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${learningPath.progressPercentage || 0}%` }}
                      />
                    </div>
                    <div className="space-y-2">
                      {pathArray.slice(0, 3).map((pathItem, index) => {
                        // Handle different data structures
                        const module = pathItem.moduleId || pathItem.module || pathItem;
                        const status = pathItem.status || 'not-started';
                        const title = module?.title || module?.name || pathItem?.title || pathItem?.name || `Module ${index + 1}`;
                        
                        return (
                          <div key={index} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                            <div className={`w-2 h-2 rounded-full ${
                              status === 'completed' ? 'bg-green-500' : 
                              status === 'in-progress' ? 'bg-indigo-500' : 'bg-slate-300'
                            }`}></div>
                            <span className="text-sm text-slate-700 flex-1 line-clamp-1">{title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="text-center py-6">
                    <p className="text-slate-500 text-sm mb-3">No learning path yet</p>
                    <Link 
                      to="/path" 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                    >
                      Create Path
                    </Link>
                  </div>
                );
              }
            })()}
          </div>

          {/* Learning Plans */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <span className="text-2xl">📋</span> Learning Plans
              </h2>
              <Link 
                to="/plan" 
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            {learningPlans.length > 0 ? (
              <div className="space-y-3">
                {learningPlans.slice(0, 3).map((plan, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg">
                    <h4 className="font-medium text-slate-800 text-sm mb-1">{plan.title || 'Learning Plan'}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{plan.description || 'Custom learning plan'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-500">{plan.domain || 'General'}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="text-xs text-slate-500">{plan.level || 'All levels'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-500 text-sm mb-3">No learning plans yet</p>
                <Link 
                  to="/plan" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                >
                  Create Plan
                </Link>
              </div>
            )}
          </div>

          {/* Flashcards */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <span className="text-2xl">🧠</span> Flashcards
              </h2>
              <Link 
                to="/flashcards" 
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            {flashcards.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-indigo-50 rounded-lg">
                    <div className="font-semibold text-indigo-700">{flashcards.length}</div>
                    <div className="text-xs text-indigo-600">Total Cards</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-700">
                      {Math.round(flashcards.reduce((sum, card) => sum + (card.mastery || 0), 0) / flashcards.length) || 0}%
                    </div>
                    <div className="text-xs text-green-600">Avg Mastery</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {flashcards.slice(0, 2).map((card, index) => (
                    <div key={index} className="p-2 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-700 line-clamp-1">{card.question}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-slate-200 rounded-full h-1">
                          <div 
                            className="bg-indigo-600 h-1 rounded-full"
                            style={{ width: `${card.mastery || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{card.mastery || 0}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-500 text-sm mb-3">No flashcards yet</p>
                <Link 
                  to="/flashcards" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                >
                  Create Cards
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Topics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Mastered Topics */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">💪</span> Topics Mastered
            </h2>
            {topics_mastered.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topics_mastered.map((topic, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Complete quizzes to master topics!</p>
            )}
          </div>

          {/* Weak Topics */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📚</span> Areas for Improvement
            </h2>
            {weak_topics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {weak_topics.map((topic, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Great job! No weak areas detected.</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        {recent_activity && recent_activity.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">🕐 Recent Activity</h2>
            <div className="space-y-3">
              {recent_activity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
                    {activity.type === 'quiz' ? '📝' : '📚'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">{activity.title}</div>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      {activity.date && (
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                      )}
                      {activity.score !== undefined && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                          {activity.score}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { to: '/catalog', icon: '📚', title: 'Browse Catalogue', desc: 'Explore available courses', color: 'from-blue-500 to-indigo-600' },
              { to: '/plan', icon: '🗓️', title: 'Learning Plan', desc: 'View your personalized plan', color: 'from-purple-500 to-pink-600' },
              { to: '/profile', icon: '👤', title: 'Update Profile', desc: 'Manage your preferences', color: 'from-emerald-500 to-teal-600' },
            ].map((action, index) => (
              <Link 
                key={index}
                to={action.to} 
                className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <div className="font-semibold text-slate-800 mb-1">{action.title}</div>
                <div className="text-sm text-slate-500">{action.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
