import React, { useState, useEffect } from 'react'
import { Container, Title, SimpleGrid, Card, Text, Group, Box, Loader, Center, Table, Badge, Button } from '@mantine/core'
import { IconPackage, IconClock, IconCheck, IconTrendingUp, IconPlus } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { donationApi } from '../../api/donationApi'
import '../../styles/dashboard.css'

const DonorDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    completed: 0,
    totalImpact: 0
  })
  const [recentDonations, setRecentDonations] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await donationApi.getStats()
      setStats(statsResponse.data)
      
      // Fetch recent donations
      const donationsResponse = await donationApi.getMyDonations()
      setRecentDonations(donationsResponse.data.slice(0, 5))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { icon: IconPackage, label: 'Active Donations', value: stats.active, color: 'green', bg: '#f0fdf4' },
    { icon: IconClock, label: 'Pending', value: stats.pending, color: 'yellow', bg: '#fefce8' },
    { icon: IconCheck, label: 'Completed', value: stats.completed, color: 'blue', bg: '#eff6ff' },
    { icon: IconTrendingUp, label: 'Lives Impacted', value: stats.totalImpact, color: 'orange', bg: '#fff7ed' },
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
            <Title order={2}>Welcome back, {user?.name?.split(' ')[0]}!</Title>
            <Text size="sm" opacity={0.9}>Here's what's happening with your donations</Text>
          </Box>
          <Button 
            leftSection={<IconPlus size={18} />}
            variant="white" 
            color="green"
            onClick={() => navigate('/donor/add-donation')}
          >
            New Donation
          </Button>
        </Group>
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="xl">
        {statCards.map((stat, index) => (
          <Card key={index} shadow="sm" p="lg" radius="md" withBorder style={{ backgroundColor: stat.bg }}>
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed">{stat.label}</Text>
                <Text size="2rem" fw={700}>{stat.value}</Text>
              </Box>
              <stat.icon size={40} color={`var(--mantine-color-${stat.color}-6)`} stroke={1.5} />
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Title order={3} mb="md">Recent Donations</Title>
        {recentDonations.length === 0 ? (
          <Text ta="center" c="dimmed" py="xl">No donations yet. Start by posting your first donation!</Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Food Item</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {recentDonations.map((donation) => (
                <Table.Tr key={donation._id}>
                  <Table.Td fw={500}>{donation.foodName}</Table.Td>
                  <Table.Td>{donation.quantity} {donation.unit}</Table.Td>
                  <Table.Td>
                    <Badge color={
                      donation.status === 'available' ? 'green' :
                      donation.status === 'accepted' ? 'yellow' :
                      donation.status === 'picked_up' ? 'blue' : 'teal'
                    }>
                      {donation.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{new Date(donation.createdAt).toLocaleDateString()}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </Container>
  )
}

export default DonorDashboard