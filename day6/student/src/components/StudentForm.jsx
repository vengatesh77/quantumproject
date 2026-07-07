import { useEffect, useState } from "react";
import { FaUserPlus, FaUpload } from "react-icons/fa";

const COURSES = ["B.Tech", "BCA", "B.Sc", "MCA", "MBA", "BE", "ME", "B.Com"];
const DEPARTMENTS = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];
const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

const emptyStudent = {
  name: "",
  studentId: "",
  age: "",
  course: "",
  department: "",
  semester: "",
  gender: "",
  dob: "",
  admissionDate: "",
  email: "",
  phone: "",
  address: "",
  photo: "",
};

function StudentForm({ addStudent, editingStudent }) {
  const [student, setStudent] = useState({ ...emptyStudent });

  useEffect(() => {
    if (editingStudent) {
      setStudent({ ...emptyStudent, ...editingStudent });
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudent({ ...student, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addStudent(student);
    setStudent({ ...emptyStudent });
  };

  return (
    <div className="form-section fade-in">
      <h3>
        <FaUserPlus className="form-icon" />
        {editingStudent ? "Update Student" : "Add New Student"}
      </h3>

      <form className="student-form" onSubmit={handleSubmit}>
        {/* Photo Upload */}
        <div className="photo-upload-area">
          <label className="upload-label">Photo</label>
          <div className="photo-upload-box">
            {student.photo ? (
              <img src={student.photo} alt="Preview" className="photo-preview" />
            ) : (
              <div className="upload-placeholder">
                <FaUpload className="upload-icon" />
                <span>Upload Photo</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>

        {/* Name */}
        <div className="form-group">
          <label>Student Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={student.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Age */}
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            placeholder="Enter age"
            value={student.age}
            onChange={handleChange}
            required
            min="15"
            max="60"
          />
        </div>

        {/* Course Dropdown */}
        <div className="form-group">
          <label>Course</label>
          <select
            name="course"
            value={student.course}
            onChange={handleChange}
            required
          >
            <option value="">Select Course</option>
            {COURSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Department Dropdown */}
        <div className="form-group">
          <label>Department</label>
          <select
            name="department"
            value={student.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Semester Dropdown */}
        <div className="form-group">
          <label>Semester</label>
          <select
            name="semester"
            value={student.semester}
            onChange={handleChange}
            required
          >
            <option value="">Select Semester</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div className="form-group-radio">
          <label className="radio-label">Gender</label>
          <div className="radio-options">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={student.gender === "Male"}
                onChange={handleChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={student.gender === "Female"}
                onChange={handleChange}
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Other"
                checked={student.gender === "Other"}
                onChange={handleChange}
              />
              Other
            </label>
          </div>
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={student.dob}
            onChange={handleChange}
          />
        </div>

        {/* Admission Date */}
        <div className="form-group">
          <label>Admission Date</label>
          <input
            type="date"
            name="admissionDate"
            value={student.admissionDate}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={student.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter phone number"
            value={student.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            placeholder="Enter address"
            value={student.address}
            onChange={handleChange}
            rows="2"
          />
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <FaUserPlus />
            {editingStudent ? "Update Student" : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentForm;