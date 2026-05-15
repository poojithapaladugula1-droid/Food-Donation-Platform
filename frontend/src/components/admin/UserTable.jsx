import React from 'react'
import { Table, Badge, ActionIcon, Group } from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'

const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <Table striped highlightOnHover>
      <Table.Thead><Table.Tr><Table.Th>Name</Table.Th><Table.Th>Email</Table.Th><Table.Th>Role</Table.Th><Table.Th>Status</Table.Th><Table.Th>Actions</Table.Th></Table.Tr></Table.Thead>
      <Table.Tbody>
        {users.map((user) => (
          <Table.Tr key={user.id}>
            <Table.Td fw={500}>{user.name}</Table.Td><Table.Td>{user.email}</Table.Td>
            <Table.Td><Badge color={user.role === 'volunteer' ? 'blue' : user.role === 'donor' ? 'green' : 'orange'}>{user.role}</Badge></Table.Td>
            <Table.Td><Badge color={user.status === 'active' ? 'green' : 'red'}>{user.status}</Badge></Table.Td>
            <Table.Td><Group gap="xs"><ActionIcon color="blue" onClick={() => onEdit(user)}><IconEdit size={16} /></ActionIcon><ActionIcon color="red" onClick={() => onDelete(user)}><IconTrash size={16} /></ActionIcon></Group></Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

export default UserTable