import React from 'react'
import { TextInput, NumberInput, Textarea, Button, Stack, Group, Select } from '@mantine/core'
import { useForm } from '@mantine/form'

const DonationForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const form = useForm({
    initialValues: initialValues || {
      foodName: '',
      quantity: '',
      unit: 'kg',
      pickupLocation: '',
      description: '',
    },
    validate: {
      foodName: (v) => !v ? 'Required' : null,
      quantity: (v) => !v ? 'Required' : null,
      pickupLocation: (v) => v?.length < 5 ? 'Valid location required' : null,
    },
  })

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput label="Food Name" placeholder="e.g., Rice, Vegetables" {...form.getInputProps('foodName')} />
        <Group grow>
          <NumberInput label="Quantity" placeholder="Enter quantity" {...form.getInputProps('quantity')} />
          <Select label="Unit" data={['kg', 'g', 'lbs', 'pieces', 'boxes']} {...form.getInputProps('unit')} />
        </Group>
        <TextInput label="Pickup Location" placeholder="Full address" {...form.getInputProps('pickupLocation')} />
        <Textarea label="Description" placeholder="Additional details" minRows={3} {...form.getInputProps('description')} />
        <Group justify="flex-end">
          <Button variant="light" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="gradient" gradient={{ from: '#22c55e', to: '#16a34a' }} loading={loading}>Submit</Button>
        </Group>
      </Stack>
    </form>
  )
}

export default DonationForm