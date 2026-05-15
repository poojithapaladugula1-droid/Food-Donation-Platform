import React from 'react'
import { Card, Text, Group, Badge, Button, Stack } from '@mantine/core'
import { IconMapPin, IconClock, IconPackage } from '@tabler/icons-react'

const DonationCard = ({ donation, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'green'
      case 'accepted': return 'yellow'
      case 'picked_up': return 'blue'
      case 'delivered': return 'teal'
      default: return 'gray'
    }
  }

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder className="donation-card">
      <Group justify="space-between" mb="md">
        <Text fw={700} size="lg">{donation.foodName}</Text>
        <Badge color={getStatusColor(donation.status)} size="lg">{donation.status}</Badge>
      </Group>
      
      <Stack gap="xs" mb="md">
        <Group gap="xs"><IconPackage size={16} /><Text size="sm">{donation.quantity}</Text></Group>
        <Group gap="xs"><IconMapPin size={16} /><Text size="sm">{donation.location}</Text></Group>
        <Group gap="xs"><IconClock size={16} /><Text size="sm">Expires: {donation.expiryTime}</Text></Group>
      </Stack>
      
      {donation.status === 'available' && (
        <Group justify="flex-end">
          <Button variant="light" color="blue" size="sm" onClick={() => onEdit(donation)}>Edit</Button>
          <Button variant="light" color="red" size="sm" onClick={() => onDelete(donation)}>Delete</Button>
        </Group>
      )}
    </Card>
  )
}

export default DonationCard