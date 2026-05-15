import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppShell, Burger, Group, Box, ScrollArea } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import Sidebar from '../components/common/Sidebar'
import Navbar from '../components/common/Navbar'

const DashboardLayout = () => {
  const [opened, { toggle, close }] = useDisclosure()
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger 
              opened={opened} 
              onClick={toggle} 
              hiddenFrom="sm" 
              size="sm" 
            />
            <Box visibleFrom="sm">
              <Burger 
                opened={opened} 
                onClick={toggle} 
                size="sm" 
                visibility="hidden"
              />
            </Box>
          </Group>
          <Navbar />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <ScrollArea h="calc(100vh - 80px)">
          <Sidebar closeNavbar={isMobile ? close : undefined} />
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box p="md">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}

export default DashboardLayout