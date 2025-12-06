import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import Toast from '../components/Toast';

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
    'Web Development', 'Data Science', 'Machine Learning',
    'Data Structures & Algorithms', 'DevOps', 'AI/ML',
    'Mobile Development', 'Cloud Computing', 'Cybersecurity', 'Database Management',
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
        if (profileData.profileImage) setImagePreview(profileData.profileImage);
        setHasProfile(true);
        setIsEditing(false);
      }
    } catch (err) {
      console.log('No existing profile found');
      setIsEditing(true);
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
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData({ ...formData, interests: [...formData.interests, interestInput.trim()] });
      setInterestInput('');
    }
  };

  const removeInterest = (index) => {
    setFormData({ ...formData, interests: formData.interests.filter((_, i) => i !== index) });
  };

  const addGoal = () => {
    if (goalInput.trim() && !formData.learningGoals.includes(goalInput.trim())) {
      setFormData({ ...formData, learningGoals: [...formData.learningGoals, goalInput.trim()] });
      setGoalInput('');
    }
  };

  const removeGoal = (index) => {
    setFormData({ ...formData, learningGoals: formData.learningGoals.filter((_, i) => i !== index) });
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const profileData = { ...formData, profileImage: imagePreview };
      await api.put('/profile', profileData);

      if (formData.primaryDomain && formData.level) {
        try { await api.post('/learning/path/rebuild'); } catch (err) { console.error('Failed to rebuild learning path:', err); }
      }

      showToast('Profile updated successfully!', 'success');
      setHasProfile(true);
      setIsEditing(false);
      await fetchProfile();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Section Card Component
  const SectionCard = ({ title, icon, children }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-xl">{icon}</span> {title}
      </h3>
      {children}
    </div>
  );

  // Tag Component
  const Tag = ({ text, onRemove, editable = false }) => (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
      {text}
      {editable && (
        <button type="button" onClick={onRemove} className="hover:text-indigo-900 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-indigo-100">
                {isEditing ? 'Manage your personal information and preferences' : 'Your profile information'}
              </p>
            </div>
            {hasProfile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 bg-white text-indigo-600 font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {!isEditing && hasProfile ? (
          // View Mode
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-white">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-slate-800">{user?.name || 'User'}</h2>
                  <p className="text-slate-500 mb-3">{user?.email}</p>
                  {formData.bio && <p className="text-slate-600 max-w-md">{formData.bio}</p>}
                </div>
              </div>
            </div>

            {/* Learning Info */}
            <SectionCard title="Learning Information" icon="📚">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Primary Domain', value: formData.primaryDomain },
                  { label: 'Skill Level', value: levels.find(l => l.value === formData.level)?.label },
                  { label: 'Learning Style', value: learningStyles.find(ls => ls.value === formData.preferences.learningStyle)?.label },
                  { label: 'Daily Study Time', value: formData.preferences.studyTimePerDay ? `${formData.preferences.studyTimePerDay} minutes` : null },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-sm text-slate-500 mb-1">{item.label}</div>
                    <div className="font-medium text-slate-800">{item.value || 'Not set'}</div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Interests */}
            {formData.interests.length > 0 && (
              <SectionCard title="Interests" icon="💡">
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => <Tag key={index} text={interest} />)}
                </div>
              </SectionCard>
            )}

            {/* Learning Goals */}
            {formData.learningGoals.length > 0 && (
              <SectionCard title="Learning Goals" icon="🎯">
                <div className="flex flex-wrap gap-2">
                  {formData.learningGoals.map((goal, index) => <Tag key={index} text={goal} />)}
                </div>
              </SectionCard>
            )}

            {/* Preferences */}
            <SectionCard title="Preferences" icon="⚙️">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${formData.preferences.notificationsEnabled ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                <span className="text-slate-600">
                  Email Notifications: {formData.preferences.notificationsEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </SectionCard>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-white">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
                <div>
                  <label htmlFor="profileImage" className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl cursor-pointer hover:bg-indigo-700 transition-colors">
                    Choose Photo
                  </label>
                  <input type="file" id="profileImage" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <p className="text-sm text-slate-500 mt-2">Max size: 5MB</p>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <SectionCard title="Basic Information" icon="👤">
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows="3"
                  maxLength={500}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
                <p className="text-sm text-slate-500 mt-1 text-right">{formData.bio.length}/500</p>
              </div>
            </SectionCard>

            {/* Learning Preferences */}
            <SectionCard title="Learning Preferences" icon="📚">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="primaryDomain" className="block text-sm font-medium text-slate-700 mb-2">Primary Domain</label>
                  <select
                    id="primaryDomain"
                    value={formData.primaryDomain}
                    onChange={(e) => setFormData({ ...formData, primaryDomain: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="">Select domain</option>
                    {domains.map((domain) => <option key={domain} value={domain}>{domain}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-slate-700 mb-2">Skill Level</label>
                  <select
                    id="level"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="">Select level</option>
                    {levels.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="learningStyle" className="block text-sm font-medium text-slate-700 mb-2">Learning Style</label>
                  <select
                    id="learningStyle"
                    value={formData.preferences.learningStyle}
                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, learningStyle: e.target.value } })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="">Select style</option>
                    {learningStyles.map((style) => <option key={style.value} value={style.value}>{style.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="studyTime" className="block text-sm font-medium text-slate-700 mb-2">Daily Study Time (minutes)</label>
                  <input
                    type="number"
                    id="studyTime"
                    value={formData.preferences.studyTimePerDay}
                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, studyTimePerDay: parseInt(e.target.value) || 0 } })}
                    min="0"
                    max="720"
                    placeholder="60"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preferences.notificationsEnabled}
                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, notificationsEnabled: e.target.checked } })}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700">Enable email notifications</span>
                </label>
              </div>
            </SectionCard>

            {/* Interests */}
            <SectionCard title="Interests" icon="💡">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                  placeholder="Add an interest"
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button type="button" onClick={addInterest} className="px-5 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest, index) => <Tag key={index} text={interest} onRemove={() => removeInterest(index)} editable />)}
              </div>
            </SectionCard>

            {/* Learning Goals */}
            <SectionCard title="Learning Goals" icon="🎯">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                  placeholder="Add a learning goal"
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button type="button" onClick={addGoal} className="px-5 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.learningGoals.map((goal, index) => <Tag key={index} text={goal} onRemove={() => removeGoal(index)} editable />)}
              </div>
            </SectionCard>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              {hasProfile && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                  className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Profile;
