import React, { useState, useEffect } from 'react';
import { getPayroll, updatePayrollRecord, getDepartments } from '../services/localStorageService';
import { useToast } from './ToastContext';
import { Search, Banknote, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Payroll = () => {
  const [payroll, setPayroll] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterMonth, setFilterMonth] = useState('July 2026');
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    setPayroll(getPayroll());
    setDepartments(getDepartments());
  };

  const handleUpdateAmounts = (id, field, value) => {
    let records = [...payroll];
    let index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index][field] = Number(value) || 0;
      records[index].netSalary = records[index].basicSalary + records[index].bonus - records[index].deduction;
      updatePayrollRecord(records[index]);
      setPayroll(records);
    }
  };

  const handleStatusChange = (id, status) => {
    let records = [...payroll];
    let index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index].paymentStatus = status;
      updatePayrollRecord(records[index]);
      setPayroll(records);
      toast('Payment status updated');
    }
  };

  const downloadPayslip = (record) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Salary Slip", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.text(`Employee Name: ${record.employeeName}`, 14, 40);
    doc.text(`Department: ${record.department}`, 14, 50);
    doc.text(`Designation: ${record.designation}`, 14, 60);
    doc.text(`Month: ${record.month}`, 14, 70);

    const tableData = [
      ["Basic Salary", `INR ${record.basicSalary.toLocaleString()}`],
      ["Bonus", `INR ${record.bonus.toLocaleString()}`],
      ["Deductions", `INR ${record.deduction.toLocaleString()}`],
      ["Net Salary", `INR ${record.netSalary.toLocaleString()}`]
    ];

    doc.autoTable({
      startY: 85,
      head: [["Description", "Amount"]],
      body: tableData,
      theme: 'grid'
    });

    doc.text("This is a computer generated payslip.", 105, doc.lastAutoTable.finalY + 30, null, null, "center");
    doc.save(`Payslip_${record.employeeName.replace(/\s+/g, '_')}_${record.month.replace(/\s+/g, '_')}.pdf`);
    toast('Payslip downloaded');
  };

  const filtered = payroll.filter(r => 
    r.month === filterMonth &&
    (filterDept === 'All' || r.department === filterDept) &&
    r.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-enter">
      <div className="section-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Payroll Management</h1>
          <p>Manage employee salaries, bonuses, and deductions</p>
        </div>
      </div>

      <div className="toolbar hide-print card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <div className="search-input-wrap" style={{ flex: 1 }}>
          <Search size={16} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search employee..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="form-control" 
          style={{ width: 'auto' }}
          value={filterMonth}
          onChange={e => setFilterMonth(e.target.value)}
        >
          <option value="July 2026">July 2026</option>
          <option value="June 2026">June 2026</option>
          <option value="May 2026">May 2026</option>
        </select>
        <select 
          className="form-control" 
          style={{ width: 'auto' }}
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
        >
          <option value="All">All Departments</option>
          {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Basic Salary</th>
                <th>Bonus</th>
                <th>Deduction</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th className="hide-print" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(record => (
                <tr key={record.id}>
                  <td className="font-medium">
                    <div className="flex items-center gap-2">
                      <Banknote size={16} className="text-primary-color" />
                      <div>
                        <div>{record.employeeName}</div>
                        <div className="text-muted text-xs">{record.department}</div>
                      </div>
                    </div>
                  </td>
                  <td>₹{record.basicSalary.toLocaleString()}</td>
                  <td className="hide-print">
                    <input type="number" className="form-control" style={{ width: '90px', padding: '0.25rem 0.5rem', height: 'auto' }} value={record.bonus} onChange={e => handleUpdateAmounts(record.id, 'bonus', e.target.value)} />
                  </td>
                  <td className="hide-print">
                    <input type="number" className="form-control" style={{ width: '90px', padding: '0.25rem 0.5rem', height: 'auto' }} value={record.deduction} onChange={e => handleUpdateAmounts(record.id, 'deduction', e.target.value)} />
                  </td>
                  <td className="font-semibold text-primary-color">₹{record.netSalary.toLocaleString()}</td>
                  <td>
                     <select 
                      className={`form-control ${record.paymentStatus === 'Paid' ? 'text-success' : 'text-warning'}`} 
                      style={{ padding: '0.25rem 0.5rem', height: 'auto', fontSize: '0.8125rem', width: 'auto', border: 'none', background: 'transparent' }}
                      value={record.paymentStatus}
                      onChange={e => handleStatusChange(record.id, e.target.value)}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </td>
                  <td className="hide-print" style={{ textAlign: 'right' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => downloadPayslip(record)}>
                      <Download size={14} /> Payslip
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <Banknote size={48} />
                    <h3>No payroll records found</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
