import React, { useState, useEffect } from 'react'
import { Container, Title, SimpleGrid, Card, Text, Group, Box, Progress, Badge, Loader, Center, RingProgress, Table } from '@mantine/core'
import { IconTruck, IconCheck, IconClock, IconAward, IconUsers, IconMapPin } from '@tabler/icons-react'
import { useAuth } from '../../context/AuthContext'
import { volunteerApi } from '../../api/volunteerApi'

const VolunteerDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    availableDeliveries: 0,
    activeDeliveries: 0,
    completedDeliveries: 0,
    totalPoints: 0,
    currentLevel: 'Bronze',
    nextLevelPoints: 500,
    rating: 0,
    recentDeliveries: []
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const statsResponse = await volunteerApi.getStats()
      setStats(statsResponse.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelProgress = () => {
    return (stats.totalPoints / stats.nextLevelPoints) * 100
  }

  const statCards = [
    { icon: IconTruck, label: 'Available', value: stats.availableDeliveries, color: 'green', bg: '#f0fdf4' },
    { icon: IconClock, label: 'In Progress', value: stats.activeDeliveries, color: 'yellow', bg: '#fefce8' },
    { icon: IconCheck, label: 'Completed', value: stats.completedDeliveries, color: 'blue', bg: '#eff6ff' },
    { icon: IconAward, label: 'Points', value: stats.totalPoints, color: 'orange', bg: '#fff7ed' },
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
        <Title order={2}>Welcome back, {user?.name?.split(' ')[0]}!</Title>
        <Text>Thank you for your service as a volunteer</Text>
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="xl">
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

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="xl">
        {/* Level Progress Card */}
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Text fw={600} mb="md">Your Level Progress</Text>
          <Group justify="space-between" mb="xs">
            <Badge size="lg" color="orange">Level: {stats.currentLevel}</Badge>
            <Text size="sm">{stats.totalPoints} / {stats.nextLevelPoints} points</Text>
          </Group>
          <Progress value={getLevelProgress()} color="green" size="lg" radius="xl" />
          <Text size="xs" c="dimmed" mt="xs">
            {stats.nextLevelPoints - stats.totalPoints} more points to reach next level
          </Text>
        </Card>

        {/* Rating Card */}
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">Volunteer Rating</Text>
              <Text size="2rem" fw={700}>{stats.rating} ★</Text>
              <Text size="sm">Based on {stats.completedDeliveries} deliveries</Text>
            </div>
            <RingProgress
              size={100}
              thickness={8}
              sections={[{ value: (stats.rating / 5) * 100, color: 'green' }]}
              label={<Text ta="center" size="xl" fw={700}>{stats.rating}</Text>}
            />
          </Group>
        </Card>
      </SimpleGrid>

      {/* Recent Deliveries */}
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Title order={3} mb="md">Recent Deliveries</Title>
        {stats.recentDeliveries?.length === 0 ? (
          <Text ta="center" c="dimmed" py="xl">No deliveries yet. Start by accepting donations!</Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Food Item</Table.Th>
                <Table.Th>Location</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Points Earned</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {stats.recentDeliveries?.map((delivery) => (
                <Table.Tr key={delivery._id}>
                  <Table.Td fw={500}>{delivery.foodName}</Table.Td>
                  <Table.Td>{delivery.location}</Table.Td>
                  <Table.Td>
                    <Badge color={delivery.status === 'delivered' ? 'green' : 'yellow'}>
                      {delivery.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>+{delivery.points || 10}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </Container>
  )
}

export default VolunteerDashboard