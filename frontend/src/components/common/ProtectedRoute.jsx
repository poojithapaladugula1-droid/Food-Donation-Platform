import React from 'react'
import { Navigate } from 'react-router-dom'
import { Loader, Center } from '@mantine/core'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="lg" color="green" />
      </Center>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute