import api from './api';
import type { User } from '../types';

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post<{ token: string; user: User }>(
      '/auth/login', { email, password }
    );
    localStorage.setItem('token', data.token);
    return data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  async register(name: string, email: string, password: string) {
    const { data } = await api.post<{ token: string; user: User }>(
      '/auth/register', { name, email, password }
    );
    localStorage.setItem('token', data.token);
    return data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};