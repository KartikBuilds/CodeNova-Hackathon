import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import CourseDetail from './pages/CourseDetail';
import ModuleDetail from './pages/ModuleDetail';
import QuizPage from './pages/QuizPage';
import DashboardPage from './pages/DashboardPage';
import LearningPlanPage from './pages/LearningPlanPage';
import LearningPath from './pages/LearningPath';
import Profile from './pages/Profile';
import TutorChat from './components/TutorChat';
import FloatingTutor from './components/FloatingTutor';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <FloatingTutor />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/catalog" replace />} />
          
          {/* Public catalog route */}
          <Route path="/catalog" element={<Catalog />} />
          
          {/* Protected routes */}
          <Route 
            path="/course/:id" 
            element={
              <PrivateRoute>
                <CourseDetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/module/:id" 
            element={
              <PrivateRoute>
                <ModuleDetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/quiz/:moduleId" 
            element={
              <PrivateRoute>
                <QuizPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/plan" 
            element={
              <PrivateRoute>
                <LearningPlanPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/path" 
            element={
              <PrivateRoute>
                <LearningPath />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/tutor" 
            element={
              <PrivateRoute>
                <TutorChat />
              </PrivateRoute>
            } 
          />
          
          {/* Catch all - redirect to catalog */}
          <Route path="*" element={<Navigate to="/catalog" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

