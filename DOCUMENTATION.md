# AI-Based Personalized Learning Assistant - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Setup & Installation](#setup--installation)
7. [Environment Variables](#environment-variables)
8. [API Documentation](#api-documentation)
9. [Frontend Components](#frontend-components)
10. [State Management](#state-management)
11. [Authentication & Authorization](#authentication--authorization)
12. [Database Schema](#database-schema)
13. [AI Integration](#ai-integration)
14. [Deployment](#deployment)
15. [Code Standards](#code-standards)
16. [Enhancement Recommendations](#enhancement-recommendations)

---

## Project Overview

### What is This Project?
The **AI-Based Personalized Learning Assistant** is a comprehensive full-stack web application designed to revolutionize online learning through artificial intelligence. It provides personalized learning experiences by adapting to each user's skill level, learning pace, and performance patterns.

### Problem It Solves
- **Generic Learning Paths**: Traditional e-learning platforms offer one-size-fits-all content
- **Lack of Personalization**: Students don't receive guidance tailored to their weaknesses
- **No Real-time Feedback**: Limited instant help when stuck on concepts
- **Progress Tracking**: Difficulty in visualizing learning progress and identifying knowledge gaps

### Key Value Propositions
1. **AI-Powered Personalization**: Dynamic quiz generation and learning plans based on individual performance
2. **Intelligent Tutoring**: 24/7 AI tutor for instant concept clarification
3. **Adaptive Learning Paths**: Automatically adjusts difficulty and focus areas
4. **Comprehensive Analytics**: Track strengths, weaknesses, and learning trends

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (React SPA)                       │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────────┐ │
│  │  Pages  │  │Components│  │ Context │  │  API Client  │ │
│  └────┬────┘  └─────┬────┘  └────┬────┘  └──────┬───────┘ │
│       │            │             │               │          │
│       └────────────┴─────────────┴───────────────┘          │
└───────────────────────────────┬─────────────────────────────┘
                                │ HTTP/HTTPS (REST API)
                                │
┌───────────────────────────────┴─────────────────────────────┐
│                 SERVER (Express.js API)                      │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Routes  │→ │Controllers │→ │  Models  │→ │    DB    │ │
│  └──────────┘  └────────────┘  └──────────┘  └──────────┘ │
│                       ↓                                      │
│               ┌───────────────┐                             │
│               │  AI Service   │                             │
│               │  (LangChain)  │                             │
│               └───────┬───────┘                             │
└───────────────────────┼─────────────────────────────────────┘
                        │
                        ↓
              ┌─────────────────┐
              │  Groq LLM API   │
              │  (AI Provider)  │
              └─────────────────┘
```

### Data Flow

#### 1. Authentication Flow
```
User → Login Page → POST /api/auth/login → Validate Credentials
→ Generate JWT → Store in localStorage → Redirect to Catalog
```

#### 2. Quiz Generation Flow
```
User Selects Module → POST /api/quiz/generate → AI Service
→ Groq LLM (with prompts) → Validate JSON → Return Questions
→ Display Quiz Interface
```

#### 3. Learning Plan Flow
```
Complete Quiz → POST /api/quiz/submit → Calculate Score
→ POST /api/analysis/performance → Identify Weaknesses
→ POST /api/learning/plan → AI generates personalized plan
→ Display day-by-day schedule
```

### Component Interaction
- **Frontend** communicates with backend via Axios HTTP client
- **Backend** uses MongoDB for persistence with Mongoose ODM
- **AI Service** integrates LangChain + Groq for LLM capabilities
- **Authentication** uses JWT tokens stored in localStorage
- **State Management** uses React Context API for global state

---

## Features

### 1. User Management
**Authentication & Authorization**
- Secure user registration with email validation
- JWT-based authentication with 7-day expiration
- Password hashing using bcrypt (10 salt rounds)
- Protected routes requiring authentication
- Session persistence across browser sessions

**User Profiles**
- Customizable profile with bio and interests
- Profile picture upload (file system or asset selection)
- Learning preferences (primary domain, skill level, goals)
- Learning style preferences (visual, auditory, reading, kinesthetic)

### 2. Course Catalog & Content
**Course Browsing**
- Multi-domain course library (Web Dev, Data Science, ML, DevOps, Cloud, Mobile, Cybersecurity)
- Three difficulty levels (Beginner, Intermediate, Advanced)
- Pagination support (9 courses per page)
- Domain filtering and search
- Course details with module breakdown

**Content Structure**
- Hierarchical: Courses → Modules → Content Items
- Each module contains learning objectives and resources
- Support for various content types (text, video, code snippets)

### 3. AI-Powered Features
**Intelligent Quiz Generation**
- Dynamic question generation based on module topics
- Difficulty adaptation based on user level
- Focus on identified weaknesses
- Multiple-choice format with explanations
- Real-time grading and feedback

**Performance Analysis**
- Automated strength/weakness identification
- Topic-wise performance breakdown
- Difficulty level recommendations
- Historical performance trends
- Detailed analytics dashboard

**Personalized Learning Plans**
- 7-day study schedules tailored to user performance
- Daily task breakdowns with time estimates
- Progressive difficulty scaling
- Integration with user goals and availability
- Motivational notes and guidance

**AI Tutor**
- Context-aware conversational interface
- Real-time doubt clarification
- Topic suggestions based on learning path
- Conversation history tracking
- Code explanation and debugging help

### 4. Learning Management
**Learning Paths**
- Structured module sequences per domain
- Progress tracking (not-started, in-progress, completed)
- Visual progress indicators
- Adaptive path rebuilding based on performance

**Flashcards**
- Spaced repetition system
- Custom deck creation
- Due card tracking
- Review performance analytics

**Dashboard**
- Overall progress visualization
- Activity timeline
- Topic-wise performance charts
- Personalized recommendations
- Quick access to recent activities

### 5. Document Q&A (RAG)
- Upload and analyze documents
- AI-powered document summarization
- Question-answering on uploaded content
- Context-aware responses

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.0 | UI library for component-based architecture |
| **React Router DOM** | 7.10.1 | Client-side routing and navigation |
| **Axios** | 1.13.2 | HTTP client for API communication |
| **Recharts** | 3.5.1 | Data visualization for analytics |
| **Vite** | 7.2.5 (Rolldown) | Build tool and dev server |
| **Tailwind CSS** | 3.4.18 | Utility-first CSS framework |
| **PostCSS** | 8.5.6 | CSS processing and autoprefixing |
| **ESLint** | 9.39.1 | Code linting and quality |

### Backend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express.js** | 4.18.2 | Web application framework |
| **MongoDB** | 8.0+ | NoSQL database for data persistence |
| **Mongoose** | 8.0.3 | MongoDB ODM for schema modeling |
| **JSON Web Token** | 9.0.2 | Authentication and authorization |
| **bcryptjs** | 2.4.3 | Password hashing and security |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **dotenv** | 16.6.1 | Environment variable management |

### AI & Machine Learning

| Technology | Version | Purpose |
|-----------|---------|---------|
| **LangChain** | 1.1.5 | LLM application framework |
| **@langchain/groq** | 1.0.2 | Groq LLM integration |
| **@langchain/core** | 1.1.4 | Core LangChain utilities |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Nodemon** | Auto-restart server on file changes |
| **Concurrently** | Run multiple commands simultaneously |
| **Git** | Version control |
| **Docker** | Containerization (optional) |

### Deployment & Infrastructure

| Platform | Use Case |
|----------|----------|
| **Railway** | Full-stack deployment (recommended) |
| **Vercel** | Frontend + serverless functions |
| **Render** | Alternative full-stack hosting |
| **MongoDB Atlas** | Cloud database hosting |
| **Docker** | Container orchestration |

---

## Project Structure

```
AI-based-Personalized-Learning-Assistant/
│
├── client/                          # Frontend application
│   └── frontend/
│       ├── src/
│       │   ├── api/                # API client modules
│       │   │   ├── apiClient.js    # Base Axios instance with interceptors
│       │   │   ├── catalogAPI.js   # Course catalog endpoints
│       │   │   ├── quizAPI.js      # Quiz generation & submission
│       │   │   ├── analysisAPI.js  # Performance analysis
│       │   │   ├── learningPlanAPI.js  # Learning plan management
│       │   │   ├── dashboardAPI.js # Dashboard data
│       │   │   ├── tutorAPI.js     # AI tutor chat
│       │   │   └── profileAPI.js   # User profile management
│       │   │
│       │   ├── components/         # Reusable React components
│       │   │   ├── Navbar.jsx      # Navigation header with auth state
│       │   │   ├── Footer.jsx      # Site footer with links
│       │   │   ├── CourseCard.jsx  # Course display card
│       │   │   ├── PrivateRoute.jsx # Route protection HOC
│       │   │   ├── Toast.jsx       # Notification component
│       │   │   ├── TutorChat.jsx   # AI tutor chat interface
│       │   │   ├── FloatingTutor.jsx # Floating chat button
│       │   │   ├── DocumentRAG.jsx # Document Q&A interface
│       │   │   ├── DocumentSummary.jsx # Document summarization
│       │   │   └── ProfileImageSelector.jsx # Profile pic uploader
│       │   │
│       │   ├── context/            # React Context providers
│       │   │   ├── AuthContext.jsx # Authentication state management
│       │   │   └── ProfileContext.jsx # User profile state
│       │   │
│       │   ├── pages/              # Page components (routes)
│       │   │   ├── Login.jsx       # User login
│       │   │   ├── Register.jsx    # User registration
│       │   │   ├── Catalog.jsx     # Course browsing with pagination
│       │   │   ├── CourseDetail.jsx # Single course view
│       │   │   ├── ModuleDetail.jsx # Module content display
│       │   │   ├── QuizPage.jsx    # Quiz taking interface
│       │   │   ├── DashboardPage.jsx # Analytics dashboard
│       │   │   ├── LearningPath.jsx # Learning path tracker
│       │   │   ├── LearningPlanPage.jsx # Study plan generator
│       │   │   ├── AllLearningPlansPage.jsx # Saved plans list
│       │   │   ├── Profile.jsx     # User profile editor
│       │   │   └── Flashcards.jsx  # Flashcard review
│       │   │
│       │   ├── assets/             # Static assets
│       │   │   ├── 1.jpeg - 9.jpeg # Profile picture options
│       │   │   └── react.svg       # React logo
│       │   │
│       │   ├── App.jsx             # Main app component with routing
│       │   ├── main.jsx            # React entry point
│       │   └── index.css           # Global styles
│       │
│       ├── public/                 # Public static files
│       ├── package.json            # Frontend dependencies
│       ├── vite.config.js          # Vite configuration
│       ├── tailwind.config.js      # Tailwind CSS config
│       ├── postcss.config.js       # PostCSS config
│       └── eslint.config.js        # ESLint rules
│
├── server/                         # Backend API server
│   ├── src/
│   │   ├── config/                # Configuration files
│   │   │   ├── db.js              # MongoDB connection setup
│   │   │   └── langchain.js       # LangChain + Groq LLM config
│   │   │
│   │   ├── models/                # Mongoose schemas
│   │   │   ├── User.js            # User authentication model
│   │   │   ├── UserProfile.js     # Extended user profile data
│   │   │   ├── Course.js          # Course information
│   │   │   ├── Module.js          # Module content
│   │   │   ├── ContentItem.js     # Learning materials
│   │   │   ├── QuizSession.js     # Quiz attempt records
│   │   │   ├── LearningPath.js    # User learning paths
│   │   │   ├── LearningPlan.js    # Personalized study plans
│   │   │   ├── FlashcardDeck.js   # Flashcard collections
│   │   │   └── index.js           # Model exports
│   │   │
│   │   ├── controllers/           # Request handlers
│   │   │   ├── authController.js  # Authentication logic
│   │   │   ├── profileController.js # Profile management
│   │   │   ├── catalogController.js # Course catalog operations
│   │   │   ├── quizController.js  # Quiz generation & grading
│   │   │   ├── analysisController.js # Performance analytics
│   │   │   ├── learningPathController.js # Path management
│   │   │   ├── learningPlanController.js # Plan generation
│   │   │   ├── tutorController.js # AI tutor chat
│   │   │   ├── dashboardController.js # Dashboard data
│   │   │   └── flashcardController.js # Flashcard operations
│   │   │
│   │   ├── routes/                # API route definitions
│   │   │   ├── authRoutes.js      # POST /api/auth/{register,login}
│   │   │   ├── profileRoutes.js   # GET/PUT /api/profile
│   │   │   ├── catalogRoutes.js   # GET /api/catalog/*
│   │   │   ├── quizRoutes.js      # POST /api/quiz/*
│   │   │   ├── analysisRoutes.js  # POST /api/analysis/*
│   │   │   ├── learningPathRoutes.js # GET/POST /api/learning/path
│   │   │   ├── learningPlanRoutes.js # POST /api/learning/plan
│   │   │   ├── tutorRoutes.js     # POST /api/tutor/chat
│   │   │   ├── dashboardRoutes.js # GET /api/dashboard/*
│   │   │   └── flashcardRoutes.js # CRUD /api/flashcards
│   │   │
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.js            # JWT verification & user extraction
│   │   │   └── authMiddleware.js  # Authentication wrapper
│   │   │
│   │   ├── services/              # Business logic services
│   │   │   └── aiService.js       # AI/LLM integration layer
│   │   │
│   │   ├── scripts/               # Utility scripts
│   │   │   └── seedData.js        # Database seeding (50 courses)
│   │   │
│   │   ├── app.js                 # Express app configuration
│   │   └── server.js              # Server entry point
│   │
│   ├── utils/                     # Utility functions
│   │   ├── validator.js           # Input validation helpers
│   │   ├── responseFormatter.js   # API response standardization
│   │   └── promptTemplates.js     # AI prompt templates
│   │
│   ├── package.json               # Backend dependencies
│   ├── .env                       # Environment variables (gitignored)
│   └── .env.example               # Environment template
│
├── ai/                            # AI prompts and examples
│   ├── prompts/
│   │   ├── quiz_generation.md    # Quiz prompt template
│   │   ├── performance_analysis.md # Analysis prompt
│   │   └── learning_plan.md      # Learning plan prompt
│   │
│   ├── examples/
│   │   ├── sample_quiz.json      # Example quiz output
│   │   ├── sample_analysis.json  # Example analysis
│   │   └── sample_learning_plan.json # Example plan
│   │
│   └── json_formats/             # JSON schema definitions
│       ├── quiz_output.json
│       ├── analysis_output.json
│       └── learning_plan_output.json
│
├── docs/                          # Additional documentation
│
├── .github/                       # GitHub-specific files
│   └── workflows/
│       └── deploy.yml            # CI/CD pipeline (GitHub Actions)
│
├── package.json                   # Root package.json (monorepo)
├── docker-compose.yml             # Docker orchestration
├── railway.json                   # Railway deployment config
├── railway.toml                   # Railway service config
├── vercel.json                    # Vercel deployment config
├── .gitignore                     # Git ignore rules
├── README.md                      # Project README
├── DEPLOYMENT.md                  # Deployment guide
├── QUICK_START.md                 # Quick start guide
└── TESTING_GUIDE.md              # Testing documentation
```

### Key Directory Explanations

#### `/client/frontend/src/api/`
Contains all API client modules that communicate with the backend. Each module exports functions for specific feature domains (catalog, quiz, etc.). Uses a centralized Axios instance with interceptors for authentication and error handling.

#### `/client/frontend/src/components/`
Reusable UI components that can be composed into pages. Includes both presentational components (CourseCard) and container components (TutorChat). Uses React hooks for state management.

#### `/client/frontend/src/context/`
React Context providers for global state management. AuthContext manages authentication state and user info across the app. ProfileContext handles user profile data and image management.

#### `/client/frontend/src/pages/`
Full-page components mapped to routes. Each page typically fetches its own data and composes smaller components. Protected pages use the PrivateRoute wrapper.

#### `/server/src/models/`
Mongoose schema definitions that define the structure of MongoDB collections. Includes validation rules, indexes, virtuals, and instance methods. Models are the single source of truth for data structure.

#### `/server/src/controllers/`
Business logic layer that processes requests, calls services, and returns responses. Controllers are thin - they orchestrate operations but delegate complex logic to services.

#### `/server/src/routes/`
Express route definitions that map HTTP endpoints to controller functions. Routes also apply middleware for authentication, validation, and error handling.

#### `/server/src/middleware/`
Express middleware functions for cross-cutting concerns like authentication, error handling, and request logging. Applied globally or to specific routes.

#### `/server/src/services/`
Business logic services that encapsulate complex operations. The aiService handles all AI-related functionality including prompt engineering and LLM communication.

#### `/ai/`
AI configuration and prompt engineering resources. Contains templated prompts for different AI features, example outputs for testing, and JSON schemas for validation.

---

## Setup & Installation

### Prerequisites

Before starting, ensure you have:

- **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v9.0.0 or higher (comes with Node.js)
- **MongoDB** v8.0+ running locally OR MongoDB Atlas account ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Git** for version control
- **Code Editor** (VS Code recommended)
- **Groq API Key** (optional, for AI features) - [Get key](https://console.groq.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/KartikBuilds/CodeNova-Hackathon.git
cd "AI-based Personalized Learning Assistant"
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd server
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/learnAI
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/learnAI?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# AI Service (Optional)
GROQ_API_KEY=your_groq_api_key_here
```

**Important**: Change `JWT_SECRET` to a strong random string in production!

#### Seed the Database

Populate the database with 50 sample courses:

```bash
npm run seed
```

Expected output:
```
✓ MongoDB Connected
✓ Database cleared
✓ 50 courses created
✓ 250+ modules created
✓ Database seeding completed successfully!
```

#### Start the Backend Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

Server should start at `http://localhost:5000`

Verify with health check:
```bash
curl http://localhost:5000/api/health
# Response: {"status":"ok"}
```

### 3. Frontend Setup

Open a **new terminal** window:

```bash
cd client/frontend
npm install
```

#### Configure Frontend Environment

Create `.env` file in `client/frontend/`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=AI Learning Assistant
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

#### Start the Frontend

```bash
npm run dev
```

Frontend should start at `http://localhost:5173`

### 4. Verify Installation

1. **Open Browser**: Navigate to `http://localhost:5173`
2. **Register Account**: Click "Register" and create a new user
3. **Browse Catalog**: View the 50 seeded courses
4. **Test Quiz**: Select a module and generate a quiz
5. **Check Dashboard**: View your progress analytics

### Common Setup Issues

#### MongoDB Connection Failed
```
Error: MongooseError: Server selection timeout
```
**Solution**: Ensure MongoDB is running
```bash
# Windows (if installed as service)
net start MongoDB

# macOS/Linux
sudo systemctl start mongod

# OR use MongoDB Atlas cloud connection
```

#### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution**: Change PORT in `.env` or kill the process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

#### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Ensure frontend URL is in `ALLOWED_ORIGINS`:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Missing Dependencies
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Development Workflow

#### Running Both Servers Simultaneously

Option 1: Use separate terminals
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client/frontend && npm run dev
```

Option 2: Use concurrently (from root):
```bash
npm install -g concurrently
concurrently "cd server && npm run dev" "cd client/frontend && npm run dev"
```

#### Hot Reload
- **Backend**: Auto-restarts on file changes (using Node.js --watch)
- **Frontend**: Vite provides instant HMR (Hot Module Replacement)

#### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- ESLint
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Thunder Client (API testing)

---

## Environment Variables

### Server Environment Variables

Complete reference for `server/.env`:

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `PORT` | Number | No | 5000 | Server port number |
| `NODE_ENV` | String | No | development | Environment: `development`, `production`, `test` |
| `MONGO_URI` | String | **Yes** | - | MongoDB connection string |
| `JWT_SECRET` | String | **Yes** | - | Secret key for JWT signing (min 32 chars recommended) |
| `JWT_EXPIRE` | String | No | 7d | JWT expiration time (e.g., `7d`, `24h`, `30m`) |
| `ALLOWED_ORIGINS` | String | No | * | Comma-separated allowed CORS origins |
| `GROQ_API_KEY` | String | No | - | Groq API key for AI features (optional) |

**Example Production `.env`:**

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://prod_user:SecurePass123@cluster.mongodb.net/learnAI_prod?retryWrites=true&w=majority
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c
JWT_EXPIRE=7d
ALLOWED_ORIGINS=https://myapp.com,https://www.myapp.com
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Client Environment Variables

Complete reference for `client/frontend/.env`:

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `VITE_API_URL` | String | **Yes** | - | Backend API base URL (include `/api`) |
| `VITE_APP_NAME` | String | No | AI Learning Assistant | Application display name |
| `VITE_APP_VERSION` | String | No | 1.0.0 | Application version |
| `VITE_ENVIRONMENT` | String | No | development | Environment identifier |

**Example Production `.env`:**

```env
VITE_API_URL=https://api.myapp.com/api
VITE_APP_NAME=AI Learning Assistant Pro
VITE_APP_VERSION=2.1.0
VITE_ENVIRONMENT=production
```

### Security Best Practices

1. **Never commit `.env` files** - Always in `.gitignore`
2. **Use strong secrets** - Generate with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. **Rotate secrets regularly** - Change JWT_SECRET periodically
4. **Use environment-specific files** - `.env.development`, `.env.production`
5. **Validate on startup** - Server checks required variables on boot

### Accessing Environment Variables

**Backend (Node.js):**
```javascript
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 5000;
const dbUri = process.env.MONGO_URI;
```

**Frontend (Vite):**
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

---

## API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

### Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Response Format
All API responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

---

### 1. Authentication Endpoints

#### Register User
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation Rules:**
- `name`: 2-100 characters
- `email`: Valid email format, unique
- `password`: Minimum 6 characters

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-12-07T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400` - Validation error (email already exists, invalid format)
- `500` - Server error

---

#### Login User
**POST** `/api/auth/login`

Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

**Error Responses:**
- `401` - Invalid credentials
- `400` - Missing email or password

---

#### Get Current User
**GET** `/api/auth/me`

Get authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-12-07T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `401` - Not authenticated or invalid token
- `404` - User not found

---

### 2. Profile Endpoints

#### Get User Profile
**GET** `/api/profile`

**Headers:** `Authorization: Bearer <token>` (Required)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "primaryDomain": "Web Development",
    "level": "intermediate",
    "goals": "Master full-stack development",
    "profileImage": "data:image/jpeg;base64,...",
    "bio": "Aspiring full-stack developer",
    "interests": ["React", "Node.js", "MongoDB"],
    "learningStyle": "visual",
    "createdAt": "2025-12-07T10:30:00.000Z",
    "updatedAt": "2025-12-07T12:45:00.000Z"
  }
}
```

---

#### Update User Profile
**PUT** `/api/profile`

**Headers:** `Authorization: Bearer <token>` (Required)

**Request Body:**
```json
{
  "primaryDomain": "Data Science",
  "level": "advanced",
  "goals": "Become a data scientist",
  "bio": "Data enthusiast",
  "interests": ["Python", "Machine Learning", "Statistics"],
  "learningStyle": "reading",
  "profileImage": "data:image/jpeg;base64,..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "primaryDomain": "Data Science",
    "level": "advanced",
    ...
  },
  "message": "Profile updated successfully"
}
```

---

### 3. Catalog Endpoints

#### Get All Domains
**GET** `/api/catalog/domains`

Get unique list of all course domains.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    "Web Development",
    "Data Science",
    "Machine Learning",
    "DevOps",
    "Cloud Computing",
    "Mobile Development",
    "Cybersecurity"
  ]
}
```

---

#### Get Courses
**GET** `/api/catalog/courses`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `domain` | String | No | - | Filter by domain |
| `level` | String | No | - | Filter by level (beginner/intermediate/advanced) |
| `search` | String | No | - | Search in title and description |
| `page` | Number | No | 1 | Page number for pagination |
| `limit` | Number | No | 9 | Results per page |

**Example Request:**
```
GET /api/catalog/courses?domain=Web%20Development&level=beginner&page=1&limit=9
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "HTML & CSS Fundamentals",
        "domain": "Web Development",
        "description": "Learn the basics of web development",
        "level": "beginner",
        "modules": [
          "507f1f77bcf86cd799439012",
          "507f1f77bcf86cd799439013"
        ],
        "moduleCount": 5,
        "createdAt": "2025-12-07T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 9,
      "total": 45,
      "pages": 5
    }
  }
}
```

---

#### Get Course by ID
**GET** `/api/catalog/course/:id`

**Path Parameters:**
- `id` - Course ObjectId

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "HTML & CSS Fundamentals",
    "domain": "Web Development",
    "description": "Comprehensive HTML and CSS course",
    "level": "beginner",
    "modules": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Introduction to HTML",
        "description": "Learn HTML basics",
        "order": 1,
        "duration": 120,
        "contentItemsCount": 5
      }
    ],
    "createdAt": "2025-12-07T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `404` - Course not found
- `400` - Invalid course ID format

---

#### Get Module by ID
**GET** `/api/catalog/module/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "courseId": "507f1f77bcf86cd799439011",
    "title": "Introduction to HTML",
    "description": "HTML fundamentals",
    "order": 1,
    "duration": 120,
    "learningObjectives": [
      "Understand HTML structure",
      "Create basic web pages"
    ],
    "contentItems": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "type": "video",
        "title": "HTML Basics Video",
        "content": "https://example.com/video.mp4",
        "order": 1
      }
    ]
  }
}
```

---

### 4. Quiz Endpoints

#### Generate Quiz
**POST** `/api/quiz/generate`

**Headers:** `Authorization: Bearer <token>` (Required)

**Request Body:**
```json
{
  "moduleId": "507f1f77bcf86cd799439012",
  "questionCount": 5,
  "difficulty": "medium"
}
```

**Parameters:**
- `moduleId`: Module to generate quiz for
- `questionCount`: Number of questions (default: 5)
- `difficulty`: easy | medium | hard (default: medium)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "quiz": {
      "moduleId": "507f1f77bcf86cd799439012",
      "questions": [
        {
          "id": "q1",
          "question": "What does HTML stand for?",
          "options": [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlinks and Text Markup Language"
          ],
          "correct_answer": "Hyper Text Markup Language",
          "explanation": "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages."
        }
      ]
    }
  }
}
```

**Error Responses:**
- `400` - Invalid module ID
- `404` - Module not found
- `503` - AI service unavailable (fallback to mock data)

---

#### Submit Quiz
**POST** `/api/quiz/submit`

**Headers:** `Authorization: Bearer <token>` (Required)

**Request Body:**
```json
{
  "moduleId": "507f1f77bcf86cd799439012",
  "answers": [
    {
      "questionId": "q1",
      "selectedAnswer": "Hyper Text Markup Language"
    },
    {
      "questionId": "q2",
      "selectedAnswer": "To style web pages"
    }
  ],
  "questions": [
    {
      "id": "q1",
      "question": "What does HTML stand for?",
      "correct_answer": "Hyper Text Markup Language"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "score": 80,
    "totalQuestions": 5,
    "correctAnswers": 4,
    "results": [
      {
        "questionId": "q1",
        "isCorrect": true,
        "userAnswer": "Hyper Text Markup Language",
        "correctAnswer": "Hyper Text Markup Language"
      }
    ],
    "sessionId": "507f1f77bcf86cd799439020"
  }
}
```

---

### 5. Analysis Endpoints

#### Analyze Performance
**POST** `/api/analysis/performance`

**Headers:** `Authorization: Bearer <token>` (Required)

**Request Body:**
```json
{
  "quizResults": [
    {
      "topic": "HTML Basics",
      "score": 80,
      "totalQuestions": 5
    },
    {
      "topic": "CSS Fundamentals",
      "score": 60,
      "totalQuestions": 5
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "strengths": ["HTML Basics", "JavaScript Fundamentals"],
    "weaknesses": ["CSS Animations", "Responsive Design"],
    "recommendedLevel": "intermediate",
    "overallScore": 75,
    "topicBreakdown": [
      {
        "topic": "HTML Basics",
        "score": 80,
        "performance": "strong"
      }
    ]
  }
}
```

---

#### Get Performance Trends
**GET** `/api/analysis/trends`

**Headers:** `Authorization: Bearer <token>` (Required)

**Query Parameters:**
- `days`: Number of days to analyze (default: 30)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "date": "2025-12-01",
        "averageScore": 75,
        "quizzesCompleted": 3
      }
    ],
    "improvement": 15,
    "consistencyScore": 8.5
  }
}
```

---

### 6. Learning Path Endpoints

#### Get Learning Path
**GET** `/api/learning/path`

**Headers:** `Authorization: Bearer <token>` (Required)

**Query Parameters:**
- `domain`: Domain to get path for (required)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "domain": "Web Development",
    "path": [
      {
        "moduleId": {
          "_id": "507f1f77bcf86cd799439012",
          "title": "HTML Basics",
          "description": "Learn HTML fundamentals"
        },
        "status": "completed",
        "startedAt": "2025-12-01T10:00:00.000Z",
        "completedAt": "2025-12-02T15:00:00.000Z"
      }
    ],
    "progressPercentage": 40,
    "totalModules": 10,
    "completedModules": 4
  }
}
```

---

#### Rebuild Learning Path
**POST** `/api/learning/path/rebuild`

**Headers:** `Authorization: Bearer <token>` (Required)

**Request Body:**
```json
{
  "domain": "Web Development",
  "level": "intermediate"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "domain": "Web Development",
    "path": [...],
    "message": "Learning path created successfully"
  }
}
```

---

#### Update Module Status
**PATCH** `/api/learning/path/module/:moduleId`

**Headers:** `Authorization: Bearer <token>` (Required)

**Request Body:**
```json
{
  "domain": "Web Development",
  "status": "completed"
}
```

**Status Values:**
- `not-started`
- `in-progress`
- `completed`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "moduleId": "507f1f77bcf86cd799439012",
    "status": "completed",
    "completedAt": "2025-12-07T15:30:00.000Z"
  }
}
```

---

### 7. Learning Plan Endpoints

#### Create Learning Plan
**POST** `/api/learning/plan`

**Headers:** `Authorization: Bearer <token>` (Required)

**Request Body:**
```json
{
  "topic": "React Development",
  "days": 7,
  "hoursPerDay": 2,
  "difficulty": "intermediate",
  "goals": "Build production-ready React applications"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "plan": [
      {
        "day": 1,
        "topics": ["React Fundamentals", "JSX Syntax"],
        "tasks": [
          "Study React component basics",
          "Practice creating functional components",
          "Complete JSX exercises"
        ],
        "notes": "Focus on understanding the virtual DOM concept",
        "estimatedHours": 2
      }
    ],
    "totalDays": 7,
    "totalHours": 14
  }
}
```

---

#### Get Saved Learning Plans
**GET** `/api/learning/plans`

**Headers:** `Authorization: Bearer <token>` (Required)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "_id": "507f1f77bcf86cd799439030",
        "userId": "507f1f77bcf86cd799439011",
        "topic": "React Development",
        "totalDays": 7,
        "progress": 40,
        "createdAt": "2025-12-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### 8. Dashboard Endpoints

#### Get Dashboard Summary
**GET** `/api/dashboard/summary`

**Headers:** `Authorization: Bearer <token>` (Required)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total_quizzes": 25,
    "average_score": 78.5,
    "hours_studied": 42,
    "courses_enrolled": 5,
    "modules_completed": 18,
    "current_streak": 7,
    "recentActivity": [
      {
        "type": "quiz_completed",
        "title": "HTML Basics Quiz",
        "score": 85,
        "timestamp": "2025-12-07T14:30:00.000Z"
      }
    ]
  }
}
```

---

#### Get Activity Timeline
**GET** `/api/dashboard/activity`

**Headers:** `Authorization: Bearer <token>` (Required)

**Query Parameters:**
- `days`: Number of days (default: 7)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "date": "2025-12-07",
        "quizzes": 2,
        "studyTime": 120,
        "modulesCompleted": 1
      }
    ]
  }
}
```

---

### 9. AI Tutor Endpoints

#### Chat with Tutor
**POST** `/api/tutor/chat`

**Headers:** `Authorization: Bearer <token>` (Optional)

**Request Body:**
```json
{
  "message": "Explain closures in JavaScript",
  "conversationId": "507f1f77bcf86cd799439040"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "response": "A closure is a function that has access to variables in its outer scope...",
    "conversationId": "507f1f77bcf86cd799439040",
    "timestamp": "2025-12-07T15:45:00.000Z"
  }
}
```

---

#### Get Chat History
**GET** `/api/tutor/history`

**Headers:** `Authorization: Bearer <token>` (Required)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "507f1f77bcf86cd799439040",
        "messages": [
          {
            "role": "user",
            "content": "Explain closures",
            "timestamp": "2025-12-07T15:45:00.000Z"
          },
          {
            "role": "assistant",
            "content": "A closure is...",
            "timestamp": "2025-12-07T15:45:05.000Z"
          }
        ]
      }
    ]
  }
}
```

---

### 10. Flashcard Endpoints

#### Get All Flashcard Decks
**GET** `/api/flashcards`

**Headers:** `Authorization: Bearer <token>` (Required)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439050",
      "title": "JavaScript Fundamentals",
      "description": "Core JS concepts",
      "cardCount": 20,
      "dueCount": 5,
      "createdAt": "2025-12-01T10:00:00.000Z"
    }
  ]
}
```

---

#### Create Flashcard Deck
**POST** `/api/flashcards`

**Headers:** `Authorization: Bearer <token>` (Required)

**Request Body:**
```json
{
  "title": "React Hooks",
  "description": "Common React hooks and their usage",
  "cards": [
    {
      "front": "What is useState?",
      "back": "A React hook for managing component state"
    }
  ]
}
```

**Response:** `201 Created`

---

### Status Codes Reference

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation error, malformed request |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (e.g., email exists) |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | External service (AI) unavailable |

---

*(Continued in next section...)*
