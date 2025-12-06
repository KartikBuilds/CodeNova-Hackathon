import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import Toast from '../components/Toast';
import './Profile.css';

const Profile = () => {
  const [formData, setFormData] = useState({
    primaryDomain: '',
    level: '',
    goals: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const navigate = useNavigate();
  const { user } = useAuth();

  const domains = [
    'Web Development',
    'Data Structures & Algorithms',
    'AI/ML',
    'Mobile Development',
    'DevOps',
    'Cloud Computing',
    'Cybersecurity',
    'Database Management',
    'Backend Development',
    'Frontend Development',
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  useEffect(() => {
    // Load existing profile data if available
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        if (response.data) {
          setFormData({
            primaryDomain: response.data.primaryDomain || '',
            level: response.data.level || '',
            goals: response.data.goals || '',
          });
        }
      } catch (err) {
        // Profile might not exist yet, ignore error
        console.log('No existing profile found');
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.primaryDomain || !formData.level) {
      setError('Please select both domain and level');
      return;
    }

    setLoading(true);

    try {
      // Update profile
      await api.put('/profile', formData);

      // Rebuild learning path
      await api.post('/learning/path/rebuild');

      showToast('Profile updated and learning path created successfully!', 'success');
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Complete Your Profile</h2>
        <p className="profile-subtitle">
          Help us personalize your learning experience
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="primaryDomain">Primary Domain *</label>
            <select
              id="primaryDomain"
              name="primaryDomain"
              value={formData.primaryDomain}
              onChange={handleChange}
              required
            >
              <option value="">Select your primary domain</option>
              {domains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="level">Skill Level *</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="">Select your level</option>
              {levels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="goals">Learning Goals</label>
            <textarea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="What do you want to achieve? (e.g., Build a full-stack app, Master algorithms, Get job-ready...)"
              rows="5"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="profile-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile & Generate Learning Path'}
          </button>
        </form>
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Profile;
