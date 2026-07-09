import React, { useState, useEffect } from 'react';
import { getAttendance, saveAttendance, getEmployees, getDepartments } from '../services/localStorageService';
import { useToast } from './ToastContext';
import { Search, CalendarCheck } from 'lucide-react';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDept, setFilterDept] = useState('All');
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    setAttendance(getAttendance());
    setEmployees(getEmployees());
    setDepartments(getDepartments());
  };

  const handleStatusChange = (id, newStatus) => {
    let records = [...attendance];
    let recordIndex = records.findIndex(r => r.id === id);
    
    if (recordIndex !== -1) {
      records[recordIndex].status = newStatus;
      if (newStatus === 'Present') {
        records[recordIndex].checkIn = '09:00';
        records[recordIndex].checkOut = '18:00';
        records[recordIndex].workingHours = '9h 00m';
      } else if (newStatus === 'Half Day') {
        records[recordIndex].checkIn = '13:00';
        records[recordIndex].checkOut = '18:00';
        records[recordIndex].workingHours = '5h 00m';
      } else {
        records[recordIndex].checkIn = '';
        records[recordIndex].checkOut = '';
        records[recordIndex].workingHours = '0h 00m';
      }
      saveAttendance(records);
      setAttendance(records);
      toast('Attendance updated');
    }
  };

  const generateTodayRecords = () => {
    let records = [...attendance];
    let newRecordsAdded = false;
    
    employees.forEach(emp => {
      const recordId = `ATT_${emp.id}_${filterDate}`;
      if (!records.find(r => r.id === recordId)) {
        records.push({
          id: recordId,
          employeeId: emp.id,
          employeeName: emp.name,
          department: emp.department,
          date: filterDate,
          checkIn: '',
          checkOut: '',
          workingHours: '0h 00m',
          status: 'Absent', // Default to absent until marked
        });
        newRecordsAdded = true;
      }
    });

    if (newRecordsAdded) {
      saveAttendance(records);
      setAttendance(records);
      toast(`Records generated for ${filterDate}`);
    }
  };

  const getFilteredRecords = () => {
    return attendance.filter(r => {
      const matchDate = r.date === filterDate;
      const matchDept = filterDept === 'All' || r.department === filterDept;
      const matchSearch = r.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDate && matchDept && matchSearch;
    });
  };

  const filtered = getFilteredRecords();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present': return 'badge-success';
      case 'Absent': return 'badge-danger';
      case 'Half Day': return 'badge-info';
      case 'Leave': return 'badge-warning';
      default: return 'badge-gray';
    }
  };

  return (
    <div className="page-enter">
      <div className="section-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Attendance</h1>
          <p>Track daily employee attendance and working hours</p>
        </div>
        <div className="section-actions hide-print">
           <button className="btn btn-outline" onClick={generateTodayRecords}>
             Generate Records for Selected Date
           </button>
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
        <input 
          type="date" 
          className="form-control" 
          style={{ width: 'auto' }}
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
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
                <th>Department</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
                <th className="hide-print">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(record => (
                <tr key={record.id}>
                  <td className="font-medium">
                    <div className="flex items-center gap-2">
                      <CalendarCheck size={16} className="text-muted" />
                      {record.employeeName}
                    </div>
                  </td>
                  <td>{record.department}</td>
                  <td>{record.date}</td>
                  <td>{record.checkIn || '-'}</td>
                  <td>{record.checkOut || '-'}</td>
                  <td>{record.workingHours}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="hide-print">
                    <select 
                      className="form-control" 
                      style={{ padding: '0.25rem 0.5rem', height: 'auto', fontSize: '0.8125rem' }}
                      value={record.status}
                      onChange={e => handleStatusChange(record.id, e.target.value)}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Half Day">Half Day</option>
                      <option value="Leave">Leave</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <CalendarCheck size={48} />
                    <h3>No attendance records found for {filterDate}</h3>
                    <p>Click "Generate Records" to create attendance entries for this date.</p>
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

export default Attendance;
