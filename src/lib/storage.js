/**
 * localStorage 접근을 추상화하여 보안과 테스트를 개선합니다.
 */

const TOKEN_KEY = 'accessToken';

export const storage = {
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get token from storage:', error);
      return null;
    }
  },

  setToken: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to set token in storage:', error);
    }
  },

  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to remove token from storage:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
};
