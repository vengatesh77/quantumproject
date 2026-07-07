import { FaUsers, FaBook, FaUserPlus, FaChalkboardTeacher, FaGraduationCap, FaTrophy, FaMoneyBillWave, FaBullhorn, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaUserFriends } from "react-icons/fa";

function Dashboard({ students }) {
  const totalStudents = students.length;
  const courses = [...new Set(students.map((s) => s.course))];
  const totalCourses = courses.length;
  const newAdmissions = students.length;
  const departments = [...new Set(students.map((s) => s.department).filter(Boolean))];
  const totalFaculty = Math.max(departments.length * 3, 5);
  const totalPlacements = Math.floor(totalStudents * 0.85);
  const totalAchievements = 24;
  const feesCollected = "₹" + (totalStudents * 1.5).toFixed(2) + "M";

  return (
    <div className="fade-in">
      {/* Statistics Cards */}
      <div className="dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="card card-blue">
          <div className="card-icon icon-blue"><FaUsers /></div>
          <div className="card-info">
            <h3>Total Students</h3>
            <h2>{totalStudents}</h2>
          </div>
        </div>

        <div className="card card-purple">
          <div className="card-icon icon-purple"><FaChalkboardTeacher /></div>
          <div className="card-info">
            <h3>Faculty</h3>
            <h2>{totalFaculty}</h2>
          </div>
        </div>

        <div className="card card-green">
          <div className="card-icon icon-green"><FaBook /></div>
          <div className="card-info">
            <h3>Courses</h3>
            <h2>{totalCourses}</h2>
          </div>
        </div>

        <div className="card card-orange">
          <div className="card-icon icon-orange"><FaGraduationCap /></div>
          <div className="card-info">
            <h3>Placements</h3>
            <h2>{totalPlacements}</h2>
          </div>
        </div>

        <div className="card card-blue" style={{ '--accent-blue': '#14b8a6' }}>
          <div className="card-icon" style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}><FaTrophy /></div>
          <div className="card-info">
            <h3>Achievements</h3>
            <h2>{totalAchievements}</h2>
          </div>
        </div>

        <div className="card card-green" style={{ '--accent-green': '#84cc16' }}>
          <div className="card-icon" style={{ background: 'linear-gradient(135deg, #84cc16, #65a30d)' }}><FaMoneyBillWave /></div>
          <div className="card-info">
            <h3>Fees Collected</h3>
            <h2>{feesCollected}</h2>
          </div>
        </div>
      </div>

      {/* 3 Modern Dashboard Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '28px' }}>
        
        {/* CARD 1: Today's Attendance */}
        <div className="chart-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <h3><FaUserFriends className="chart-icon" style={{ color: 'var(--accent-blue)' }} /> Today's Attendance</h3>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaCheckCircle style={{ color: 'var(--accent-green)', fontSize: '24px' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Present</p>
                  <h2 style={{ margin: 0, fontSize: '28px', color: 'var(--text-primary)', fontWeight: 800 }}>185</h2>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaTimesCircle style={{ color: 'var(--accent-red)', fontSize: '24px' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Absent</p>
                  <h2 style={{ margin: 0, fontSize: '28px', color: 'var(--text-primary)', fontWeight: 800 }}>15</h2>
                </div>
              </div>
            </div>

            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              background: 'rgba(59, 130, 246, 0.1)', 
              border: '8px solid var(--accent-blue)', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)'
            }}>
              <span style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Rate</span>
              <span style={{ fontSize: '28px', color: 'var(--accent-blue)', fontWeight: 800, lineHeight: 1 }}>92%</span>
            </div>
          </div>
        </div>

        {/* CARD 2: College Notices */}
        <div className="chart-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3><FaBullhorn className="chart-icon" style={{ color: 'var(--accent-red)' }} /> College Notices</h3>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <li style={{ padding: '12px 16px', background: 'var(--bg-input)', borderRadius: '10px', borderLeft: '4px solid var(--accent-red)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>📌</span> <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Semester Exam starts on Aug 10</span>
            </li>
            <li style={{ padding: '12px 16px', background: 'var(--bg-input)', borderRadius: '10px', borderLeft: '4px solid var(--accent-orange)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>📌</span> <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Last date for Fee Payment: Aug 5</span>
            </li>
            <li style={{ padding: '12px 16px', background: 'var(--bg-input)', borderRadius: '10px', borderLeft: '4px solid var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>📌</span> <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Placement Drive - TCS</span>
            </li>
            <li style={{ padding: '12px 16px', background: 'var(--bg-input)', borderRadius: '10px', borderLeft: '4px solid var(--accent-green)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>📌</span> <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Holiday on Independence Day</span>
            </li>
          </ul>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button className="btn btn-primary btn-sm" style={{ borderRadius: '20px', padding: '8px 20px' }}>
              Read More &rarr;
            </button>
          </div>
        </div>

        {/* CARD 3: Upcoming Events */}
        <div className="chart-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3><FaCalendarAlt className="chart-icon" style={{ color: 'var(--accent-purple)' }} /> Upcoming Events</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '20px', flex: 1 }}>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                🎓
              </div>
              <div style={{ flex: 1, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>Placement Drive</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>15 July 2026</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                🏏
              </div>
              <div style={{ flex: 1, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>Sports Meet</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>20 July 2026</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-orange)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                💻
              </div>
              <div style={{ flex: 1, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>Hackathon</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>25 July 2026</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                🎉
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>Freshers Day</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>30 July 2026</p>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button className="btn btn-primary btn-sm" style={{ borderRadius: '20px', padding: '8px 20px' }}>
              View All &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;