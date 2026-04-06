import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';
import { useRouter } from 'expo-router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initial load: check for existing token
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('hunter_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to load user from AsyncStorage:', e.message || e);
      } finally {
        setLoading(false);
      }
    };
    loadStoredUser();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await authAPI.login(credentials);
      const { token, user: userData } = res.data;
      await AsyncStorage.setItem('hunter_token', token);
      await AsyncStorage.setItem('hunter_user', JSON.stringify(userData));
      setUser(userData);
      router.replace('/dashboard');
      return { success: true };
    } catch (err) {
      console.error('Login error', err);
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      // Usually auto-login or redirect
      return { success: true };
    } catch (err) {
      console.error('Registration error', err);
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('hunter_token');
    await AsyncStorage.removeItem('hunter_user');
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
