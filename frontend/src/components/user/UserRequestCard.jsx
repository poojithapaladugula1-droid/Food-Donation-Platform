import React from 'react'
import { Card, Text, Group, Badge } from '@mantine/core'
import { IconPackage } from '@tabler/icons-react'

const UserRequestCard = ({ request }) => {
  return (
    <Card shadow="sm" p="md" radius="md" withBorder className="request-card">
      <Group justify="space-between">
        <Group><IconPackage size={20} color="#22c55e" /><div><Text fw={500}>{request.food}</Text><Text size="xs" c="dimmed">{request.date}</Text></div></Group>
        <Badge color={request.status === 'delivered' ? 'green' : request.status === 'accepted' ? 'blue' : 'yellow'}>{request.status}</Badge>
      </Group>
    </Card>
  )
}

export default UserRequestCard