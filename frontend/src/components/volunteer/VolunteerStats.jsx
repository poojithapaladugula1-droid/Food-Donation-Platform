import React from 'react'
import { SimpleGrid, Card, Text, Group } from '@mantine/core'

const VolunteerStats = ({ stats }) => {
  const items = [
    { label: 'Available', value: stats.available, color: 'green' },
    { label: 'In Progress', value: stats.inProgress, color: 'yellow' },
    { label: 'Completed', value: stats.completed, color: 'blue' },
    { label: 'Rating', value: `${stats.rating}★`, color: 'orange' },
  ]

  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
      {items.map((item, i) => (
        <Card key={i} shadow="sm" p="md" radius="md" withBorder>
          <Group justify="space-between">
            <div><Text size="xs" c="dimmed">{item.label}</Text><Text size="2rem" fw={700}>{item.value}</Text></div>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  )
}

export default VolunteerStats