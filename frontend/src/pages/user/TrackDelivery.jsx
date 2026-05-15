import React, { useState, useEffect } from 'react'
import { Container, Card, Text, Group, Stepper, Badge, Timeline, Stack, Alert, Loader, Center, Button } from '@mantine/core'
import { IconMapPin, IconTruck, IconCheck, IconPackage, IconPhone, IconRefresh } from '@tabler/icons-react'
import { requestApi } from '../../api/requestApi'
import PageHeader from '../../components/common/PageHeader'

const TrackDelivery = () => {
  const [loading, setLoading] = useState(true)
  const [delivery, setDelivery] = useState(null)
  const [error, setError] = useState(null)

  const fetchActiveDelivery = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await requestApi.getActiveRequest()
      setDelivery(response.data)
    } catch (error) {
      if (error.response?.status === 404) {
        setDelivery(null)
      } else {
        setError('Failed to fetch delivery status')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActiveDelivery()
    // Refresh every 30 seconds
    const interval = setInterval(fetchActiveDelivery, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStepIndex = (status) => {
    switch(status) {
      case 'pending': return 0
      case 'accepted': return 1
      case 'picked_up': return 2
      case 'delivered': return 3
      default: return 0
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'green'
      case 'picked_up': return 'blue'
      case 'accepted': return 'yellow'
      default: return 'gray'
    }
  }

  if (loading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Loader size="xl" color="green" />
      </Center>
    )
  }

  if (!delivery) {
    return (
      <Container size="md">
        <PageHeader title="Track Your Delivery" />
        <Card shadow="sm" p="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <IconPackage size={64} color="#9ca3af" />
            <Text ta="center" size="lg" fw={500}>No Active Delivery</Text>
            <Text ta="center" c="dimmed">You don't have any active food requests at the moment.</Text>
            <Button 
              variant="gradient" 
              gradient={{ from: '#22c55e', to: '#16a34a' }}
              onClick={() => window.location.href = '/user/request-food'}
            >
              Request Food Now
            </Button>
          </Stack>
        </Card>
      </Container>
    )
  }

  return (
    <Container size="md">
      <PageHeader 
        title="Track Your Delivery" 
        actionButton={
          <Button 
            variant="light" 
            size="sm" 
            leftSection={<IconRefresh size={16} />}
            onClick={fetchActiveDelivery}
          >
            Refresh
          </Button>
        }
      />
      
      <Card shadow="sm" p="lg" radius="md" withBorder mb="lg">
        <Group justify="space-between" mb="md">
          <Group>
            <IconPackage size={24} color="#22c55e" />
            <div>
              <Text fw={700} size="lg">{delivery.foodType?.replace('_', ' ').toUpperCase()}</Text>
              <Text size="sm" c="dimmed">For {delivery.quantity} {delivery.unit}</Text>
            </div>
          </Group>
          <Badge size="lg" color={getStatusColor(delivery.status)}>
            {delivery.status?.toUpperCase()}
          </Badge>
        </Group>

        <Text size="sm" mb="md">📍 Delivery Address: {delivery.address}</Text>

        <Stepper active={getStepIndex(delivery.status)} mb="xl">
          <Stepper.Step label="Request Placed" description="We received your request" />
          <Stepper.Step label="Accepted" description="Volunteer assigned" />
          <Stepper.Step label="Picked Up" description="Food collected" />
          <Stepper.Step label="Delivered" description="Food delivered" />
        </Stepper>

        {delivery.volunteer && (
          <Alert color="blue" mb="lg">
            <Group>
              <IconTruck size={20} />
              <div>
                <Text fw={500}>Your Volunteer: {delivery.volunteer.name}</Text>
                <Group gap="xs">
                  <IconPhone size={14} />
                  <Text size="sm">{delivery.volunteer.phone}</Text>
                </Group>
                <Text size="sm" c="dimmed">Status: {delivery.volunteer.status || 'On the way'}</Text>
              </div>
            </Group>
          </Alert>
        )}

        <Card withBorder p="md" radius="md">
          <Text fw={600} mb="md">Delivery Timeline</Text>
          <Timeline active={getStepIndex(delivery.status)} bulletSize={24} lineWidth={2}>
            <Timeline.Item title="Request Submitted">
              <Text c="dimmed" size="sm">{new Date(delivery.createdAt).toLocaleString()}</Text>
            </Timeline.Item>
            {delivery.acceptedAt && (
              <Timeline.Item title="Accepted by Volunteer">
                <Text c="dimmed" size="sm">{new Date(delivery.acceptedAt).toLocaleString()}</Text>
              </Timeline.Item>
            )}
            {delivery.pickedUpAt && (
              <Timeline.Item title="Food Picked Up">
                <Text c="dimmed" size="sm">{new Date(delivery.pickedUpAt).toLocaleString()}</Text>
              </Timeline.Item>
            )}
            {delivery.deliveredAt && (
              <Timeline.Item title="Delivered">
                <Text c="dimmed" size="sm">{new Date(delivery.deliveredAt).toLocaleString()}</Text>
              </Timeline.Item>
            )}
          </Timeline>
        </Card>

        {delivery.status !== 'delivered' && delivery.volunteer?.phone && (
          <Alert color="green" mt="lg">
            <Group>
              <IconPhone size={20} />
              <Text>Need to contact your volunteer? Call them at: {delivery.volunteer.phone}</Text>
            </Group>
          </Alert>
        )}
      </Card>
    </Container>
  )
}

export default TrackDelivery