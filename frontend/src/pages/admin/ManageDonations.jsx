import React, { useState, useEffect } from 'react'
import { Container, Card, Table, Badge, ActionIcon, TextInput, Group, Modal, Button, Select, Loader, Center, Alert, Pagination, Text, Stack, SimpleGrid } from '@mantine/core'
import { IconSearch, IconTrash, IconEye, IconRefresh } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { adminApi } from '../../api/adminApi'
import PageHeader from '../../components/common/PageHeader'

const ManageDonations = () => {
  const [loading, setLoading] = useState(true)
  const [donations, setDonations] = useState([])
  const [filteredDonations, setFilteredDonations] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchDonations()
  }, [])

  useEffect(() => {
    filterDonations()
  }, [search, statusFilter, donations])

  const fetchDonations = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getAllDonations()
      setDonations(response.data)
      setFilteredDonations(response.data)
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch donations',
        color: 'red'
      })
    } finally {
      setLoading(false)
    }
  }

  const filterDonations = () => {
    let filtered = [...donations]
    if (search) {
      filtered = filtered.filter(d => 
        d.foodName?.toLowerCase().includes(search.toLowerCase()) ||
        d.donorName?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter)
    }
    setFilteredDonations(filtered)
    setCurrentPage(1)
  }

  const handleDelete = async () => {
    try {
      await adminApi.deleteDonation(selectedDonation._id)
      setDonations(donations.filter(d => d._id !== selectedDonation._id))
      notifications.show({ title: 'Deleted', message: 'Donation removed', color: 'green' })
      setDeleteModalOpen(false)
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to delete', color: 'red' })
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'green'
      case 'accepted': return 'yellow'
      case 'picked_up': return 'blue'
      case 'delivered': return 'teal'
      default: return 'gray'
    }
  }

  const paginatedDonations = filteredDonations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return <Center style={{ height: '60vh' }}><Loader size="xl" color="green" /></Center>
  }

  return (
    <Container size="xl">
      <PageHeader 
        title="Manage Donations" 
        actionButton={<Button variant="light" leftSection={<IconRefresh size={16} />} onClick={fetchDonations}>Refresh</Button>}
      />
      
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Group grow mb="md">
          <TextInput placeholder="Search..." leftSection={<IconSearch size={16} />} value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select placeholder="Filter by status" value={statusFilter} onChange={setStatusFilter} data={[
            { value: 'all', label: 'All' },
            { value: 'available', label: 'Available' },
            { value: 'accepted', label: 'Accepted' },
            { value: 'delivered', label: 'Delivered' },
          ]} />
        </Group>

        {filteredDonations.length === 0 ? (
          <Alert color="blue">No donations found</Alert>
        ) : (
          <>
            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Food</Table.Th><Table.Th>Donor</Table.Th><Table.Th>Quantity</Table.Th><Table.Th>Status</Table.Th><Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedDonations.map((donation) => (
                  <Table.Tr key={donation._id}>
                    <Table.Td fw={500}>{donation.foodName}</Table.Td>
                    <Table.Td>{donation.donorName || 'Anonymous'}</Table.Td>
                    <Table.Td>{donation.quantity} {donation.unit}</Table.Td>
                    <Table.Td><Badge color={getStatusColor(donation.status)}>{donation.status}</Badge></Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon color="blue" onClick={() => { setSelectedDonation(donation); setViewModalOpen(true) }}><IconEye size={16} /></ActionIcon>
                        <ActionIcon color="red" onClick={() => { setSelectedDonation(donation); setDeleteModalOpen(true) }}><IconTrash size={16} /></ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            {filteredDonations.length > itemsPerPage && (
              <Group justify="center" mt="xl">
                <Pagination total={Math.ceil(filteredDonations.length / itemsPerPage)} value={currentPage} onChange={setCurrentPage} color="green" />
              </Group>
            )}
          </>
        )}
      </Card>

      <Modal opened={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Donation Details" centered>
        {selectedDonation && (
          <Stack>
            <Text fw={700}>{selectedDonation.foodName}</Text>
            <Text>Quantity: {selectedDonation.quantity} {selectedDonation.unit}</Text>
            <Text>Location: {selectedDonation.pickupLocation}</Text>
            <Text>Status: <Badge color={getStatusColor(selectedDonation.status)}>{selectedDonation.status}</Badge></Text>
          </Stack>
        )}
      </Modal>

      <Modal opened={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Donation" centered>
        <Text>Delete {selectedDonation?.foodName}?</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button color="red" onClick={handleDelete}>Delete</Button>
        </Group>
      </Modal>
    </Container>
  )
}

export default ManageDonations