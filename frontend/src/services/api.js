import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('hunter_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hunter_token')
      localStorage.removeItem('hunter_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
}

// ── User Status ───────────────────────────────────────
export const userAPI = {
  getStatus: () => api.get('/user/status'),
}

// ── Quests ────────────────────────────────────────────
export const questAPI = {
  getAll:    (params) => api.get('/tasks', { params }),
  getById:   (id)     => api.get(`/tasks/${id}`),
  create:    (data)   => api.post('/tasks', data),
  update:    (id, data) => api.put(`/tasks/${id}`, data),
  complete:  (id)     => api.patch(`/tasks/${id}/complete`),
  delete:    (id)     => api.delete(`/tasks/${id}`),
}

// ── Categories ────────────────────────────────────────
export const categoryAPI = {
  getAll:  ()         => api.get('/categories'),
  create:  (data)     => api.post('/categories', data),
  delete:  (id)       => api.delete(`/categories/${id}`),
}

export default api
