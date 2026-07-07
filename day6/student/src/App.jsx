import { useState, useEffect, useCallback } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import StudentProfile from "./components/StudentProfile";
import ConfirmModal from "./components/ConfirmModal";
import LoadingSpinner from "./components/LoadingSpinner";
import Courses from "./components/Courses";
import Faculty from "./components/Faculty";
import Settings from "./components/Settings";
import Reports from "./components/Reports";
import Attendance from "./components/Attendance";
import Toast from "./components/Toast";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Global Settings State
  const [collegeName, setCollegeName] = useState(() => localStorage.getItem("collegeName") || "Hindusthan Institute of Technology");
  const [profileName, setProfileName] = useState(() => localStorage.getItem("profileName") || "Vengatesh");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("collegeName", collegeName);
  }, [collegeName]);

  useEffect(() => {
    localStorage.setItem("profileName", profileName);
  }, [profileName]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ id: Date.now(), message, type });
  }, []);
  
  const [students, setStudents] = useState(() => {
    // Force refresh student data to v2 (17 students)
    const dataVersion = localStorage.getItem("studentDataVersion");
    if (dataVersion !== "v2") {
      localStorage.removeItem("students");
      localStorage.setItem("studentDataVersion", "v2");
    }
    const data = localStorage.getItem("students");
    return data
      ? JSON.parse(data)
      : [
          {
            id: 1, studentId: "STU2026001", name: "Rahul", age: 20, course: "B.Tech", department: "CSE", semester: "3", gender: "Male", dob: "2006-05-14", admissionDate: "2024-08-01", email: "rahul@gmail.com", phone: "9876543210", address: "123 Main St, Coimbatore", photo: "", attendancePercent: 95
          },
          {
            id: 2, studentId: "STU2026002", name: "Priya", age: 21, course: "BCA", department: "IT", semester: "5", gender: "Female", dob: "2005-02-10", admissionDate: "2023-08-01", email: "priya@gmail.com", phone: "9123456780", address: "456 Park Ave, Chennai", photo: "", attendancePercent: 93
          },
          {
            id: 3, studentId: "STU2026003", name: "Karthik", age: 20, course: "B.Tech", department: "ECE", semester: "3", gender: "Male", dob: "2006-03-22", admissionDate: "2024-08-01", email: "karthik@gmail.com", phone: "9988776655", address: "78 Gandhi Nagar, Madurai", photo: "", attendancePercent: 91
          },
          {
            id: 4, studentId: "STU2026004", name: "Sneha", age: 19, course: "B.Sc", department: "CSE", semester: "1", gender: "Female", dob: "2007-07-18", admissionDate: "2026-06-15", email: "sneha@gmail.com", phone: "9871234567", address: "12 Lake Road, Trichy", photo: "", attendancePercent: 90
          },
          {
            id: 5, studentId: "STU2026005", name: "Arjun", age: 22, course: "MCA", department: "IT", semester: "3", gender: "Male", dob: "2004-11-05", admissionDate: "2025-08-01", email: "arjun@gmail.com", phone: "9765432180", address: "34 Temple St, Salem", photo: "", attendancePercent: 67
          },
          {
            id: 6, studentId: "STU2026006", name: "Kavitha", age: 20, course: "B.Tech", department: "MECH", semester: "5", gender: "Female", dob: "2006-01-30", admissionDate: "2024-08-01", email: "kavitha@gmail.com", phone: "9654321098", address: "56 Anna Nagar, Erode", photo: "", attendancePercent: 82
          },
          {
            id: 7, studentId: "STU2026007", name: "Deepak", age: 21, course: "BE", department: "CIVIL", semester: "7", gender: "Male", dob: "2005-09-12", admissionDate: "2023-08-01", email: "deepak@gmail.com", phone: "9543210987", address: "89 MG Road, Coimbatore", photo: "", attendancePercent: 74
          },
          {
            id: 8, studentId: "STU2026008", name: "Anjali", age: 19, course: "BCA", department: "IT", semester: "1", gender: "Female", dob: "2007-04-25", admissionDate: "2026-06-15", email: "anjali@gmail.com", phone: "9432109876", address: "23 Nehru St, Tirupur", photo: "", attendancePercent: 88
          },
          {
            id: 9, studentId: "STU2026009", name: "Vikram", age: 22, course: "MBA", department: "CSE", semester: "3", gender: "Male", dob: "2004-08-08", admissionDate: "2025-08-01", email: "vikram@gmail.com", phone: "9321098765", address: "45 Brigade Rd, Bangalore", photo: "", attendancePercent: 79
          },
          {
            id: 10, studentId: "STU2026010", name: "Divya", age: 20, course: "B.Tech", department: "ECE", semester: "5", gender: "Female", dob: "2006-06-14", admissionDate: "2024-08-01", email: "divya@gmail.com", phone: "9210987654", address: "67 Beach Rd, Pondicherry", photo: "", attendancePercent: 96
          },
          {
            id: 11, studentId: "STU2026011", name: "Surya", age: 21, course: "B.Tech", department: "CSE", semester: "7", gender: "Male", dob: "2005-12-01", admissionDate: "2023-08-01", email: "surya@gmail.com", phone: "9109876543", address: "90 EVR Rd, Chennai", photo: "", attendancePercent: 85
          },
          {
            id: 12, studentId: "STU2026012", name: "Meena", age: 20, course: "B.Com", department: "IT", semester: "3", gender: "Female", dob: "2006-10-20", admissionDate: "2024-08-01", email: "meena@gmail.com", phone: "9012345678", address: "11 Kamaraj St, Dindigul", photo: "", attendancePercent: 71
          },
          {
            id: 13, studentId: "STU2026013", name: "Ravi", age: 19, course: "B.Tech", department: "EEE", semester: "1", gender: "Male", dob: "2007-02-14", admissionDate: "2026-06-15", email: "ravi@gmail.com", phone: "8901234567", address: "33 Patel Nagar, Vellore", photo: "", attendancePercent: 100
          },
          {
            id: 14, studentId: "STU2026014", name: "Lakshmi", age: 22, course: "ME", department: "MECH", semester: "3", gender: "Female", dob: "2004-05-28", admissionDate: "2025-08-01", email: "lakshmi@gmail.com", phone: "8890123456", address: "55 RK Salai, Thanjavur", photo: "", attendancePercent: 58
          },
          {
            id: 15, studentId: "STU2026015", name: "Arun", age: 20, course: "BCA", department: "IT", semester: "3", gender: "Male", dob: "2006-07-07", admissionDate: "2024-08-01", email: "arun@gmail.com", phone: "8789012345", address: "77 Mount Rd, Nagercoil", photo: "", attendancePercent: 83
          },
          {
            id: 16, studentId: "STU2026016", name: "Sowmiya", age: 21, course: "B.Tech", department: "CSE", semester: "5", gender: "Female", dob: "2005-03-16", admissionDate: "2024-08-01", email: "sowmiya@gmail.com", phone: "8678901234", address: "44 Race Course, Coimbatore", photo: "", attendancePercent: 89
          },
          {
            id: 17, studentId: "STU2026017", name: "Ganesh", age: 20, course: "B.Tech", department: "CIVIL", semester: "3", gender: "Male", dob: "2006-09-09", admissionDate: "2024-08-01", email: "ganesh@gmail.com", phone: "8567890123", address: "22 Teppakulam, Madurai", photo: "", attendancePercent: 76
          },
        ];
  });

  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  
  // Filter state
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Persist students
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  // Check login state and simulate loading
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (loggedIn) {
      setIsLoggedIn(true);
    }
    
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("isLoggedIn");
  };

  const generateSequentialId = () => {
    // Generate sequential ID based on total created students count stored in local storage
    let counter = parseInt(localStorage.getItem("studentCounter") || "2", 10);
    counter += 1;
    localStorage.setItem("studentCounter", counter.toString());
    const year = new Date().getFullYear();
    const paddedCounter = counter.toString().padStart(3, '0');
    return `STU${year}${paddedCounter}`;
  };

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
      showToast("Student Updated Successfully");
    } else {
      setStudents([
        {
          ...student,
          id: Date.now(),
          studentId: generateSequentialId(),
          attendancePercent: 100 // new students start with 100%
        },
        ...students,
      ]);
      showToast("Student Added Successfully");
    }
    setActivePage("students");
  };

  const deleteStudent = () => {
    if (deletingStudent) {
      setStudents(students.filter((student) => student.id !== deletingStudent.id));
      setDeletingStudent(null);
      showToast("Student Deleted Successfully", "error");
    }
  };

  const editStudent = (student) => {
    setEditingStudent(student);
    setActivePage("add-student");
  };

  const viewStudent = (student) => {
    setViewingStudent(student);
  };

  const updateStudentAttendance = (studentId, status) => {
    setStudents(students.map(s => {
      if (s.id === studentId) {
        // Mock attendance calculation
        let percent = s.attendancePercent || 75;
        if (status === 'present' && percent < 100) percent += 2;
        if (status === 'absent' && percent > 0) percent -= 2;
        return { ...s, attendancePercent: percent };
      }
      return s;
    }));
    showToast(`Attendance marked ${status}`, "success");
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = (
      (student.name && student.name.toLowerCase().includes(search.toLowerCase())) ||
      (student.studentId && student.studentId.toLowerCase().includes(search.toLowerCase())) ||
      (student.course && student.course.toLowerCase().includes(search.toLowerCase())) ||
      (student.phone && student.phone.toLowerCase().includes(search.toLowerCase())) ||
      (student.email && student.email.toLowerCase().includes(search.toLowerCase()))
    );
    const matchesCourse = courseFilter === "All" || student.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} collegeName={collegeName} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app-layout">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        collegeName={collegeName}
      />

      <div className="main-content">
        <Navbar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          profileName={profileName}
        />

        {activePage === "dashboard" && (
          <Dashboard students={students} />
        )}

        {activePage === "students" && (
          <StudentTable
            students={filteredStudents}
            deleteStudent={deleteStudent}
            editStudent={editStudent}
            viewStudent={viewStudent}
            search={search}
            setSearch={setSearch}
            onDeleteConfirm={setDeletingStudent}
            courseFilter={courseFilter}
            setCourseFilter={setCourseFilter}
          />
        )}

        {activePage === "courses" && <Courses />}
        
        {activePage === "faculty" && <Faculty />}
        
        {activePage === "reports" && <Reports />}
        
        {activePage === "settings" && (
          <Settings 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            collegeName={collegeName}
            setCollegeName={setCollegeName}
            profileName={profileName}
            setProfileName={setProfileName}
            showToast={showToast}
          />
        )}

        {activePage === "attendance" && (
          <Attendance 
            students={students} 
            updateStudentAttendance={updateStudentAttendance} 
          />
        )}

        {activePage === "add-student" && (
          <StudentForm
            addStudent={addStudent}
            editingStudent={editingStudent}
          />
        )}

        <Footer />
      </div>

      {/* Modals */}
      {viewingStudent && (
        <StudentProfile 
          student={viewingStudent} 
          onClose={() => setViewingStudent(null)} 
          collegeName={collegeName}
        />
      )}

      {deletingStudent && (
        <ConfirmModal
          message={`Are you sure you want to delete ${deletingStudent.name}? This action cannot be undone.`}
          onConfirm={deleteStudent}
          onCancel={() => setDeletingStudent(null)}
        />
      )}

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toast && (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </div>
    </div>
  );
}

export default App;