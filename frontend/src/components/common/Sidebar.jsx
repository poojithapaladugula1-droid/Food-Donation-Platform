import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Stack, Button, Text, Group, Divider, Box } from '@mantine/core'
import { 
  IconHome, 
  IconPlus, 
  IconList, 
  IconTruck, 
  IconShoppingBag,
  IconUsers,
  IconAward,
  IconLogout
} from '@tabler/icons-react'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const getMenuItems = () => {
    switch(user?.role) {
      case 'donor':
        return [
          { to: '/donor/dashboard', label: 'Dashboard', icon: IconHome },
          { to: '/donor/add-donation', label: 'Add Donation', icon: IconPlus },
          { to: '/donor/my-donations', label: 'My Donations', icon: IconList },
        ]
      case 'volunteer':
        return [
          { to: '/volunteer/dashboard', label: 'Dashboard', icon: IconHome },
          { to: '/volunteer/available', label: 'Available Donations', icon: IconTruck },
          { to: '/volunteer/accepted', label: 'My Deliveries', icon: IconList },
          { to: '/volunteer/rewards', label: 'Rewards', icon: IconAward },
        ]
      case 'user':
        return [
          { to: '/user/dashboard', label: 'Dashboard', icon: IconHome },
          { to: '/user/request-food', label: 'Request Food', icon: IconShoppingBag },
          { to: '/user/track-delivery', label: 'Track Delivery', icon: IconTruck },
        ]
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Overview', icon: IconHome },
          { to: '/admin/users', label: 'Manage Users', icon: IconUsers },
          { to: '/admin/donations', label: 'Manage Donations', icon: IconList },
          { to: '/admin/volunteers', label: 'Volunteer Monitoring', icon: IconAward },
        ]
      default:
        return []
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Box style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Stack gap="xs">
        <Group p="sm" mb="md">
          <Text fw={700} size="lg" c="green">Menu</Text>
        </Group>
        <Divider />
        {getMenuItems().map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              textDecoration: 'none',
              display: 'block',
              width: '100%',
            })}
          >
            {({ isActive }) => (
              <Button
                variant={isActive ? 'filled' : 'subtle'}
                color={isActive ? 'green' : 'gray'}
                leftSection={<item.icon size={18} />}
                fullWidth
                justify="flex-start"
                style={{ borderRadius: '8px' }}
              >
                {item.label}
              </Button>
            )}
          </NavLink>
        ))}
      </Stack>
      
      <Button 
        variant="light" 
        color="red" 
        leftSection={<IconLogout size={18} />}
        onClick={handleLogout}
        fullWidth
      >
        Logout
      </Button>
    </Box>
  )
}

export default Sidebar