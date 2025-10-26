import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Help from "./pages/Help";
import About from "./pages/About";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import MapPage from "./pages/MapPage";
import IssueDetailPage from "./pages/IssueDetailPage";

// User Pages
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";
import IssuesBrowser from "./pages/IssuesBrowser";
import ReportIssuePage from "./pages/ReportIssuePage";

// Volunteer Pages
import Volunteer from "./pages/Volunteer";
import VolunteerBrowserIssues from "./pages/VolunteerBrowserIssues";
import MyAssignedIssues from "./pages/MyAssignedIssues";
import VolunteerProfile from "./pages/VolunteerProfile";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminAllIssues from "./pages/AdminAllIssues";
import AdminUsersVolunteers from "./pages/AdminUsersVolunteers";
import AdminRequests from "./pages/AdminRequests";
import AdminIssuesUpdates from "./pages/AdminIssuesUpdates";
import AdminProfile from "./pages/AdminProfile";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ========== Public Routes ========== */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
          <Route path="/mappage" element={<MapPage initialCenter={[40.7128, -74.006]} />} />
          <Route path="/issue/:id" element={<IssueDetailPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* ========== User Routes ========== */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['user', 'volunteer', 'admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/browse-issues" element={
            <ProtectedRoute allowedRoles={['user', 'volunteer', 'admin']}>
              <IssuesBrowser />
            </ProtectedRoute>
          } />
          <Route path="/report-issue" element={
            <ProtectedRoute allowedRoles={['user']}>
              <ReportIssuePage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['user']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/edit-profile" element={
            <ProtectedRoute allowedRoles={['user']}>
              <EditProfile />
            </ProtectedRoute>
          } />

          {/* ========== Volunteer Routes ========== */}
          <Route path="/volunteer" element={
            <ProtectedRoute allowedRoles={['volunteer']}>
              <Volunteer />
            </ProtectedRoute>
          } />
          <Route path="/volunteer-browser-issues" element={
            <ProtectedRoute allowedRoles={['volunteer']}>
              <VolunteerBrowserIssues />
            </ProtectedRoute>
          } />
          <Route path="/my-assigned-issues" element={
            <ProtectedRoute allowedRoles={['volunteer']}>
              <MyAssignedIssues />
            </ProtectedRoute>
          } />
          <Route path="/volunteer-profile" element={
            <ProtectedRoute allowedRoles={['volunteer']}>
              <VolunteerProfile />
            </ProtectedRoute>
          } />
          <Route path="/edit-volunteer-profile" element={
            <ProtectedRoute allowedRoles={['volunteer']}>
              <EditProfile  />
            </ProtectedRoute>
          } />

          {/* ========== Admin Routes ========== */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-profile" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfile />
            </ProtectedRoute>
          } />
          <Route path="/admin-all-issues" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAllIssues />
            </ProtectedRoute>
          } />
          <Route path="/admin-users-volunteers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsersVolunteers />
            </ProtectedRoute>
          } />
          <Route path="/admin-requests" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminRequests />
            </ProtectedRoute>
          } />
          <Route path="/admin-issues-updates" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminIssuesUpdates />
            </ProtectedRoute>
          } />
          <Route path="/edit-admin-profile" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditProfile  />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;