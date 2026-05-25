import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Dashboard from '../pages/Dashboard'
import Journal from '../pages/Journal'
import Mood from '../pages/Mood'
import Focus from '../pages/Focus'
import AdminLogin from '../pages/AdminLogin'
import AdminDashboard from '../pages/AdminDashboard'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="user" redirectTo="/login">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal"
          element={
            <ProtectedRoute allowedRole="user" redirectTo="/login">
              <Journal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mood"
          element={
            <ProtectedRoute allowedRole="user" redirectTo="/login">
              <Mood />
            </ProtectedRoute>
          }
        />
        <Route
          path="/focus"
          element={
            <ProtectedRoute allowedRole="user" redirectTo="/login">
              <Focus />
            </ProtectedRoute>
          }
        />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin" redirectTo="/admin-login">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Legacy paths → new routes */}
        <Route path="/admin/login" element={<Navigate to="/admin-login" replace />} />
        <Route path="/admin/dashboard" element={<Navigate to="/admin-dashboard" replace />} />
      </Route>
    </Routes>
  )
}
