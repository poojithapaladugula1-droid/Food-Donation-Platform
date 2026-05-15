import React, { useState } from 'react'
import { Container, Card, TextInput, Button, Stack, Group, Avatar, Text, Badge, Tabs, SimpleGrid, Divider, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconMail, IconPhone, IconMapPin, IconBuilding, IconId, IconLock, IconDeviceFloppy } from '@tabler/icons-react'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/authApi'
import PageHeader from '../../components/common/PageHeader'
import Loader from '../../components/common/Loader'

const DonorProfile = () => {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      organization: user?.organization || '',
      taxId: user?.taxId || '',
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
        message: 'Your password has been updated successfully',
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
      <PageHeader title="Donor Profile" subtitle="Manage your donor account and preferences" />

      {/* Profile Header */}
      <Card shadow="sm" p="lg" radius="md" withBorder mb="xl">
        <Group justify="space-between" align="flex-start">
          <Group>
            <Avatar size={100} radius="xl" color="green">
              {user.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <div>
              <Text size="xl" fw={700}>{user.name}</Text>
              <Badge size="lg" color="green" mt="xs">Donor</Badge>
              <Text size="sm" c="dimmed" mt="xs">Member since {new Date(user.createdAt).toLocaleDateString()}</Text>
            </div>
          </Group>
          <Button 
            variant={isEditing ? "light" : "filled"} 
            color="green"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Group>
      </Card>

      {/* Stats Overview */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Text size="xs" c="dimmed">Total Donations</Text>
          <Text size="2rem" fw={700}>{user.stats?.totalDonations || 0}</Text>
        </Card>
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Text size="xs" c="dimmed">Lives Impacted</Text>
          <Text size="2rem" fw={700}>{user.stats?.livesImpacted || 0}</Text>
        </Card>
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Text size="xs" c="dimmed">Rating</Text>
          <Text size="2rem" fw={700}>{user.stats?.rating || '4.8'} ★</Text>
        </Card>
      </SimpleGrid>

      {/* Tabs for different sections */}
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Tabs defaultValue="personal">
          <Tabs.List>
            <Tabs.Tab value="personal">Personal Information</Tabs.Tab>
            <Tabs.Tab value="business">Business Information</Tabs.Tab>
            <Tabs.Tab value="security">Security</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="personal" pt="md">
            <form onSubmit={form.onSubmit(handleSave)}>
              <Stack gap="md">
                <TextInput
                  label="Full Name"
                  placeholder="Your name"
                  leftSection={<IconMail size={16} />}
                  readOnly={!isEditing}
                  {...form.getInputProps('name')}
                />
                <TextInput
                  label="Email"
                  placeholder="Your email"
                  leftSection={<IconMail size={16} />}
                  readOnly
                  {...form.getInputProps('email')}
                />
                <TextInput
                  label="Phone Number"
                  placeholder="Contact number"
                  leftSection={<IconPhone size={16} />}
                  readOnly={!isEditing}
                  {...form.getInputProps('phone')}
                />
                <TextInput
                  label="Address"
                  placeholder="Your address"
                  leftSection={<IconMapPin size={16} />}
                  readOnly={!isEditing}
                  {...form.getInputProps('address')}
                />
                {isEditing && (
                  <Group justify="flex-end">
                    <Button type="submit" variant="gradient" loading={loading}>
                      Save Changes
                    </Button>
                  </Group>
                )}
              </Stack>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="business" pt="md">
            <Stack gap="md">
              <TextInput
                label="Organization Name"
                placeholder="Your organization"
                leftSection={<IconBuilding size={16} />}
                readOnly={!isEditing}
                {...form.getInputProps('organization')}
              />
              <TextInput
                label="Tax ID / Registration Number"
                placeholder="Tax ID"
                leftSection={<IconId size={16} />}
                readOnly={!isEditing}
                {...form.getInputProps('taxId')}
              />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="security" pt="md">
            <form onSubmit={passwordForm.onSubmit(handleChangePassword)}>
              <Stack gap="md">
                <PasswordInput
                  label="Current Password"
                  placeholder="Enter current password"
                  leftSection={<IconLock size={16} />}
                  {...passwordForm.getInputProps('currentPassword')}
                />
                <PasswordInput
                  label="New Password"
                  placeholder="Enter new password"
                  leftSection={<IconLock size={16} />}
                  {...passwordForm.getInputProps('newPassword')}
                />
                <PasswordInput
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  leftSection={<IconLock size={16} />}
                  {...passwordForm.getInputProps('confirmPassword')}
                />
                <Group justify="flex-end">
                  <Button type="submit" variant="gradient" loading={loading}>
                    Change Password
                  </Button>
                </Group>
              </Stack>
            </form>
            <Divider my="md" />
            <Button variant="outline" color="red">Delete Account</Button>
            <Text size="xs" c="dimmed" mt="xs">Deleting your account will remove all your donation history</Text>
          </Tabs.Panel>
        </Tabs>
      </Card>
    </Container>
  )
}

export default DonorProfile