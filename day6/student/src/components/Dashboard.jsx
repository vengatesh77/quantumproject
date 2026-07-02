import { FaUsers, FaBook, FaUserPlus } from "react-icons/fa";

function Dashboard({
  totalStudents,
  totalCourses,
  newAdmissions,
}) {
  return (
    <div className="dashboard">

      <div className="card">
        <FaUsers className="icon" />
        <h3>Total Students</h3>
        <h2>{totalStudents}</h2>
      </div>

      <div className="card">
        <FaBook className="icon" />
        <h3>Courses</h3>
        <h2>{totalCourses}</h2>
      </div>

      <div className="card">
        <FaUserPlus className="icon" />
        <h3>Admissions</h3>
        <h2>{newAdmissions}</h2>
      </div>

    </div>
  );
}

export default Dashboard;