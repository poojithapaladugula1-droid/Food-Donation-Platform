import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, TextInput, PasswordInput, Button, Title, Text, Stack, Divider, Box, Checkbox, Anchor, Group } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconMail, IconLock } from '@tabler/icons-react'
import { useAuth } from '../../context/AuthContext'
import '../../styles/auth.css'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  })

  const handleSubmit = async (values) => {
    setLoading(true)
    const result = await login(values.email, values.password)
    setLoading(false)
    
    if (result.success) {
      // Redirect based on role
      const role = result.user.role
      if (role === 'donor') navigate('/donor/dashboard')
      else if (role === 'volunteer') navigate('/volunteer/dashboard')
      else if (role === 'user') navigate('/user/dashboard')
      else if (role === 'admin') navigate('/admin/dashboard')
      else navigate('/')
    }
  }

  return (
    <Card shadow="xl" p="xl" radius="lg" withBorder className="auth-card">
      <Box className="auth-header">
        <Title order={2}>Welcome Back</Title>
        <Text size="sm" c="dimmed">Login to access your dashboard</Text>
      </Box>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Email Address"
            placeholder="your@email.com"
            leftSection={<IconMail size={16} />}
            size="md"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            leftSection={<IconLock size={16} />}
            size="md"
            {...form.getInputProps('password')}
          />
          
          <Group justify="space-between">
            <Checkbox
              label="Remember me"
              size="sm"
              {...form.getInputProps('rememberMe', { type: 'checkbox' })}
            />
            <Anchor href="#" size="sm" c="green">Forgot password?</Anchor>
          </Group>

          <Button 
            type="submit" 
            variant="gradient" 
            gradient={{ from: '#22c55e', to: '#16a34a' }}
            fullWidth
            size="md"
            loading={loading}
          >
            Login
          </Button>
        </Stack>
      </form>

      <Divider my="md" label="OR" labelPosition="center" />

      <Text ta="center" size="sm">
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 600 }}>
          Create an account
        </Link>
      </Text>
    </Card>
  )
}

export default Login