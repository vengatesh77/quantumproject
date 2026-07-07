import { FaCheckCircle, FaTimesCircle, FaCalendarCheck } from "react-icons/fa";

function Attendance({ students, updateStudentAttendance }) {
  const markAttendance = (studentId, status) => {
    updateStudentAttendance(studentId, status);
  };

  return (
    <div className="table-section fade-in">
      <div className="table-header">
        <h3><FaCalendarCheck /> Attendance Management</h3>
      </div>
      
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>Course</th>
              <th>Overall Attendance</th>
              <th>Mark Today</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              // Default to 75% if no attendance history exists
              const attendancePercent = student.attendancePercent ?? 75;
              
              return (
                <tr key={student.id}>
                  <td>
                    <img
                      className="student-photo-cell"
                      src={student.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=3b82f6&color=fff&size=40`}
                      alt={student.name}
                    />
                  </td>
                  <td><span className="student-id-badge">{student.studentId}</span></td>
                  <td><strong>{student.name}</strong></td>
                  <td>{student.course}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        flex: 1, 
                        height: '8px', 
                        background: 'var(--bg-input)', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${attendancePercent}%`, 
                          background: attendancePercent < 60 ? 'var(--accent-red)' : attendancePercent < 75 ? 'var(--accent-orange)' : 'var(--accent-green)'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{attendancePercent}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit-btn" 
                        title="Mark Present"
                        onClick={() => markAttendance(student.id, 'present')}
                      >
                        <FaCheckCircle />
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title="Mark Absent"
                        onClick={() => markAttendance(student.id, 'absent')}
                      >
                        <FaTimesCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;
