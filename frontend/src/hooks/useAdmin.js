import { useState, useCallback } from 'react'
import { notifications } from '@mantine/notifications'
import { adminApi } from '../api/adminApi'

export const useAdmin = () => {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [donations, setDonations] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminApi.getStats()
      setStats(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stats')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminApi.getAllUsers()
      setUsers(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Update user role
  const updateUserRole = useCallback(async (userId, role) => {
    setLoading(true)
    try {
      const response = await adminApi.updateUserRole(userId, role)
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, role } : u
      ))
      notifications.show({
        title: 'Role Updated',
        message: `User role changed to ${role}`,
        color: 'green'
      })
      return { success: true, data: response.data }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to update role',
        color: 'red'
      })
      return { success: false, error: err.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Update user status
  const updateUserStatus = useCallback(async (userId, status) => {
    setLoading(true)
    try {
      const response = await adminApi.updateUserStatus(userId, status)
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, status } : u
      ))
      notifications.show({
        title: 'Status Updated',
        message: `User is now ${status}`,
        color: 'green'
      })
      return { success: true, data: response.data }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to update status',
        color: 'red'
      })
      return { success: false, error: err.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete user
  const deleteUser = useCallback(async (userId) => {
    setLoading(true)
    try {
      await adminApi.deleteUser(userId)
      setUsers(prev => prev.filter(u => u._id !== userId))
      notifications.show({
        title: 'Deleted',
        message: 'User removed successfully',
        color: 'green'
      })
      return { success: true }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to delete user',
        color: 'red'
      })
      return { success: false, error: err.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch all donations
  const fetchDonations = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminApi.getAllDonations()
      setDonations(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch donations')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete donation
  const deleteDonation = useCallback(async (donationId) => {
    setLoading(true)
    try {
      await adminApi.deleteDonation(donationId)
      setDonations(prev => prev.filter(d => d._id !== donationId))
      notifications.show({
        title: 'Deleted',
        message: 'Donation removed successfully',
        color: 'green'
      })
      return { success: true }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to delete donation',
        color: 'red'
      })
      return { success: false, error: err.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch volunteer stats
  const fetchVolunteers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminApi.getVolunteerStats()
      setVolunteers(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch volunteers')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    stats,
    users,
    donations,
    volunteers,
    loading,
    error,
    fetchStats,
    fetchUsers,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    fetchDonations,
    deleteDonation,
    fetchVolunteers
  }
}