export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1/o',
  ENDPOINTS: {
    CLIENTS: '/clients',
    PROJECTS: '/projects',
    PURPOSES: '/purposes',
    SMS: '/sms',
    LOGIN: '/users/login'
  }
};

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}