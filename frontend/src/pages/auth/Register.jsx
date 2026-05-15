import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, TextInput, PasswordInput, Button, Title, Text, Stack, Divider, SegmentedControl, Box, Group, Anchor } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconUser, IconMail, IconLock, IconPhone, IconMapPin } from '@tabler/icons-react'
import { useAuth } from '../../context/AuthContext'
import '../../styles/auth.css'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('donor')

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
      phone: (value) => (value.length < 10 ? 'Valid phone number required' : null),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) => (value !== values.password ? 'Passwords do not match' : null),
    },
  })

  const handleSubmit = async (values) => {
    setLoading(true)
    const { confirmPassword, ...userData } = values
    const result = await register({ ...userData, role })
    setLoading(false)
    
    if (result.success) {
      navigate(`/${role}/dashboard`)
    }
  }

  return (
    <Card shadow="xl" p="xl" radius="lg" withBorder className="auth-card">
      <Box className="auth-header">
        <Title order={2}>Create Account</Title>
        <Text size="sm" c="dimmed">Join FoodShare and make a difference</Text>
      </Box>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Full Name"
            placeholder="John Doe"
            leftSection={<IconUser size={16} />}
            size="md"
            {...form.getInputProps('name')}
          />
          
          <TextInput
            label="Email Address"
            placeholder="your@email.com"
            leftSection={<IconMail size={16} />}
            size="md"
            {...form.getInputProps('email')}
          />
          
          <TextInput
            label="Phone Number"
            placeholder="+1 234 567 890"
            leftSection={<IconPhone size={16} />}
            size="md"
            {...form.getInputProps('phone')}
          />
          
          <TextInput
            label="Address"
            placeholder="Your full address"
            leftSection={<IconMapPin size={16} />}
            size="md"
            {...form.getInputProps('address')}
          />
          
          <PasswordInput
            label="Password"
            placeholder="Create a strong password"
            leftSection={<IconLock size={16} />}
            size="md"
            {...form.getInputProps('password')}
          />
          
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            leftSection={<IconLock size={16} />}
            size="md"
            {...form.getInputProps('confirmPassword')}
          />
          
          <Box>
            <Text size="sm" fw={500} mb="xs">I want to join as a</Text>
            <SegmentedControl
              fullWidth
              value={role}
              onChange={setRole}
              size="md"
              data={[
                { label: '🍕 Donor', value: 'donor' },
                { label: '🚚 Volunteer', value: 'volunteer' },
                { label: '🍽️ Receiver', value: 'user' },
              ]}
              color="green"
            />
          </Box>

          <Button 
            type="submit" 
            variant="gradient" 
            gradient={{ from: '#22c55e', to: '#16a34a' }}
            fullWidth
            size="md"
            loading={loading}
          >
            Create Account
          </Button>
        </Stack>
      </form>

      <Divider my="md" label="OR" labelPosition="center" />

      <Text ta="center" size="sm">
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 600 }}>
          Sign in
        </Link>
      </Text>
    </Card>
  )
}

export default Register