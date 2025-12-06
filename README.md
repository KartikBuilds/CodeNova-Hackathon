# 🎓 AI-Based Personalized Learning Assistant

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-61dafb.svg)
![MongoDB](https://img.shields.io/badge/mongodb-8.0%2B-green.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**An intelligent, AI-powered learning platform that adapts to your unique learning journey**

[Features](#-features) • [Demo](#-demo) • [Installation](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🌟 Overview

The **AI-Based Personalized Learning Assistant** revolutionizes online education by combining artificial intelligence with adaptive learning techniques. Unlike traditional e-learning platforms that offer one-size-fits-all content, our platform:

- 📊 **Analyzes** your learning patterns and performance in real-time
- 🤖 **Generates** personalized quizzes tailored to your skill level
- 🎯 **Adapts** learning paths based on your strengths and weaknesses
- 💬 **Provides** 24/7 AI tutor support for instant help
- 📈 **Tracks** progress with comprehensive analytics

### Problem We Solve

Traditional learning platforms struggle with:
- Generic content that doesn't adapt to individual needs
- Lack of real-time feedback and personalized guidance
- Difficulty identifying and addressing knowledge gaps
- Limited access to one-on-one tutoring

Our solution uses AI to create a truly personalized learning experience that scales.

---

## ✨ Features

### 🔐 **User Management**
- Secure authentication with JWT tokens (7-day expiration)
- Customizable user profiles with learning preferences
- Profile picture upload (file system or curated assets)
- Learning style identification (visual, auditory, reading, kinesthetic)

### 📚 **Comprehensive Course Catalog**
- **50+ Pre-loaded Courses** across 7 major domains:
  - 🌐 Web Development (MERN Stack, React, Vue, Angular)
  - 📊 Data Science (Python, R, Statistics)
  - 🤖 Machine Learning & AI (TensorFlow, PyTorch)
  - ⚙️ DevOps (Docker, Kubernetes, CI/CD)
  - ☁️ Cloud Computing (AWS, Azure, GCP)
  - 📱 Mobile Development (React Native, Flutter)
  - 🔒 Cybersecurity (Ethical Hacking, Network Security)
  
- Three difficulty levels: Beginner → Intermediate → Advanced
- Smart pagination (9 courses per page)
- Advanced filtering and search capabilities

### 🧠 **AI-Powered Quiz System**
- **Dynamic Question Generation** using Groq LLM (LangChain integration)
- Adaptive difficulty based on performance history
- Multiple-choice questions with detailed explanations
- Real-time grading and instant feedback
- Focused questions on identified weak areas

### 📊 **Performance Analytics**
- Comprehensive strength/weakness analysis
- Topic-wise performance breakdown
- Historical trend tracking
- Difficulty level recommendations
- Visual progress charts (powered by Recharts)

### 🎯 **Personalized Learning Plans**
- AI-generated 7-day study schedules
- Daily task breakdowns with time estimates
- Progressive difficulty scaling
- Integration with personal goals and availability
- Motivational guidance and best practices

### 🤖 **AI Tutor Chat**
- 24/7 conversational AI assistant
- Context-aware responses
- Code explanation and debugging support
- Topic suggestions based on learning path
- Persistent conversation history

### 🗂️ **Learning Path Management**
- Structured module sequences per domain
- Progress tracking (not-started → in-progress → completed)
- Visual progress indicators
- Adaptive path rebuilding

### 📇 **Flashcard System**
- Spaced repetition algorithm
- Custom deck creation
- Due card tracking
- Review performance analytics

### 📈 **Interactive Dashboard**
- Real-time progress visualization
- Activity timeline
- Performance charts
- Quick action shortcuts
- Personalized recommendations

### 📄 **Document Q&A (RAG)**
- Upload and analyze study materials
- AI-powered document summarization
- Question-answering on content
- Context-aware intelligent responses

---

## 🎬 Demo

### Screenshots

**Course Catalog with Pagination**
```
[Screenshot placeholder - Catalog page showing filtered courses]
```

**AI-Generated Quiz Interface**
```
[Screenshot placeholder - Quiz page with multiple choice questions]
```

**Performance Analytics Dashboard**
```
[Screenshot placeholder - Dashboard with charts and statistics]
```

**AI Tutor Chat**
```
[Screenshot placeholder - Chat interface with AI tutor]
```

**Personalized Learning Plan**
```
[Screenshot placeholder - 7-day study plan]
```

### Live Demo
🚀 **[Try Live Demo](https://your-demo-url.railway.app)** *(Coming Soon)*

**Test Credentials:**
```
Email: demo@example.com
Password: Demo123!
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| ![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react) | 19.2.0 | UI library with modern hooks |
| ![Vite](https://img.shields.io/badge/Vite-7.2.5-646cff?logo=vite) | 7.2.5 | Lightning-fast build tool |
| ![Tailwind](https://img.shields.io/badge/Tailwind-3.4.18-38bdf8?logo=tailwind-css) | 3.4.18 | Utility-first CSS framework |
| ![React Router](https://img.shields.io/badge/React_Router-7.10.1-ca4245?logo=react-router) | 7.10.1 | Client-side routing |
| ![Axios](https://img.shields.io/badge/Axios-1.13.2-5a29e4?logo=axios) | 1.13.2 | HTTP client |
| ![Recharts](https://img.shields.io/badge/Recharts-3.5.1-ff6b6b) | 3.5.1 | Data visualization |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js) | 18+ | JavaScript runtime |
| ![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express) | 4.18.2 | Web framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-47a248?logo=mongodb) | 8.0+ | NoSQL database |
| ![Mongoose](https://img.shields.io/badge/Mongoose-8.0.3-880000) | 8.0.3 | MongoDB ODM |
| ![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?logo=json-web-tokens) | 9.0.2 | Authentication |
| ![bcrypt](https://img.shields.io/badge/bcrypt-2.4.3-338836) | 2.4.3 | Password hashing |

### AI & Machine Learning
| Technology | Version | Purpose |
|-----------|---------|---------|
| ![LangChain](https://img.shields.io/badge/LangChain-1.1.5-121212) | 1.1.5 | LLM framework |
| Groq LLM | 1.0.2 | Fast AI inference |

### DevOps & Deployment
- **Docker** - Containerization
- **Railway** - Full-stack deployment
- **GitHub Actions** - CI/CD pipeline
- **MongoDB Atlas** - Cloud database

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18.0.0+ ([Download](https://nodejs.org/))
- **npm** v9.0.0+ (comes with Node.js)
- **MongoDB** v8.0+ ([Download](https://www.mongodb.com/try/download/community)) OR [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas)
- **Git** ([Download](https://git-scm.com/downloads))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/KartikBuilds/CodeNova-Hackathon.git
cd "AI-based Personalized Learning Assistant"
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
