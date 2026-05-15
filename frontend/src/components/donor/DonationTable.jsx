import React from 'react'
import { Table, Badge, ActionIcon, Group } from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'

const DonationTable = ({ donations, onEdit, onDelete }) => {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Food Item</Table.Th><Table.Th>Quantity</Table.Th><Table.Th>Location</Table.Th><Table.Th>Status</Table.Th><Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {donations.map((donation) => (
          <Table.Tr key={donation.id}>
            <Table.Td fw={500}>{donation.foodName}</Table.Td>
            <Table.Td>{donation.quantity}</Table.Td>
            <Table.Td>{donation.location}</Table.Td>
            <Table.Td><Badge color="green">{donation.status}</Badge></Table.Td>
            <Table.Td><Group gap="xs"><ActionIcon color="blue" onClick={() => onEdit(donation)}><IconEdit size={16} /></ActionIcon><ActionIcon color="red" onClick={() => onDelete(donation)}><IconTrash size={16} /></ActionIcon></Group></Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

export default DonationTable