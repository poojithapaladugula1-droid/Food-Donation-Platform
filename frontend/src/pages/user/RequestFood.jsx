import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, TextInput, NumberInput, Textarea, Button, Stack, Group, Select, Box, Text, Alert } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconUser, IconMapPin, IconPhone, IconPackage, IconInfoCircle } from '@tabler/icons-react'
import { requestApi } from '../../api/requestApi'
import { useAuth } from '../../context/AuthContext'
import PageHeader from '../../components/common/PageHeader'

const RequestFood = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      foodType: '',
      quantity: 1,
      unit: 'meals',
      address: user?.address || '',
      contactName: user?.name || '',
      contactPhone: user?.phone || '',
      dietaryRestrictions: '',
      specialInstructions: '',
      isEmergency: false,
    },
    validate: {
      foodType: (value) => (!value ? 'Please select food type' : null),
      quantity: (value) => (!value || value <= 0 ? 'Valid quantity is required' : null),
      address: (value) => (!value || value.length < 5 ? 'Valid address is required' : null),
      contactPhone: (value) => (!value || value.length < 10 ? 'Valid phone number is required' : null),
    },
  })

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      await requestApi.create(values)
      notifications.show({
        title: 'Request Submitted!',
        message: 'A volunteer will contact you soon to arrange delivery.',
        color: 'green',
      })
      navigate('/user/track-delivery')
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to submit request',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="md">
      <PageHeader title="Request Food Assistance" subtitle="Get food delivered to your doorstep" />
      
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Alert icon={<IconInfoCircle size={16} />} color="blue" mb="lg">
          All requests are handled by verified volunteers. Your information is kept confidential.
        </Alert>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Select
              label="Food Type Needed"
              placeholder="What type of food do you need?"
              data={[
                { value: 'rice_grains', label: '🍚 Rice & Grains' },
                { value: 'vegetables', label: '🥬 Fresh Vegetables' },
                { value: 'fruits', label: '🍎 Fresh Fruits' },
                { value: 'bread_bakery', label: '🍞 Bread & Bakery' },
                { value: 'canned_goods', label: '🥫 Canned Goods' },
                { value: 'dairy', label: '🥛 Dairy Products' },
                { value: 'meat', label: '🍗 Meat & Protein' },
                { value: 'mixed', label: '📦 Mixed Food Package' },
              ]}
              withAsterisk
              {...form.getInputProps('foodType')}
            />
            
            <Group grow>
              <NumberInput
                label="Quantity"
                placeholder="How many people?"
                withAsterisk
                min={1}
                max={50}
                {...form.getInputProps('quantity')}
              />
              <Select
                label="Unit"
                data={['meals', 'people', 'kg', 'boxes']}
                {...form.getInputProps('unit')}
              />
            </Group>
            
            <TextInput
              label="Delivery Address"
              placeholder="Full address for delivery"
              leftSection={<IconMapPin size={16} />}
              withAsterisk
              {...form.getInputProps('address')}
            />
            
            <TextInput
              label="Contact Name"
              placeholder="Your full name"
              leftSection={<IconUser size={16} />}
              withAsterisk
              {...form.getInputProps('contactName')}
            />
            
            <TextInput
              label="Phone Number"
              placeholder="Your contact number"
              leftSection={<IconPhone size={16} />}
              withAsterisk
              {...form.getInputProps('contactPhone')}
            />
            
            <Textarea
              label="Dietary Restrictions"
              placeholder="Any allergies or dietary restrictions (e.g., vegetarian, halal, gluten-free)"
              minRows={2}
              {...form.getInputProps('dietaryRestrictions')}
            />
            
            <Textarea
              label="Special Instructions"
              placeholder="Any special instructions for delivery (e.g., gate code, landmark, etc.)"
              minRows={2}
              {...form.getInputProps('specialInstructions')}
            />
            
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => navigate(-1)}>Cancel</Button>
              <Button 
                type="submit" 
                variant="gradient" 
                gradient={{ from: '#22c55e', to: '#16a34a' }}
                loading={loading}
              >
                Submit Request
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Container>
  )
}

export default RequestFood