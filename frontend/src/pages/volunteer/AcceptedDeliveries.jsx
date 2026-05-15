import React, { useState, useEffect } from 'react'
import { Container, Card, Text, Group, Button, Stepper, Badge, Stack, SimpleGrid, Loader, Center, Modal, Textarea, Alert } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconMapPin, IconPackage, IconCheck, IconTruck, IconPhone, IconNavigation } from '@tabler/icons-react'
import { volunteerApi } from '../../api/volunteerApi'
import PageHeader from '../../components/common/PageHeader'

const AcceptedDeliveries = () => {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [updateLocation, setUpdateLocation] = useState('')

  useEffect(() => {
    fetchAcceptedDeliveries()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAcceptedDeliveries, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAcceptedDeliveries = async () => {
    try {
      const response = await volunteerApi.getAcceptedDeliveries()
      setDeliveries(response.data)
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch deliveries',
        color: 'red'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (deliveryId, newStatus) => {
    try {
      await volunteerApi.updateDeliveryStatus(deliveryId, newStatus)
      notifications.show({
        title: 'Updated',
        message: `Delivery marked as ${newStatus.replace('_', ' ')}`,
        color: 'green'
      })
      fetchAcceptedDeliveries()
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update status',
        color: 'red'
      })
    }
  }

  const updateLocationTracking = async () => {
    if (!updateLocation) return
    try {
      await volunteerApi.updateDeliveryStatus(selectedDelivery._id, 'location_update', { location: updateLocation })
      notifications.show({
        title: 'Location Updated',
        message: 'Donor can now see your location',
        color: 'green'
      })
      setLocationModalOpen(false)
      setUpdateLocation('')
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update location',
        color: 'red'
      })
    }
  }

  const getStepIndex = (status) => {
    switch(status) {
      case 'accepted': return 0
      case 'picked_up': return 1
      case 'delivered': return 2
      default: return 0
    }
  }

  if (loading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Loader size="xl" color="green" />
      </Center>
    )
  }

  if (deliveries.length === 0) {
    return (
      <Container size="xl">
        <PageHeader title="My Deliveries" subtitle="Track and manage your accepted deliveries" />
        <Card shadow="sm" p="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <IconTruck size={64} color="#9ca3af" />
            <Text ta="center" size="lg" fw={500}>No Active Deliveries</Text>
            <Text ta="center" c="dimmed">You don't have any accepted deliveries at the moment.</Text>
            <Button 
              variant="gradient" 
              gradient={{ from: '#22c55e', to: '#16a34a' }}
              onClick={() => window.location.href = '/volunteer/available'}
            >
              Find Donations
            </Button>
          </Stack>
        </Card>
      </Container>
    )
  }

  return (
    <Container size="xl">
      <PageHeader 
        title="My Deliveries" 
        subtitle={`You have ${deliveries.length} active delivery(ies)`}
      />

      <SimpleGrid cols={{ base: 1, lg: 1 }} spacing="lg">
        {deliveries.map((delivery) => (
          <Card key={delivery._id} shadow="sm" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Group>
                <IconPackage size={24} color="#22c55e" />
                <div>
                  <Text fw={700} size="lg">{delivery.foodName}</Text>
                  <Text size="sm" c="dimmed">Donor: {delivery.donorName}</Text>
                </div>
              </Group>
              <Badge size="lg" color={delivery.status === 'delivered' ? 'teal' : 'yellow'}>
                {delivery.status?.replace('_', ' ').toUpperCase()}
              </Badge>
            </Group>

            <Group gap="xs" mb="xl">
              <IconMapPin size={16} />
              <Text size="sm">{delivery.pickupLocation}</Text>
            </Group>

            <Stepper active={getStepIndex(delivery.status)} mb="xl">
              <Stepper.Step 
                label="Accepted" 
                description="Order confirmed"
                completedIcon={<IconCheck size={16} />}
              />
              <Stepper.Step 
                label="Picked Up" 
                description="Collected from donor"
                completedIcon={<IconTruck size={16} />}
              />
              <Stepper.Step 
                label="Delivered" 
                description="Reached receiver"
              />
            </Stepper>

            {delivery.status === 'accepted' && (
              <Alert color="blue" mb="md">
                <Group>
                  <IconPhone size={20} />
                  <Text size="sm">Donor contact: {delivery.donorPhone || 'Available in chat'}</Text>
                </Group>
              </Alert>
            )}

            <Group justify="flex-end" gap="sm">
              {delivery.status === 'accepted' && (
                <>
                  <Button 
                    variant="light" 
                    color="blue"
                    leftSection={<IconNavigation size={16} />}
                    onClick={() => {
                      setSelectedDelivery(delivery)
                      setLocationModalOpen(true)
                    }}
                  >
                    Share Location
                  </Button>
                  <Button 
                    variant="filled" 
                    color="blue"
                    onClick={() => updateStatus(delivery._id, 'picked_up')}
                  >
                    Mark as Picked Up
                  </Button>
                </>
              )}
              {delivery.status === 'picked_up' && (
                <Button 
                  variant="gradient" 
                  gradient={{ from: '#22c55e', to: '#16a34a' }}
                  onClick={() => updateStatus(delivery._id, 'delivered')}
                >
                  Mark as Delivered
                </Button>
              )}
              {delivery.status === 'delivered' && (
                <Badge size="lg" color="teal">✓ Completed - +{delivery.points || 10} points</Badge>
              )}
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {/* Share Location Modal */}
      <Modal 
        opened={locationModalOpen} 
        onClose={() => setLocationModalOpen(false)}
        title="Share Your Location"
        centered
      >
        <Text mb="md">Share your current location with the donor so they can track your progress.</Text>
        <Textarea
          label="Current Location / Status Update"
          placeholder="e.g., En route to pickup, 5 minutes away, etc."
          value={updateLocation}
          onChange={(e) => setUpdateLocation(e.target.value)}
          minRows={3}
          mb="md"
        />
        <Group justify="flex-end">
          <Button variant="light" onClick={() => setLocationModalOpen(false)}>Cancel</Button>
          <Button color="green" onClick={updateLocationTracking}>Share Location</Button>
        </Group>
      </Modal>
    </Container>
  )
}

export default AcceptedDeliveries