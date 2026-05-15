import React from 'react'
import { TextInput, NumberInput, Textarea, Button, Stack, Group, Select } from '@mantine/core'
import { useForm } from '@mantine/form'

const FoodRequestForm = ({ onSubmit, onCancel, loading }) => {
  const form = useForm({
    initialValues: { foodType: '', quantity: '', address: '', contactName: '', contactPhone: '', specialInstructions: '' },
    validate: {
      foodType: (v) => !v ? 'Required' : null,
      quantity: (v) => !v ? 'Required' : null,
      address: (v) => v?.length < 5 ? 'Valid address required' : null,
      contactPhone: (v) => v?.length < 10 ? 'Valid phone required' : null,
    },
  })

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <Select label="Food Type" placeholder="Select food type" data={['Rice & Grains', 'Vegetables', 'Fruits', 'Bread', 'Canned Goods', 'Dairy', 'Meat']} {...form.getInputProps('foodType')} />
        <NumberInput label="Quantity Needed" placeholder="How many people / kg?" {...form.getInputProps('quantity')} />
        <TextInput label="Delivery Address" placeholder="Full address" {...form.getInputProps('address')} />
        <TextInput label="Contact Name" placeholder="Your name" {...form.getInputProps('contactName')} />
        <TextInput label="Phone Number" placeholder="Contact number" {...form.getInputProps('contactPhone')} />
        <Textarea label="Special Instructions" placeholder="Dietary restrictions or notes" minRows={2} {...form.getInputProps('specialInstructions')} />
        <Group justify="flex-end"><Button variant="light" onClick={onCancel}>Cancel</Button><Button type="submit" variant="gradient" gradient={{ from: '#22c55e', to: '#16a34a' }} loading={loading}>Submit Request</Button></Group>
      </Stack>
    </form>
  )
}

export default FoodRequestForm