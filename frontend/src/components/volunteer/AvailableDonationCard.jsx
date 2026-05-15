import React from 'react'
import { Card, Text, Group, Badge, Button, Stack } from '@mantine/core'
import { IconMapPin, IconClock, IconPackage } from '@tabler/icons-react'

const AvailableDonationCard = ({ donation, onAccept }) => {
  const getUrgencyColor = (urgency) => urgency === 'high' ? 'red' : urgency === 'medium' ? 'yellow' : 'green'

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Badge color={getUrgencyColor(donation.urgency)} size="lg">{donation.urgency?.toUpperCase()} URGENCY</Badge>
        <Badge variant="light">{donation.distance}</Badge>
      </Group>
      <Text fw={700} size="lg">{donation.foodName}</Text>
      <Text size="sm" c="dimmed" mb="md">Donor: {donation.donorName}</Text>
      <Stack gap="xs" mb="md">
        <Group gap="xs"><IconPackage size={16} /><Text size="sm">{donation.quantity}</Text></Group>
        <Group gap="xs"><IconMapPin size={16} /><Text size="sm">{donation.location}</Text></Group>
        <Group gap="xs"><IconClock size={16} /><Text size="sm">Expires: {donation.expiryTime}</Text></Group>
      </Stack>
      <Button fullWidth variant="gradient" gradient={{ from: '#22c55e', to: '#16a34a' }} onClick={() => onAccept(donation)}>Accept Donation</Button>
    </Card>
  )
}

export default AvailableDonationCard