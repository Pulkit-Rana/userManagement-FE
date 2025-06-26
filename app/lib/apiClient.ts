import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token
apiClient.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// On 401, refresh once
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshRes = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const { accessToken } = refreshRes.data;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('accessToken', accessToken);
        }
        original.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(original);
      } catch {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('accessToken');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const setAccessToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

export default apiClient;
