import axiosInstance from './axiosInstance'

export const donationApi = {
  create: (data) => axiosInstance.post('/donations', data),
  getAll: () => axiosInstance.get('/donations'),
  getMyDonations: () => axiosInstance.get('/donations/my'),
  getAvailable: () => axiosInstance.get('/donations/available'),
  getStats: () => axiosInstance.get('/donations/stats'),
  update: (id, data) => axiosInstance.put(`/donations/${id}`, data),
  delete: (id) => axiosInstance.delete(`/donations/${id}`),
  getById: (id) => axiosInstance.get(`/donations/${id}`),
}