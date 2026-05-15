import React from 'react'
import { Card, Text, Group, Badge, Timeline, Alert } from '@mantine/core'
import { IconTruck, IconPhone } from '@tabler/icons-react'

const DeliveryTrackingCard = ({ delivery }) => {
  const timeline = [
    { status: 'Request Placed', time: delivery.requestTime, completed: true },
    { status: 'Accepted by Volunteer', time: delivery.acceptTime, completed: delivery.status !== 'pending' },
    { status: 'Picked Up', time: delivery.pickupTime, completed: delivery.status === 'picked_up' || delivery.status === 'delivered' },
    { status: 'Delivered', time: delivery.deliveryTime, completed: delivery.status === 'delivered' },
  ]

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Text fw={700} size="lg">{delivery.foodName}</Text>
        <Badge size="lg" color={delivery.status === 'delivered' ? 'green' : 'yellow'}>{delivery.status}</Badge>
      </Group>
      <Timeline active={timeline.filter(t => t.completed).length} bulletSize={20}>
        {timeline.map((item, i) => (<Timeline.Item key={i} title={item.status}><Text size="sm">{item.time || 'Pending'}</Text></Timeline.Item>))}
      </Timeline>
      {delivery.volunteer && (<Alert color="blue" mt="lg"><Group><IconTruck size={20} /><div><Text fw={500}>{delivery.volunteer.name}</Text><Group gap="xs"><IconPhone size={14} /><Text size="sm">{delivery.volunteer.phone}</Text></Group></div></Group></Alert>)}
    </Card>
  )
}

export default DeliveryTrackingCard