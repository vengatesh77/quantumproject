import { FaMoon, FaSun, FaBars, FaBell, FaCog, FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";

function Navbar({ darkMode, setDarkMode, onToggleSidebar, profileName }) {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };
    updateTime();
    // No need for interval if we only show date, but if time was needed we'd set an interval
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="hamburger-btn" onClick={onToggleSidebar}>
          <FaBars />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>Welcome, {profileName} 👋</h2>
          <span style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>{currentDate}</span>
        </div>
      </div>
      <div className="navbar-right">
        <button className="theme-btn" title="Notifications" style={{ fontSize: '16px' }}>
          <FaBell />
        </button>
        <button className="theme-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button className="theme-btn" title="Settings" style={{ fontSize: '16px' }}>
          <FaCog />
        </button>
        <button className="theme-btn" title="Profile" style={{ fontSize: '20px' }}>
          <FaUserCircle />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;