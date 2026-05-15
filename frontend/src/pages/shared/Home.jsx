import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Title, Text, Button, Grid, Card, Group, SimpleGrid, Box } from '@mantine/core'
import { IconHeart, IconTruck, IconUsers } from '@tabler/icons-react'
import '../../styles/home.css'

const Home = () => {
  const navigate = useNavigate()
  const swipeRef = useRef(null)

  const features = [
    { icon: IconHeart, title: 'Donate Food', desc: 'Share excess food with those in need', color: '#22c55e' },
    { icon: IconTruck, title: 'Volunteer', desc: 'Help deliver food to communities', color: '#3b82f6' },
    { icon: IconUsers, title: 'Receive Help', desc: 'Get food assistance when needed', color: '#eab308' },
  ]

  const stats = [
    { number: '500+', label: 'Meals Saved' },
    { number: '100+', label: 'Active Volunteers' },
    { number: '50+', label: 'Partner NGOs' },
  ]

  return (
    <>
      {/* Hero Section */}
      <Box className="hero-section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <Container size="lg">
          <Title className="hero-title" ta="center" size="3rem">Share Food, Save Lives</Title>
          <Text size="xl" c="dimmed" mb="xl" maw={600} mx="auto" ta="center">
            Connect with donors, volunteers, and communities to reduce food waste and fight hunger
          </Text>
          <Group justify="center">
            <Button 
              size="lg" 
              variant="gradient" 
              gradient={{ from: '#22c55e', to: '#16a34a' }}
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button size="lg" variant="outline" color="green">
              Learn More
            </Button>
          </Group>
        </Container>
      </Box>

      {/* Swipe Section for Auth */}
      <Container size="xl" py="xl">
        <Box 
          ref={swipeRef}
          style={{ display: 'flex', gap: '2rem', overflowX: 'auto', padding: '1rem' }}
        >
          <Box style={{ minWidth: '300px', flexShrink: 0 }}>
            <Card shadow="md" p="xl" radius="md" withBorder>
              <Title order={3} mb="md">Already have an account?</Title>
              <Text mb="lg">Login to access your dashboard</Text>
              <Button fullWidth onClick={() => navigate('/login')}>Login</Button>
            </Card>
          </Box>
          <Box style={{ minWidth: '300px', flexShrink: 0 }}>
            <Card shadow="md" p="xl" radius="md" withBorder>
              <Title order={3} mb="md">New to FoodShare?</Title>
              <Text mb="lg">Create an account to get started</Text>
              <Button fullWidth variant="outline" color="green" onClick={() => navigate('/register')}>
                Register
              </Button>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* Features Section */}
      <Container size="xl" py="xl">
        <Title ta="center" order={2} mb="xl">How It Works</Title>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
          {features.map((feature, index) => (
            <Card key={index} shadow="sm" p="xl" radius="md" withBorder className="feature-card">
              <feature.icon size={48} color={feature.color} stroke={1.5} />
              <Title order={3} mt="md">{feature.title}</Title>
              <Text size="sm" c="dimmed" mt="sm">{feature.desc}</Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Stats Section */}
      <Box style={{ backgroundColor: '#f0fdf4', padding: '4rem 0' }}>
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
            {stats.map((stat, index) => (
              <Card key={index} shadow="none" p="xl" radius="md" style={{ textAlign: 'center', background: 'transparent' }}>
                <Text className="stats-number" fw={700} size="2rem" c="green">{stat.number}</Text>
                <Text size="sm" c="dimmed">{stat.label}</Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </>
  )
}

export default Home