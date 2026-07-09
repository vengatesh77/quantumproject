import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getDepartments, getDesignations } from '../services/localStorageService';

const EmployeeForm = ({ employee, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '', name: '', email: '', phone: '', gender: 'Male', dob: '',
    department: '', designation: '', salary: '', address: '',
    joiningDate: new Date().toISOString().split('T')[0],
    experience: '', status: 'Active', avatar: ''
  });

  const [departments] = useState(() => getDepartments());
  const [designations] = useState(() => getDesignations());

  useEffect(() => {
    if (employee) setFormData(employee);
    else if (departments.length > 0) setFormData(prev => ({ ...prev, department: departments[0].name }));
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const filteredDesignations = designations.filter(d => d.department === formData.department);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{employee ? 'Edit Employee' : 'Add New Employee'}</h3>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Full Name *</label>
              <input type="text" name="name" className="input-field form-control" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="input-label">Email *</label>
              <input type="email" name="email" className="input-field form-control" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="input-label">Phone *</label>
              <input type="tel" name="phone" className="input-field form-control" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="input-label">Date of Birth</label>
              <input type="date" name="dob" className="input-field form-control" value={formData.dob} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="input-label">Gender</label>
              <select name="gender" className="input-field form-control" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Department *</label>
              <select name="department" className="input-field form-control" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Designation *</label>
              <select name="designation" className="input-field form-control" value={formData.designation} onChange={handleChange} required>
                <option value="">Select Designation</option>
                {(filteredDesignations.length > 0 ? filteredDesignations : designations).map(d => (
                  <option key={d.id} value={d.title}>{d.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Monthly Salary (₹) *</label>
              <input type="number" name="salary" className="input-field form-control" value={formData.salary} onChange={handleChange} required min="0" />
            </div>

            <div className="form-group">
              <label className="input-label">Joining Date *</label>
              <input type="date" name="joiningDate" className="input-field form-control" value={formData.joiningDate} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="input-label">Experience</label>
              <input type="text" name="experience" className="input-field form-control" placeholder="e.g. 3 Years" value={formData.experience} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="input-label">Status</label>
              <select name="status" className="input-field form-control" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Address</label>
              <textarea name="address" className="input-field form-control" rows="2" value={formData.address} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {employee ? 'Update Employee' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;