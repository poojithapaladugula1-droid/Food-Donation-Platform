import React, { useState } from 'react'
import { Container, Card, TextInput, Button, Stack, Group, Avatar, Text, Badge, Tabs, PasswordInput, Alert } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconMail, IconPhone, IconShield, IconActivity, IconSettings, IconLock } from '@tabler/icons-react'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/authApi'
import PageHeader from '../../components/common/PageHeader'
import Loader from '../../components/common/Loader'

const AdminProfile = () => {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || 'Platform Operations',
    },
  })

  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      newPassword: (value) => (value.length < 8 ? 'Password must be at least 8 characters' : null),
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

  return (
    <Container size="lg">
      <PageHeader title="Admin Profile" subtitle="Manage your administrator account" />

      <Card shadow="sm" p="lg" radius="md" withBorder mb="xl">
        <Group justify="space-between" align="flex-start">
          <Group>
            <Avatar size={100} radius="xl" color="red">
              {user.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <div>
              <Text size="xl" fw={700}>{user.name}</Text>
              <Badge size="lg" color="red" mt="xs">Administrator</Badge>
              <Text size="sm" c="dimmed" mt="xs">Super Admin • {user.department || 'Platform Operations'}</Text>
            </div>
          </Group>
          <Button variant="light" color="red" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Group>
      </Card>

      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Tabs defaultValue="personal">
          <Tabs.List>
            <Tabs.Tab value="personal">Personal Info</Tabs.Tab>
            <Tabs.Tab value="security">Security</Tabs.Tab>
            <Tabs.Tab value="activity">Activity Log</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="personal" pt="md">
            <form onSubmit={form.onSubmit(handleSave)}>
              <Stack gap="md">
                <TextInput label="Full Name" readOnly={!isEditing} {...form.getInputProps('name')} />
                <TextInput label="Email" readOnly {...form.getInputProps('email')} />
                <TextInput label="Phone Number" readOnly={!isEditing} {...form.getInputProps('phone')} />
                <TextInput label="Department" readOnly={!isEditing} {...form.getInputProps('department')} />
                {isEditing && (
                  <Group justify="flex-end">
                    <Button type="submit" variant="gradient" loading={loading}>Save Changes</Button>
                  </Group>
                )}
              </Stack>
            </form>
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
            <Alert color="blue" mt="md">
              <Text size="sm">⚠️ For security reasons, enable Two-Factor Authentication for your admin account.</Text>
            </Alert>
          </Tabs.Panel>

          <Tabs.Panel value="activity" pt="md">
            <Stack gap="md">
              {['Today 10:30 AM - Logged in', 'Yesterday 5:45 PM - Updated user roles', 'Jan 15, 2024 - Reviewed donations'].map((log, i) => (
                <Group key={i} justify="space-between">
                  <Text size="sm">{log}</Text>
                  <Badge color="green">Success</Badge>
                </Group>
              ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Card>
    </Container>
  )
}

export default AdminProfile