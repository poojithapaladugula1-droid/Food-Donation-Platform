import { useState, useCallback } from 'react'
import { notifications } from '@mantine/notifications'
import { requestApi } from '../api/requestApi'

export const useRequest = () => {
  const [requests, setRequests] = useState([])
  const [activeRequest, setActiveRequest] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch my requests
  const fetchMyRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await requestApi.getMyRequests()
      setRequests(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch requests')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch active request (for tracking)
  const fetchActiveRequest = useCallback(async () => {
    setLoading(true)
    try {
      const response = await requestApi.getActiveRequest()
      setActiveRequest(response.data)
      return response.data
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Failed to fetch active request')
      }
      setActiveRequest(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Create a new food request
  const createRequest = useCallback(async (requestData) => {
    setLoading(true)
    try {
      const response = await requestApi.create(requestData)
      setRequests(prev => [response.data, ...prev])
      notifications.show({
        title: 'Request Submitted!',
        message: 'A volunteer will contact you soon',
        color: 'green'
      })
      return { success: true, data: response.data }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to submit request',
        color: 'red'
      })
      return { success: false, error: err.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Track a specific delivery
  const trackDelivery = useCallback(async (requestId) => {
    setLoading(true)
    try {
      const response = await requestApi.trackDelivery(requestId)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to track delivery')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Cancel a request
  const cancelRequest = useCallback(async (requestId) => {
    setLoading(true)
    try {
      await requestApi.cancel(requestId)
      setRequests(prev => prev.filter(r => r._id !== requestId))
      if (activeRequest?._id === requestId) {
        setActiveRequest(null)
      }
      notifications.show({
        title: 'Cancelled',
        message: 'Request has been cancelled',
        color: 'blue'
      })
      return { success: true }
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to cancel request',
        color: 'red'
      })
      return { success: false, error: err.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }, [activeRequest])

  return {
    requests,
    activeRequest,
    loading,
    error,
    fetchMyRequests,
    fetchActiveRequest,
    createRequest,
    trackDelivery,
    cancelRequest
  }
}