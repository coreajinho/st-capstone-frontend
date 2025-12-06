import { api } from '@/lib/axios';

export const authApi = {
  login: async (username, password) => {
    const response = await api.post('/api/auth/login', {
      username,
      password
    });
    return response.data;
  },

  signup: async (username, password, riotName, riotTag) => {
    const response = await api.post('/api/auth/signup', {
      username,
      password,
      riotName,
      riotTag
    });
    return response.data;
  }
};