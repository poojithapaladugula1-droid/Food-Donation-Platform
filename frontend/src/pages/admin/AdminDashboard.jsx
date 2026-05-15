import React, { useState, useEffect } from 'react'
import { Container, Title, SimpleGrid, Card, Text, Group, Box, Table, Badge, Loader, Center, Button } from '@mantine/core'
import { IconUsers, IconPackage, IconTruck, IconCheck, IconClock, IconAlertCircle, IconRefresh } from '@tabler/icons-react'
import { adminApi } from '../../api/adminApi'
import PageHeader from '../../components/common/PageHeader'

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    pendingDonations: 0,
    activeVolunteers: 0,
    completedDeliveries: 0,
    urgentRequests: 0
  })
  const [recentDonations, setRecentDonations] = useState([])
  const [topVolunteers, setTopVolunteers] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const statsResponse = await adminApi.getStats()
      setStats(statsResponse.data)
      
      const donationsResponse = await adminApi.getAllDonations()
      setRecentDonations(donationsResponse.data.slice(0, 5))
      
      const volunteersResponse = await adminApi.getVolunteerStats()
      setTopVolunteers(volunteersResponse.data.slice(0, 3))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { icon: IconUsers, label: 'Total Users', value: stats.totalUsers, color: 'blue', bg: '#eff6ff' },
    { icon: IconPackage, label: 'Total Donations', value: stats.totalDonations, color: 'green', bg: '#f0fdf4' },
    { icon: IconClock, label: 'Pending Donations', value: stats.pendingDonations, color: 'yellow', bg: '#fefce8' },
    { icon: IconTruck, label: 'Active Volunteers', value: stats.activeVolunteers, color: 'teal', bg: '#f0fdfa' },
    { icon: IconCheck, label: 'Completed Deliveries', value: stats.completedDeliveries, color: 'green', bg: '#f0fdf4' },
    { icon: IconAlertCircle, label: 'Urgent Requests', value: stats.urgentRequests, color: 'red', bg: '#fef2f2' },
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
      <PageHeader 
        title="Admin Dashboard" 
        subtitle="Overview of platform activity"
        actionButton={
          <Button 
            variant="light" 
            leftSection={<IconRefresh size={16} />}
            onClick={fetchDashboardData}
          >
            Refresh
          </Button>
        }
      />
      
      <SimpleGrid cols={{ base: 2, md: 3, lg: 6 }} spacing="md" mb="xl">
        {statCards.map((stat, index) => (
          <Card key={index} shadow="sm" p="md" radius="md" withBorder style={{ backgroundColor: stat.bg }}>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed">{stat.label}</Text>
                <Text size="1.5rem" fw={700}>{stat.value}</Text>
              </div>
              <stat.icon size={32} color={`var(--mantine-color-${stat.color}-6)`} />
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {/* Recent Donations */}
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Title order={3} mb="md">Recent Donations</Title>
          {recentDonations.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">No donations yet</Text>
          ) : (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Food</Table.Th>
                  <Table.Th>Donor</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {recentDonations.map((donation) => (
                  <Table.Tr key={donation._id}>
                    <Table.Td fw={500}>{donation.foodName}</Table.Td>
                    <Table.Td>{donation.donorName || 'Anonymous'}</Table.Td>
                    <Table.Td>
                      <Badge color={donation.status === 'available' ? 'green' : 'yellow'}>
                        {donation.status}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Card>

        {/* Top Volunteers */}
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Title order={3} mb="md">Top Volunteers</Title>
          {topVolunteers.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">No volunteers yet</Text>
          ) : (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Deliveries</Table.Th>
                  <Table.Th>Rating</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {topVolunteers.map((volunteer, index) => (
                  <Table.Tr key={index}>
                    <Table.Td fw={500}>{volunteer.name}</Table.Td>
                    <Table.Td>{volunteer.deliveries}</Table.Td>
                    <Table.Td>{volunteer.rating} ★</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Card>
      </SimpleGrid>
    </Container>
  )
}

export default AdminDashboard