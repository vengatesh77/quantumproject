import { useState } from "react";
import { FaEdit, FaTrash, FaEye, FaFilePdf, FaFileExcel, FaSearch, FaUsers, FaPrint, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function StudentTable({
  students,
  deleteStudent,
  editStudent,
  viewStudent,
  search,
  setSearch,
  onDeleteConfirm,
  courseFilter,
  setCourseFilter
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // Pagination Logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(students.length / studentsPerPage);

  const COURSES = ["All", "B.Tech", "BCA", "B.Sc", "MCA", "MBA", "BE", "ME", "B.Com"];

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Student Management Report", 105, 15, { align: "center" });
    
    // ... basic pdf setup ...
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 23, { align: "center" });

    const headers = ["S.No", "Student ID", "Name", "Course", "Email", "Phone"];
    const colWidths = [15, 30, 40, 25, 45, 30];
    let y = 35;
    
    doc.setFillColor(30, 60, 114);
    doc.rect(14, y - 6, 182, 9, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    
    let x = 16;
    headers.forEach((h, i) => { doc.text(h, x, y); x += colWidths[i]; });
    
    y += 8;
    doc.setTextColor(0, 0, 0);
    
    students.forEach((s, index) => {
      if (y > 275) { doc.addPage(); y = 20; }
      x = 16;
      const row = [String(index + 1), s.studentId || "-", s.name, s.course, s.email, s.phone];
      row.forEach((cell, i) => { doc.text(String(cell).substring(0, 25), x, y); x += colWidths[i]; });
      y += 7;
    });

    doc.save("students_report.pdf");
  };

  // Export Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(students.map((s, i) => ({
      "S.No": i + 1, "Student ID": s.studentId, "Name": s.name, "Course": s.course, "Email": s.email, "Phone": s.phone
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "students_data.xlsx");
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="table-section fade-in">
      <div className="table-header">
        <h3><FaUsers /> Student Records</h3>
        <div className="table-actions">
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <FaPrint /> Print
          </button>
          <button className="btn btn-export btn-sm" onClick={exportPDF}>
            <FaFilePdf /> Export PDF
          </button>
          <button className="btn btn-success btn-sm" onClick={exportExcel}>
            <FaFileExcel /> Export Excel
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: "relative", flex: 1, minWidth: '250px' }}>
          <FaSearch style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", marginTop: "-1px" }} />
          <input
            className="search-box"
            style={{ width: '100%', maxWidth: 'none', margin: 0, paddingLeft: "38px" }}
            type="text"
            placeholder="Search by name, student ID, course, phone, or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        
        <select 
          className="search-box" 
          style={{ width: 'auto', margin: 0 }}
          value={courseFilter}
          onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}
        >
          {COURSES.map(c => <option key={c} value={c}>{c === "All" ? "All Courses ▼" : c}</option>)}
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>Course</th>
              <th>Department</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length === 0 ? (
              <tr><td colSpan="7" className="no-data">No students found.</td></tr>
            ) : (
              currentStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <img
                      className="student-photo-cell"
                      src={student.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=1e3c72&color=fff&size=100`}
                      alt={student.name}
                    />
                  </td>
                  <td><span className="student-id-badge">{student.studentId || "-"}</span></td>
                  <td><strong>{student.name}</strong></td>
                  <td>{student.course}</td>
                  <td>{student.department || "-"}</td>
                  <td>{student.email}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view-btn" onClick={() => viewStudent(student)}><FaEye /></button>
                      <button className="action-btn edit-btn" onClick={() => editStudent(student)}><FaEdit /></button>
                      <button className="action-btn delete-btn" onClick={() => onDeleteConfirm(student)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, students.length)} of {students.length} entries
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-secondary btn-icon" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            ><FaChevronLeft /></button>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', fontSize: '14px', fontWeight: 600, background: 'var(--primary-gradient)', color: '#fff', borderRadius: '6px' }}>
              {currentPage}
            </span>
            <button 
              className="btn btn-secondary btn-icon" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            ><FaChevronRight /></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentTable;