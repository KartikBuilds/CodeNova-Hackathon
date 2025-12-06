import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/apiClient';
import Toast from '../components/Toast';
import './LearningPath.css';

const LearningPath = () => {
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [domain, setDomain] = useState('');
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  useEffect(() => {
    fetchUserDomain();
  }, []);

  const fetchUserDomain = async () => {
    try {
      const response = await api.get('/profile');
      console.log('Profile response:', response.data); // Debug log
      
      // Handle nested data structure
      const profileData = response.data?.data || response.data;
      const userDomain = profileData?.primaryDomain;
      
      if (userDomain) {
        setDomain(userDomain);
        fetchLearningPath(userDomain);
      } else {
        setError('Please set your primary domain in profile first');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Please complete your profile first');
      setLoading(false);
    }
  };

  const fetchLearningPath = async (userDomain) => {
    setLoading(true);
    try {
      const response = await api.get(`/learning/path?domain=${userDomain}`);
      console.log('Learning path response:', response.data); // Debug log
      
      // Handle nested data structure
      const pathData = response.data?.data?.learningPath || response.data?.learningPath;
      
      if (pathData) {
        setLearningPath(pathData);
        setError('');
      } else {
        setError('No learning path found. Generate one from your profile.');
      }
    } catch (err) {
      console.error('Error fetching learning path:', err);
      setError('Failed to load learning path');
    } finally {
      setLoading(false);
    }
  };

  const handleRebuildPath = async () => {
    setLoading(true);
    try {
      await api.post('/learning/path/rebuild');
      showToast('Learning path rebuilt successfully!', 'success');
      fetchLearningPath(domain);
    } catch (err) {
      console.error('Error rebuilding path:', err);
      showToast('Failed to rebuild learning path', 'error');
      setLoading(false);
    }
  };

  const handleModuleClick = (moduleId) => {
    navigate(`/module/${moduleId}`);
  };

  const handleUpdateStatus = async (moduleId, newStatus) => {
    try {
      await api.patch(`/learning/path/module/${moduleId}`, {
        domain,
        status: newStatus
      });
      
      showToast('Progress updated!', 'success');
      fetchLearningPath(domain);
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Failed to update progress', 'error');
    }
  };

  if (loading) {
    return (
      <div className="learning-path-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your learning path...</p>
        </div>
      </div>
    );
  }

  if (error && !learningPath) {
    return (
      <div className="learning-path-container">
        <div className="error-container">
          <h2>📚 No Learning Path Yet</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/profile')} className="action-button">
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  const pathModules = learningPath?.path || [];
  const progress = learningPath?.progressPercentage || 0;
  const completedCount = pathModules.filter(m => m.status === 'completed').length;
  const totalCount = pathModules.length;

  return (
    <div className="learning-path-container">
      <div className="path-header">
        <div className="path-header-content">
          <h1>🎯 Your Learning Path</h1>
          <p className="path-domain">{domain}</p>
          
          <div className="progress-section">
            <div className="progress-stats">
              <span className="stat">
                <strong>{completedCount}</strong> / {totalCount} modules completed
              </span>
              <span className="stat">
                <strong>{progress}%</strong> progress
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <button onClick={handleRebuildPath} className="rebuild-button">
          🔄 Rebuild Path
        </button>
      </div>

      <div className="modules-timeline">
        {pathModules.map((pathModule, index) => {
          const module = pathModule.moduleId;
          const course = module?.courseId;
          const status = pathModule.status || 'not-started';
          
          if (!module) return null;

          return (
            <div 
              key={module._id || index} 
              className={`timeline-module ${status}`}
            >
              <div className="timeline-marker">
                <div className="timeline-dot">
                  {status === 'completed' && '✓'}
                  {status === 'in-progress' && '▶'}
                  {status === 'not-started' && index + 1}
                </div>
                {index < pathModules.length - 1 && <div className="timeline-line" />}
              </div>

              <div className="module-card">
                <div className="module-header">
                  <div className="module-info">
                    <span className="module-number">Module {index + 1}</span>
                    <h3>{module.title}</h3>
                    {course && (
                      <p className="course-name">
                        📚 {course.title} • {course.level}
                      </p>
                    )}
                  </div>
                  <span className={`status-badge ${status}`}>
                    {status === 'completed' && '✅ Completed'}
                    {status === 'in-progress' && '▶️ In Progress'}
                    {status === 'not-started' && '⏸️ Not Started'}
                  </span>
                </div>

                <div className="module-actions">
                  <button 
                    onClick={() => handleModuleClick(module._id)}
                    className="view-button"
                  >
                    View Module
                  </button>

                  {status === 'not-started' && (
                    <button 
                      onClick={() => handleUpdateStatus(module._id, 'in-progress')}
                      className="status-button start"
                    >
                      Start Learning
                    </button>
                  )}

                  {status === 'in-progress' && (
                    <button 
                      onClick={() => handleUpdateStatus(module._id, 'completed')}
                      className="status-button complete"
                    >
                      Mark Complete
                    </button>
                  )}

                  {status === 'completed' && (
                    <button 
                      onClick={() => handleUpdateStatus(module._id, 'in-progress')}
                      className="status-button reset"
                    >
                      Reset Status
                    </button>
                  )}
                </div>

                {pathModule.startedAt && (
                  <div className="module-meta">
                    <small>
                      Started: {new Date(pathModule.startedAt).toLocaleDateString()}
                    </small>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default LearningPath;
