import { FaChartLine, FaFilePdf, FaFileExcel, FaDownload } from "react-icons/fa";

function Reports() {
  return (
    <div className="form-section fade-in">
      <h3><FaChartLine className="form-icon" style={{color: 'var(--accent-orange)'}}/> Academic Reports</h3>
      
      <div className="dashboard" style={{ gridTemplateColumns: '1fr 1fr' }}>
        
        <div className="card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
          <div className="card-info" style={{ width: '100%' }}>
            <h3 style={{ color: 'var(--accent-blue)', marginBottom: '8px' }}>Student Performance</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>Generate comprehensive performance reports for all students across semesters.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-export btn-sm"><FaFilePdf /> PDF</button>
              <button className="btn btn-success btn-sm"><FaFileExcel /> Excel</button>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
          <div className="card-info" style={{ width: '100%' }}>
            <h3 style={{ color: 'var(--accent-green)', marginBottom: '8px' }}>Attendance Records</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>Download monthly and semester-wise attendance logs for the current academic year.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-export btn-sm"><FaFilePdf /> PDF</button>
              <button className="btn btn-success btn-sm"><FaFileExcel /> Excel</button>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-orange)' }}>
          <div className="card-info" style={{ width: '100%' }}>
            <h3 style={{ color: 'var(--accent-orange)', marginBottom: '8px' }}>Fee Defaulters</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>Generate a list of students with pending fee dues for the current term.</p>
            <button className="btn btn-secondary btn-sm"><FaDownload /> Download Report</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Reports;
