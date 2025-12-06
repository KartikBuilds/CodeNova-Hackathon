import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../api/apiClient';

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    if (!isAuthenticated || !user) {
      setProfile(null);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/profile');
      const profileData = response.data?.data || response.data;
      setProfile(profileData);
    } catch (err) {
      console.log('No profile found or error fetching profile:', err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/profile', profileData);
      const updatedProfile = response.data?.data || response.data;
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const clearProfile = () => {
    setProfile(null);
  };

  // Fetch profile when user authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile();
    } else {
      clearProfile();
    }
  }, [isAuthenticated, user]);

  const value = {
    profile,
    loading,
    fetchProfile,
    updateProfile,
    clearProfile,
    profileImage: profile?.profileImage || null,
    getDefaultAvatar: () => user?.name?.charAt(0)?.toUpperCase() || 'U'
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};