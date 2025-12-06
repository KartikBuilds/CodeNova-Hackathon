import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/apiClient';
import Toast from '../components/Toast';

const LearningPath = () => {
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [domain, setDomain] = useState('');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileData, setProfileData] = useState({
    primaryDomain: '',
    level: '',
    interests: [],
    learningGoals: []
  });
  const [interestInput, setInterestInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const navigate = useNavigate();

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
      // Try multiple API endpoints
      let response;
      let pathData = null;
      
      try {
        response = await api.get(`/learning/path?domain=${userDomain}`);
        pathData = response.data?.data?.learningPath || response.data?.learningPath || response.data;
      } catch (firstError) {
        console.log('First API call failed, trying alternative endpoint');
        try {
          response = await api.get('/learning/path');
          pathData = response.data?.data?.learningPath || response.data?.learningPath || response.data;
        } catch (secondError) {
          console.log('Second API call failed, trying to generate new path');
          await api.post('/learning/path/rebuild');
          response = await api.get('/learning/path');
          pathData = response.data?.data?.learningPath || response.data?.learningPath || response.data;
        }
      }
      
      console.log('Learning path response:', response.data);
      
      if (pathData && pathData.path && pathData.path.length > 0) {
        setLearningPath(pathData);
        setError('');
      } else {
        setError('No learning path found. Click "Rebuild Path" to generate one based on your profile.');
      }
    } catch (err) {
      console.error('Error fetching learning path:', err);
      setError('Failed to load learning path. Click "Rebuild Path" to generate a new one.');
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

  const addInterest = () => {
    if (interestInput.trim() && !profileData.interests.includes(interestInput.trim())) {
      setProfileData({ 
        ...profileData, 
        interests: [...profileData.interests, interestInput.trim()] 
      });
      setInterestInput('');
    }
  };

  const removeInterest = (index) => {
    setProfileData({ 
      ...profileData, 
      interests: profileData.interests.filter((_, i) => i !== index) 
    });
  };

  const addGoal = () => {
    if (goalInput.trim() && !profileData.learningGoals.includes(goalInput.trim())) {
      setProfileData({ 
        ...profileData, 
        learningGoals: [...profileData.learningGoals, goalInput.trim()] 
      });
      setGoalInput('');
    }
  };

  const removeGoal = (index) => {
    setProfileData({ 
      ...profileData, 
      learningGoals: profileData.learningGoals.filter((_, i) => i !== index) 
    });
  };

  const handleSaveProfile = async () => {
    if (!profileData.primaryDomain || !profileData.level) {
      setError('Please select both domain and skill level');
      return;
    }

    setLoading(true);
    try {
      // Save profile to database
      await api.put('/profile', {
        primaryDomain: profileData.primaryDomain,
        level: profileData.level,
        interests: profileData.interests,
        learningGoals: profileData.learningGoals,
        preferences: {
          learningStyle: 'visual',
          studyTimePerDay: 60,
          notificationsEnabled: true
        }
      });

      setDomain(profileData.primaryDomain);
      setShowProfileSetup(false);
      
      // Generate learning path
      await api.post('/learning/path/rebuild');
      await fetchLearningPath(profileData.primaryDomain);
      
      showToast('Profile saved and learning path generated!', 'success');
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-600 text-lg">Loading your learning path...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !learningPath) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!showProfileSetup ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Set Up Your Learning Path</h2>
              <p className="text-slate-600 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => setShowProfileSetup(true)} 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Set Up Here
                </button>
                <button 
                  onClick={() => navigate('/profile')} 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Go to Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Quick Profile Setup</h2>
                <p className="text-slate-600">Set up your learning preferences to generate a personalized learning path.</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Domain and Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Primary Domain *</label>
                    <select
                      value={profileData.primaryDomain}
                      onChange={(e) => setProfileData({ ...profileData, primaryDomain: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                      required
                    >
                      <option value="">Select your domain</option>
                      {domains.map((domain) => <option key={domain} value={domain}>{domain}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Skill Level *</label>
                    <select
                      value={profileData.level}
                      onChange={(e) => setProfileData({ ...profileData, level: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                      required
                    >
                      <option value="">Select your level</option>
                      {levels.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Interests (Optional)</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                      placeholder="Add an interest (e.g., React, Python)"
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={addInterest} 
                      className="px-5 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                        {interest}
                        <button type="button" onClick={() => removeInterest(index)} className="hover:text-indigo-900 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learning Goals */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Learning Goals (Optional)</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                      placeholder="Add a learning goal (e.g., Build a web app)"
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={addGoal} 
                      className="px-5 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.learningGoals.map((goal, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                        {goal}
                        <button type="button" onClick={() => removeGoal(index)} className="hover:text-green-900 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
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
                    onClick={() => setShowProfileSetup(false)}
                    disabled={loading}
                    className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={loading || !profileData.primaryDomain || !profileData.level}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating Path...
                      </>
                    ) : (
                      'Generate Learning Path'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const pathModules = learningPath?.path || [];
  const progress = learningPath?.progressPercentage || 0;
  const completedCount = pathModules.filter(m => m.status === 'completed').length;
  const totalCount = pathModules.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                Your Learning Path
              </h1>
              <p className="text-lg text-indigo-600 font-semibold capitalize">{domain}</p>
              
              <div className="mt-4">
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-700">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z\" />
                    </svg>
                    <strong>{completedCount}</strong> / {totalCount} modules completed
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 rounded-full text-sm font-medium text-indigo-700">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <strong>{progress}%</strong> progress
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleRebuildPath} 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Rebuild Path
            </button>
          </div>
        </div>

        {/* Learning Path Timeline */}
        <div className="space-y-6">
          {pathModules.map((pathModule, index) => {
            const module = pathModule.moduleId;
            const course = module?.courseId;
            const status = pathModule.status || 'not-started';
            
            if (!module) return null;

            const getStatusColor = () => {
              switch (status) {
                case 'completed': return 'bg-green-500 border-green-200';
                case 'in-progress': return 'bg-indigo-500 border-indigo-200';
                default: return 'bg-slate-300 border-slate-200';
              }
            };

            const getStatusBadge = () => {
              switch (status) {
                case 'completed': return { text: 'Completed', class: 'bg-green-100 text-green-700' };
                case 'in-progress': return { text: 'In Progress', class: 'bg-indigo-100 text-indigo-700' };
                default: return { text: 'Not Started', class: 'bg-slate-100 text-slate-600' };
              }
            };

            return (
              <div key={module._id || index} className="relative">
                {/* Timeline Line */}
                {index < pathModules.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-20 bg-slate-200 z-0"></div>
                )}
                
                <div className="flex gap-4">
                  {/* Timeline Marker */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full border-4 ${getStatusColor()} flex items-center justify-center text-white font-bold z-10`}>
                      {status === 'completed' ? '✓' : 
                       status === 'in-progress' ? '▶' : 
                       index + 1}
                    </div>
                  </div>

                  {/* Module Card */}
                  <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                            Module {index + 1}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadge().class}`}>
                            {getStatusBadge().text}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{module.title}</h3>
                        {course && (
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {course.title} • <span className="capitalize">{course.level}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => handleModuleClick(module._id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Module
                        </button>

                        {status === 'not-started' && (
                          <button 
                            onClick={() => handleUpdateStatus(module._id, 'in-progress')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Start Learning
                          </button>
                        )}

                        {status === 'in-progress' && (
                          <button 
                            onClick={() => handleUpdateStatus(module._id, 'completed')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Mark Complete
                          </button>
                        )}

                        {status === 'completed' && (
                          <button 
                            onClick={() => handleUpdateStatus(module._id, 'in-progress')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset Status
                          </button>
                        )}
                      </div>
                    </div>

                    {pathModule.startedAt && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-500">
                          Started: {new Date(pathModule.startedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default LearningPath;
