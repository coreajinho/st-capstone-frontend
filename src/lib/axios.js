import axios from 'axios';

// 1. 환경변수를 가져옵니다.
const envApiUrl = import.meta.env.VITE_API_URL;

// 2. 검증 로직
if (!envApiUrl) {
  console.error('[Configuration Error] VITE_API_URL 환경변수가 설정되지 않았습니다. .env 파일을 확인해주세요.');
}

// 3. 기본값(localhost) 제거 -> 이제 설정 없이는 동작하지 않음
const BASE_URL = envApiUrl;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);