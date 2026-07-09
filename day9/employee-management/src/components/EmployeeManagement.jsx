import React, { useState, useEffect } from 'react';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../services/localStorageService';
import { 
  Search, Filter, Plus, Edit, Trash2, Eye, Download, Printer, ChevronDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import EmployeeForm from './EmployeeForm';
import './EmployeeManagement.css';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [employees, searchTerm, departmentFilter, statusFilter, sortBy]);

  const loadEmployees = () => {
    const data = getEmployees();
    setEmployees(data);
  };

  const applyFilters = () => {
    let result = [...employees];

    // Search
    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      result = result.filter(emp => 
        emp.name.toLowerCase().includes(lowerCaseTerm) ||
        emp.id.toLowerCase().includes(lowerCaseTerm) ||
        emp.department.toLowerCase().includes(lowerCaseTerm) ||
        emp.designation.toLowerCase().includes(lowerCaseTerm)
      );
    }

    // Filters
    if (departmentFilter !== 'All') {
      result = result.filter(emp => emp.department === departmentFilter);
    }
    if (statusFilter !== 'All') {
      result = result.filter(emp => emp.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case 'Salary High to Low':
        result.sort((a, b) => b.salary - a.salary);
        break;
      case 'Salary Low to High':
        result.sort((a, b) => a.salary - b.salary);
        break;
      case 'Oldest':
        result.sort((a, b) => new Date(a.joiningDate) - new Date(b.joiningDate));
        break;
      case 'Newest':
      default:
        result.sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate));
        break;
    }

    setFilteredEmployees(result);
  };

  const handleAddEdit = (employeeData) => {
    if (currentEmployee) {
      updateEmployee(employeeData);
    } else {
      addEmployee(employeeData);
    }
    loadEmployees();
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
      loadEmployees();
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee List", 14, 15);
    const tableColumn = ["ID", "Name", "Department", "Designation", "Salary", "Status"];
    const tableRows = [];

    filteredEmployees.forEach(emp => {
      const empData = [
        emp.id,
        emp.name,
        emp.department,
        emp.designation,
        `₹${emp.salary.toLocaleString('en-IN')}`,
        emp.status
      ];
      tableRows.push(empData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });
    doc.save("employees.pdf");
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredEmployees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "employees.xlsx");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="employee-mgmt-container fade-enter-active">
      <div className="header-actions">
        <div>
          <h1>Employee Management</h1>
          <p className="text-secondary">Manage your team members and their details.</p>
        </div>
        <div className="action-buttons hide-print">
          <button className="btn-secondary" onClick={handlePrint}><Printer size={18}/> Print</button>
          <button className="btn-secondary" onClick={handleExportExcel}><Download size={18}/> Excel</button>
          <button className="btn-secondary" onClick={handleExportPDF}><Download size={18}/> PDF</button>
          <button className="btn-primary" onClick={() => { setCurrentEmployee(null); setShowModal(true); }}>
            <Plus size={18}/> Add Employee
          </button>
        </div>
      </div>

      <div className="controls-bar glass-panel hide-print">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID, Name, Dept..." 
            className="input-field search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <Filter size={16} className="text-muted"/>
            <select 
              className="input-field" 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          <div className="filter-group">
            <select 
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
          
          <div className="filter-group">
            <span className="text-muted text-sm">Sort:</span>
            <select 
              className="input-field"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Salary High to Low">Salary: High to Low</option>
              <option value="Salary Low to High">Salary: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      <div className="employee-table-container glass-panel">
        <table className="custom-table print-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name & Contact</th>
              <th>Department & Role</th>
              <th>Salary</th>
              <th>Status</th>
              <th className="hide-print text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
              <tr key={emp.id}>
                <td className="font-medium">{emp.id}</td>
                <td>
                  <div className="emp-name">{emp.name}</div>
                  <div className="emp-contact text-muted text-sm">{emp.email}</div>
                </td>
                <td>
                  <div className="emp-dept">{emp.department}</div>
                  <div className="emp-role text-muted text-sm">{emp.designation}</div>
                </td>
                <td className="font-medium">₹{Number(emp.salary).toLocaleString('en-IN')}</td>
                <td>
                  <span className={`badge badge-${emp.status.toLowerCase().replace(' ', '-')}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="hide-print text-right">
                  <div className="table-actions">
                    <button className="btn-icon" onClick={() => { setCurrentEmployee(emp); setShowModal(true); }}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon text-danger" onClick={() => handleDelete(emp.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-muted">
                  No employees found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <EmployeeForm 
          employee={currentEmployee} 
          onSave={handleAddEdit} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
