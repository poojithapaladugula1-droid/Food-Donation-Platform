// App-wide constants
export const DONATION_STATUS = {
  AVAILABLE: 'available',
  ACCEPTED: 'accepted',
  PICKED_UP: 'picked_up',
  DELIVERED: 'delivered',
  EXPIRED: 'expired'
}

export const URGENCY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
}

export const FOOD_TYPES = [
  'Rice & Grains',
  'Fresh Vegetables',
  'Fresh Fruits',
  'Bread & Bakery',
  'Canned Goods',
  'Dairy Products',
  'Meat & Protein',
  'Beverages',
  'Mixed Package'
]

export const VOLUNTEER_LEVELS = {
  BRONZE: { name: 'Bronze', minPoints: 0, color: '#cd7f32' },
  SILVER: { name: 'Silver', minPoints: 500, color: '#c0c0c0' },
  GOLD: { name: 'Gold', minPoints: 1000, color: '#ffd700' },
  PLATINUM: { name: 'Platinum', minPoints: 2000, color: '#e5e4e2' }
}

export const getVolunteerLevel = (points) => {
  if (points >= 2000) return VOLUNTEER_LEVELS.PLATINUM
  if (points >= 1000) return VOLUNTEER_LEVELS.GOLD
  if (points >= 500) return VOLUNTEER_LEVELS.SILVER
  return VOLUNTEER_LEVELS.BRONZE
}