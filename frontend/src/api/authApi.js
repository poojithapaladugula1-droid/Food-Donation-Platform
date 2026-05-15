import axiosInstance from './axiosInstance'

export const authApi = {
  register: (userData) => axiosInstance.post('/auth/register', userData),
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  googleLogin: (token) => axiosInstance.post('/auth/google', { token }),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
  changePassword: (data) => axiosInstance.post('/auth/change-password', data),
  logout: () => axiosInstance.post('/auth/logout'),
}