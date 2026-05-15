import React, { createContext, useState, useContext, useEffect } from 'react'
import { notifications } from '@mantine/notifications'
import { authApi } from '../api/authApi'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        
        try {
          const response = await authApi.getProfile()
          setUser(response.data.user)
          localStorage.setItem('user', JSON.stringify(response.data.user))
        } catch (error) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }
    
    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password })
      const { token, user } = response.data
      
      setUser(user)
      setToken(token)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      notifications.show({
        title: 'Welcome back!',
        message: `Hello ${user.name}`,
        color: 'green',
      })
      
      return { success: true, user }
    } catch (error) {
      notifications.show({
        title: 'Login Failed',
        message: error.response?.data?.message || 'Invalid credentials',
        color: 'red',
      })
      return { success: false, error: error.response?.data?.message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData)
      const { token, user } = response.data
      
      setUser(user)
      setToken(token)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      notifications.show({
        title: 'Welcome!',
        message: `Account created successfully for ${user.name}`,
        color: 'green',
      })
      
      return { success: true, user }
    } catch (error) {
      notifications.show({
        title: 'Registration Failed',
        message: error.response?.data?.message || 'Something went wrong',
        color: 'red',
      })
      return { success: false, error: error.response?.data?.message }
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      notifications.show({
        title: 'Logged Out',
        message: 'You have been logged out successfully',
        color: 'blue',
      })
    }
  }

  const updateProfile = async (data) => {
    try {
      const response = await authApi.updateProfile(data)
      setUser(response.data.user)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      notifications.show({
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully',
        color: 'green',
      })
      return { success: true }
    } catch (error) {
      notifications.show({
        title: 'Update Failed',
        message: error.response?.data?.message || 'Failed to update profile',
        color: 'red',
      })
      return { success: false }
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}