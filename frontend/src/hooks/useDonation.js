import { useState, useEffect, useCallback } from 'react'
import { notifications } from '@mantine/notifications'
import { donationApi } from '../api/donationApi'

export const useDonation = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all donations
  const fetchDonations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await donationApi.getAll()
      setDonations(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch donations')
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch donations',
        color: 'red'
      })
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch my donations
  const fetchMyDonations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await donationApi.getMyDonations()
      setDonations(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your donations')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch available donations for volunteers
  const fetchAvailableDonations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await donationApi.getAvailable()
      setDonations(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch available donations')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Create a new donation
  const createDonation = useCallback(async (donationData) => {
    setLoading(true)
    try {
      const response = await donationApi.create(donationData)
      notifications.show({
        title: 'Success',
        message: 'Donation posted successfully!',
        color: 'green'
      })
      return { success: true, data: response.data }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to create donation',
        color: 'red'
      })
      return { success: false, error: err.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Update a donation
  const updateDonation = useCallback(async (id, donationData) => {
    setLoading(true)
    try {
      const response = await donationApi.update(id, donationData)
      setDonations(prev => prev.map(d => d._id === id ? response.data : d))
      notifications.show({
        title: 'Success',
        message: 'Donation updated successfully!',
        color: 'green'
      })
      return { success: true, data: response.data }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to update donation',
        color: 'red'
      })
      return { success: false, error: err.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete a donation
  const deleteDonation = useCallback(async (id) => {
    setLoading(true)
    try {
      await donationApi.delete(id)
      setDonations(prev => prev.filter(d => d._id !== id))
      notifications.show({
        title: 'Success',
        message: 'Donation deleted successfully!',
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

  return {
    donations,
    loading,
    error,
    fetchDonations,
    fetchMyDonations,
    fetchAvailableDonations,
    createDonation,
    updateDonation,
    deleteDonation
  }
}