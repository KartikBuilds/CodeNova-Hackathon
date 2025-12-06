import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import Toast from '../components/Toast';
import './Profile.css';

const Profile = () => {
  const [formData, setFormData] = useState({
    bio: '',
    interests: [],
    learningGoals: [],
    primaryDomain: '',
    level: '',
    preferences: {
      learningStyle: '',
      studyTimePerDay: 0,
      notificationsEnabled: true
    }
  });
  const [interestInput, setInterestInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  const domains = [
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Data Structures & Algorithms',
    'DevOps',
    'AI/ML',
    'Mobile Development',
    'Cloud Computing',
    'Cybersecurity',
    'Database Management',
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const learningStyles = [
    { value: 'visual', label: 'Visual - Learn by seeing' },
    { value: 'auditory', label: 'Auditory - Learn by hearing' },
    { value: 'reading', label: 'Reading/Writing - Learn by reading' },
    { value: 'kinesthetic', label: 'Kinesthetic - Learn by doing' },
  ];

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      const profileData = response.data?.data || response.data;
      
      if (profileData) {
        setFormData({
          bio: profileData.bio || '',
          interests: profileData.interests || [],
          learningGoals: profileData.learningGoals || [],
          primaryDomain: profileData.primaryDomain || '',
          level: profileData.level || '',
          preferences: {
            learningStyle: profileData.preferences?.learningStyle || '',
            studyTimePerDay: profileData.preferences?.studyTimePerDay || 0,
            notificationsEnabled: profileData.preferences?.notificationsEnabled ?? true
          }
        });
        
        // Set profile image if exists
        if (profileData.profileImage) {
          setImagePreview(profileData.profileImage);
        }
        
        setHasProfile(true);
        setIsEditing(false);
      }
    } catch (err) {
      console.log('No existing profile found');
      setIsEditing(true); // Show edit form if no profile exists
      setHasProfile(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interestInput.trim()]
      });
      setInterestInput('');
    }
  };

  const removeInterest = (index) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((_, i) => i !== index)
    });
  };

  const addGoal = () => {
    if (goalInput.trim() && !formData.learningGoals.includes(goalInput.trim())) {
      setFormData({
        ...formData,
        learningGoals: [...formData.learningGoals, goalInput.trim()]
      });
      setGoalInput('');
    }
  };

  const removeGoal = (index) => {
    setFormData({
      ...formData,
      learningGoals: formData.learningGoals.filter((_, i) => i !== index)
    });
  };

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

    setLoading(true);

    try {
      // Prepare profile data with image
      const profileData = {
        ...formData,
        profileImage: imagePreview // Include base64 image
      };

      // Update profile
      await api.put('/profile', profileData);

      // Rebuild learning path if domain/level are set
      if (formData.primaryDomain && formData.level) {
        try {
          await api.post('/learning/path/rebuild');
        } catch (err) {
          console.error('Failed to rebuild learning path:', err);
        }
      }

      showToast('Profile updated successfully!', 'success');
      setHasProfile(true);
      setIsEditing(false);
      await fetchProfile(); // Refresh profile data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          {hasProfile && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn-edit"
            >
              Edit Profile
            </button>
          )}
        </div>
        
        <p className="profile-subtitle">
          {isEditing ? 'Manage your personal information and preferences' : 'Your profile information'}
        </p>

        {error && <div className="error-message">{error}</div>}

        {!isEditing && hasProfile ? (
          // View Mode
          <div className="profile-view">
            {/* Profile Picture Display */}
            <div className="profile-picture-display">
              <div className="picture-preview">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" />
                ) : (
                  <div className="default-avatar">
                    <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h2>{user?.name || 'User'}</h2>
                <p className="user-email">{user?.email}</p>
                {formData.bio && <p className="user-bio">{formData.bio}</p>}
              </div>
            </div>

            {/* Learning Info */}
            <div className="info-section">
              <h3>Learning Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Primary Domain</label>
                  <span>{formData.primaryDomain || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Skill Level</label>
                  <span>{formData.level ? levels.find(l => l.value === formData.level)?.label : 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Learning Style</label>
                  <span>{formData.preferences.learningStyle ? learningStyles.find(ls => ls.value === formData.preferences.learningStyle)?.label : 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Daily Study Time</label>
                  <span>{formData.preferences.studyTimePerDay ? `${formData.preferences.studyTimePerDay} minutes` : 'Not set'}</span>
                </div>
              </div>
            </div>

            {/* Interests */}
            {formData.interests.length > 0 && (
              <div className="info-section">
                <h3>Interests</h3>
                <div className="tags-container">
                  {formData.interests.map((interest, index) => (
                    <span key={index} className="tag-display">{interest}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Goals */}
            {formData.learningGoals.length > 0 && (
              <div className="info-section">
                <h3>Learning Goals</h3>
                <div className="tags-container">
                  {formData.learningGoals.map((goal, index) => (
                    <span key={index} className="tag-display">{goal}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences */}
            <div className="info-section">
              <h3>Preferences</h3>
              <div className="preference-item">
                <span>Email Notifications: {formData.preferences.notificationsEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className="profile-form">
          {/* Profile Picture Section */}
          <div className="profile-picture-section">
            <div className="picture-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" />
              ) : (
                <div className="default-avatar">
                  <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
              )}
            </div>
            <div className="picture-upload">
              <label htmlFor="profileImage" className="upload-btn">
                Choose Photo
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <small>Max size: 5MB</small>
            </div>
          </div>

          {/* Basic Info */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows="3"
                maxLength={500}
              />
              <small className="char-count">{formData.bio.length}/500</small>
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="form-section">
            <h3>Learning Preferences</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="primaryDomain">Primary Domain</label>
                <select
                  id="primaryDomain"
                  value={formData.primaryDomain}
                  onChange={(e) => setFormData({ ...formData, primaryDomain: e.target.value })}
                >
                  <option value="">Select domain</option>
                  {domains.map((domain) => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="level">Skill Level</label>
                <select
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  <option value="">Select level</option>
                  {levels.map((level) => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="learningStyle">Learning Style</label>
                <select
                  id="learningStyle"
                  value={formData.preferences.learningStyle}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, learningStyle: e.target.value }
                  })}
                >
                  <option value="">Select style</option>
                  {learningStyles.map((style) => (
                    <option key={style.value} value={style.value}>{style.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="studyTime">Daily Study Time (minutes)</label>
                <input
                  type="number"
                  id="studyTime"
                  value={formData.preferences.studyTimePerDay}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, studyTimePerDay: parseInt(e.target.value) || 0 }
                  })}
                  min="0"
                  max="720"
                  placeholder="60"
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.preferences.notificationsEnabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, notificationsEnabled: e.target.checked }
                  })}
                />
                <span>Enable email notifications</span>
              </label>
            </div>
          </div>

          {/* Interests */}
          <div className="form-section">
            <h3>Interests</h3>
            <div className="tag-input-group">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                placeholder="Add an interest (press Enter)"
              />
              <button type="button" onClick={addInterest} className="btn-add">Add</button>
            </div>
            <div className="tags-container">
              {formData.interests.map((interest, index) => (
                <span key={index} className="tag">
                  {interest}
                  <button type="button" onClick={() => removeInterest(index)}>&times;</button>
                </span>
              ))}
            </div>
          </div>

          {/* Learning Goals */}
          <div className="form-section">
            <h3>Learning Goals</h3>
            <div className="tag-input-group">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                placeholder="Add a learning goal (press Enter)"
              />
              <button type="button" onClick={addGoal} className="btn-add">Add</button>
            </div>
            <div className="tags-container">
              {formData.learningGoals.map((goal, index) => (
                <span key={index} className="tag">
                  {goal}
                  <button type="button" onClick={() => removeGoal(index)}>&times;</button>
                </span>
              ))}
            </div>
          </div>

            <div className="form-buttons">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
              {hasProfile && (
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="btn-cancel"
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Profile;
