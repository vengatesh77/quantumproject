import { FaTimes } from "react-icons/fa";

function StudentProfile({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content profile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="btn btn-secondary btn-icon profile-close" onClick={onClose}>
          <FaTimes />
        </button>

        {/* Header */}
        <div className="profile-header">
          <img
            className="profile-photo"
            src={
              student.photo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1e3c72&color=fff&size=200`
            }
            alt={student.name}
          />
          <div className="profile-header-info">
            <h2>{student.name}</h2>
            <p>{student.studentId || "N/A"} • {student.course} • {student.department || "N/A"}</p>
          </div>
        </div>

        {/* Personal Details */}
        <div className="profile-section">
          <h4>Personal Details</h4>
          <div className="profile-grid">
            <div className="profile-field">
              <span className="field-label">Student ID</span>
              <span className="field-value">{student.studentId || "N/A"}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Age</span>
              <span className="field-value">{student.age || "N/A"}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Gender</span>
              <span className="field-value">{student.gender || "N/A"}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Date of Birth</span>
              <span className="field-value">{student.dob || "N/A"}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Phone</span>
              <span className="field-value">{student.phone || "N/A"}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Email</span>
              <span className="field-value">{student.email || "N/A"}</span>
            </div>
            <div className="profile-field" style={{ gridColumn: "1 / -1" }}>
              <span className="field-label">Address</span>
              <span className="field-value">{student.address || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="profile-section">
          <h4>Academic Details</h4>
          <div className="profile-grid">
            <div className="profile-field">
              <span className="field-label">Course</span>
              <span className="field-value">{student.course || "N/A"}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Department</span>
              <span className="field-value">{student.department || "N/A"}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Semester</span>
              <span className="field-value">{student.semester ? `Semester ${student.semester}` : "N/A"}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Admission Date</span>
              <span className="field-value">{student.admissionDate || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Marks */}
        <div className="profile-section">
          <h4>Marks & Grades</h4>
          <div className="profile-placeholder">
            📊 Marks data will be available once integrated with the examination module.
          </div>
        </div>

        {/* Attendance */}
        <div className="profile-section">
          <h4>Attendance</h4>
          <div className="profile-placeholder">
            📅 Attendance data will be available once integrated with the attendance module.
          </div>
        </div>

        {/* Fees */}
        <div className="profile-section">
          <h4>Fee Details</h4>
          <div className="profile-placeholder">
            💰 Fee details will be available once integrated with the accounts module.
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
