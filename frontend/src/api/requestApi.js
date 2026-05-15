import axiosInstance from './axiosInstance'

export const requestApi = {
  create: (data) => axiosInstance.post('/requests', data),
  getMyRequests: () => axiosInstance.get('/requests/my'),
  getActiveRequest: () => axiosInstance.get('/requests/active'),
  trackDelivery: (id) => axiosInstance.get(`/requests/${id}/track`),
  cancel: (id) => axiosInstance.delete(`/requests/${id}`),
}