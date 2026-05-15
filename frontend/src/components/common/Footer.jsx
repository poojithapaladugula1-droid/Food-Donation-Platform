import React from 'react'
import { Container, Grid, Text, Group, Stack } from '@mantine/core'
import { IconHeart, IconMail, IconPhone, IconMapPin } from '@tabler/icons-react'
import '../../styles/footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <Container size="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Group gap="xs" mb="md">
              <IconHeart size={24} color="#22c55e" />
              <Text size="xl" fw={700}>FoodShare</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Making food redistribution faster and smarter. Connecting donors, volunteers, and those in need.
            </Text>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text fw={600} mb="md">Quick Links</Text>
            <Stack gap="xs" className="footer-links">
              <a href="/about">About Us</a>
              <a href="/how-it-works">How It Works</a>
              <a href="/contact">Contact</a>
              <a href="/privacy">Privacy Policy</a>
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Text fw={600} mb="md">Contact</Text>
            <Stack gap="xs">
              <Group gap="xs">
                <IconMail size={16} />
                <Text size="sm">support@foodshare.com</Text>
              </Group>
              <Group gap="xs">
                <IconPhone size={16} />
                <Text size="sm">+1 234 567 890</Text>
              </Group>
              <Group gap="xs">
                <IconMapPin size={16} />
                <Text size="sm">123 Food Street, NY</Text>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
        
        <Text ta="center" size="xs" c="dimmed" mt="xl" pt="xl" style={{ borderTop: '1px solid #333' }}>
          © 2024 FoodShare. All rights reserved.
        </Text>
      </Container>
    </footer>
  )
}

export default Footer