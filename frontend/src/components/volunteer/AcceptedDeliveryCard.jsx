import React from 'react'
import { Card, Text, Group, Badge, Button, Stepper } from '@mantine/core'

const AcceptedDeliveryCard = ({ delivery, onStatusUpdate }) => {
  const steps = ['accepted', 'picked_up', 'delivered']
  const currentStep = steps.indexOf(delivery.status)

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Text fw={700} size="lg">{delivery.foodName}</Text>
        <Badge color={delivery.status === 'delivered' ? 'green' : 'yellow'} size="lg">{delivery.status}</Badge>
      </Group>
      <Text size="sm" c="dimmed" mb="md">Donor: {delivery.donorName}</Text>
      <Text size="sm" mb="lg">Location: {delivery.location}</Text>
      <Stepper active={currentStep} size="sm" mb="lg">
        <Stepper.Step label="Accepted" /><Stepper.Step label="Picked Up" /><Stepper.Step label="Delivered" />
      </Stepper>
      {delivery.status === 'accepted' && <Button color="blue" fullWidth onClick={() => onStatusUpdate(delivery.id, 'picked_up')}>Mark as Picked Up</Button>}
      {delivery.status === 'picked_up' && <Button color="green" fullWidth onClick={() => onStatusUpdate(delivery.id, 'delivered')}>Mark as Delivered</Button>}
      {delivery.status === 'delivered' && <Badge color="teal" size="lg" fullWidth>Completed ✓</Badge>}
    </Card>
  )
}

export default AcceptedDeliveryCard