import React from 'react'
import { Card, Text, RingProgress, Group, Badge } from '@mantine/core'
import { IconAward } from '@tabler/icons-react'

const VolunteerRewardCard = ({ level, deliveries, nextLevel }) => {
  const progress = (deliveries / nextLevel) * 100

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Group justify="space-between">
        <div><Text size="xs" c="dimmed">Current Level</Text><Text size="2rem" fw={700}>{level}</Text></div>
        <RingProgress size={80} thickness={6} sections={[{ value: progress, color: 'green' }]} label={<Text ta="center" size="sm">{Math.round(progress)}%</Text>} />
      </Group>
      <Text size="sm">{deliveries} / {nextLevel} deliveries</Text>
      <Badge mt="md" size="lg" color="gold">+{deliveries * 10} Points</Badge>
    </Card>
  )
}

export default VolunteerRewardCard