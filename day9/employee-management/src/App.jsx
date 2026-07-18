import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import Departments from './components/Departments';
import Designations from './components/Designations';
import Attendance from './components/Attendance';
import Payroll from './components/Payroll';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/ToastContext';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="departments" element={<Departments />} />
            <Route path="designations" element={<Designations />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={
              <div className="empty-state">
                <h2>404 - Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
