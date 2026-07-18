# Employee Management System

A full-featured Employee Management System built with **React + Vite** and powered by a **JSON Server** REST API (mock backend).

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the API Server (JSON Server)

Open a **new terminal** and run:

```bash
npm run server
```

> API will be available at: **http://localhost:3001**

### 3. Run the React App

In a **separate terminal** run:

```bash
npm run dev
```

> App will open at: **http://localhost:5173**

---

## 📡 API Endpoints

Base URL: `http://localhost:3001`

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/employees` | Get all employees |
| `GET` | `/employees/:id` | Get employee by ID |
| `POST` | `/employees` | Add new employee |
| `PUT` | `/employees/:id` | Update employee |
| `DELETE` | `/employees/:id` | Delete employee |

### Departments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/departments` | Get all departments |
| `POST` | `/departments` | Add department |
| `PUT` | `/departments/:id` | Update department |
| `DELETE` | `/departments/:id` | Delete department |

### Designations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/designations` | Get all designations |
| `POST` | `/designations` | Add designation |
| `PUT` | `/designations/:id` | Update designation |
| `DELETE` | `/designations/:id` | Delete designation |

---

## 🧪 Testing with Postman

### GET all employees
```
GET http://localhost:3001/employees
```

### GET one employee
```
GET http://localhost:3001/employees/1
```

### POST – Add employee
```
POST http://localhost:3001/employees
Content-Type: application/json

{
  "employeeId": "EMP013",
  "name": "Test Employee",
  "email": "test@company.com",
  "phone": "9999999999",
  "department": "Development",
  "designation": "Software Engineer",
  "salary": 50000,
  "joiningDate": "2026-07-10",
  "status": "Active"
}
```

### PUT – Update employee
```
PUT http://localhost:3001/employees/1
Content-Type: application/json

{
  "salary": 100000,
  "status": "Active"
}
```

### DELETE – Delete employee
```
DELETE http://localhost:3001/employees/1
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8 |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Mock API | JSON Server |
| Icons | Lucide React |
| PDF Export | jsPDF + jspdf-autotable |
| Excel Export | SheetJS (xlsx) |

---

## 📁 Project Structure

```
employee-management/
├── db.json                    ← JSON Server database
├── package.json
├── src/
│   ├── services/
│   │   └── api.js             ← Axios REST API service
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── EmployeeManagement.jsx
│   │   ├── EmployeeForm.jsx
│   │   ├── Departments.jsx
│   │   ├── Designations.jsx
│   │   └── ...
│   └── App.jsx
```

---

## ✅ Key Features

- **Full CRUD via REST API** — all operations persist in `db.json`
- **Real-time sync** — Add/Edit/Delete in React → immediately visible in Postman
- **Loading spinners** while API requests are in flight
- **Error messages** if JSON Server is not running
- **Search, Filter, Sort** on Employee table (client-side, instant)
- **Pagination** (10 per page)
- **Export** to PDF and Excel
- **Dashboard stats** auto-update from API data
