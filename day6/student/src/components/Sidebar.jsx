import {
  FaHome,
  FaUserGraduate,
  FaBook,
  FaChalkboardTeacher,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaUniversity,
  FaCalendarCheck
} from "react-icons/fa";

function Sidebar({ activePage, setActivePage, onLogout, isOpen, onClose, collegeName }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "students", label: "Students", icon: <FaUserGraduate /> },
    { id: "courses", label: "Courses", icon: <FaBook /> },
    { id: "faculty", label: "Faculty", icon: <FaChalkboardTeacher /> },
    { id: "attendance", label: "Attendance", icon: <FaCalendarCheck /> },
    { id: "reports", label: "Reports", icon: <FaChartBar /> },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon" style={{ color: 'var(--accent-blue)' }}>
            <FaUniversity />
          </div>
          <div className="logo-text">
            <h2>{collegeName.split(' ').slice(0, 2).join(' ')}</h2>
            <span>ERP System</span>
          </div>
        </div>

        <div className="sidebar-section-label">Main Menu</div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  className={activePage === item.id ? "active" : ""}
                  onClick={() => {
                    setActivePage(item.id);
                    onClose();
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-section-label">Preferences</div>
        <nav className="sidebar-nav" style={{ flex: 'none', padding: '0 0 16px 0' }}>
          <ul>
            <li>
              <a
                className={activePage === "settings" ? "active" : ""}
                onClick={() => {
                  setActivePage("settings");
                  onClose();
                }}
              >
                <span className="nav-icon"><FaCog /></span>
                Settings
              </a>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <a onClick={onLogout}>
            <span className="nav-icon"><FaSignOutAlt /></span>
            Logout
          </a>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;