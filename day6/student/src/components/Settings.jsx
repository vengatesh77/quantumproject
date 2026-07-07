import { FaCog, FaMoon, FaSun, FaSave, FaImage } from "react-icons/fa";
import { useState } from "react";

function Settings({ darkMode, setDarkMode, collegeName, setCollegeName, profileName, setProfileName, showToast }) {
  const [localCollegeName, setLocalCollegeName] = useState(collegeName);
  const [localProfileName, setLocalProfileName] = useState(profileName);

  const handleSave = () => {
    setCollegeName(localCollegeName);
    setProfileName(localProfileName);
    showToast("Settings saved successfully", "success");
  };

  return (
    <div className="form-section fade-in">
      <h3><FaCog className="form-icon" style={{color: 'var(--text-secondary)'}}/> System Settings</h3>
      
      <div className="student-form" style={{ maxWidth: '600px' }}>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>College Name</label>
          <input 
            type="text" 
            value={localCollegeName} 
            onChange={(e) => setLocalCollegeName(e.target.value)} 
          />
        </div>
        
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Admin Profile Name</label>
          <input 
            type="text" 
            value={localProfileName} 
            onChange={(e) => setLocalProfileName(e.target.value)} 
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Upload College Logo</label>
          <div className="photo-upload-box" style={{ minHeight: '80px' }}>
            <input type="file" accept="image/*" />
            <div className="upload-placeholder">
              <FaImage className="upload-icon" style={{ fontSize: '20px' }} />
              <span>Click to upload logo (PNG/JPG)</span>
            </div>
          </div>
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '16px', padding: '16px', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <label style={{ marginBottom: '12px', display: 'block' }}>Appearance</label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>Dark Mode</p>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Switch between light and dark themes</p>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setDarkMode(!darkMode);
                showToast(darkMode ? "Switched to Light Mode" : "Switched to Dark Mode");
              }}
            >
              {darkMode ? <><FaSun /> Light Mode</> : <><FaMoon /> Dark Mode</>}
            </button>
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: '16px' }}>
          <button className="btn btn-primary" onClick={handleSave}>
            <FaSave /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
