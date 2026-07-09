import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getEmployees } from '../services/localStorageService';
import { 
  Users, 
  UserCheck, 
  Building2, 
  CalendarCheck,
  CalendarOff,
  Banknote,
  TrendingUp,
  Pin
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setStats(getDashboardStats());
    
    // Get 5 most recent
    const employees = getEmployees();
    const sorted = employees.sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate));
    setRecentEmployees(sorted.slice(0, 5));
  }, []);

  if (!stats) return null;
  
  const attendanceRate = stats.totalEmployees > 0 ? Math.round((stats.presentToday / stats.totalEmployees) * 100) : 0;

  return (
    <div className="dashboard-container fade-enter-active">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, Admin 👋</h1>
          <p className="text-secondary">Here's what's happening today.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel" style={{ cursor: 'pointer' }} onClick={() => navigate('/employees')}>
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Employees</h3>
            <h2>{stats.totalEmployees}</h2>
          </div>
        </div>
        
        <div className="stat-card glass-panel" style={{ cursor: 'pointer' }} onClick={() => navigate('/employees')}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Employees</h3>
            <h2>{stats.activeEmployees}</h2>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ cursor: 'pointer' }} onClick={() => navigate('/departments')}>
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
            <Building2 size={24} />
          </div>
          <div className="stat-info">
            <h3>Departments</h3>
            <h2>{stats.totalDepartments}</h2>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ cursor: 'pointer' }} onClick={() => navigate('/payroll')}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
            <Banknote size={24} />
          </div>
          <div className="stat-info">
            <h3>Monthly Salary</h3>
            <h2>₹{stats.totalSalary ? stats.totalSalary.toLocaleString('en-IN') : 0}</h2>
          </div>
        </div>
      </div>

      <div className="widgets-grid">
        {/* Attendance Widget */}
        <div className="widget-card glass-panel">
          <div className="widget-header">
            <h3>Today's Attendance</h3>
            <TrendingUp size={20} className="text-secondary" />
          </div>
          <div className="attendance-stats">
            <div className="att-stat present">
              <CalendarCheck size={24} />
              <div>
                <p>Present</p>
                <h4>{stats.presentToday}</h4>
              </div>
            </div>
            <div className="att-stat absent">
              <CalendarOff size={24} />
              <div>
                <p>Absent</p>
                <h4>{stats.absentToday}</h4>
              </div>
            </div>
          </div>
          <div className="attendance-rate">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${attendanceRate}%` }}
              ></div>
            </div>
            <p>Attendance Rate: <strong>{attendanceRate}%</strong></p>
          </div>
        </div>

        {/* Notices Widget */}
        <div className="widget-card glass-panel">
          <div className="widget-header">
            <h3>Company Notices</h3>
            <Pin size={20} className="text-secondary" />
          </div>
          <ul className="notices-list">
            <li>
              <span className="notice-icon">📌</span>
              <div>
                <h4>HR Meeting</h4>
                <p>Monday, 10:00 AM</p>
              </div>
            </li>
            <li>
              <span className="notice-icon">📌</span>
              <div>
                <h4>Payroll Release</h4>
                <p>July 30</p>
              </div>
            </li>
            <li>
              <span className="notice-icon">📌</span>
              <div>
                <h4>Leave Policy Updated</h4>
                <p>Check email for details</p>
              </div>
            </li>
            <li>
              <span className="notice-icon">📌</span>
              <div>
                <h4>New Recruitment Drive</h4>
                <p>Starting Next Week</p>
              </div>
            </li>
          </ul>
        </div>
        
        {/* Events Widget */}
        <div className="widget-card glass-panel">
          <div className="widget-header">
            <h3>Upcoming Events</h3>
            <CalendarCheck size={20} className="text-secondary" />
          </div>
          <ul className="events-list">
            <li>
              <span className="event-icon">🎉</span>
              <div>
                <h4>Team Meeting</h4>
                <p>All Hands</p>
              </div>
            </li>
            <li>
              <span className="event-icon">🎯</span>
              <div>
                <h4>Training Program</h4>
                <p>Skill Development</p>
              </div>
            </li>
            <li>
              <span className="event-icon">🏆</span>
              <div>
                <h4>Employee of the Month</h4>
                <p>Announcement</p>
              </div>
            </li>
            <li>
              <span className="event-icon">🍰</span>
              <div>
                <h4>Birthday Celebrations</h4>
                <p>Friday Evening</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

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
                  <td className="font-medium">{emp.id}</td>
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
