import { useState, useEffect } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";

function App() {
  const [students, setStudents] = useState(() => {
    const data = localStorage.getItem("students");
    return data
      ? JSON.parse(data)
      : [
          {
            id: 1,
            name: "Rahul",
            age: 20,
            course: "B.Tech",
            email: "rahul@gmail.com",
            phone: "9876543210",
          },
          {
            id: 2,
            name: "Priya",
            age: 21,
            course: "BCA",
            email: "priya@gmail.com",
            phone: "9123456780",
          },
        ];
  });

  const [editingStudent, setEditingStudent] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const addStudent = (student) => {
    if (editingStudent) {
      setStudents(
        students.map((s) =>
          s.id === editingStudent.id
            ? { ...student, id: editingStudent.id }
            : s
        )
      );
      setEditingStudent(null);
    } else {
      setStudents([
        ...students,
        {
          ...student,
          id: Date.now(),
        },
      ]);
    }
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const editStudent = (student) => {
    setEditingStudent(student);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <Navbar />

      <Dashboard
        totalStudents={students.length}
        totalCourses={
          [...new Set(students.map((s) => s.course))].length
        }
        newAdmissions={students.length}
      />

      <StudentForm
        addStudent={addStudent}
        editingStudent={editingStudent}
      />

      <StudentTable
        students={filteredStudents}
        deleteStudent={deleteStudent}
        editStudent={editStudent}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}

export default App;