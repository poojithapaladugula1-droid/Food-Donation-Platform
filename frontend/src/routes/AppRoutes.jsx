import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import MainLayout from '../layouts/MainLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import AuthLayout from '../layouts/AuthLayout'

// Shared Pages
import Home from '../pages/shared/Home'
import NotFound from '../pages/shared/NotFound'

// Auth Pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Donor Pages
import DonorDashboard from '../pages/donor/DonorDashboard'
import AddDonation from '../pages/donor/AddDonation'
import MyDonations from '../pages/donor/MyDonations'
import DonorProfile from '../pages/donor/DonorProfile'

// Volunteer Pages
import VolunteerDashboard from '../pages/volunteer/VolunteerDashboard'
import AvailableDonations from '../pages/volunteer/AvailableDonations'
import AcceptedDeliveries from '../pages/volunteer/AcceptedDeliveries'
import VolunteerProfile from '../pages/volunteer/VolunteerProfile'

// User Pages
import UserDashboard from '../pages/user/UserDashboard'
import RequestFood from '../pages/user/RequestFood'
import TrackDelivery from '../pages/user/TrackDelivery'
import UserProfile from '../pages/user/UserProfile'

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageUsers from '../pages/admin/ManageUsers'
import ManageDonations from '../pages/admin/ManageDonations'
import VolunteerMonitoring from '../pages/admin/VolunteerMonitoring'
import AdminProfile from '../pages/admin/AdminProfile'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}><Route index element={<Home />} /></Route>
      <Route path="/" element={<AuthLayout />}><Route path="login" element={<Login />} /><Route path="register" element={<Register />} /></Route>

      {/* Protected Dashboard Routes */}
      <Route path="/" element={<DashboardLayout />}>
        {/* Donor */}
        <Route path="donor"><Route path="dashboard" element={<ProtectedRoute allowedRoles={['donor']}><DonorDashboard /></ProtectedRoute>} /><Route path="add-donation" element={<ProtectedRoute allowedRoles={['donor']}><AddDonation /></ProtectedRoute>} /><Route path="my-donations" element={<ProtectedRoute allowedRoles={['donor']}><MyDonations /></ProtectedRoute>} /><Route path="profile" element={<ProtectedRoute allowedRoles={['donor']}><DonorProfile /></ProtectedRoute>} /></Route>

        {/* Volunteer */}
        <Route path="volunteer"><Route path="dashboard" element={<ProtectedRoute allowedRoles={['volunteer']}><VolunteerDashboard /></ProtectedRoute>} /><Route path="available" element={<ProtectedRoute allowedRoles={['volunteer']}><AvailableDonations /></ProtectedRoute>} /><Route path="accepted" element={<ProtectedRoute allowedRoles={['volunteer']}><AcceptedDeliveries /></ProtectedRoute>} /><Route path="profile" element={<ProtectedRoute allowedRoles={['volunteer']}><VolunteerProfile /></ProtectedRoute>} /></Route>

        {/* User */}
        <Route path="user"><Route path="dashboard" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} /><Route path="request-food" element={<ProtectedRoute allowedRoles={['user']}><RequestFood /></ProtectedRoute>} /><Route path="track-delivery" element={<ProtectedRoute allowedRoles={['user']}><TrackDelivery /></ProtectedRoute>} /><Route path="profile" element={<ProtectedRoute allowedRoles={['user']}><UserProfile /></ProtectedRoute>} /></Route>

        {/* Admin */}
        <Route path="admin"><Route path="dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} /><Route path="users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} /><Route path="donations" element={<ProtectedRoute allowedRoles={['admin']}><ManageDonations /></ProtectedRoute>} /><Route path="volunteers" element={<ProtectedRoute allowedRoles={['admin']}><VolunteerMonitoring /></ProtectedRoute>} /><Route path="profile" element={<ProtectedRoute allowedRoles={['admin']}><AdminProfile /></ProtectedRoute>} /></Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes