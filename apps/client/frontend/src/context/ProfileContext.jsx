import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ProfileContext } from '../hooks/useProfile';
import { api } from '../api/apiClient';

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Memoised so the effect below can depend on it without refetching on every render
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setProfile(null);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/profile');
      const profileData = response.data?.data || response.data;
      setProfile(profileData);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

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
      setProfile(null);
    }
  }, [isAuthenticated, user, fetchProfile]);

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
