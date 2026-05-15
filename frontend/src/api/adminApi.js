import axiosInstance from './axiosInstance'

export const adminApi = {
  getStats: () => axiosInstance.get('/admin/stats'),
  getAllUsers: () => axiosInstance.get('/admin/users'),
  updateUserRole: (userId, role) => axiosInstance.put(`/admin/users/${userId}/role`, { role }),
  updateUserStatus: (userId, status) => axiosInstance.put(`/admin/users/${userId}/status`, { status }),
  deleteUser: (userId) => axiosInstance.delete(`/admin/users/${userId}`),
  getAllDonations: () => axiosInstance.get('/admin/donations'),
  deleteDonation: (donationId) => axiosInstance.delete(`/admin/donations/${donationId}`),
  getVolunteerStats: () => axiosInstance.get('/admin/volunteers'),
  getPendingDonations: () => axiosInstance.get('/admin/donations/pending'),
}