import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// For local development with Expo on physical device:
// Use your machine's local IP (e.g. 192.168.1.10) instead of localhost
// If running on Android Emulator, use 10.0.2.2
const LOCAL_IP = '172.30.8.157'; // Current Wi-Fi IP
const BASE_URL = `http://${LOCAL_IP}:8080/api`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token from AsyncStorage
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('hunter_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('Error reading token from storage', e);
  }
  return config;
});

// Auto logout logic should be handled by the context/routing on error
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await AsyncStorage.removeItem('hunter_token');
      await AsyncStorage.removeItem('hunter_user');
      // The frontend will usually react to the removal of the token
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
};

// ── User Status ───────────────────────────────────────
export const userAPI = {
  getStatus: () => api.get('/user/status'),
};

// ── Quests ────────────────────────────────────────────
export const questAPI = {
  getAll:    (params) => api.get('/tasks', { params }),
  getById:   (id)     => api.get(`/tasks/${id}`),
  create:    (data)   => api.post('/tasks', data),
  update:    (id, data) => api.put(`/tasks/${id}`, data),
  complete:  (id)     => api.patch(`/tasks/${id}/complete`),
  delete:    (id)     => api.delete(`/tasks/${id}`),
};

// ── Categories ────────────────────────────────────────
export const categoryAPI = {
  getAll:  ()         => api.get('/categories'),
  create:  (data)     => api.post('/categories', data),
  delete:  (id)       => api.delete(`/categories/${id}`),
};

// ── Health ────────────────────────────────────────────
export const healthAPI = {
  sync:      (data)   => api.post('/health/sync', data),
  getToday:  ()       => api.get('/health/today'),
  getHistory:(days=7) => api.get('/health/history', { params: { days } }),
};

export default api;
