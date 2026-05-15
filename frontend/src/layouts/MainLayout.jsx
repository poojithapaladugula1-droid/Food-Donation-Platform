import React from 'react'
import { Outlet } from 'react-router-dom'
import { Container, Box } from '@mantine/core'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const MainLayout = () => {
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" style={{ flex: 1 }}>
        <Container size="xl" py="xl">
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  )
}

export default MainLayout