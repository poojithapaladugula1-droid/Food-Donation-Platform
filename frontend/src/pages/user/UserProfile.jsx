import React, { useState } from 'react'
import { Container, Card, TextInput, Button, Stack, Group, Avatar, Text, Badge, Tabs, SimpleGrid, PasswordInput, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconMail, IconPhone, IconMapPin, IconUsers, IconHeart, IconLock } from '@tabler/icons-react'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/authApi'
import PageHeader from '../../components/common/PageHeader'
import Loader from '../../components/common/Loader'

const UserProfile = () => {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      familySize: user?.familySize || '',
      dietaryRestrictions: user?.dietaryRestrictions || '',
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
    { label: 'Requests Made', value: user.stats?.totalRequests || 0 },
    { label: 'Meals Received', value: user.stats?.mealsReceived || 0 },
    { label: 'Active Request', value: user.stats?.activeRequest ? 'Yes' : 'No' },
  ]

  return (
    <Container size="lg">
      <PageHeader title="My Profile" subtitle="Manage your account and preferences" />

      <Card shadow="sm" p="lg" radius="md" withBorder mb="xl">
        <Group justify="space-between" align="flex-start">
          <Group>
            <Avatar size={100} radius="xl" color="orange">
              {user.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <div>
              <Text size="xl" fw={700}>{user.name}</Text>
              <Badge size="lg" color="orange" mt="xs">Food Receiver</Badge>
              <Text size="sm" c="dimmed" mt="xs">Member since {new Date(user.createdAt).toLocaleDateString()}</Text>
            </div>
          </Group>
          <Button variant="light" color="orange" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Group>
      </Card>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
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
            <Tabs.Tab value="preferences">Preferences</Tabs.Tab>
            <Tabs.Tab value="security">Security</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="personal" pt="md">
            <form onSubmit={form.onSubmit(handleSave)}>
              <Stack gap="md">
                <TextInput label="Full Name" readOnly={!isEditing} {...form.getInputProps('name')} />
                <TextInput label="Email" readOnly {...form.getInputProps('email')} />
                <TextInput label="Phone Number" readOnly={!isEditing} {...form.getInputProps('phone')} />
                <TextInput label="Delivery Address" readOnly={!isEditing} {...form.getInputProps('address')} />
                {isEditing && (
                  <Group justify="flex-end">
                    <Button type="submit" variant="gradient" loading={loading}>Save Changes</Button>
                  </Group>
                )}
              </Stack>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="preferences" pt="md">
            <Stack gap="md">
              <TextInput
                label="Family Size"
                placeholder="Number of people in household"
                readOnly={!isEditing}
                {...form.getInputProps('familySize')}
              />
              <Textarea
                label="Dietary Restrictions"
                placeholder="Any allergies or dietary restrictions"
                readOnly={!isEditing}
                minRows={3}
                {...form.getInputProps('dietaryRestrictions')}
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
        </Tabs>
      </Card>
    </Container>
  )
}

export default UserProfile