

<h1 align="center">🎓 AI-Based Personalized Learning Assistant</h1>

<p align="center">
  <strong>An intelligent, AI-powered learning platform that adapts to your unique learning journey</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version"/>
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg" alt="Node"/>
  <img src="https://img.shields.io/badge/react-19.2.0-61dafb.svg" alt="React"/>
  <img src="https://img.shields.io/badge/mongodb-8.0%2B-green.svg" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/AI-Groq%20LLM-ff6b6b.svg" alt="AI"/>
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"/>
</p>

<p align="center">
  <a href="#-features">✨ Features</a> •
  <a href="#-quick-start">🚀 Quick Start</a> •
  <a href="#-tech-stack">🛠️ Tech Stack</a> •
  <a href="#-api-documentation">📚 API Docs</a>
</p>

---

<p align="center">
  <b>🏆 CodeNova Hackathon Submission</b><br/>
  <b>Team CodeNova</b> • 
  <a href="https://github.com/KartikBuilds/CodeNova-Hackathon">📂 Repository</a> •
  <a href="https://drive.google.com/file/d/175HhEVeIcPUTRGIDcwFVfZM0weOUBda6/view?usp=sharing">🎬 Demo Video</a>
</p>

---

> ⚠️ **Important Note:** This is a **hackathon project** built within a limited timeframe. The application uses **dummy/seeded data** for demonstration purposes. Some features may be incomplete, and certain links or functionalities might not work as expected. This project showcases our concept and technical capabilities rather than a production-ready application.

---

## 📖 Table of Contents

| Section | Description |
|---------|-------------|
| [🎯 Problem Statement](#-problem-statement) | The challenges we're solving |
| [💡 Our Solution](#-our-solution) | How we solve them |
| [✨ Features](#-features) | Complete feature list |
| [🛠️ Tech Stack](#-tech-stack) | Technologies used |
| [🚀 Quick Start](#-quick-start) | Setup instructions |
| [📁 Project Structure](#-project-structure) | Codebase organization |
| [📚 API Documentation](#-api-documentation) | API endpoints |
| [🔮 Future Enhancements](#-future-enhancements) | Roadmap |
| [👥 Team](#-team) | Contributors |

---

## 🎯 Problem Statement

<table>
<tr>
<td width="50%">

### ❌ Traditional E-Learning Challenges

| Problem | Impact |
|---------|--------|
| 📚 One-size-fits-all content | Learners get bored or overwhelmed |
| 🎯 No adaptive difficulty | Students plateau or give up |
| 📊 Limited feedback | Knowledge gaps go unidentified |
| 🤖 No personalized guidance | Expensive tutoring required |
| 📈 Poor progress tracking | No clear learning path |

</td>
<td width="50%">

### ✅ Our AI-Powered Solution

| Solution | Benefit |
|----------|---------|
| 🧠 AI-generated quizzes | Targets your weak areas |
| 📈 Adaptive difficulty | Grows with your skills |
| 📊 Deep analytics | Identifies knowledge gaps |
| 🤖 24/7 AI tutor | Instant help anytime |
| 🗺️ Personalized paths | Clear learning journey |

</td>
</tr>
</table>

---

## 💡 Our Solution

<p align="center">
  <img src="https://img.shields.io/badge/🧠-AI_Powered-ff6b6b?style=for-the-badge" alt="AI Powered"/>
  <img src="https://img.shields.io/badge/📊-Analytics-4ecdc4?style=for-the-badge" alt="Analytics"/>
  <img src="https://img.shields.io/badge/🎯-Personalized-a855f7?style=for-the-badge" alt="Personalized"/>
  <img src="https://img.shields.io/badge/⚡-Real_Time-f59e0b?style=for-the-badge" alt="Real Time"/>
</p>

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        🏗️ SYSTEM ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   👤 User                                                               │
│     │                                                                   │
│     ▼                                                                   │
│   ┌─────────────────┐      ┌─────────────────┐      ┌──────────────┐   │
│   │   🌐 React UI   │ ───▶ │  🚀 Express API │ ───▶ │  🍃 MongoDB  │   │
│   │   Vite + TW     │ ◀─── │    Node.js      │ ◀─── │    Atlas     │   │
│   └─────────────────┘      └────────┬────────┘      └──────────────┘   │
│                                     │                                   │
│                          ┌──────────┴──────────┐                        │
│                          ▼                     ▼                        │
│                    ┌──────────┐          ┌──────────┐                   │
│                    │  🤖 Groq │          │  🔐 JWT  │                   │
│                    │   LLM    │          │   Auth   │                   │
│                    └──────────┘          └──────────┘                   │
│                          │                                              │
│                          ▼                                              │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                    🧠 AI SERVICES                                │  │
│   │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │  │
│   │  │📝 Quiz Gen  │ │📊 Analysis  │ │📅 Plans     │ │💬 Tutor    │ │  │
│   │  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 🆚 Key Differentiators

| Feature | 🏫 Traditional Platforms | 🚀 Our Solution |
|---------|--------------------------|-----------------|
| Quiz Generation | Static question banks | **🤖 AI-generated based on weaknesses** |
| Difficulty | Manual level selection | **📈 Adaptive based on performance** |
| Learning Plans | Generic schedules | **🎯 Personalized daily tasks** |
| Tutoring | Forums or paid sessions | **💬 24/7 AI tutor chat** |
| Analytics | Basic completion stats | **📊 Deep strength/weakness analysis** |

---

## ✨ Features

### 🔐 Authentication & Profiles
> Secure JWT-based auth with customizable learning profiles

- ✅ Secure registration & login (7-day token expiration)
- ✅ Customizable user profiles with learning preferences
- ✅ Profile picture upload (file system or curated assets)
- ✅ Learning style identification (visual, auditory, reading, kinesthetic)

---

### 📚 Course Catalogue
> 50+ courses across 7 major tech domains with smart pagination

| Domain | Courses |
|--------|---------|
| 🌐 Web Development | MERN Stack, React, Vue.js, Angular, Next.js |
| 📊 Data Science | Python, R, Statistics, Pandas, NumPy |
| 🤖 Machine Learning | TensorFlow, PyTorch, Deep Learning, NLP |
| ⚙️ DevOps | Docker, Kubernetes, CI/CD, Jenkins |
| ☁️ Cloud Computing | AWS, Azure, GCP, Serverless |
| 📱 Mobile Development | React Native, Flutter, iOS, Android |
| 🔒 Cybersecurity | Ethical Hacking, Network Security, Cryptography |

---

### 🧠 AI-Powered Quiz System
> Dynamic question generation that adapts to your knowledge gaps

```
📝 Quiz Generation Flow:
━━━━━━━━━━━━━━━━━━━━━━━
User Profile + Weak Areas + Topic
              ↓
      🤖 Groq LLM (LangChain)
              ↓
      📋 Dynamic MCQ Questions
              ↓
      ✅ Real-time Grading
              ↓
      📊 Performance Analysis
```

- ✅ AI-generated questions targeting weak areas
- ✅ Configurable difficulty (easy/medium/hard)
- ✅ Detailed explanations for each answer
- ✅ Instant scoring and feedback

---

### 📊 Performance Analytics
> Comprehensive dashboard with visual insights

- 📈 **KPI Cards**: Total quizzes, Average score, Day streak, Learning time
- 📉 **Visual Charts**: Score trends, Topic performance (Recharts)
- 💪 **Strength Analysis**: AI-identified strong areas
- ⚠️ **Weakness Detection**: Areas needing improvement
- 🎯 **Recommendations**: Personalized next steps

---

### 🎯 Personalized Learning Plans
> AI-generated study schedules tailored to your goals

```
📅 Sample 7-Day Plan:
━━━━━━━━━━━━━━━━━━━━━
Day 1: Introduction to React Hooks
├── 📖 Task 1: Read useState documentation (30 min)
├── 💻 Task 2: Practice basic examples (45 min)
└── 🛠️ Task 3: Build a counter component (30 min)

Day 2: Advanced Hook Patterns
├── 📖 Task 1: Learn useEffect lifecycle (30 min)
...
```

---

### 🤖 AI Tutor Chat
> 24/7 conversational AI assistant for instant help

- 💬 Natural conversation with context awareness
- 💻 Code explanation and debugging support
- 📚 Topic suggestions based on learning path
- 🔊 Voice input/output support
- 📝 Persistent conversation history

---

### 📄 Document Q&A (RAG)
> Upload documents and ask questions about their content

- 📤 Upload PDF, TXT, MD files
- 🔍 AI-powered content analysis
- ❓ Question-answering on documents
- 📋 Intelligent summarization

---

### 📇 Flashcard System
> Spaced repetition for effective memorization

- 🗂️ Custom deck creation
- 🔄 Spaced repetition algorithm
- ⏰ Due card tracking
- 📊 Review performance analytics

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="33%">

### 🌐 Frontend
| Tech | Version |
|------|---------|
| ⚛️ React | 19.2.0 |
| ⚡ Vite | 7.2.5 |
| 🎨 Tailwind CSS | 3.4.18 |
| 🛣️ React Router | 7.10.1 |
| 📡 Axios | 1.13.2 |
| 📊 Recharts | 3.5.1 |

</td>
<td valign="top" width="33%">

### 🖥️ Backend
| Tech | Version |
|------|---------|
| 🟢 Node.js | 18+ |
| 🚀 Express.js | 4.18.2 |
| 🍃 MongoDB | 8.0+ |
| 🔗 Mongoose | 8.0.3 |
| 🔐 JWT | 9.0.2 |
| 🔒 bcryptjs | 2.4.3 |

</td>
<td valign="top" width="33%">

### 🤖 AI/ML
| Tech | Version |
|------|---------|
| 🦜 LangChain | 1.1.5 |
| ⚡ Groq LLM | 1.0.2 |
| 🧠 AI Models | GPT-oss |

### 🚀 DevOps
| Tech | Purpose |
|------|---------|
| 🐳 Docker | Containers |
| 🚂 Railway | Deployment |
| ☁️ MongoDB Atlas | Cloud DB |

</td>
</tr>
</table>

---

## 🚀 Quick Start

### 📋 Prerequisites

| Requirement | Version | Installation |
|-------------|---------|--------------|
| 🟢 Node.js | ≥18.0.0 | [nodejs.org](https://nodejs.org/) |
| 📦 npm | ≥9.0.0 | Comes with Node.js |
| 🍃 MongoDB | ≥8.0 | [mongodb.com](https://www.mongodb.com/) |
| 🔑 Groq API Key | - | [console.groq.com](https://console.groq.com/) |

---

### 🔑 Test Credentials
```
📧 Email: testuser@gmail.com
🔐 Password: testuser123
```

---

### 1️⃣ Clone Repository

```bash
git clone https://github.com/KartikBuilds/CodeNova-Hackathon.git
cd "AI-based Personalized Learning Assistant"
```

---

### 2️⃣ Backend Setup

```bash
# 📂 Navigate to server
cd server

# 📦 Install dependencies
npm install
```

**Create `server/.env`:**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key
```

```bash
# 🚀 Start backend
npm run dev
```
✅ Backend running at `http://localhost:5000`

---

### 3️⃣ Frontend Setup

```bash
# 📂 Navigate to frontend
cd client/frontend

# 📦 Install dependencies
npm install
```

**Create `client/frontend/.env`:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GROQ_API_KEY=your_groq_api_key
```

```bash
# 🚀 Start frontend
npm run dev
```
✅ Frontend running at `http://localhost:5173`

---

### 4️⃣ Seed Database (Optional)

```bash
cd server
npm run seed
```
✅ Seeds 50+ courses across all domains

---

### 5️⃣ Access Application

1. 🌐 Open `http://localhost:5173`
2. 📝 Register or use test credentials
3. 🎉 Start learning!

---

## 📁 Project Structure

```
📂 AI-based Personalized Learning Assistant/
│
├── 📂 server/                      # 🖥️ Backend (Node.js + Express)
│   ├── 📂 src/
│   │   ├── 📂 config/              # ⚙️ Database & LangChain config
│   │   ├── 📂 controllers/         # 🎮 Request handlers
│   │   ├── 📂 models/              # 📊 MongoDB schemas
│   │   ├── 📂 routes/              # 🛣️ API endpoints
│   │   ├── 📂 middleware/          # 🔐 Auth middleware
│   │   ├── 📂 services/            # 🤖 AI services
│   │   └── 📄 server.js            # 🚀 Entry point
│   └── 📄 package.json
│
├── 📂 client/frontend/             # 🌐 Frontend (React + Vite)
│   ├── 📂 src/
│   │   ├── 📂 api/                 # 📡 API client modules
│   │   ├── 📂 components/          # 🧩 Reusable components
│   │   ├── 📂 context/             # 🔄 React context providers
│   │   ├── 📂 pages/               # 📄 Page components
│   │   ├── 📂 assets/              # 🖼️ Images & screenshots
│   │   └── 📄 App.jsx              # ⚛️ Root component
│   └── 📄 package.json
│
├── 📂 ai/                          # 🤖 AI prompts & templates
├── 📄 docker-compose.yml           # 🐳 Docker config
├── 📄 railway.json                 # 🚂 Railway deployment
└── 📄 README.md                    # 📖 This file
```

---

## 📚 API Documentation

### 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | 📝 Register new user |
| `POST` | `/api/auth/login` | 🔑 Login user |
| `GET` | `/api/auth/me` | 👤 Get current user |

### 📚 Catalogue

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/catalog/domains` | 📂 Get all domains |
| `GET` | `/api/catalog/courses` | 📚 Get courses (with pagination) |
| `GET` | `/api/catalog/course/:id` | 📖 Get course details |
| `GET` | `/api/catalog/module/:id` | 📄 Get module details |

### 🧠 Quiz

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/quiz/generate` | 🤖 Generate AI quiz |
| `POST` | `/api/quiz/submit` | ✅ Submit quiz answers |

### 📊 Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analysis/performance` | 📈 Analyze performance |
| `GET` | `/api/analysis/trends` | 📉 Get performance trends |
| `GET` | `/api/analysis/summary` | 📋 Get strengths/weaknesses |

### 📅 Learning

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/learning/path` | 🗺️ Get learning path |
| `POST` | `/api/learning/plan` | 📅 Create learning plan |
| `POST` | `/api/learning/path/rebuild` | 🔄 Rebuild learning path |

### 💬 Tutor

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tutor/chat` | 🤖 Chat with AI tutor |
| `GET` | `/api/tutor/history` | 📝 Get chat history |

### 📊 Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/summary` | 📊 Get dashboard summary |

---

## 🔮 Future Enhancements

| Feature | Description | Priority |
|---------|-------------|----------|
| 🎮 Gamification | Points, badges, leaderboards | 🔴 High |
| 📹 Video Integration | Embedded course videos | 🔴 High |
| 👥 Social Learning | Study groups, discussions | 🟡 Medium |
| 📱 Mobile App | React Native version | 🟡 Medium |
| 🌍 Multi-language | i18n support | 🟡 Medium |
| 🔔 Notifications | Push/email reminders | 🟡 Medium |
| 📊 Advanced Analytics | ML-based predictions | 🟢 Low |

---

## 🧪 Testing

### ✅ Quick Test Checklist

- [x] User registration works
- [x] User login works
- [x] Protected routes redirect to login
- [x] Catalogue displays courses with pagination
- [x] Quiz generation works
- [x] Quiz submission returns results with AI analysis
- [x] Dashboard shows analytics with charts
- [x] Learning plan generates
- [x] AI tutor responds
- [x] Profile updates save
- [x] Document Q&A works
- [x] Flashcards functional

---

## 👥 Team

<table>
<tr>
<td align="center">
<b>Kartik</b><br/>
<sub>Full Stack Developer</sub><br/>
<a href="https://github.com/KartikBuilds">@KartikBuilds</a>
</td>
<td align="center">
<b>Tanmay Jare</b><br/>
<sub>Frontend Developer</sub><br/>
<a href="https://github.com/TanmayJare">@TanmayJare</a>
</td>
<td align="center">
<b>Shreeya Parkhi</b><br/>
<sub>Backend Developer</sub><br/>
<a href="https://github.com/Shreeyaparkhi11">@Shreeyaparkhi11</a>
</td>
<td align="center">
<b>Viraj Gavade</b><br/>
<sub>AI/ML Engineer</sub><br/>
<a href="https://github.com/viraj-gavade">@viraj-gavade</a>
</td>
</tr>
</table>

---

## 📄 License

This project is licensed under the **MIT License**.

© 2025 **Team CodeNova**. All rights reserved.

---

## 🙏 Acknowledgements

| Resource | Purpose |
|----------|---------|
| [Groq](https://groq.com/) | Ultra-fast LLM inference |
| [LangChain](https://langchain.com/) | LLM orchestration |
| [MongoDB](https://mongodb.com/) | Database |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Recharts](https://recharts.org/) | Data visualization |
| [Railway](https://railway.app/) | Deployment |

---

<p align="center">
  <b>Built by Team CodeNova</b><br/><br/>
  © 2025 Team CodeNova. All rights reserved.<br/><br/>
  ⭐ <b>Star this repo if you found it helpful!</b> ⭐
</p>

<p align="center">
  <a href="https://github.com/KartikBuilds/CodeNova-Hackathon/issues">🐛 Report Bug</a> •
  <a href="https://github.com/KartikBuilds/CodeNova-Hackathon/issues">✨ Request Feature</a>
</p>
