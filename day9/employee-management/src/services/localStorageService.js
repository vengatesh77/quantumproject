// ==========================================
// EMPLOYEE MANAGEMENT SYSTEM - localStorage Service
// ==========================================

const KEYS = {
  EMPLOYEES: 'ems_employees',
  DEPARTMENTS: 'ems_departments',
  DESIGNATIONS: 'ems_designations',
  ATTENDANCE: 'ems_attendance',
  PAYROLL: 'ems_payroll',
  SETTINGS: 'ems_settings',
  THEME: 'ems_theme',
};

// ─── SEED DATA ──────────────────────────────────────────────

const seedDepartments = [
  { id: 'DEPT001', name: 'Human Resources', manager: 'Priya Sharma', location: 'Chennai', status: 'Active' },
  { id: 'DEPT002', name: 'Information Technology', manager: 'Vignesh Raj', location: 'Bangalore', status: 'Active' },
  { id: 'DEPT003', name: 'Finance', manager: 'Rahul Kumar', location: 'Mumbai', status: 'Active' },
  { id: 'DEPT004', name: 'Marketing', manager: 'Sneha Reddy', location: 'Hyderabad', status: 'Active' },
  { id: 'DEPT005', name: 'Sales', manager: 'Arun Babu', location: 'Delhi', status: 'Active' },
  { id: 'DEPT006', name: 'Operations', manager: 'Karthik Rajan', location: 'Pune', status: 'Active' },
  { id: 'DEPT007', name: 'Customer Support', manager: 'Divya Nair', location: 'Chennai', status: 'Active' },
  { id: 'DEPT008', name: 'Administration', manager: 'Harish Babu', location: 'Coimbatore', status: 'Inactive' },
];

const seedDesignations = [
  { id: 'DES001', title: 'HR Executive', department: 'Human Resources', minSalary: 25000, maxSalary: 45000, experience: '0-2 Years', status: 'Active' },
  { id: 'DES002', title: 'HR Manager', department: 'Human Resources', minSalary: 60000, maxSalary: 100000, experience: '5+ Years', status: 'Active' },
  { id: 'DES003', title: 'Software Engineer', department: 'Information Technology', minSalary: 40000, maxSalary: 80000, experience: '1-3 Years', status: 'Active' },
  { id: 'DES004', title: 'Senior Developer', department: 'Information Technology', minSalary: 80000, maxSalary: 150000, experience: '4-7 Years', status: 'Active' },
  { id: 'DES005', title: 'Project Manager', department: 'Information Technology', minSalary: 100000, maxSalary: 200000, experience: '7+ Years', status: 'Active' },
  { id: 'DES006', title: 'Team Lead', department: 'Information Technology', minSalary: 90000, maxSalary: 160000, experience: '5+ Years', status: 'Active' },
  { id: 'DES007', title: 'UI/UX Designer', department: 'Information Technology', minSalary: 45000, maxSalary: 90000, experience: '2-5 Years', status: 'Active' },
  { id: 'DES008', title: 'QA Engineer', department: 'Information Technology', minSalary: 35000, maxSalary: 70000, experience: '1-4 Years', status: 'Active' },
  { id: 'DES009', title: 'Marketing Executive', department: 'Marketing', minSalary: 25000, maxSalary: 50000, experience: '0-3 Years', status: 'Active' },
  { id: 'DES010', title: 'Sales Executive', department: 'Sales', minSalary: 20000, maxSalary: 45000, experience: '0-2 Years', status: 'Active' },
  { id: 'DES011', title: 'Finance Analyst', department: 'Finance', minSalary: 45000, maxSalary: 80000, experience: '2-5 Years', status: 'Active' },
  { id: 'DES012', title: 'Operations Manager', department: 'Operations', minSalary: 70000, maxSalary: 120000, experience: '5+ Years', status: 'Active' },
];

const seedEmployees = [
  { id: 'EMP001', name: 'Rahul Kumar', email: 'rahul.kumar@company.com', phone: '9876543210', gender: 'Male', dob: '1992-03-15', department: 'Information Technology', designation: 'Senior Developer', salary: 95000, address: '12, Anna Nagar, Chennai', joiningDate: '2019-06-01', experience: '5 Years', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=rahulkumar' },
  { id: 'EMP002', name: 'Priya Sharma', email: 'priya.sharma@company.com', phone: '9876543211', gender: 'Female', dob: '1994-07-22', department: 'Human Resources', designation: 'HR Manager', salary: 75000, address: '34, T Nagar, Chennai', joiningDate: '2020-01-10', experience: '4 Years', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=priyasharma' },
  { id: 'EMP003', name: 'Arun Kumar', email: 'arun.kumar@company.com', phone: '9876543212', gender: 'Male', dob: '1991-11-05', department: 'Finance', designation: 'Finance Analyst', salary: 60000, address: '56, Adyar, Chennai', joiningDate: '2018-08-20', experience: '7 Years', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=arunkumar' },
  { id: 'EMP004', name: 'Sneha Reddy', email: 'sneha.reddy@company.com', phone: '9876543213', gender: 'Female', dob: '1995-04-18', department: 'Marketing', designation: 'Marketing Executive', salary: 40000, address: '78, Velachery, Chennai', joiningDate: '2021-03-15', experience: '3 Years', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=snehareddy' },
  { id: 'EMP005', name: 'Karthik Rajan', email: 'karthik.rajan@company.com', phone: '9876543214', gender: 'Male', dob: '1988-09-30', department: 'Operations', designation: 'Operations Manager', salary: 110000, address: '90, Perambur, Chennai', joiningDate: '2017-05-01', experience: '9 Years', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=karthikmurali' },
  { id: 'EMP006', name: 'Divya Nair', email: 'divya.nair@company.com', phone: '9876543215', gender: 'Female', dob: '1996-01-25', department: 'Customer Support', designation: 'HR Executive', salary: 30000, address: '23, Tambaram, Chennai', joiningDate: '2022-07-01', experience: '2 Years', status: 'On Leave', avatar: 'https://i.pravatar.cc/150?u=divyanair' },
  { id: 'EMP007', name: 'Vignesh Raj', email: 'vignesh.raj@company.com', phone: '9876543216', gender: 'Male', dob: '1993-06-10', department: 'Information Technology', designation: 'Project Manager', salary: 130000, address: '45, Guindy, Chennai', joiningDate: '2016-11-15', experience: '10 Years', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=vigneshraj' },
  { id: 'EMP008', name: 'Aarthi Krishnan', email: 'aarthi.k@company.com', phone: '9876543217', gender: 'Female', dob: '1997-02-14', department: 'Information Technology', designation: 'UI/UX Designer', salary: 55000, address: '67, Porur, Chennai', joiningDate: '2022-01-10', experience: '2 Years', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=aarthikrishnan' },
  { id: 'EMP009', name: 'Harish Babu', email: 'harish.babu@company.com', phone: '9876543218', gender: 'Male', dob: '1990-12-08', department: 'Administration', designation: 'HR Executive', salary: 35000, address: '89, Chromepet, Chennai', joiningDate: '2019-04-20', experience: '6 Years', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=harishbabu' },
  { id: 'EMP010', name: 'Keerthana Suresh', email: 'keerthana.s@company.com', phone: '9876543219', gender: 'Female', dob: '1998-08-19', department: 'Information Technology', designation: 'QA Engineer', salary: 45000, address: '100, Sholinganallur, Chennai', joiningDate: '2023-02-01', experience: '1 Year', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=keerthanasu' },
  { id: 'EMP011', name: 'Rohit Verma', email: 'rohit.verma@company.com', phone: '9876543220', gender: 'Male', dob: '1993-10-12', department: 'Sales', designation: 'Sales Executive', salary: 35000, address: '120, Mogappair, Chennai', joiningDate: '2020-09-01', experience: '4 Years', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=rohitverma' },
  { id: 'EMP012', name: 'Naveen Balaji', email: 'naveen.b@company.com', phone: '9876543221', gender: 'Male', dob: '1994-05-28', department: 'Information Technology', designation: 'Software Engineer', salary: 65000, address: '130, Padi, Chennai', joiningDate: '2021-06-15', experience: '3 Years', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=naveenbalaji' },
  { id: 'EMP013', name: 'Akash Vijay', email: 'akash.vijay@company.com', phone: '9876543222', gender: 'Male', dob: '1999-03-07', department: 'Marketing', designation: 'Marketing Executive', salary: 32000, address: '140, Koyambedu, Chennai', joiningDate: '2023-05-01', experience: '1 Year', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=akashvijay' },
  { id: 'EMP014', name: 'Deepika Gopal', email: 'deepika.g@company.com', phone: '9876543223', gender: 'Female', dob: '1996-09-15', department: 'Finance', designation: 'Finance Analyst', salary: 58000, address: '150, Egmore, Chennai', joiningDate: '2020-11-20', experience: '4 Years', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=deepikagopal' },
  { id: 'EMP015', name: 'Venkatesh Iyer', email: 'venkatesh.i@company.com', phone: '9876543224', gender: 'Male', dob: '1987-07-01', department: 'Information Technology', designation: 'Team Lead', salary: 120000, address: '160, Mylapore, Chennai', joiningDate: '2015-03-10', experience: '12 Years', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=venkateshiyer' },
];

const seedAttendance = (() => {
  const records = [];
  const today = new Date();
  seedEmployees.forEach(emp => {
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const statuses = ['Present', 'Present', 'Present', 'Absent', 'Present', 'Present', 'Half Day', 'Present', 'Leave', 'Present'];
      const stat = statuses[i] || 'Present';
      records.push({
        id: `ATT_${emp.id}_${dateStr}`,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        date: dateStr,
        checkIn: stat === 'Present' ? '09:00' : stat === 'Half Day' ? '13:00' : '',
        checkOut: stat === 'Present' ? '18:00' : stat === 'Half Day' ? '18:00' : '',
        workingHours: stat === 'Present' ? '9h 00m' : stat === 'Half Day' ? '5h 00m' : '0h 00m',
        status: stat,
      });
    }
  });
  return records;
})();

const seedPayroll = seedEmployees.map(emp => ({
  id: `PAY_${emp.id}`,
  employeeId: emp.id,
  employeeName: emp.name,
  department: emp.department,
  designation: emp.designation,
  basicSalary: emp.salary,
  bonus: Math.round(emp.salary * 0.1),
  deduction: Math.round(emp.salary * 0.12),
  netSalary: Math.round(emp.salary + emp.salary * 0.1 - emp.salary * 0.12),
  paymentStatus: Math.random() > 0.3 ? 'Paid' : 'Pending',
  paymentDate: '2026-07-01',
  month: 'July 2026',
}));

const defaultSettings = {
  adminName: 'Vengatesh Admin',
  companyName: 'Quantum Systems Pvt. Ltd.',
  email: 'admin@quantumsystems.com',
  phone: '9876543000',
  theme: 'light',
  language: 'English',
  notifications: true,
};

// ─── INIT ──────────────────────────────────────────────
export const initData = () => {
  if (!localStorage.getItem(KEYS.DEPARTMENTS)) localStorage.setItem(KEYS.DEPARTMENTS, JSON.stringify(seedDepartments));
  if (!localStorage.getItem(KEYS.DESIGNATIONS)) localStorage.setItem(KEYS.DESIGNATIONS, JSON.stringify(seedDesignations));
  if (!localStorage.getItem(KEYS.EMPLOYEES)) localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(seedEmployees));
  if (!localStorage.getItem(KEYS.ATTENDANCE)) localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(seedAttendance));
  if (!localStorage.getItem(KEYS.PAYROLL)) localStorage.setItem(KEYS.PAYROLL, JSON.stringify(seedPayroll));
  if (!localStorage.getItem(KEYS.SETTINGS)) localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings));
};

const getItem = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setItem = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// ─── EMPLOYEES ──────────────────────────────────────────────
export const getEmployees = () => getItem(KEYS.EMPLOYEES);

export const addEmployee = (emp) => {
  const list = getEmployees();
  const maxId = list.reduce((max, e) => {
    const num = parseInt(e.id.replace('EMP', ''));
    return num > max ? num : max;
  }, 0);
  const newEmp = { ...emp, id: `EMP${String(maxId + 1).padStart(3, '0')}`, avatar: `https://i.pravatar.cc/150?u=${Date.now()}` };
  list.push(newEmp);
  setItem(KEYS.EMPLOYEES, list);
  return newEmp;
};

export const updateEmployee = (updated) => {
  const list = getEmployees().map(e => e.id === updated.id ? updated : e);
  setItem(KEYS.EMPLOYEES, list);
};

export const deleteEmployee = (id) => setItem(KEYS.EMPLOYEES, getEmployees().filter(e => e.id !== id));

// ─── DEPARTMENTS ──────────────────────────────────────────────
export const getDepartments = () => getItem(KEYS.DEPARTMENTS);

export const addDepartment = (dept) => {
  const list = getDepartments();
  const maxId = list.reduce((max, d) => {
    const num = parseInt(d.id.replace('DEPT', ''));
    return num > max ? num : max;
  }, 0);
  const newDept = { ...dept, id: `DEPT${String(maxId + 1).padStart(3, '0')}` };
  list.push(newDept);
  setItem(KEYS.DEPARTMENTS, list);
  return newDept;
};

export const updateDepartment = (updated) => setItem(KEYS.DEPARTMENTS, getDepartments().map(d => d.id === updated.id ? updated : d));
export const deleteDepartment = (id) => setItem(KEYS.DEPARTMENTS, getDepartments().filter(d => d.id !== id));

// ─── DESIGNATIONS ──────────────────────────────────────────────
export const getDesignations = () => getItem(KEYS.DESIGNATIONS);

export const addDesignation = (desig) => {
  const list = getDesignations();
  const maxId = list.reduce((max, d) => {
    const num = parseInt(d.id.replace('DES', ''));
    return num > max ? num : max;
  }, 0);
  const newDesig = { ...desig, id: `DES${String(maxId + 1).padStart(3, '0')}` };
  list.push(newDesig);
  setItem(KEYS.DESIGNATIONS, list);
  return newDesig;
};

export const updateDesignation = (updated) => setItem(KEYS.DESIGNATIONS, getDesignations().map(d => d.id === updated.id ? updated : d));
export const deleteDesignation = (id) => setItem(KEYS.DESIGNATIONS, getDesignations().filter(d => d.id !== id));

// ─── ATTENDANCE ──────────────────────────────────────────────
export const getAttendance = () => getItem(KEYS.ATTENDANCE);
export const saveAttendance = (records) => setItem(KEYS.ATTENDANCE, records);

// ─── PAYROLL ──────────────────────────────────────────────
export const getPayroll = () => getItem(KEYS.PAYROLL);
export const savePayroll = (records) => setItem(KEYS.PAYROLL, records);

export const updatePayrollRecord = (updated) => {
  const list = getPayroll().map(p => p.id === updated.id ? updated : p);
  setItem(KEYS.PAYROLL, list);
};

// ─── SETTINGS ──────────────────────────────────────────────
export const getSettings = () => JSON.parse(localStorage.getItem(KEYS.SETTINGS) || JSON.stringify(defaultSettings));
export const saveSettings = (settings) => localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));

// ─── DASHBOARD STATS ──────────────────────────────────────────────
export const getDashboardStats = () => {
  const employees = getEmployees();
  const departments = getDepartments();
  const attendance = getAttendance();
  const payroll = getPayroll();
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === 'Present').length;
  const absentToday = todayAttendance.filter(a => a.status === 'Absent').length;
  const totalSalary = payroll.reduce((sum, p) => sum + (Number(p.netSalary) || 0), 0);

  return {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'Active').length,
    totalDepartments: departments.length,
    presentToday,
    absentToday,
    onLeave: employees.filter(e => e.status === 'On Leave').length,
    totalSalary,
  };
};
