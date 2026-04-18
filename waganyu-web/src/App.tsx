import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SetupPage from "./pages/SetupPage";
import HomePage from "./pages/HomePage";
import WorkersPage from "./pages/WorkersPage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import JobDetailsPage from "./pages/JobDetailsPage";
import WorkerProfilePage from "./pages/WorkerProfilePage";
import ChatPage from "./pages/ChatPage";
import PostJobPage from "./pages/PostJobPage";
import MyJobsPage from "./pages/MyJobsPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/landing" replace />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Setup route - requires auth but incomplete profile */}
      <Route path="/setup" element={
        <ProtectedRoute>
          <SetupPage />
        </ProtectedRoute>
      } />
      
      {/* Protected routes - requires auth and complete profile */}
      <Route path="/dashboard" element={
        <ProtectedRoute requireProfileComplete>
          <HomePage />
        </ProtectedRoute>
      } />
      <Route path="/workers" element={
        <ProtectedRoute requireProfileComplete>
          <WorkersPage />
        </ProtectedRoute>
      } />
      <Route path="/my-jobs" element={
        <ProtectedRoute requireProfileComplete>
          <MyJobsPage />
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute requireProfileComplete>
          <MessagesPage />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute requireProfileComplete>
          <NotificationsPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute requireProfileComplete>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      {/* Detail pages - requires auth */}
      <Route path="/job/:id" element={
        <ProtectedRoute requireProfileComplete>
          <JobDetailsPage />
        </ProtectedRoute>
      } />
      <Route path="/worker/:id" element={
        <ProtectedRoute requireProfileComplete>
          <WorkerProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/chat/:id" element={
        <ProtectedRoute requireProfileComplete>
          <ChatPage />
        </ProtectedRoute>
      } />
      <Route path="/post-job" element={
        <ProtectedRoute requireProfileComplete>
          <PostJobPage />
        </ProtectedRoute>
      } />
      
      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
