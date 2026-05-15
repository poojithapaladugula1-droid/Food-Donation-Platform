import React from 'react'
import { Box, Title, Text, Group, Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

const PageHeader = ({ title, subtitle, showBack = false, actionButton = null }) => {
  const navigate = useNavigate()

  return (
    <Box mb="xl">
      <Group justify="space-between" align="center">
        <Box>
          {showBack && (
            <Button 
              variant="subtle" 
              size="compact-sm" 
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate(-1)}
              mb="xs"
            >
              Back
            </Button>
          )}
          <Title order={2}>{title}</Title>
          {subtitle && <Text c="dimmed" size="sm">{subtitle}</Text>}
        </Box>
        {actionButton && actionButton}
      </Group>
    </Box>
  )
}

export default PageHeader