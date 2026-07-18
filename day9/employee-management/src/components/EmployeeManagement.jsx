import React, { useState, useEffect } from 'react';
import {
  getEmployees, addEmployee, updateEmployee, deleteEmployee
} from '../services/api';
import { useToast } from './ToastContext';
import {
  Search, Filter, Plus, Edit, Trash2, Download, Printer
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import EmployeeForm from './EmployeeForm';
import './EmployeeManagement.css';

// ─── Loading Spinner ──────────────────────────────────────────────────────────
const Spinner = () => (
  <div style={{ textAlign: 'center', padding: '3rem' }}>
    <div style={{
      display: 'inline-block', width: 40, height: 40,
      border: '4px solid rgba(99,102,241,0.2)',
      borderTopColor: '#6366f1',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <p style={{ marginTop: 12, color: '#6b7280' }}>Loading employees…</p>
  </div>
);

// ─── API Error ─────────────────────────────────────────────────────────────────
const ApiError = ({ onRetry }) => (
  <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
    <h3 style={{ marginBottom: 8 }}>Cannot connect to API Server</h3>
    <p style={{ color: '#6b7280', marginBottom: 16 }}>
      Make sure JSON Server is running: <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>npm run server</code>
    </p>
    <button className="btn-primary" onClick={onRetry}>Retry</button>
  </div>
);

// ─── Pagination ───────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 10;

const EmployeeManagement = () => {
  const { toast } = useToast();
  const [employees, setEmployees]           = useState([]);
  const [filteredEmployees, setFiltered]    = useState([]);
  const [showModal, setShowModal]           = useState(false);
  const [currentEmployee, setCurrentEmp]   = useState(null);
  const [loading, setLoading]              = useState(true);
  const [error, setError]                  = useState(null);
  const [page, setPage]                    = useState(1);

  // Search & Filter state
  const [searchTerm, setSearchTerm]         = useState('');
  const [departmentFilter, setDeptFilter]   = useState('All');
  const [statusFilter, setStatusFilter]     = useState('All');
  const [sortBy, setSortBy]                 = useState('Newest');

  // ── Load ─────────────────────────────────────────────────────────────────────
  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEmployees(); }, []);

  // ── Filter + Sort ────────────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...employees];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        (e.employeeId || '').toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    }

    if (departmentFilter !== 'All')
      result = result.filter(e => e.department === departmentFilter);
    if (statusFilter !== 'All')
      result = result.filter(e => e.status === statusFilter);

    switch (sortBy) {
      case 'Salary High to Low': result.sort((a, b) => b.salary - a.salary); break;
      case 'Salary Low to High': result.sort((a, b) => a.salary - b.salary); break;
      case 'Oldest':  result.sort((a, b) => new Date(a.joiningDate) - new Date(b.joiningDate)); break;
      default:        result.sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate));
    }

    setFiltered(result);
    setPage(1);
  }, [employees, searchTerm, departmentFilter, statusFilter, sortBy]);

  // ── Unique departments for filter dropdown ────────────────────────────────────
  const uniqueDepts = [...new Set(employees.map(e => e.department))].sort();

  // ── Pagination ────────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const paginated  = filteredEmployees.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // ── CRUD handlers ─────────────────────────────────────────────────────────────
  const handleSave = async (formData) => {
    try {
      if (currentEmployee) {
        await updateEmployee(currentEmployee.id, formData);
        toast('Employee updated successfully ✅');
      } else {
        // Auto-generate employeeId
        const maxNum = employees.reduce((max, e) => {
          const n = parseInt((e.employeeId || '').replace('EMP', '')) || 0;
          return n > max ? n : max;
        }, 0);
        const newEmp = {
          ...formData,
          employeeId: `EMP${String(maxNum + 1).padStart(3, '0')}`,
          profileImage: `https://i.pravatar.cc/150?u=${Date.now()}`,
        };
        await addEmployee(newEmp);
        toast('Employee added successfully ✅');
      }
      await loadEmployees();
      setShowModal(false);
    } catch {
      toast('Error saving employee. Check API server.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await deleteEmployee(id);
      toast('Employee deleted ✅');
      await loadEmployees();
    } catch {
      toast('Error deleting employee. Check API server.', 'error');
    }
  };

  // ── Export helpers ────────────────────────────────────────────────────────────
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Employee List', 14, 15);
    doc.autoTable({
      head: [['ID', 'Name', 'Department', 'Designation', 'Salary', 'Status']],
      body: filteredEmployees.map(e => [
        e.employeeId, e.name, e.department, e.designation,
        `₹${Number(e.salary).toLocaleString('en-IN')}`, e.status,
      ]),
      startY: 20,
    });
    doc.save('employees.pdf');
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredEmployees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, 'employees.xlsx');
  };

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <div className="employee-mgmt-container fade-enter-active">
      <div className="header-actions">
        <div>
          <h1>Employee Management</h1>
          <p className="text-secondary">
            Manage your team members · API: <code>http://localhost:3001/employees</code>
          </p>
        </div>
        <div className="action-buttons hide-print">
          <button className="btn-secondary" onClick={() => window.print()}><Printer size={18}/> Print</button>
          <button className="btn-secondary" onClick={handleExportExcel}><Download size={18}/> Excel</button>
          <button className="btn-secondary" onClick={handleExportPDF}><Download size={18}/> PDF</button>
          <button className="btn-primary" onClick={() => { setCurrentEmp(null); setShowModal(true); }}>
            <Plus size={18}/> Add Employee
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-bar glass-panel hide-print">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search by ID, Name, Dept, Email…"
            className="input-field search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <Filter size={16} className="text-muted"/>
            <select className="input-field" value={departmentFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="All">All Departments</option>
              {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <select className="input-field" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="text-muted text-sm">Sort:</span>
            <select className="input-field" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Salary High to Low">Salary: High to Low</option>
              <option value="Salary Low to High">Salary: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Count bar */}
      {!loading && !error && (
        <div style={{ padding: '0.5rem 0', color: '#6b7280', fontSize: 14 }}>
          Showing {paginated.length} of {filteredEmployees.length} employees
        </div>
      )}

      {/* Table */}
      <div className="employee-table-container glass-panel">
        {loading ? <Spinner /> : error ? <ApiError onRetry={loadEmployees} /> : (
          <>
            <table className="custom-table print-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name &amp; Contact</th>
                  <th>Department &amp; Role</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th className="hide-print text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length > 0 ? paginated.map(emp => (
                  <tr key={emp.id}>
                    <td className="font-medium">{emp.employeeId}</td>
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
                        <button className="btn-icon" onClick={() => { setCurrentEmp(emp); setShowModal(true); }}>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '1rem' }}>
                <button
                  className="btn-secondary"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  style={{ padding: '6px 14px' }}
                >← Prev</button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    style={{
                      padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                      background: n === page ? '#6366f1' : 'rgba(255,255,255,0.07)',
                      color: n === page ? '#fff' : 'inherit', fontWeight: n === page ? 700 : 400,
                    }}
                  >{n}</button>
                ))}

                <button
                  className="btn-secondary"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  style={{ padding: '6px 14px' }}
                >Next →</button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <EmployeeForm
          employee={currentEmployee}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
