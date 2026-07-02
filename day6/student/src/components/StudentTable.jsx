import { FaEdit, FaTrash } from "react-icons/fa";

function StudentTable({
  students,
  deleteStudent,
  editStudent,
  search,
  setSearch,
}) {

  return (
    <div className="table-container">

      <input
        className="search-box"
        type="text"
        placeholder="Search Student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>

        <thead>

          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Age</th>
            <th>Course</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {students.map((student) => (

            <tr key={student.id}>

              <td>
                <img
                  src={`https://ui-avatars.com/api/?name=${student.name}&background=2563eb&color=fff`}
                  alt={student.name}
                />
              </td>

              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.course}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>

              <td>

                <button
                  className="edit-btn"
                  onClick={() => editStudent(student)}
                >
                  <FaEdit />
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteStudent(student.id)}
                >
                  <FaTrash />
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default StudentTable;