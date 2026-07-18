// ============================================================
// api.js – Axios REST API Service for Employee Management
// Base URL: http://localhost:3001
// ============================================================

import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
});

// ─── EMPLOYEES ──────────────────────────────────────────────────────────────

export const getEmployees = () =>
  api.get('/employees').then(r => r.data);

export const getEmployeeById = (id) =>
  api.get(`/employees/${id}`).then(r => r.data);

export const addEmployee = (data) =>
  api.post('/employees', data).then(r => r.data);

export const updateEmployee = (id, data) =>
  api.put(`/employees/${id}`, data).then(r => r.data);

export const deleteEmployee = (id) =>
  api.delete(`/employees/${id}`).then(r => r.data);

// ─── DEPARTMENTS ─────────────────────────────────────────────────────────────

export const getDepartments = () =>
  api.get('/departments').then(r => r.data);

export const addDepartment = (data) =>
  api.post('/departments', data).then(r => r.data);

export const updateDepartment = (id, data) =>
  api.put(`/departments/${id}`, data).then(r => r.data);

export const deleteDepartment = (id) =>
  api.delete(`/departments/${id}`).then(r => r.data);

// ─── DESIGNATIONS ─────────────────────────────────────────────────────────────

export const getDesignations = () =>
  api.get('/designations').then(r => r.data);

export const addDesignation = (data) =>
  api.post('/designations', data).then(r => r.data);

export const updateDesignation = (id, data) =>
  api.put(`/designations/${id}`, data).then(r => r.data);

export const deleteDesignation = (id) =>
  api.delete(`/designations/${id}`).then(r => r.data);

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
// Computed from the employees and departments endpoints

export const getDashboardStats = async () => {
  const [employees, departments] = await Promise.all([
    getEmployees(),
    getDepartments(),
  ]);

  const totalSalary = employees.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);

  return {
    totalEmployees:  employees.length,
    activeEmployees: employees.filter(e => e.status === 'Active').length,
    totalDepartments: departments.length,
    onLeave:         employees.filter(e => e.status === 'On Leave').length,
    totalSalary,
    // Attendance stats — still computed locally since attendance isn't in JSON Server
    presentToday: Math.floor(employees.filter(e => e.status === 'Active').length * 0.85),
    absentToday:  Math.floor(employees.filter(e => e.status === 'Active').length * 0.15),
  };
};

export default api;
