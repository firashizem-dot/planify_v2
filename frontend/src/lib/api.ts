import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60s for solver calls
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 - auto logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  verify2fa: (data: { email: string; code: number }) =>
    api.post('/api/auth/2fa/verify', data),
  setup2fa: () => api.post('/api/auth/2fa/setup'),
  enable2fa: (code: number) => api.post('/api/auth/2fa/enable', { code }),
  disable2fa: () => api.post('/api/auth/2fa/disable'),
};

// Admin
export const adminApi = {
  getDepartmentHeads: () => api.get('/api/admin/department-heads'),
  createDepartmentHead: (data: unknown) => api.post('/api/admin/department-heads', data),
  updateDepartmentHead: (id: number, data: unknown) => api.put(`/api/admin/department-heads/${id}`, data),
  deleteDepartmentHead: (id: number) => api.delete(`/api/admin/department-heads/${id}`),
  getDepartments: () => api.get('/api/admin/departments'),
  createDepartment: (data: unknown) => api.post('/api/admin/departments', data),
  updateDepartment: (id: number, data: unknown) => api.put(`/api/admin/departments/${id}`, data),
  deleteDepartment: (id: number) => api.delete(`/api/admin/departments/${id}`),
};

// Professors
export const professorApi = {
  getAll: (departmentId?: number) =>
    api.get('/api/professors', { params: departmentId ? { departmentId } : {} }),
  getById: (id: number) => api.get(`/api/professors/${id}`),
  create: (data: unknown) => api.post('/api/professors', data),
  update: (id: number, data: unknown) => api.put(`/api/professors/${id}`, data),
  delete: (id: number) => api.delete(`/api/professors/${id}`),
};

// Subjects
export const subjectApi = {
  getAll: (departmentId?: number) =>
    api.get('/api/subjects', { params: departmentId ? { departmentId } : {} }),
  getById: (id: number) => api.get(`/api/subjects/${id}`),
  create: (data: unknown) => api.post('/api/subjects', data),
  update: (id: number, data: unknown) => api.put(`/api/subjects/${id}`, data),
  delete: (id: number) => api.delete(`/api/subjects/${id}`),
};

// Classrooms
export const classroomApi = {
  getAll: () => api.get('/api/classrooms'),
  getById: (id: number) => api.get(`/api/classrooms/${id}`),
  create: (data: unknown) => api.post('/api/classrooms', data),
  update: (id: number, data: unknown) => api.put(`/api/classrooms/${id}`, data),
  delete: (id: number) => api.delete(`/api/classrooms/${id}`),
};

// Student Groups
export const groupApi = {
  getAll: (departmentId?: number) =>
    api.get('/api/groups', { params: departmentId ? { departmentId } : {} }),
  getById: (id: number) => api.get(`/api/groups/${id}`),
  create: (data: unknown) => api.post('/api/groups', data),
  update: (id: number, data: unknown) => api.put(`/api/groups/${id}`, data),
  delete: (id: number) => api.delete(`/api/groups/${id}`),
};

// Time Slots
export const timeslotApi = {
  getByDepartment: (departmentId: number) =>
    api.get('/api/timeslots', { params: { departmentId } }),
  create: (data: unknown) => api.post('/api/timeslots', data),
  update: (id: number, data: unknown) => api.put(`/api/timeslots/${id}`, data),
  delete: (id: number) => api.delete(`/api/timeslots/${id}`),
};

// Schedules
export const scheduleApi = {
  getAll: (departmentId?: number) =>
    api.get('/api/schedules', { params: departmentId ? { departmentId } : {} }),
  getById: (id: number) => api.get(`/api/schedules/${id}`),
  getSessions: (id: number) => api.get(`/api/schedules/${id}/sessions`),
  generate: (data: unknown) => api.post('/api/schedules/generate', data),
  mySchedule: () => api.get('/api/schedules/my-schedule'),
  byGroup: (groupId: number) => api.get(`/api/schedules/by-group/${groupId}`),
  validate: (id: number) => api.post(`/api/schedules/${id}/validate`),
  publish: (id: number) => api.post(`/api/schedules/${id}/publish`),
  archive: (id: number) => api.post(`/api/schedules/${id}/archive`),
  delete: (id: number) => api.delete(`/api/schedules/${id}`),
};
