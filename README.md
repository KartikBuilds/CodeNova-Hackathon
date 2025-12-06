# AI-Based Personalized Learning Assistant

A full-stack web application that provides personalized learning experiences with AI-powered quizzes, performance analysis, and adaptive learning plans.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Course Catalog**: Browse courses organized by domain (Web Development, Data Science, etc.)
- **Interactive Quizzes**: AI-generated quizzes with multiple-choice questions
- **Performance Analysis**: Get insights on strengths, weaknesses, and recommended difficulty levels
- **Learning Plans**: Personalized day-by-day study plans based on your performance
- **Dashboard**: Track your progress with charts and statistics
- **AI Tutor Chat**: Get instant help with your learning topics

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing
- RESTful API architecture

### Frontend
- **React** with **Vite**
- **React Router** for navigation
- **Axios** for API calls
- **Recharts** for data visualization
- Context API for state management

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (running locally or MongoDB Atlas connection string)
- **npm** or **yarn**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "AI-based Personalized Learning Assistant"
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment variables
# Create a .env file with the following:
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-learning-assistant
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
NODE_ENV=development

# Start MongoDB (if running locally)
# On Windows with MongoDB installed:
net start MongoDB

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd client/frontend

# Install dependencies
npm install

# Configure environment variables
# Create a .env file with:
VITE_API_BASE_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📊 Database Setup

The application will automatically create the necessary collections when you start using it. However, you can seed some sample data:

### Sample Course Data

You can use the backend API to create courses. Here's an example using curl or Postman:

```bash
POST http://localhost:5000/api/catalog/courses
Content-Type: application/json

{
  "title": "Introduction to React",
  "domain": "Web Development",
  "description": "Learn React from scratch",
  "level": "Beginner"
}
```

## 🧪 Testing the Application

### 1. User Registration & Authentication

1. Navigate to `http://localhost:5173`
2. Click "Register" in the navbar
3. Fill in the registration form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. Click "Register" - you'll be redirected to the catalog

### 2. Browse Catalog

1. You'll see domains and courses listed
2. Click on a course to view modules
3. Click on a module to view content

### 3. Take a Quiz

1. From a module detail page, click "Take Quiz"
2. Fill in the quiz generation form:
   - Topic: React Hooks
   - Difficulty: Medium
   - Number of questions: 5
3. Click "Generate Quiz"
4. Answer the questions by selecting options
5. Click "Submit Quiz"
6. View your score and AI-generated analysis with:
   - Score percentage
   - Strengths identified
   - Weaknesses to work on
   - Recommended difficulty level
   - Question-by-question breakdown

### 4. View Dashboard

1. Navigate to `/dashboard` from the navbar
2. You'll see:
   - Total quizzes taken
   - Average score
   - Learning streak
   - Score history chart
   - Topics mastered
   - Areas for improvement
   - Recent activity

### 5. Create Learning Plan

1. Navigate to `/plan` from the navbar
2. The system will auto-generate a personalized learning plan based on:
   - Your profile (if set)
   - Your quiz performance
   - Identified strengths and weaknesses
3. View the day-by-day breakdown with:
   - Daily topics
   - Tasks and activities
   - Resources and notes
4. Mark tasks as complete by checking the checkboxes
5. Track your progress with the progress bar

### 6. Use AI Tutor Chat

1. Access the tutor chat from TutorChat component
2. Ask questions like:
   - "Explain React hooks"
   - "What is useState?"
   - "Help me understand closures"
3. Get instant AI-generated responses

### 7. Update Profile

1. Navigate to `/profile`
2. Update your:
   - Learning goals
   - Interests
   - Preferred difficulty level
3. Save changes

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Catalog
- `GET /api/catalog/domains` - Get all domains
- `GET /api/catalog/courses` - Get courses by domain
- `GET /api/catalog/course/:id` - Get course details
- `GET /api/catalog/module/:id` - Get module details

### Quiz
- `POST /api/quiz/generate` - Generate AI quiz
- `POST /api/quiz/submit` - Submit quiz answers

### Analysis
- `POST /api/analysis/analyze` - Analyze performance

### Learning
- `GET /api/learning/path` - Get learning path
- `POST /api/learning/path/rebuild` - Rebuild learning path
- `POST /api/learning/plan` - Create learning plan

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary

### Tutor
- `POST /api/tutor/chat` - Chat with AI tutor

## 🎨 Key Features Implemented

✅ **Complete Authentication Flow**
- JWT-based authentication
- Protected routes
- Auto-redirect on 401 errors
- Token stored in localStorage

✅ **AI-Powered Quiz System**
- Dynamic quiz generation
- Automatic scoring
- Performance analysis
- Weakness detection

✅ **Personalized Learning**
- Adaptive difficulty recommendations
- Custom learning plans
- Progress tracking
- Mastery-based advancement

✅ **Rich Dashboard**
- Visual charts (Recharts)
- Performance metrics
- Activity history
- Topic mastery tracking

✅ **Interactive Tutor**
- Context-aware responses
- Helpful suggestions
- Chat history

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running: `mongo --version`
- Verify .env file has correct MONGO_URI
- Check if port 5000 is available

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check .env file has `VITE_API_BASE_URL=http://localhost:5000/api`
- Check browser console for CORS errors

### Authentication errors
- Clear localStorage: `localStorage.clear()`
- Check JWT_SECRET is set in backend .env
- Verify token is being sent in Authorization header

### MongoDB connection errors
- Start MongoDB service
- Check connection string format
- Verify database permissions

## 📁 Project Structure

```
AI-based Personalized Learning Assistant/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── UserProfile.js
│   │   │   ├── Course.js
│   │   │   ├── Module.js
│   │   │   ├── ContentItem.js
│   │   │   ├── LearningPath.js
│   │   │   └── QuizSession.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── catalogController.js
│   │   │   ├── quizController.js
│   │   │   ├── analysisController.js
│   │   │   ├── learningPlanController.js
│   │   │   ├── learningPathController.js
│   │   │   ├── tutorController.js
│   │   │   └── dashboardController.js
│   │   ├── routes/
│   │   │   └── [corresponding route files]
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── services/
│   │   │   └── aiService.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── client/frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── apiClient.js
│   │   │   ├── catalogAPI.js
│   │   │   ├── quizAPI.js
│   │   │   ├── analysisAPI.js
│   │   │   ├── learningPlanAPI.js
│   │   │   ├── dashboardAPI.js
│   │   │   ├── tutorAPI.js
│   │   │   └── profileAPI.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── TutorChat.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Catalog.jsx
│   │   │   ├── CourseDetail.jsx
│   │   │   ├── ModuleDetail.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LearningPlanPage.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
│
└── ai/
    ├── prompts/
    └── json_formats/
```

## 🔐 Security Notes

- Change JWT_SECRET in production
- Use environment variables for sensitive data
- Implement rate limiting for APIs
- Add input validation and sanitization
- Use HTTPS in production
- Implement CSRF protection

## 🚀 Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, or DigitalOcean
- Set environment variables
- Use MongoDB Atlas for database

### Frontend (React)
- Deploy to Vercel, Netlify, or AWS Amplify
- Update VITE_API_BASE_URL to production backend URL
- Build: `npm run build`

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on the repository.

---

**Happy Learning! 🎓✨**
