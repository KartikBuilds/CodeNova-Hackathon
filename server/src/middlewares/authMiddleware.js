import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Auth middleware - verify JWT token and attach user to request
const authMiddleware = async (req, res, next) => {
  let token;

  // Read Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Return 401 if token is missing
  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Not authorized to access this route. Please login.',
        status: 401
      }
    });
  }

  try {
    // Verify JWT using JWT_SECRET
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );

    // Get user from database
    const user = await User.findById(decoded.id);

    // Return 401 if user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not found. Please login again.',
          status: 401
        }
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Your account has been deactivated. Please contact support.',
          status: 403
        }
      });
    }

    // Attach req.user = { id } (plus full user object for convenience)
    req.user = {
      id: user._id,
      ...user.toObject()
    };
    
    next();
  } catch (error) {
    // Return 401 if token is invalid
    return res.status(401).json({
      success: false,
      error: {
        message: 'Not authorized to access this route. Invalid token.',
        status: 401
      }
    });
  }
};

export default authMiddleware;

// Named export for flexibility
export { authMiddleware };
