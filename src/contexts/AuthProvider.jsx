import { authApi } from '@/apis/authApi';
import { storage } from '@/lib/storage';
import { createContext, useContext, useEffect, useState } from 'react';

/**
 * 인증 상태를 관리하는 Context
 */
const AuthContext = createContext(null);

/**
 * useAuth Hook - AuthContext를 사용하는 커스텀 훅
 * @returns {Object} 인증 관련 상태와 함수들
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider - 앱 전체에 인증 상태를 제공하는 Provider
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 저장된 토큰으로 사용자 정보를 가져옵니다
   */
  const fetchMe = async () => {
    const token = storage.getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authApi.fetchMe();
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // 토큰이 만료되었거나 유효하지 않은 경우
      storage.removeToken();
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그인을 수행합니다
   * @param {string} username - 사용자 이름
   * @param {string} password - 비밀번호
   */
  const login = async (username, password) => {
    try {
      const response = await authApi.login(username, password);
      
      // accessToken 저장
      if (response.accessToken) {
        storage.setToken(response.accessToken);
      }
      
      // 사용자 정보 조회
      await fetchMe();
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  /**
   * 로그아웃을 수행합니다
   */
  const logout = () => {
    storage.removeToken();
    setUser(null);
    setIsLoggedIn(false);
  };

  // 초기 로드 시 토큰 확인 및 사용자 정보 조회
  useEffect(() => {
    fetchMe();
  }, []);

  const value = {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout,
    fetchMe
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
