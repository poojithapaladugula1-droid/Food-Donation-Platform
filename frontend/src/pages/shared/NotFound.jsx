import React from 'react'
import { Container, Title, Text, Button, Stack, Box } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { IconMoodSad, IconHome } from '@tabler/icons-react'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Container style={{ textAlign: 'center', marginTop: '100px' }}>
      <Stack align="center" gap="md">
        <IconMoodSad size={80} color="#9ca3af" />
        <Title order={1} style={{ fontSize: '6rem', color: '#22c55e' }}>404</Title>
        <Title order={2}>Page Not Found</Title>
        <Text c="dimmed" maw={400}>
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Button 
          variant="gradient" 
          gradient={{ from: '#22c55e', to: '#16a34a' }}
          leftSection={<IconHome size={18} />}
          onClick={() => navigate('/')}
          size="lg"
        >
          Go to Homepage
        </Button>
      </Stack>
    </Container>
  )
}

export default NotFound