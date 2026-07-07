import { FaBook, FaLaptopCode, FaMicrochip, FaCogs, FaHardHat, FaNetworkWired } from "react-icons/fa";

function Courses() {
  const coursesList = [
    { id: 1, name: "B.Tech Computer Science", dept: "CSE", duration: "4 Years", icon: <FaLaptopCode /> },
    { id: 2, name: "B.Tech Electronics", dept: "ECE", duration: "4 Years", icon: <FaMicrochip /> },
    { id: 3, name: "B.Tech Mechanical", dept: "MECH", duration: "4 Years", icon: <FaCogs /> },
    { id: 4, name: "B.Tech Civil", dept: "CIVIL", duration: "4 Years", icon: <FaHardHat /> },
    { id: 5, name: "BCA / MCA", dept: "IT", duration: "3/2 Years", icon: <FaNetworkWired /> },
  ];

  return (
    <div className="fade-in">
      <div className="table-header" style={{ marginBottom: '24px' }}>
        <h3><FaBook /> Offered Courses</h3>
      </div>
      
      <div className="dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {coursesList.map(course => (
          <div key={course.id} className="card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
            <div className="card-icon" style={{ background: 'var(--bg-input)', color: 'var(--accent-blue)' }}>
              {course.icon}
            </div>
            <div className="card-info" style={{ textAlign: 'left' }}>
              <h3 style={{ color: 'var(--accent-blue)', marginBottom: '4px' }}>{course.dept}</h3>
              <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>{course.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Duration: {course.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
