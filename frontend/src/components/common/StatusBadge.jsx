import React from 'react'
import { Badge } from '@mantine/core'

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch(status) {
      case 'available':
        return { color: 'green', label: 'Available' }
      case 'accepted':
        return { color: 'yellow', label: 'Accepted' }
      case 'picked_up':
        return { color: 'blue', label: 'Picked Up' }
      case 'delivered':
        return { color: 'teal', label: 'Delivered' }
      case 'pending':
        return { color: 'orange', label: 'Pending' }
      default:
        return { color: 'gray', label: status }
    }
  }

  const config = getStatusConfig()
  return <Badge color={config.color} size="md">{config.label}</Badge>
}

export default StatusBadge