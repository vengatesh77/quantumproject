import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/localStorageService';
import { BarChart3, Download, Users, Building2, CalendarCheck, Banknote } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats(getDashboardStats());
  }, []);

  const handleExportPDF = () => {
    if (!stats) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("HR Summary Report", 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = [
      ["Total Employees", stats.totalEmployees],
      ["Active Employees", stats.activeEmployees],
      ["Total Departments", stats.totalDepartments],
      ["Employees on Leave", stats.onLeave],
      ["Today's Present", stats.presentToday],
      ["Today's Absent", stats.absentToday],
      ["Total Monthly Salary", `INR ${stats.totalSalary.toLocaleString()}`]
    ];

    doc.autoTable({
      startY: 40,
      head: [["Metric", "Value"]],
      body: tableData,
      theme: 'grid'
    });

    doc.save("HR_Summary_Report.pdf");
  };

  const handleExportExcel = () => {
    if (!stats) return;
    const data = [
      { Metric: "Total Employees", Value: stats.totalEmployees },
      { Metric: "Active Employees", Value: stats.activeEmployees },
      { Metric: "Total Departments", Value: stats.totalDepartments },
      { Metric: "Employees on Leave", Value: stats.onLeave },
      { Metric: "Today's Present", Value: stats.presentToday },
      { Metric: "Today's Absent", Value: stats.absentToday },
      { Metric: "Total Monthly Salary", Value: stats.totalSalary }
    ];
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Summary Report");
    XLSX.writeFile(wb, "HR_Summary_Report.xlsx");
  };

  if (!stats) return null;

  return (
    <div className="page-enter">
      <div className="section-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Reports & Analytics</h1>
          <p>Overview of company metrics and summaries</p>
        </div>
        <div className="section-actions hide-print">
          <button className="btn btn-outline" onClick={handleExportExcel}>
            <Download size={16} /> Export Excel
          </button>
          <button className="btn btn-primary" onClick={handleExportPDF}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h4>Total Employees</h4>
            <h2>{stats.totalEmployees}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <Building2 size={24} />
          </div>
          <div className="stat-info">
            <h4>Departments</h4>
            <h2>{stats.totalDepartments}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <CalendarCheck size={24} />
          </div>
          <div className="stat-info">
            <h4>Today's Present</h4>
            <h2>{stats.presentToday}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Banknote size={24} />
          </div>
          <div className="stat-info">
            <h4>Monthly Payroll</h4>
            <h2>₹{(stats.totalSalary / 100000).toFixed(2)}L</h2>
          </div>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="card">
          <h3 className="mb-4">Attendance Summary</h3>
          <div className="flex flex-col gap-3">
             <div className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium">Present Today</span>
                <span className="badge badge-success">{stats.presentToday}</span>
             </div>
             <div className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium">Absent Today</span>
                <span className="badge badge-danger">{stats.absentToday}</span>
             </div>
             <div className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium">On Leave</span>
                <span className="badge badge-warning">{stats.onLeave}</span>
             </div>
          </div>
        </div>
        <div className="card">
          <h3 className="mb-4">Employee Status</h3>
          <div className="flex flex-col gap-3">
             <div className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium">Active Employees</span>
                <span className="badge badge-primary">{stats.activeEmployees}</span>
             </div>
             <div className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium">Inactive Employees</span>
                <span className="badge badge-gray">{stats.totalEmployees - stats.activeEmployees - stats.onLeave}</span>
             </div>
             <div className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium">Total Headcount</span>
                <span className="font-semibold">{stats.totalEmployees}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
