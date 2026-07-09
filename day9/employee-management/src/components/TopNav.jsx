import React from 'react';
import { Search, Bell, Moon, Sun, ChevronDown } from 'lucide-react';
import { getSettings } from '../services/localStorageService';
import './TopNav.css';

const TopNav = () => {
  const settings = getSettings();
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="top-navbar">
      <div className="topnav-left">
        <div className="welcome-text">
          <h3>Welcome, {settings.adminName.split(' ')[0]}</h3>
          <span className="current-date">{date}</span>
        </div>
      </div>

      <div className="topnav-center">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search anything..." className="search-input" />
        </div>
      </div>

      <div className="topnav-right">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <button className="icon-btn">
          <Moon size={20} />
        </button>
        
        <div className="profile-dropdown">
          <img src="https://ui-avatars.com/api/?name=Admin&background=3B82F6&color=fff" alt="Admin" className="profile-img" />
          <div className="profile-info">
            <span className="profile-name">{settings.adminName}</span>
            <span className="profile-role">Super Admin</span>
          </div>
          <ChevronDown size={16} className="dropdown-icon" />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
