import React, { useState } from 'react'
import { Container, Card, TextInput, Button, Stack, Group, Avatar, Text, Badge, Tabs, SimpleGrid, PasswordInput, Select } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconMail, IconPhone, IconMapPin, IconCar, IconClock, IconAward, IconLock } from '@tabler/icons-react'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/authApi'
import PageHeader from '../../components/common/PageHeader'
import Loader from '../../components/common/Loader'

const VolunteerProfile = () => {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      vehicleType: user?.vehicleType || '',
      availability: user?.availability || '',
    },
  })

  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      newPassword: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) => (value !== values.newPassword ? 'Passwords do not match' : null),
    },
  })

  const handleSave = async (values) => {
    setLoading(true)
    const result = await updateProfile(values)
    setLoading(false)
    if (result.success) {
      setIsEditing(false)
    }
  }

  const handleChangePassword = async (values) => {
    setLoading(true)
    try {
      await authApi.changePassword(values)
      notifications.show({
        title: 'Password Changed',
        message: 'Your password has been updated',
        color: 'green',
      })
      passwordForm.reset()
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to change password',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <Loader />

  const stats = [
    { label: 'Completed Deliveries', value: user.stats?.completedDeliveries || 0 },
    { label: 'Rating', value: `${user.stats?.rating || 4.8} ★` },
    { label: 'Total Points', value: user.stats?.totalPoints || 0 },
    { label: 'Badges Earned', value: user.stats?.badgesCount || 3 },
  ]

  return (
    <Container size="lg">
      <PageHeader title="Volunteer Profile" subtitle="Manage your volunteer account" />

      <Card shadow="sm" p="lg" radius="md" withBorder mb="xl">
        <Group justify="space-between" align="flex-start">
          <Group>
            <Avatar size={100} radius="xl" color="blue">
              {user.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <div>
              <Text size="xl" fw={700}>{user.name}</Text>
              <Badge size="lg" color="blue" mt="xs">Volunteer</Badge>
              <Text size="sm" c="dimmed" mt="xs">Member since {new Date(user.createdAt).toLocaleDateString()}</Text>
            </div>
          </Group>
          <Button variant="light" color="blue" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Group>
      </Card>

      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg" mb="xl">
        {stats.map((stat, index) => (
          <Card key={index} shadow="sm" p="md" radius="md" withBorder style={{ textAlign: 'center' }}>
            <Text fw={700} size="xl">{stat.value}</Text>
            <Text size="xs" c="dimmed">{stat.label}</Text>
          </Card>
        ))}
      </SimpleGrid>

      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Tabs defaultValue="personal">
          <Tabs.List>
            <Tabs.Tab value="personal">Personal Info</Tabs.Tab>
            <Tabs.Tab value="availability">Availability</Tabs.Tab>
            <Tabs.Tab value="security">Security</Tabs.Tab>
            <Tabs.Tab value="badges">Badges & Awards</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="personal" pt="md">
            <form onSubmit={form.onSubmit(handleSave)}>
              <Stack gap="md">
                <TextInput label="Full Name" readOnly={!isEditing} {...form.getInputProps('name')} />
                <TextInput label="Email" readOnly {...form.getInputProps('email')} />
                <TextInput label="Phone Number" readOnly={!isEditing} {...form.getInputProps('phone')} />
                <TextInput label="Address" readOnly={!isEditing} {...form.getInputProps('address')} />
                {isEditing && (
                  <Group justify="flex-end">
                    <Button type="submit" variant="gradient" loading={loading}>Save Changes</Button>
                  </Group>
                )}
              </Stack>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="availability" pt="md">
            <Stack gap="md">
              <Select
                label="Vehicle Type"
                placeholder="Select your vehicle type"
                data={['Car', 'Motorcycle', 'Bicycle', 'Scooter', 'Van/Truck']}
                readOnly={!isEditing}
                {...form.getInputProps('vehicleType')}
              />
              <Select
                label="Availability"
                placeholder="When can you deliver?"
                data={['Weekdays Only', 'Weekends Only', 'Evenings', 'Full Time', 'Flexible']}
                readOnly={!isEditing}
                {...form.getInputProps('availability')}
              />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="security" pt="md">
            <form onSubmit={passwordForm.onSubmit(handleChangePassword)}>
              <Stack gap="md">
                <PasswordInput label="Current Password" {...passwordForm.getInputProps('currentPassword')} />
                <PasswordInput label="New Password" {...passwordForm.getInputProps('newPassword')} />
                <PasswordInput label="Confirm Password" {...passwordForm.getInputProps('confirmPassword')} />
                <Group justify="flex-end">
                  <Button type="submit" variant="gradient" loading={loading}>Change Password</Button>
                </Group>
              </Stack>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="badges" pt="md">
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
              {['First Delivery', '5 Deliveries', '10 Deliveries', '25 Deliveries', '50 Deliveries', '100 Hours', 'Top Rated', 'Community Hero'].map((badge, i) => (
                <Card key={i} p="sm" radius="md" withBorder style={{ textAlign: 'center', opacity: i < (user.stats?.badgesCount || 3) ? 1 : 0.5 }}>
                  <IconAward size={32} color={i < (user.stats?.badgesCount || 3) ? '#ffd700' : '#9ca3af'} />
                  <Text size="xs" mt="xs">{badge}</Text>
                  {i < (user.stats?.badgesCount || 3) && <Badge size="xs" color="green" mt="xs">Earned</Badge>}
                </Card>
              ))}
            </SimpleGrid>
          </Tabs.Panel>
        </Tabs>
      </Card>
    </Container>
  )
}

export default VolunteerProfile