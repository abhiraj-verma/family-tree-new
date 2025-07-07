import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      Cookies.remove('auth_token')
      Cookies.remove('user_data')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: {
    username: string
    password: string
    email?: string
    mobile?: string
  }) => api.post('/auth/register', data),

  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),

  googleSignIn: (token: string) =>
    api.post('/auth/google-signin', token),

  logout: () => api.post('/auth/logout'),
}

// Family API
export const familyAPI = {
  createFamily: (familyName: string) =>
    api.post('/family/create', null, { params: { familyName } }),

  getFamily: (familyKey: string) =>
    api.get(`/family/${familyKey}`),

  addMember: (
    familyKey: string,
    userData: any,
    parentId?: string,
    relationshipType?: string
  ) =>
    api.post(`/family/${familyKey}/members`, userData, {
      params: { parentId, relationshipType },
    }),

  removeMember: (familyKey: string, userId: string) =>
    api.delete(`/family/${familyKey}/members/${userId}`),

  updateFamilyName: (familyKey: string, newName: string) =>
    api.put(`/family/${familyKey}/name`, null, { params: { newName } }),
}

// Public API
export const publicAPI = {
  getPublicFamily: (token: string, familyName: string) =>
    api.get(`/public/family/${token}`, { params: { familyName } }),
}

// Image API
export const imageAPI = {
  uploadImage: (userId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/images/upload/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  deleteImage: (imageUrl: string) =>
    api.delete('/images/delete', { params: { imageUrl } }),
}

export default api