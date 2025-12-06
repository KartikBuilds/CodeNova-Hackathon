import UserProfile from '../models/UserProfile.js';

/**
 * @desc    Get user profile
 * @route   GET /api/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let profile = await UserProfile.findOne({ userId });

    // If profile doesn't exist, create a default one
    if (!profile) {
      profile = await UserProfile.create({
        userId,
        primaryDomain: '',
        level: '',
        goals: '',
        profileImage: '',
        bio: '',
        interests: [],
        learningGoals: [],
        skillLevel: new Map(),
        preferences: {
          learningStyle: '',
          studyTimePerDay: 0,
          notificationsEnabled: true
        }
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to retrieve profile',
        details: error.message
      }
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Find existing profile or create new one
    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
      // Create new profile with provided data
      profile = await UserProfile.create({
        userId,
        ...updateData
      });
    } else {
      // Update existing profile
      // Handle nested preferences object properly
      if (updateData.preferences) {
        profile.preferences = {
          ...profile.preferences.toObject(),
          ...updateData.preferences
        };
      }

      // Update primary fields
      if (updateData.primaryDomain !== undefined) profile.primaryDomain = updateData.primaryDomain;
      if (updateData.level !== undefined) profile.level = updateData.level;
      if (updateData.goals !== undefined) profile.goals = updateData.goals;
      
      // Update other fields
      if (updateData.profileImage !== undefined) profile.profileImage = updateData.profileImage;
      if (updateData.bio !== undefined) profile.bio = updateData.bio;
      if (updateData.interests !== undefined) profile.interests = updateData.interests;
      if (updateData.learningGoals !== undefined) profile.learningGoals = updateData.learningGoals;
      if (updateData.skillLevel !== undefined) {
        // Convert skillLevel object to Map
        if (typeof updateData.skillLevel === 'object' && !updateData.skillLevel instanceof Map) {
          profile.skillLevel = new Map(Object.entries(updateData.skillLevel));
        } else {
          profile.skillLevel = updateData.skillLevel;
        }
      }

      await profile.save();
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update profile',
        details: error.message
      }
    });
  }
};
