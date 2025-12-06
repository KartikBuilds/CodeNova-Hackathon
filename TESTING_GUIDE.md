# End-to-End Testing Guide

## Quick Start Testing

### 1. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client/frontend
npm run dev
```

**Terminal 3 - MongoDB (if needed):**
```bash
net start MongoDB
```

### 2. Test Complete User Flow

#### Step 1: Register New User
1. Open `http://localhost:5173`
2. Click "Register" in navbar
3. Enter:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
4. ✅ **Expected**: Redirect to catalog, navbar shows "John Doe"

#### Step 2: Browse Catalog
1. You should see domains listed (if empty, see "Seed Data" below)
2. Click on a domain to see courses
3. Click on a course to see modules
4. ✅ **Expected**: Modules displayed with video content and "Take Quiz" button

#### Step 3: Take a Quiz
1. Click "Take Quiz" on any module
2. Fill quiz generation form:
   ```
   Topic: JavaScript Basics
   Difficulty: Medium
   Weaknesses: (leave blank or enter topics)
   Number of Questions: 5
   ```
3. Click "Generate Quiz"
4. ✅ **Expected**: 5 multiple-choice questions appear

5. Select answers for all questions
6. Click "Submit Quiz"
7. ✅ **Expected**: Results page shows:
   - Score (e.g., "You scored 4/5 (80%)")
   - AI Analysis with:
     - Strengths
     - Weaknesses
     - Recommended difficulty
   - Question breakdown (correct/incorrect)

#### Step 4: View Dashboard
1. Click "Dashboard" in navbar
2. ✅ **Expected**: Dashboard shows:
   - KPI cards (Total Quizzes, Avg Score, Day Streak, Learning Time)
   - Score History chart
   - Quiz Performance bar chart
   - Topics Mastered badges
   - Areas for Improvement badges
   - Recent Activity list
   - Quick Actions cards

#### Step 5: Create Learning Plan
1. Click "Learning Plan" in navbar
2. System auto-generates plan based on your quiz performance
3. ✅ **Expected**: Learning plan displays:
   - Topic/Title
   - Duration (e.g., "7 days")
   - Strengths & Focus Areas sections
   - Day-by-day timeline with:
     - Day number and topic
     - Task checklist
     - Progress bar
     - Notes and resources
4. Check off some tasks
5. ✅ **Expected**: Progress bar updates, task completion tracked

#### Step 6: Test AI Tutor (if implemented in UI)
1. Access TutorChat component
2. Type: "Explain React hooks"
3. ✅ **Expected**: AI response appears with explanation

#### Step 7: Update Profile
1. Click "Profile" in navbar
2. Update learning goals, interests, difficulty level
3. Click Save
4. ✅ **Expected**: Success message, profile updated

#### Step 8: Logout and Login
1. Click "Logout"
2. ✅ **Expected**: Redirect to login page
3. Login with same credentials
4. ✅ **Expected**: Redirect to catalog, session restored

## Seed Data (If Catalog is Empty)

Use the following API calls to seed data:

### Create Domains/Courses via Backend

**Option 1: Direct MongoDB Insert**
```javascript
// Connect to MongoDB and run:
use ai-learning-assistant

db.courses.insertMany([
  {
    title: "Introduction to React",
    domain: "Web Development",
    description: "Learn React from scratch",
    level: "Beginner",
    modules: []
  },
  {
    title: "Python Data Science",
    domain: "Data Science",
    description: "Data analysis with Python",
    level: "Intermediate",
    modules: []
  }
])
```

**Option 2: Create via API**

Using PowerShell:
```powershell
# Create a course
$body = @{
    title = "Introduction to React"
    domain = "Web Development"
    description = "Learn React from scratch"
    level = "Beginner"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/catalog/courses" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

Or using curl:
```bash
curl -X POST http://localhost:5000/api/catalog/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to React",
    "domain": "Web Development",
    "description": "Learn React from scratch",
    "level": "Beginner"
  }'
```

## Common Test Scenarios

### Test Authentication

**Valid Login:**
```
Email: john@example.com
Password: password123
Expected: Success, redirect to catalog
```

**Invalid Credentials:**
```
Email: wrong@example.com
Password: wrongpass
Expected: Error message "Invalid credentials"
```

**Access Protected Route Without Login:**
```
1. Logout
2. Navigate directly to http://localhost:5173/dashboard
Expected: Redirect to /login
```

### Test Quiz Flow

**Generate Quiz:**
```
POST /api/quiz/generate
Body: {
  "topic": "React Hooks",
  "difficulty": "medium",
  "count": 5
}
Expected: 5 questions returned
```

**Submit Quiz:**
```
POST /api/quiz/submit
Body: {
  "moduleId": "...",
  "topic": "React Hooks",
  "answers": [{"question": "...", "selected_answer": "A"}],
  "original_questions": [...]
}
Expected: { score, total, percentage, details, sessionId }
```

### Test API Response Structure

All successful API responses follow:
```json
{
  "success": true,
  "data": { ... }
}
```

All error responses follow:
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "statusCode": 400
  }
}
```

## Debugging Checklist

### Backend Issues
- [ ] MongoDB is running (`mongo --version`)
- [ ] Backend server started (`npm run dev` in /server)
- [ ] .env file exists with MONGO_URI, JWT_SECRET
- [ ] Port 5000 is available
- [ ] Check terminal for errors

### Frontend Issues
- [ ] Frontend server started (`npm run dev` in /client/frontend)
- [ ] .env file exists with VITE_API_BASE_URL=http://localhost:5000/api
- [ ] Browser console shows no errors
- [ ] Network tab shows API calls going to localhost:5000

### Authentication Issues
- [ ] JWT_SECRET is set in backend .env
- [ ] Token stored in localStorage after login
- [ ] Token sent in Authorization header (check Network tab)
- [ ] No 401 errors in console

### Data Issues
- [ ] Database has courses/modules seeded
- [ ] User profile created after registration
- [ ] Quiz sessions saved after quiz submission

## Performance Verification

### Expected Load Times
- Login/Register: < 1 second
- Catalog page: < 2 seconds
- Quiz generation: 2-3 seconds (mock AI)
- Dashboard load: < 2 seconds

### Expected Behavior
- No console errors
- Smooth page transitions
- Charts render properly
- All buttons clickable
- Forms validate input

## Integration Test Checklist

- [ ] User can register
- [ ] User can login
- [ ] Protected routes redirect to login when not authenticated
- [ ] Navbar shows user name when logged in
- [ ] Catalog displays domains and courses
- [ ] Course detail shows modules
- [ ] Module detail shows content and quiz button
- [ ] Quiz generates questions
- [ ] Quiz submission returns score
- [ ] Analysis shows strengths/weaknesses
- [ ] Dashboard displays all sections
- [ ] Learning plan generates and displays
- [ ] Task completion updates progress
- [ ] Profile can be updated
- [ ] Logout clears session
- [ ] Re-login restores session

## Success Criteria

✅ All 12 integration requirements met:
1. API client with JWT and 401 redirect
2. Auth flow with localStorage
3. Protected routes
4. Catalog fetching domains/courses
5. CourseDetail with modules
6. ModuleDetail with content
7. QuizPage with full workflow
8. LearningPlan generation
9. Dashboard with metrics
10. Tutor chat (UI exists)
11. .env files created
12. Navbar for navigation

---

**If all tests pass, the application is ready for demo! 🎉**
