import axios from 'axios';

// Support production backend deployment (Render API URL) or fallback to local backend
let API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  // If VITE_API_URL environment variable is not defined on Netlify
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    console.warn('VITE_API_URL is not configured on Netlify environment variables.');
  }
  API_BASE_URL = 'http://localhost:5000/api';
}

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token to request headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('blog_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  getMe: () => API.get('/auth/me'),
};

// Blog Endpoints
export const blogAPI = {
  getAll: (params) => API.get('/blogs', { params }),
  getById: (id) => API.get(`/blogs/${id}`),
  create: (blogData) => API.post('/blogs', blogData),
  update: (id, blogData) => API.put(`/blogs/${id}`, blogData),
  delete: (id) => API.delete(`/blogs/${id}`),
};

export default API;
