import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardAPI } from '../api/dashboardAPI';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
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

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name || 'Learner'}! 👋</h1>
          <p>Here's your learning progress overview</p>
        </div>
        <div className="header-actions">
          <Link to="/catalog" className="action-button primary">
            Browse Courses
          </Link>
          <Link to="/plan" className="action-button secondary">
            Learning Plan
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#dbeafe' }}>
            📝
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{total_quizzes}</div>
            <div className="kpi-label">Quizzes Taken</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#dcfce7' }}>
            🎯
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{avg_score.toFixed(1)}%</div>
            <div className="kpi-label">Average Score</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#fef3c7' }}>
            🔥
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{learning_streak}</div>
            <div className="kpi-label">Day Streak</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#f3e8ff' }}>
            ⏱️
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{total_learning_time}h</div>
            <div className="kpi-label">Learning Time</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Score History Chart */}
        {score_history.length > 0 && (
          <div className="chart-card">
            <h2>Score History</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={score_history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Score (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Performance Bar Chart */}
        {score_history.length > 0 && (
          <div className="chart-card">
            <h2>Quiz Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={score_history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="quiz" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="score" 
                  fill="url(#colorGradient)" 
                  name="Score (%)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#667eea" stopOpacity={1} />
                    <stop offset="100%" stopColor="#764ba2" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Topics Section */}
      <div className="topics-grid">
        {/* Mastered Topics */}
        <div className="topics-card mastered">
          <h2>💪 Topics Mastered</h2>
          {topics_mastered.length > 0 ? (
            <div className="topics-badges">
              {topics_mastered.map((topic, index) => (
                <span key={index} className="topic-badge success">
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-state">Complete quizzes to master topics!</p>
          )}
        </div>

        {/* Weak Topics */}
        <div className="topics-card weak">
          <h2>📚 Areas for Improvement</h2>
          {weak_topics.length > 0 ? (
            <div className="topics-badges">
              {weak_topics.map((topic, index) => (
                <span key={index} className="topic-badge warning">
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-state">Great job! No weak areas detected.</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {recent_activity && recent_activity.length > 0 && (
        <div className="activity-card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recent_activity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'quiz' ? '📝' : '📚'}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-meta">
                    {activity.date && (
                      <span className="activity-date">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                    )}
                    {activity.score !== undefined && (
                      <span className="activity-score">Score: {activity.score}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/catalog" className="action-card">
            <div className="action-icon">📚</div>
            <div className="action-title">Browse Catalog</div>
            <div className="action-description">Explore available courses</div>
          </Link>

          <Link to="/plan" className="action-card">
            <div className="action-icon">🗓️</div>
            <div className="action-title">Learning Plan</div>
            <div className="action-description">View your personalized plan</div>
          </Link>

          <Link to="/profile" className="action-card">
            <div className="action-icon">👤</div>
            <div className="action-title">Update Profile</div>
            <div className="action-description">Manage your preferences</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
