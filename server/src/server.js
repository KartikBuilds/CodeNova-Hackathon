// Must be the first import: ESM imports run in order, and app.js reads env vars when it loads
import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

// Fail fast: tokens signed with a missing/known-default secret can be forged by anyone
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
  console.error('FATAL: JWT_SECRET must be set to a secure, non-default value.');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Connect to MongoDB and start server
let server;

const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();

    // Start server after successful DB connection
    server = app.listen(PORT, HOST, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
const gracefulShutdown = async (signal) => {

  if (server) {
    server.close(async () => {

      try {
        // Close database connection
        const mongoose = (await import('mongoose')).default;
        await mongoose.connection.close();
        process.exit(0);
      } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Forcing shutdown after timeout.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
  console.error('Promise:', promise);

  // In production, you might want to log to an external service
  // and potentially shut down gracefully
  if (process.env.NODE_ENV === 'production') {
    console.error('Shutting down due to unhandled promise rejection...');
    gracefulShutdown('UNHANDLED_REJECTION');
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);

  // Exit process as the application is in an undefined state
  console.error('Shutting down due to uncaught exception...');
  process.exit(1);
});

export default server;
