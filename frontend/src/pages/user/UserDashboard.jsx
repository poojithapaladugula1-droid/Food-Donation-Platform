import React, { useState, useEffect } from 'react'
import { Container, Title, SimpleGrid, Card, Text, Group, Box, Badge, Loader, Center, Table, Button, Alert } from '@mantine/core'
import { IconShoppingBag, IconPackage, IconCheck, IconClock, IconTruck, IconPlus } from '@tabler/icons-react'
import { useAuth } from '../../context/AuthContext'
import { requestApi } from '../../api/requestApi'
import { useNavigate } from 'react-router-dom'

const UserDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeRequests: 0,
    completedRequests: 0,
    pendingRequests: 0,
  })
  const [recentRequests, setRecentRequests] = useState([])
  const [activeDelivery, setActiveDelivery] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const requestsResponse = await requestApi.getMyRequests()
      const requests = requestsResponse.data
      
      setStats({
        activeRequests: requests.filter(r => r.status !== 'delivered').length,
        completedRequests: requests.filter(r => r.status === 'delivered').length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
      })
      
      setRecentRequests(requests.slice(0, 5))
      
      // Get active delivery if exists
      const active = requests.find(r => r.status !== 'delivered')
      if (active) {
        const trackResponse = await requestApi.trackDelivery(active._id)
        setActiveDelivery(trackResponse.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { icon: IconClock, label: 'Active Requests', value: stats.activeRequests, color: 'yellow', bg: '#fefce8' },
    { icon: IconTruck, label: 'In Progress', value: stats.pendingRequests, color: 'blue', bg: '#eff6ff' },
    { icon: IconCheck, label: 'Completed', value: stats.completedRequests, color: 'green', bg: '#f0fdf4' },
  ]

  if (loading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Loader size="xl" color="green" />
      </Center>
    )
  }

  return (
    <Container size="xl">
      <Box className="dashboard-header" style={{ 
        background: 'linear-gradient(135deg, #166534, #22c55e)', 
        color: 'white', 
        padding: '2rem', 
        borderRadius: '0 0 20px 20px',
        marginBottom: '2rem'
      }}>
        <Group justify="space-between" align="center">
          <Box>
            <Title order={2}>Welcome, {user?.name?.split(' ')[0]}!</Title>
            <Text size="sm" opacity={0.9}>Track your food assistance requests here</Text>
          </Box>
          <Button 
            leftSection={<IconPlus size={18} />}
            variant="white" 
            color="green"
            onClick={() => navigate('/user/request-food')}
          >
            Request Food
          </Button>
        </Group>
      </Box>

      {/* Active Delivery Alert */}
      {activeDelivery && activeDelivery.status !== 'delivered' && (
        <Alert 
          color="blue" 
          mb="xl"
          title="You have an active delivery!"
          icon={<IconTruck size={20} />}
        >
          <Group justify="space-between">
            <Text>Your food request is {activeDelivery.status.replace('_', ' ')}. Track its progress!</Text>
            <Button variant="light" size="xs" onClick={() => navigate('/user/track-delivery')}>
              Track Now
            </Button>
          </Group>
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
        {statCards.map((stat, index) => (
          <Card key={index} shadow="sm" p="lg" radius="md" withBorder style={{ backgroundColor: stat.bg }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed">{stat.label}</Text>
                <Text size="2rem" fw={700}>{stat.value}</Text>
              </div>
              <stat.icon size={40} color={`var(--mantine-color-${stat.color}-6)`} stroke={1.5} />
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {/* Recent Requests */}
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Title order={3} mb="md">Recent Requests</Title>
          {recentRequests.length === 0 ? (
            <Text ta="center" c="dimmed" py="xl">No requests yet. Click "Request Food" to get started!</Text>
          ) : (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Food Type</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Date</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {recentRequests.map((request) => (
                  <Table.Tr key={request._id}>
                    <Table.Td fw={500}>{request.foodType?.replace('_', ' ')}</Table.Td>
                    <Table.Td>
                      <Badge color={
                        request.status === 'delivered' ? 'green' :
                        request.status === 'accepted' ? 'blue' : 'yellow'
                      }>
                        {request.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{new Date(request.createdAt).toLocaleDateString()}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Card>

        {/* Quick Tips */}
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Title order={3} mb="md">Quick Tips</Title>
          <Stack gap="md">
            <Box>
              <Text fw={600}>📞 Keep your phone ready</Text>
              <Text size="sm" c="dimmed">Volunteers may call to confirm delivery details</Text>
            </Box>
            <Box>
              <Text fw={600}>📍 Provide accurate address</Text>
              <Text size="sm" c="dimmed">This helps volunteers find you faster</Text>
            </Box>
            <Box>
              <Text fw={600}>⭐ Rate your experience</Text>
              <Text size="sm" c="dimmed">Help us improve by rating volunteers after delivery</Text>
            </Box>
          </Stack>
        </Card>
      </SimpleGrid>
    </Container>
  )
}

export default UserDashboard