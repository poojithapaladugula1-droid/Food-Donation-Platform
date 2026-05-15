import { useState, useCallback } from 'react'
import { notifications } from '@mantine/notifications'
import { volunteerApi } from '../api/volunteerApi'

export const useVolunteer = () => {
  const [deliveries, setDeliveries] = useState([])
  const [stats, setStats] = useState(null)
  const [rewards, setRewards] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch accepted deliveries
  const fetchAcceptedDeliveries = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await volunteerApi.getAcceptedDeliveries()
      setDeliveries(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch deliveries')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch volunteer stats
  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const response = await volunteerApi.getStats()
      setStats(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stats')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch rewards and badges
  const fetchRewards = useCallback(async () => {
    setLoading(true)
    try {
      const response = await volunteerApi.getRewards()
      setRewards(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch rewards')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Accept a donation
  const acceptDonation = useCallback(async (donationId) => {
    setLoading(true)
    try {
      const response = await volunteerApi.acceptDonation(donationId)
      notifications.show({
        title: 'Accepted!',
        message: 'You have accepted this donation',
        color: 'green'
      })
      return { success: true, data: response.data }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to accept donation',
        color: 'red'
      })
      return { success: false, error: err.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Update delivery status
  const updateDeliveryStatus = useCallback(async (deliveryId, status, location = null) => {
    setLoading(true)
    try {
      const response = await volunteerApi.updateDeliveryStatus(deliveryId, status, location)
      setDeliveries(prev => prev.map(d => 
        d._id === deliveryId ? { ...d, status } : d
      ))
      notifications.show({
        title: 'Updated',
        message: `Delivery marked as ${status.replace('_', ' ')}`,
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

  // Get leaderboard
  const getLeaderboard = useCallback(async () => {
    setLoading(true)
    try {
      const response = await volunteerApi.getLeaderboard()
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leaderboard')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    deliveries,
    stats,
    rewards,
    loading,
    error,
    fetchAcceptedDeliveries,
    fetchStats,
    fetchRewards,
    acceptDonation,
    updateDeliveryStatus,
    getLeaderboard
  }
}