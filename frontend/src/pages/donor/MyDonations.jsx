import React, { useState, useEffect } from 'react'
import { Container, Table, Badge, ActionIcon, Card, Text, Group, Button, Modal, Stack, Loader, Center, Alert, Pagination, Select } from '@mantine/core'
import { IconEdit, IconTrash, IconEye, IconRefresh, IconFilter } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { donationApi } from '../../api/donationApi'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'

const MyDonations = () => {
  const [donations, setDonations] = useState([])
  const [filteredDonations, setFilteredDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    fetchDonations()
  }, [])

  useEffect(() => {
    filterDonations()
  }, [statusFilter, donations])

  const fetchDonations = async () => {
    setLoading(true)
    try {
      const response = await donationApi.getMyDonations()
      setDonations(response.data)
      filterDonations(response.data)
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

  const filterDonations = (data = donations) => {
    if (statusFilter === 'all') {
      setFilteredDonations(data)
    } else {
      setFilteredDonations(data.filter(d => d.status === statusFilter))
    }
    setCurrentPage(1)
  }

  const handleDelete = async () => {
    try {
      await donationApi.delete(selectedDonation._id)
      setDonations(donations.filter(d => d._id !== selectedDonation._id))
      notifications.show({
        title: 'Deleted',
        message: 'Donation deleted successfully',
        color: 'green'
      })
      setDeleteModalOpen(false)
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete donation',
        color: 'red'
      })
    }
  }

  const handleEdit = (donation) => {
    notifications.show({
      title: 'Coming Soon',
      message: 'Edit feature will be available soon',
      color: 'blue'
    })
  }

  const paginatedDonations = filteredDonations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Loader size="xl" color="green" />
      </Center>
    )
  }

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'available': return 'green'
      case 'accepted': return 'yellow'
      case 'picked_up': return 'blue'
      case 'delivered': return 'teal'
      default: return 'gray'
    }
  }

  return (
    <Container size="xl">
      <PageHeader 
        title="My Donations" 
        subtitle="Manage all your food donations"
        actionButton={
          <Button 
            variant="light" 
            color="green" 
            leftSection={<IconRefresh size={16} />}
            onClick={fetchDonations}
          >
            Refresh
          </Button>
        }
      />

      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Group>
            <IconFilter size={18} />
            <Text size="sm" fw={500}>Filter by status:</Text>
            <Select
              placeholder="All"
              value={statusFilter}
              onChange={setStatusFilter}
              data={[
                { value: 'all', label: 'All Donations' },
                { value: 'available', label: 'Available' },
                { value: 'accepted', label: 'Accepted' },
                { value: 'picked_up', label: 'Picked Up' },
                { value: 'delivered', label: 'Delivered' },
              ]}
              style={{ width: 180 }}
            />
          </Group>
          <Text size="sm" c="dimmed">Total: {filteredDonations.length} donations</Text>
        </Group>

        {donations.length === 0 ? (
          <Alert color="blue" title="No donations yet">
            You haven't posted any donations yet. Click the "Add Donation" button to get started!
          </Alert>
        ) : filteredDonations.length === 0 ? (
          <Text ta="center" c="dimmed" py="xl">No donations found with the selected filter</Text>
        ) : (
          <>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Food Item</Table.Th>
                  <Table.Th>Quantity</Table.Th>
                  <Table.Th>Location</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Posted Date</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedDonations.map((donation) => (
                  <Table.Tr key={donation._id}>
                    <Table.Td fw={500}>{donation.foodName}</Table.Td>
                    <Table.Td>{donation.quantity} {donation.unit}</Table.Td>
                    <Table.Td>{donation.pickupLocation?.substring(0, 30)}...</Table.Td>
                    <Table.Td>
                      <Badge color={getStatusBadgeColor(donation.status)} size="md">
                        {donation.status?.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{new Date(donation.createdAt).toLocaleDateString()}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon 
                          variant="subtle" 
                          color="blue" 
                          onClick={() => handleEdit(donation)}
                          title="View/Edit"
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                        {donation.status === 'available' && (
                          <ActionIcon 
                            variant="subtle" 
                            color="red" 
                            onClick={() => {
                              setSelectedDonation(donation)
                              setDeleteModalOpen(true)
                            }}
                            title="Delete"
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            {filteredDonations.length > itemsPerPage && (
              <Group justify="center" mt="xl">
                <Pagination
                  total={Math.ceil(filteredDonations.length / itemsPerPage)}
                  value={currentPage}
                  onChange={setCurrentPage}
                  color="green"
                />
              </Group>
            )}
          </>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal 
        opened={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Donation"
        centered
      >
        <Text mb="md">Are you sure you want to delete this donation?</Text>
        <Card withBorder p="md" mb="lg" style={{ backgroundColor: '#fef2f2' }}>
          <Text fw={500}>{selectedDonation?.foodName}</Text>
          <Text size="sm" c="dimmed">Quantity: {selectedDonation?.quantity} {selectedDonation?.unit}</Text>
          <Text size="sm" c="dimmed">Location: {selectedDonation?.pickupLocation}</Text>
        </Card>
        <Text size="sm" c="red" mb="md">This action cannot be undone.</Text>
        <Group justify="flex-end">
          <Button variant="light" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button color="red" onClick={handleDelete}>Delete Permanently</Button>
        </Group>
      </Modal>
    </Container>
  )
}

export default MyDonations