import { useEffect, useState } from "react";

function StudentForm({
  addStudent,
  editingStudent,
}) {

  const [student, setStudent] = useState({
    name: "",
    age: "",
    course: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (editingStudent) {
      setStudent(editingStudent);
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addStudent(student);

    setStudent({
      name: "",
      age: "",
      course: "",
      email: "",
      phone: "",
    });
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>

      <input
        type="text"
        name="name"
        placeholder="Student Name"
        value={student.name}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="age"
        placeholder="Age"
        value={student.age}
        onChange={handleChange}
        required
      />

      <select
        name="course"
        value={student.course}
        onChange={handleChange}
        required
      >
        <option value="">Select Course</option>
        <option>B.Tech</option>
        <option>BCA</option>
        <option>B.Sc</option>
        <option>B.Com</option>
        <option>MCA</option>
      </select>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={student.email}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={student.phone}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {editingStudent ? "Update Student" : "Add Student"}
      </button>

    </form>
  );
}

export default StudentForm;