import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/signin';
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }

    // Handle forbidden errors
    if (error.response?.status === 403) {
      return Promise.reject(new Error('You do not have permission to perform this action.'));
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle other errors
    const errorMessage = error.response?.data?.error || error.message || 'Something went wrong.';
    return Promise.reject(new Error(errorMessage));
  }
);

// API methods
export const quotationAPI = {
  submit: (data) => api.post('/quotations', data),
  getAll: () => api.get('/quotations'),
  getById: (id) => api.get(`/quotations/${id}`),
};

export const authAPI = {
  login: (credentials) => api.post('/staff/login', credentials),
  getProfile: () => api.get('/staff/profile'),
};

export const agenciesAPI = {
  getAll: () => api.get('/agencies'),
};

export const permitsAPI = {
  getAll: () => api.get('/permits'),
};

export const quickbooksAPI = {
  getAuthUrl: () => api.get('/quickbooks/auth'),
  handleCallback: (url) => api.get(`/quickbooks/callback?${url}`),
  getPermits: () => api.get('/quickbooks/permits'),
  createEstimate: (data) => api.post('/quickbooks/estimate', data),
};

export default api; 