import React, { useState, useEffect } from 'react'
import { Container, SimpleGrid, Card, Text, Badge, Button, Group, Modal, Box, Loader, Center, Alert, TextInput, Select } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconMapPin, IconPackage, IconClock, IconAlertCircle, IconSearch, IconFilter } from '@tabler/icons-react'
import { donationApi } from '../../api/donationApi'
import { volunteerApi } from '../../api/volunteerApi'
import PageHeader from '../../components/common/PageHeader'

const AvailableDonations = () => {
  const [donations, setDonations] = useState([])
  const [filteredDonations, setFilteredDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [acceptModalOpen, setAcceptModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('all')

  useEffect(() => {
    fetchAvailableDonations()
  }, [])

  useEffect(() => {
    filterDonations()
  }, [searchTerm, urgencyFilter, donations])

  const fetchAvailableDonations = async () => {
    setLoading(true)
    try {
      const response = await donationApi.getAvailable()
      setDonations(response.data)
      setFilteredDonations(response.data)
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch available donations',
        color: 'red'
      })
    } finally {
      setLoading(false)
    }
  }

  const filterDonations = () => {
    let filtered = [...donations]
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Urgency filter
    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(d => d.urgency === urgencyFilter)
    }
    
    setFilteredDonations(filtered)
  }

  const handleAccept = async () => {
    try {
      await volunteerApi.acceptDonation(selectedDonation._id)
      notifications.show({
        title: 'Accepted!',
        message: `You have accepted ${selectedDonation.foodName}. A donor will be notified.`,
        color: 'green'
      })
      setAcceptModalOpen(false)
      fetchAvailableDonations() // Refresh the list
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to accept donation',
        color: 'red'
      })
    }
  }

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'high': return 'red'
      case 'medium': return 'yellow'
      case 'low': return 'green'
      default: return 'gray'
    }
  }

  const getUrgencyIcon = (urgency) => {
    if (urgency === 'high') return <IconAlertCircle size={16} />
    return null
  }

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
        title="Available Donations" 
        subtitle="Find and accept food donations near you to help those in need"
      />

      {/* Search and Filter Bar */}
      <Card shadow="sm" p="md" radius="md" withBorder mb="lg">
        <Group grow>
          <TextInput
            placeholder="Search by food name or description..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            placeholder="Filter by urgency"
            value={urgencyFilter}
            onChange={setUrgencyFilter}
            data={[
              { value: 'all', label: 'All Donations' },
              { value: 'high', label: '🔥 High Urgency' },
              { value: 'medium', label: '⚠️ Medium Urgency' },
              { value: 'low', label: '✅ Low Urgency' },
            ]}
          />
        </Group>
      </Card>

      {filteredDonations.length === 0 ? (
        <Card shadow="sm" p="xl" radius="md" withBorder>
          <Text ta="center" c="dimmed">
            {donations.length === 0 
              ? "No available donations at the moment. Check back later!" 
              : "No donations match your search criteria"}
          </Text>
        </Card>
      ) : (
        <>
          <Text mb="sm" size="sm" c="dimmed">Found {filteredDonations.length} donation(s)</Text>
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
            {filteredDonations.map((donation) => (
              <Card key={donation._id} shadow="sm" p="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Badge 
                    color={getUrgencyColor(donation.urgency)} 
                    size="lg"
                    leftSection={getUrgencyIcon(donation.urgency)}
                  >
                    {donation.urgency?.toUpperCase() || 'MEDIUM'} URGENCY
                  </Badge>
                  <Badge variant="light" color="blue">
                    {donation.distance ? `${donation.distance} away` : 'Available'}
                  </Badge>
                </Group>
                
                <Text fw={700} size="lg" mb="xs">{donation.foodName}</Text>
                <Text size="sm" c="dimmed" mb="md">Posted by: {donation.donorName || 'Anonymous Donor'}</Text>
                
                <Stack gap="xs" mb="md">
                  <Group gap="xs">
                    <IconPackage size={16} color="#22c55e" />
                    <Text size="sm">Quantity: {donation.quantity} {donation.unit}</Text>
                  </Group>
                  <Group gap="xs">
                    <IconMapPin size={16} color="#3b82f6" />
                    <Text size="sm">{donation.pickupLocation}</Text>
                  </Group>
                  <Group gap="xs">
                    <IconClock size={16} color="#eab308" />
                    <Text size="sm">Expires: {new Date(donation.expiryTime).toLocaleString()}</Text>
                  </Group>
                </Stack>
                
                {donation.description && (
                  <Text size="xs" c="dimmed" mb="md" lineClamp={2}>
                    📝 {donation.description}
                  </Text>
                )}
                
                <Button 
                  fullWidth 
                  variant="gradient" 
                  gradient={{ from: '#22c55e', to: '#16a34a' }}
                  onClick={() => {
                    setSelectedDonation(donation)
                    setAcceptModalOpen(true)
                  }}
                >
                  Accept Donation
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        </>
      )}

      {/* Accept Confirmation Modal */}
      <Modal 
        opened={acceptModalOpen} 
        onClose={() => setAcceptModalOpen(false)}
        title="Confirm Acceptance"
        centered
        size="md"
      >
        <Text mb="md">You are about to accept this donation:</Text>
        <Card withBorder p="md" mb="lg" style={{ backgroundColor: '#f0fdf4' }}>
          <Text fw={600} size="lg">{selectedDonation?.foodName}</Text>
          <Text size="sm">📍 {selectedDonation?.pickupLocation}</Text>
          <Text size="sm">📦 {selectedDonation?.quantity} {selectedDonation?.unit}</Text>
          <Text size="sm">⏰ Pickup by: {selectedDonation?.expiryTime && new Date(selectedDonation.expiryTime).toLocaleString()}</Text>
        </Card>
        
        <Alert color="blue" mb="lg">
          <Text size="sm">Please ensure you can:</Text>
          <Text size="sm" component="li">✓ Pick up the food before it expires</Text>
          <Text size="sm" component="li">✓ Handle the quantity properly</Text>
          <Text size="sm" component="li">✓ Deliver to the receiving community</Text>
        </Alert>
        
        <Group justify="flex-end">
          <Button variant="light" onClick={() => setAcceptModalOpen(false)}>Cancel</Button>
          <Button color="green" onClick={handleAccept}>Confirm & Accept</Button>
        </Group>
      </Modal>
    </Container>
  )
}

export default AvailableDonations