import api from './axios';

export const authService = {
  // Registrasi pengguna baru
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  // Login pengguna
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data || response.data.user));
    }
    return response.data;
  },

  // Logout pengguna
  logout: async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Cek status server / health check
  checkHealth: async () => {
    // Ping endpoint Laravel health check
    const response = await api.get('/up', { baseURL: 'http://127.0.0.1:8000' });
    return response.status === 200;
  },
};

