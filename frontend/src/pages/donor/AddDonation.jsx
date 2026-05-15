import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Title, Card, TextInput, NumberInput, Textarea, Button, Stack, Group, Select, Box, Text } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconCalendar, IconMapPin, IconPackage, IconWeight, IconPlus } from '@tabler/icons-react'
import { donationApi } from '../../api/donationApi'
import dayjs from 'dayjs'

const AddDonation = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      foodName: '',
      foodType: '',
      quantity: '',
      unit: '',
      expiryTime: dayjs().add(1, 'day').toDate(),
      pickupLocation: '',
      description: '',
      specialInstructions: '',
    },
    validate: {
      foodName: (value) => (!value ? 'Food name is required' : null),
      quantity: (value) => (!value || value <= 0 ? 'Valid quantity is required' : null),
      pickupLocation: (value) => (!value || value.length < 5 ? 'Valid location is required' : null),
      expiryTime: (value) => (value && value < new Date() ? 'Expiry time must be in the future' : null),
    },
  })

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const response = await donationApi.create(values)
      notifications.show({
        title: 'Success!',
        message: 'Your donation has been posted successfully',
        color: 'green',
      })
      navigate('/donor/my-donations')
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to post donation',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size="md">
      <Title order={2} mb="xl">Post a New Donation</Title>
      
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Food Name"
              placeholder="e.g., Rice, Vegetables, Bread"
              leftSection={<IconPackage size={16} />}
              withAsterisk
              {...form.getInputProps('foodName')}
            />
            
            <Select
              label="Food Type"
              placeholder="Select food type"
              data={[
                { value: 'cooked', label: '🍲 Cooked Food' },
                { value: 'raw', label: '🥬 Raw Ingredients' },
                { value: 'packaged', label: '📦 Packaged Food' },
                { value: 'frozen', label: '❄️ Frozen Food' },
                { value: 'beverages', label: '🥤 Beverages' },
              ]}
              {...form.getInputProps('foodType')}
            />
            
            <Group grow>
              <NumberInput
                label="Quantity"
                placeholder="Enter quantity"
                leftSection={<IconWeight size={16} />}
                withAsterisk
                min={0.5}
                step={0.5}
                {...form.getInputProps('quantity')}
              />
              <Select
                label="Unit"
                data={[
                  { value: 'kg', label: 'Kilograms (kg)' },
                  { value: 'g', label: 'Grams (g)' },
                  { value: 'lbs', label: 'Pounds (lbs)' },
                  { value: 'pieces', label: 'Pieces' },
                  { value: 'boxes', label: 'Boxes' },
                  { value: 'liters', label: 'Liters (L)' },
                ]}
                {...form.getInputProps('unit')}
              />
            </Group>
            
            <DateTimePicker
              label="Expiry Time"
              placeholder="When does the food expire?"
              leftSection={<IconCalendar size={16} />}
              withAsterisk
              minDate={new Date()}
              valueFormat="DD/MM/YYYY HH:mm"
              {...form.getInputProps('expiryTime')}
            />
            
            <TextInput
              label="Pickup Location"
              placeholder="Full address for pickup"
              leftSection={<IconMapPin size={16} />}
              withAsterisk
              {...form.getInputProps('pickupLocation')}
            />
            
            <Textarea
              label="Description"
              placeholder="Describe the food items, packaging, etc."
              minRows={3}
              {...form.getInputProps('description')}
            />
            
            <Textarea
              label="Special Instructions"
              placeholder="Any special instructions for pickup (e.g., call on arrival, ring doorbell, etc.)"
              minRows={2}
              {...form.getInputProps('specialInstructions')}
            />
            
            <Box p="md" style={{ backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
              <Text size="sm" c="dimmed">
                <IconPlus size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Tip: Adding clear photos and detailed descriptions helps volunteers find your donation faster!
              </Text>
            </Box>
            
            <Group justify="flex-end" mt="md">
              <Button variant="light" color="gray" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="gradient" 
                gradient={{ from: '#22c55e', to: '#16a34a' }}
                loading={loading}
              >
                Post Donation
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Container>
  )
}

export default AddDonation