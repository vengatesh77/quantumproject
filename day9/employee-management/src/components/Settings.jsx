import React, { useState, useEffect } from 'react';
import { User, Lock, Moon, Sun, Globe, Save, Eye, EyeOff } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [theme, setTheme] = useState(localStorage.getItem('ems_theme') || 'dark');
  const [adminProfile, setAdminProfile] = useState({
    name: localStorage.getItem('ems_admin_name') || 'Admin User',
    email: localStorage.getItem('ems_admin_email') || 'admin@company.com',
    phone: localStorage.getItem('ems_admin_phone') || '+1 234 567 8900',
    role: 'Super Administrator'
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPwd, setShowPwd] = useState({ current: false, newPass: false, confirm: false });
  const [profileMsg, setProfileMsg] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ems_theme', theme);
  }, [theme]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    localStorage.setItem('ems_admin_name', adminProfile.name);
    localStorage.setItem('ems_admin_email', adminProfile.email);
    localStorage.setItem('ems_admin_phone', adminProfile.phone);
    setProfileMsg('Profile updated successfully!');
    setTimeout(() => setProfileMsg(''), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      setPwdMsg('error:Passwords do not match.');
    } else if (passwords.newPass.length < 6) {
      setPwdMsg('error:Password must be at least 6 characters.');
    } else {
      setPwdMsg('success:Password changed successfully!');
      setPasswords({ current: '', newPass: '', confirm: '' });
    }
    setTimeout(() => setPwdMsg(''), 3000);
  };

  const togglePwdVisibility = (field) => {
    setShowPwd(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="settings-container fade-enter-active">
      <div className="settings-header">
        <h1>Settings</h1>
        <p className="text-secondary">Manage your account preferences and application settings.</p>
      </div>

      <div className="settings-grid">
        {/* Admin Profile */}
        <div className="settings-card glass-panel">
          <div className="settings-card-header">
            <User size={20} className="settings-icon" />
            <h3>Admin Profile</h3>
          </div>
          <form onSubmit={handleProfileSave} className="settings-form">
            <div className="form-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="input-field"
                value={adminProfile.name}
                onChange={e => setAdminProfile({ ...adminProfile, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                value={adminProfile.email}
                onChange={e => setAdminProfile({ ...adminProfile, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="input-label">Phone</label>
              <input
                type="tel"
                className="input-field"
                value={adminProfile.phone}
                onChange={e => setAdminProfile({ ...adminProfile, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="input-label">Role</label>
              <input type="text" className="input-field" value={adminProfile.role} disabled />
            </div>
            {profileMsg && <div className="success-msg">{profileMsg}</div>}
            <button type="submit" className="btn-primary">
              <Save size={16} /> Save Profile
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="settings-card glass-panel">
          <div className="settings-card-header">
            <Lock size={20} className="settings-icon" />
            <h3>Change Password</h3>
          </div>
          <form onSubmit={handlePasswordChange} className="settings-form">
            {['current', 'newPass', 'confirm'].map((field, i) => (
              <div className="form-group" key={field}>
                <label className="input-label">
                  {field === 'current' ? 'Current Password' : field === 'newPass' ? 'New Password' : 'Confirm New Password'}
                </label>
                <div className="pwd-input-wrap">
                  <input
                    type={showPwd[field] ? 'text' : 'password'}
                    className="input-field"
                    value={passwords[field]}
                    onChange={e => setPasswords({ ...passwords, [field]: e.target.value })}
                    required
                  />
                  <button type="button" className="pwd-toggle" onClick={() => togglePwdVisibility(field)}>
                    {showPwd[field] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}
            {pwdMsg && (
              <div className={pwdMsg.startsWith('error:') ? 'error-msg' : 'success-msg'}>
                {pwdMsg.replace(/^(error|success):/, '')}
              </div>
            )}
            <button type="submit" className="btn-primary">
              <Lock size={16} /> Update Password
            </button>
          </form>
        </div>

        {/* Theme Selection */}
        <div className="settings-card glass-panel">
          <div className="settings-card-header">
            <Moon size={20} className="settings-icon" />
            <h3>Theme Selection</h3>
          </div>
          <div className="theme-options">
            <button
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <Moon size={20} />
              <span>Dark Mode</span>
            </button>
            <button
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <Sun size={20} />
              <span>Light Mode</span>
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="settings-card glass-panel">
          <div className="settings-card-header">
            <Globe size={20} className="settings-icon" />
            <h3>Language</h3>
          </div>
          <div className="form-group">
            <label className="input-label">Select Language</label>
            <select className="input-field" defaultValue="en">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <p className="text-secondary text-sm" style={{ marginTop: '1rem' }}>
            Language support coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
