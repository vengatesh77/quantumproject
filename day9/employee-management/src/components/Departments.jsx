import React, { useState, useEffect } from 'react';
import { getDepartments, addDepartment, updateDepartment, deleteDepartment } from '../services/localStorageService';
import { useToast } from './ToastContext';
import { Search, Plus, Edit2, Trash2, Building2 } from 'lucide-react';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentDept, setCurrentDept] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({ name: '', manager: '', location: '', status: 'Active' });

  useEffect(() => { loadData(); }, []);

  const loadData = () => { setDepartments(getDepartments()); };

  const handleOpenModal = (dept = null) => {
    if (dept) {
      setCurrentDept(dept);
      setFormData({ name: dept.name, manager: dept.manager, location: dept.location, status: dept.status });
    } else {
      setCurrentDept(null);
      setFormData({ name: '', manager: '', location: '', status: 'Active' });
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentDept) {
      updateDepartment({ ...currentDept, ...formData });
      toast('Department updated successfully');
    } else {
      addDepartment(formData);
      toast('Department added successfully');
    }
    setShowModal(false);
    loadData();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      deleteDepartment(id);
      toast('Department deleted');
      loadData();
    }
  };

  const filtered = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-enter">
      <div className="section-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Departments</h1>
          <p>Manage company departments and locations</p>
        </div>
        <div className="section-actions">
          <div className="search-input-wrap hide-print">
            <Search size={16} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search departments..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary hide-print" onClick={() => handleOpenModal()}>
            <Plus size={16} /> Add Department
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Department Name</th>
                <th>Manager</th>
                <th>Location</th>
                <th>Status</th>
                <th className="hide-print" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(dept => (
                <tr key={dept.id}>
                  <td className="font-medium text-muted">{dept.id}</td>
                  <td className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-primary-color" />
                      {dept.name}
                    </div>
                  </td>
                  <td>{dept.manager}</td>
                  <td>{dept.location}</td>
                  <td>
                    <span className={`badge ${dept.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {dept.status}
                    </span>
                  </td>
                  <td className="hide-print" style={{ textAlign: 'right' }}>
                    <button className="btn-icon edit" onClick={() => handleOpenModal(dept)}><Edit2 size={16}/></button>
                    <button className="btn-icon delete" onClick={() => handleDelete(dept.id)}><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <Building2 size={48} />
                    <h3>No departments found</h3>
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
              <h3>{currentDept ? 'Edit Department' : 'Add Department'}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body form-grid-2">
                <div className="form-group col-span-2">
                  <label className="form-label">Department Name *</label>
                  <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Manager Name *</label>
                  <input type="text" className="form-control" value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input type="text" className="form-control" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{currentDept ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
