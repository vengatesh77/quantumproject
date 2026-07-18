import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getEmployees } from '../services/api';
import {
  Users, UserCheck, Building2, CalendarCheck,
  CalendarOff, Banknote, TrendingUp, Pin
} from 'lucide-react';
import './Dashboard.css';

const Spinner = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <div style={{
      display: 'inline-block', width: 36, height: 36,
      border: '4px solid rgba(99,102,241,0.2)',
      borderTopColor: '#6366f1', borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const ApiError = () => (
  <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
    <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
    <p style={{ fontWeight: 600 }}>Cannot connect to JSON Server</p>
    <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
      Run <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>npm run server</code> in a separate terminal
    </p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats]           = useState(null);
  const [recentEmployees, setRecent] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [s, emps] = await Promise.all([getDashboardStats(), getEmployees()]);
        setStats(s);
        const sorted = [...emps].sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate));
        setRecent(sorted.slice(0, 5));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;
  if (error)   return <ApiError />;
  if (!stats)  return null;

  const attendanceRate = stats.totalEmployees > 0
    ? Math.round((stats.presentToday / stats.totalEmployees) * 100) : 0;

  return (
    <div className="dashboard-container fade-enter-active">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, Admin 👋</h1>
          <p className="text-secondary">Here's what's happening today.</p>
        </div>
      </div>

      {/* ─── Stats ──────────────────────────────────────────────── */}
      <div className="stats-grid">
        <div className="stat-card glass-panel" style={{ cursor: 'pointer' }} onClick={() => navigate('/employees')}>
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Employees</h3>
            <h2>{stats.totalEmployees}</h2>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ cursor: 'pointer' }} onClick={() => navigate('/employees')}>
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Employees</h3>
            <h2>{stats.activeEmployees}</h2>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ cursor: 'pointer' }} onClick={() => navigate('/departments')}>
          <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>
            <Building2 size={24} />
          </div>
          <div className="stat-info">
            <h3>Departments</h3>
            <h2>{stats.totalDepartments}</h2>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ cursor: 'pointer' }} onClick={() => navigate('/payroll')}>
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
            <Banknote size={24} />
          </div>
          <div className="stat-info">
            <h3>Monthly Salary</h3>
            <h2>₹{stats.totalSalary ? stats.totalSalary.toLocaleString('en-IN') : 0}</h2>
          </div>
        </div>
      </div>

      {/* ─── Widgets ─────────────────────────────────────────────── */}
      <div className="widgets-grid">
        <div className="widget-card glass-panel">
          <div className="widget-header">
            <h3>Today's Attendance</h3>
            <TrendingUp size={20} className="text-secondary" />
          </div>
          <div className="attendance-stats">
            <div className="att-stat present">
              <CalendarCheck size={24} />
              <div><p>Present</p><h4>{stats.presentToday}</h4></div>
            </div>
            <div className="att-stat absent">
              <CalendarOff size={24} />
              <div><p>Absent</p><h4>{stats.absentToday}</h4></div>
            </div>
          </div>
          <div className="attendance-rate">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${attendanceRate}%` }} />
            </div>
            <p>Attendance Rate: <strong>{attendanceRate}%</strong></p>
          </div>
        </div>

        <div className="widget-card glass-panel">
          <div className="widget-header">
            <h3>Company Notices</h3>
            <Pin size={20} className="text-secondary" />
          </div>
          <ul className="notices-list">
            {[
              ['HR Meeting', 'Monday, 10:00 AM'],
              ['Payroll Release', 'July 30'],
              ['Leave Policy Updated', 'Check email for details'],
              ['New Recruitment Drive', 'Starting Next Week'],
            ].map(([title, sub]) => (
              <li key={title}>
                <span className="notice-icon">📌</span>
                <div><h4>{title}</h4><p>{sub}</p></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="widget-card glass-panel">
          <div className="widget-header">
            <h3>Upcoming Events</h3>
            <CalendarCheck size={20} className="text-secondary" />
          </div>
          <ul className="events-list">
            {[
              ['🎉', 'Team Meeting', 'All Hands'],
              ['🎯', 'Training Program', 'Skill Development'],
              ['🏆', 'Employee of the Month', 'Announcement'],
              ['🍰', 'Birthday Celebrations', 'Friday Evening'],
            ].map(([icon, title, sub]) => (
              <li key={title}>
                <span className="event-icon">{icon}</span>
                <div><h4>{title}</h4><p>{sub}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── Recent Employees ─────────────────────────────────────── */}
      <div className="recent-employees glass-panel">
        <div className="widget-header">
          <h3>Recent Employees</h3>
        </div>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEmployees.map(emp => (
                <tr key={emp.id}>
                  <td className="font-medium">{emp.employeeId}</td>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>
                    <span className={`badge badge-${emp.status.toLowerCase().replace(' ', '-')}`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
