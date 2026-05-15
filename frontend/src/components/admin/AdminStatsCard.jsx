import React from 'react'
import { Card, Text, Group } from '@mantine/core'

const AdminStatsCard = ({ icon: Icon, label, value, color }) => {
  return (
    <Card shadow="sm" p="md" radius="md" withBorder className="admin-stat-card">
      <Group justify="space-between">
        <div><Text size="xs" c="dimmed">{label}</Text><Text className="stat-value">{value}</Text></div>
        <Icon size={32} color={`var(--mantine-color-${color}-6)`} />
      </Group>
    </Card>
  )
}

export default AdminStatsCard