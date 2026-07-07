import { FaChalkboardTeacher, FaEnvelope, FaPhone } from "react-icons/fa";

function Faculty() {
  const facultyList = [
    { id: 1, name: "Dr. A. Sharma", dept: "CSE", designation: "HOD", email: "asharma@abc.edu" },
    { id: 2, name: "Prof. B. Kumar", dept: "ECE", designation: "Senior Professor", email: "bkumar@abc.edu" },
    { id: 3, name: "Dr. M. Singh", dept: "MECH", designation: "Associate Professor", email: "msingh@abc.edu" },
    { id: 4, name: "Prof. R. Patel", dept: "CIVIL", designation: "Assistant Professor", email: "rpatel@abc.edu" },
    { id: 5, name: "Dr. S. Gupta", dept: "IT", designation: "HOD", email: "sgupta@abc.edu" },
  ];

  return (
    <div className="table-section fade-in">
      <div className="table-header">
        <h3><FaChalkboardTeacher /> Faculty Directory</h3>
      </div>
      
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {facultyList.map(faculty => (
              <tr key={faculty.id}>
                <td>
                  <img
                    className="student-photo-cell"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}&background=8b5cf6&color=fff&size=100`}
                    alt={faculty.name}
                  />
                </td>
                <td><strong>{faculty.name}</strong></td>
                <td>
                  <span className="student-id-badge" style={{ color: 'var(--accent-purple)', background: 'rgba(139, 92, 246, 0.1)' }}>
                    {faculty.dept}
                  </span>
                </td>
                <td>{faculty.designation}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaEnvelope style={{color: 'var(--text-muted)'}}/> {faculty.email}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Faculty;
