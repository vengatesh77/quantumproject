import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, Briefcase,
  CalendarCheck, Banknote, BarChart3, Settings,
  LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/employees', icon: Users, label: 'Employees' },
  { path: '/departments', icon: Building2, label: 'Departments' },
  { path: '/designations', icon: Briefcase, label: 'Designations' },
  { path: '/attendance', icon: CalendarCheck, label: 'Attendance' },
  { path: '/payroll', icon: Banknote, label: 'Payroll' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    }
  };

  const SidebarContent = () => (
    <div className="sidebar-inner">
      {/* Header */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <span>HR</span>
        </div>
        <div className="sidebar-logo-text">
          <h2>Quantum India</h2>
          <p>Management System</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">MAIN MENU</p>
        {navItems.slice(0, 2).map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={18} />
            <span>{label}</span>
            <ChevronRight size={14} className="sidebar-arrow" />
          </NavLink>
        ))}

        <p className="sidebar-section-label" style={{ marginTop: '1rem' }}>MANAGEMENT</p>
        {navItems.slice(2, 6).map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={18} />
            <span>{label}</span>
            <ChevronRight size={14} className="sidebar-arrow" />
          </NavLink>
        ))}

        <p className="sidebar-section-label" style={{ marginTop: '1rem' }}>OTHERS</p>
        {navItems.slice(6).map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={18} />
            <span>{label}</span>
            <ChevronRight size={14} className="sidebar-arrow" />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="sidebar-link logout-link" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Toggle */}
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
        <Menu size={20} />
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
          <aside className="sidebar mobile-sidebar">
            <button className="mobile-close-btn" onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
