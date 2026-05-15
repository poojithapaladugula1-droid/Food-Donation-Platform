import React, { useState, useEffect } from 'react'
import { Container, Card, Table, Badge, Group, Text, SimpleGrid, RingProgress, Progress, Loader, Center, Select, Button, Avatar, Modal, Stack } from '@mantine/core'
import { IconTrophy, IconAward, IconStar, IconTruck, IconClock, IconRefresh, IconEye } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { adminApi } from '../../api/adminApi'
import PageHeader from '../../components/common/PageHeader'

const VolunteerMonitoring = () => {
  const [loading, setLoading] = useState(true)
  const [volunteers, setVolunteers] = useState([])
  const [filteredVolunteers, setFilteredVolunteers] = useState([])
  const [sortBy, setSortBy] = useState('deliveries')
  const [selectedVolunteer, setSelectedVolunteer] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  useEffect(() => {
    fetchVolunteers()
  }, [])

  useEffect(() => {
    sortVolunteers()
  }, [sortBy, volunteers])

  const fetchVolunteers = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getVolunteerStats()
      setVolunteers(response.data)
      setFilteredVolunteers(response.data)
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch volunteer data',
        color: 'red'
      })
    } finally {
      setLoading(false)
    }
  }

  const sortVolunteers = () => {
    const sorted = [...volunteers]
    if (sortBy === 'deliveries') {
      sorted.sort((a, b) => b.deliveries - a.deliveries)
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'points') {
      sorted.sort((a, b) => b.points - a.points)
    }
    setFilteredVolunteers(sorted)
  }

  const getLevelInfo = (points) => {
    if (points >= 2000) return { name: 'Platinum', color: '#e5e4e2' }
    if (points >= 1000) return { name: 'Gold', color: '#ffd700' }
    if (points >= 500) return { name: 'Silver', color: '#c0c0c0' }
    return { name: 'Bronze', color: '#cd7f32' }
  }

  const getProgressToNextLevel = (points) => {
    if (points >= 2000) return 100
    if (points >= 1000) return ((points - 1000) / 1000) * 100
    if (points >= 500) return ((points - 500) / 500) * 100
    return (points / 500) * 100
  }

  const topVolunteers = filteredVolunteers.slice(0, 3)

  if (loading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Loader size="xl" color="green" />
      </Center>
    )
  }

  return (
    <Container size="xl">
      <PageHeader 
        title="Volunteer Monitoring" 
        subtitle="Track volunteer performance and impact"
        actionButton={
          <Button 
            variant="light" 
            color="green" 
            leftSection={<IconRefresh size={16} />}
            onClick={fetchVolunteers}
          >
            Refresh
          </Button>
        }
      />

      {/* Top 3 Volunteers */}
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb="xl">
        {topVolunteers.map((volunteer, index) => {
          const level = getLevelInfo(volunteer.points)
          return (
            <Card key={volunteer._id} shadow="sm" p="lg" radius="md" withBorder>
              <Group justify="space-between" align="flex-start">
                <Group>
                  <Avatar size={50} radius="xl" color="blue">
                    {volunteer.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <div>
                    <Text fw={700} size="lg">{volunteer.name}</Text>
                    <Badge size="md" color={index === 0 ? 'yellow' : index === 1 ? 'gray' : 'orange'}>
                      #{index + 1} {index === 0 ? '🏆 Top Volunteer' : index === 1 ? '🥈 Runner Up' : '🥉 Third Place'}
                    </Badge>
                  </div>
                </Group>
                <RingProgress
                  size={70}
                  thickness={5}
                  sections={[{ value: getProgressToNextLevel(volunteer.points), color: 'green' }]}
                  label={<Text ta="center" size="xs" fw={700}>{Math.round(getProgressToNextLevel(volunteer.points))}%</Text>}
                />
              </Group>
              <SimpleGrid cols={3} mt="md">
                <div style={{ textAlign: 'center' }}>
                  <Text fw={700} size="xl">{volunteer.deliveries}</Text>
                  <Text size="xs" c="dimmed">Deliveries</Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Text fw={700} size="xl">{volunteer.rating}★</Text>
                  <Text size="xs" c="dimmed">Rating</Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Text fw={700} size="xl">{volunteer.points}</Text>
                  <Text size="xs" c="dimmed">Points</Text>
                </div>
              </SimpleGrid>
              <Progress value={getProgressToNextLevel(volunteer.points)} color="green" size="sm" mt="md" />
              <Text size="xs" c="dimmed" mt={4}>
                Level: {level.name} • {volunteer.hours || 0} hours served
              </Text>
            </Card>
          )
        })}
      </SimpleGrid>

      {/* Filters and Sort */}
      <Card shadow="sm" p="lg" radius="md" withBorder mb="lg">
        <Group justify="space-between">
          <Group>
            <Text fw={500}>Sort by:</Text>
            <Select
              value={sortBy}
              onChange={setSortBy}
              data={[
                { value: 'deliveries', label: 'Most Deliveries' },
                { value: 'rating', label: 'Highest Rated' },
                { value: 'points', label: 'Most Points' },
              ]}
              style={{ width: 180 }}
            />
          </Group>
          <Text size="sm" c="dimmed">Total Volunteers: {volunteers.length}</Text>
        </Group>
      </Card>

      {/* All Volunteers Table */}
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Volunteer</Table.Th>
              <Table.Th>Deliveries</Table.Th>
              <Table.Th>Rating</Table.Th>
              <Table.Th>Points</Table.Th>
              <Table.Th>Level</Table.Th>
              <Table.Th>Hours</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredVolunteers.map((volunteer) => {
              const level = getLevelInfo(volunteer.points)
              return (
                <Table.Tr key={volunteer._id}>
                  <Table.Td>
                    <Group gap="xs">
                      <Avatar size="sm" radius="xl" color="blue">
                        {volunteer.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Text fw={500}>{volunteer.name}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>{volunteer.deliveries}</Table.Td>
                  <Table.Td>{volunteer.rating} ★</Table.Td>
                  <Table.Td>{volunteer.points}</Table.Td>
                  <Table.Td>
                    <Badge color={level.name === 'Gold' ? 'yellow' : level.name === 'Silver' ? 'gray' : 'orange'}>
                      {level.name}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{volunteer.hours || 0}</Table.Td>
                  <Table.Td>
                    <ActionIcon 
                      variant="subtle" 
                      color="blue"
                      onClick={() => {
                        setSelectedVolunteer(volunteer)
                        setDetailsModalOpen(true)
                      }}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Volunteer Details Modal */}
      <Modal 
        opened={detailsModalOpen} 
        onClose={() => setDetailsModalOpen(false)}
        title="Volunteer Details"
        size="lg"
        centered
      >
        {selectedVolunteer && (
          <Stack gap="md">
            <Group>
              <Avatar size={80} radius="xl" color="blue">
                {selectedVolunteer.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div>
                <Text fw={700} size="xl">{selectedVolunteer.name}</Text>
                <Text size="sm" c="dimmed">{selectedVolunteer.email}</Text>
              </div>
            </Group>

            <SimpleGrid cols={3} spacing="md">
              <Card withBorder p="md">
                <Text ta="center" fw={700} size="xl">{selectedVolunteer.deliveries}</Text>
                <Text ta="center" size="xs" c="dimmed">Total Deliveries</Text>
              </Card>
              <Card withBorder p="md">
                <Text ta="center" fw={700} size="xl">{selectedVolunteer.rating}★</Text>
                <Text ta="center" size="xs" c="dimmed">Rating</Text>
              </Card>
              <Card withBorder p="md">
                <Text ta="center" fw={700} size="xl">{selectedVolunteer.points}</Text>
                <Text ta="center" size="xs" c="dimmed">Points</Text>
              </Card>
            </SimpleGrid>
          </Stack>
        )}
      </Modal>
    </Container>
  )
}

export default VolunteerMonitoring