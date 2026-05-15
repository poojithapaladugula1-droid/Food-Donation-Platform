// Utility to get user role with display names
export const getUserRole = (role) => {
  const roles = {
    donor: { label: 'Donor', color: 'green', icon: '🍕' },
    volunteer: { label: 'Volunteer', color: 'blue', icon: '🚚' },
    user: { label: 'Receiver', color: 'orange', icon: '🍽️' },
    admin: { label: 'Admin', color: 'red', icon: '👑' }
  }
  return roles[role] || { label: role, color: 'gray', icon: '👤' }
}

export const getRoleBadgeColor = (role) => {
  const colors = {
    donor: 'green',
    volunteer: 'blue',
    user: 'orange',
    admin: 'red'
  }
  return colors[role] || 'gray'
}