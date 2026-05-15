import React from 'react'
import { Loader as MantineLoader, Center, Box } from '@mantine/core'

const Loader = ({ fullScreen = false, size = 'xl' }) => {
  if (fullScreen) {
    return (
      <Center style={{ height: '100vh' }}>
        <MantineLoader size={size} color="green" />
      </Center>
    )
  }
  
  return (
    <Center style={{ height: '200px' }}>
      <MantineLoader size={size} color="green" />
    </Center>
  )
}

export default Loader