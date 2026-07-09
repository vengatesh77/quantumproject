import React, { useState, useEffect } from 'react';
import { getDesignations, addDesignation, updateDesignation, deleteDesignation, getDepartments } from '../services/localStorageService';
import { useToast } from './ToastContext';
import { Search, Plus, Edit2, Trash2, Briefcase } from 'lucide-react';

const Designations = () => {
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentDesig, setCurrentDesig] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({ title: '', department: '', minSalary: '', maxSalary: '', experience: '', status: 'Active' });

  useEffect(() => { loadData(); }, []);

  const loadData = () => { 
    setDesignations(getDesignations());
    setDepartments(getDepartments());
  };

  const handleOpenModal = (desig = null) => {
    if (desig) {
      setCurrentDesig(desig);
      setFormData({ ...desig });
    } else {
      setCurrentDesig(null);
      setFormData({ title: '', department: departments[0]?.name || '', minSalary: '', maxSalary: '', experience: '', status: 'Active' });
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentDesig) {
      updateDesignation({ ...currentDesig, ...formData });
      toast('Designation updated successfully');
    } else {
      addDesignation(formData);
      toast('Designation added successfully');
    }
    setShowModal(false);
    loadData();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this designation?')) {
      deleteDesignation(id);
      toast('Designation deleted');
      loadData();
    }
  };

  const filtered = designations.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-enter">
      <div className="section-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Designations</h1>
          <p>Manage job titles and roles</p>
        </div>
        <div className="section-actions">
          <div className="search-input-wrap hide-print">
            <Search size={16} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search designations..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary hide-print" onClick={() => handleOpenModal()}>
            <Plus size={16} /> Add Designation
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Salary Range</th>
                <th>Experience</th>
                <th>Status</th>
                <th className="hide-print" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(des => (
                <tr key={des.id}>
                  <td className="font-medium text-muted">{des.id}</td>
                  <td className="font-medium">
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-primary-color" />
                      {des.title}
                    </div>
                  </td>
                  <td>{des.department}</td>
                  <td>₹{des.minSalary.toLocaleString()} - ₹{des.maxSalary.toLocaleString()}</td>
                  <td>{des.experience}</td>
                  <td>
                    <span className={`badge ${des.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {des.status}
                    </span>
                  </td>
                  <td className="hide-print" style={{ textAlign: 'right' }}>
                    <button className="btn-icon edit" onClick={() => handleOpenModal(des)}><Edit2 size={16}/></button>
                    <button className="btn-icon delete" onClick={() => handleDelete(des.id)}><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <Briefcase size={48} />
                    <h3>No designations found</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>{currentDesig ? 'Edit Designation' : 'Add Designation'}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body form-grid-2">
                <div className="form-group col-span-2">
                  <label className="form-label">Job Title *</label>
                  <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">Department *</label>
                  <select className="form-control" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Min Salary *</label>
                  <input type="number" className="form-control" value={formData.minSalary} onChange={e => setFormData({...formData, minSalary: Number(e.target.value)})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Salary *</label>
                  <input type="number" className="form-control" value={formData.maxSalary} onChange={e => setFormData({...formData, maxSalary: Number(e.target.value)})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience Required *</label>
                  <input type="text" className="form-control" value={formData.experience} placeholder="e.g. 2-5 Years" onChange={e => setFormData({...formData, experience: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{currentDesig ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Designations;
