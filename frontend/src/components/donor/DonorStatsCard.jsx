import React from 'react'
import { Card, Text, Group } from '@mantine/core'

const DonorStatsCard = ({ icon: Icon, label, value, color }) => {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Group justify="space-between">
        <div><Text size="xs" c="dimmed">{label}</Text><Text size="2rem" fw={700}>{value}</Text></div>
        <Icon size={40} color={`var(--mantine-color-${color}-6)`} stroke={1.5} />
      </Group>
    </Card>
  )
}

export default DonorStatsCard