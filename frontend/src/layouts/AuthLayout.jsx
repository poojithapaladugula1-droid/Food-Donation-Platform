import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Container, Group } from '@mantine/core'
import { IconHeart } from '@tabler/icons-react'

const AuthLayout = () => {
  return (
    <Box style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container size="sm" py="xl">
        <Group justify="center" mb="xl">
          <IconHeart size={40} color="#22c55e" />
        </Group>
        <Outlet />
      </Container>
    </Box>
  )
}

export default AuthLayout