import axios from 'axios';

// Create axios instance with base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add interceptor to include auth token in private requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Course API
export const courseAPI = {
  getAll: async () => {
    const response = await api.get('/courses');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
  create: async (courseData: any) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },
  update: async (id: string, courseData: any) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  }
};

// Announcement API
export const announcementAPI = {
  getAll: async (category?: string) => {
    const url = category ? `/announcements?category=${category}` : '/announcements';
    const response = await api.get(url);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },
  create: async (announcementData: any) => {
    const response = await api.post('/announcements', announcementData);
    return response.data;
  },
  update: async (id: string, announcementData: any) => {
    const response = await api.put(`/announcements/${id}`, announcementData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  }
};

// Contact API
export const contactAPI = {
  getAll: async (status?: string) => {
    const url = status ? `/contacts?status=${status}` : '/contacts';
    const response = await api.get(url);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },
  create: async (contactData: any) => {
    const response = await api.post('/contacts', contactData);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/contacts/${id}`, { status });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  }
};

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  }
};

// Team API
export const teamAPI = {
  getAll: async (params?: { type?: string }) => {
    try {
      const response = await api.get('/team', { params });
      console.log('GET /team API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },
  getById: async (id: string) => {
    const response = await api.get(`/team/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/team', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/team/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/team/${id}`);
    return response.data;
  },
  getAllAdmin: async () => {
    try {
      const response = await api.get('/team/admin');
      console.log('GET /team/admin API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin team members:', error);
      throw error;
    }
  }
};

// Testimonial API
export const testimonialAPI = {
  getAll: async (params?: { limit?: number; page?: number; sort?: string; filters?: Record<string, any> }) => {
    try {
      // If filters are provided, add them to the params
      const requestParams: Record<string, any> = { ...params };
      if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          requestParams[key] = value;
        });
        delete requestParams.filters;
      }
      
      const response = await api.get('/testimonials', { params: requestParams });
      console.log('GET /testimonials API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  },
  getById: async (id: string) => {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/testimonials', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/testimonials/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  },
  submit: async (data: any) => {
    const response = await api.post('/testimonials/submit', data);
    return response.data;
  },
  getPending: async () => {
    const response = await api.get('/testimonials/pending');
    return response.data;
  },
  approve: async (id: string) => {
    const response = await api.put(`/testimonials/${id}/approve`, {});
    return response.data;
  }
};

// Video API
export const videoAPI = {
  getAll: async (params?: { limit?: number; page?: number; sort?: string; filters?: Record<string, any> }) => {
    try {
      // If filters are provided, add them to the params
      const requestParams: Record<string, any> = { ...params };
      if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          requestParams[key] = value;
        });
        delete requestParams.filters;
      }
      
      const response = await api.get('/videos', { params: requestParams });
      console.log('GET /videos API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  },
  getById: async (id: string) => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/videos', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/videos/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  }
};

export default api; 