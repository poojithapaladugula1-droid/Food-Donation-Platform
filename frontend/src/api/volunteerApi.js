import axiosInstance from './axiosInstance'

export const volunteerApi = {
  acceptDonation: (donationId) => axiosInstance.post(`/volunteer/accept/${donationId}`),
  getAcceptedDeliveries: () => axiosInstance.get('/volunteer/deliveries'),
  updateDeliveryStatus: (deliveryId, status, location) => axiosInstance.put(`/volunteer/delivery/${deliveryId}`, { status, location }),
  getRewards: () => axiosInstance.get('/volunteer/rewards'),
  getStats: () => axiosInstance.get('/volunteer/stats'),
  getLeaderboard: () => axiosInstance.get('/volunteer/leaderboard'),
}