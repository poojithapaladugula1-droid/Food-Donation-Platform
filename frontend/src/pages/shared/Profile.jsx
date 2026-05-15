import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader, Center } from '@mantine/core'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      // Redirect to role-specific profile
      navigate(`/${user.role}/profile`)
    } else if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" color="green" />
      </Center>
    )
  }

  return null
}

export default Profile