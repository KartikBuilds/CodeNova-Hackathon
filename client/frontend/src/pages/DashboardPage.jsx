import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardAPI } from '../api/dashboardAPI';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
              { to: '/catalog', icon: '📚', title: 'Browse Catalog', desc: 'Explore available courses', color: 'from-blue-500 to-indigo-600' },
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
