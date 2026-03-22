import { Routes, Route } from "react-router-dom";
import LoginSelect from "../pages/auth/LoginSelect";
import Login from "../pages/auth/Login";
import ProtectedRoute from "../components/layout/ProtectedRoute";

/* ADMIN */
import AdminDashboard from "../pages/admin/Dashboard";
import AddEmployee from "../pages/admin/employees/AddEmployee";
import EmployeeList from "../pages/admin/employees/EmployeeList";
import EditEmployee from "../pages/admin/employees/EditEmployee";
import LeaveRequests from "../pages/admin/leaves/LeaveRequests";
import EmployeesLateIn from "../pages/admin/employees/employessLateIn";
import EmployeesEarlyOut from "../pages/admin/employees/employeeEarlyOut";

/* EMPLOYEE */
import EmployeeDashboard from "../pages/employee/Dashboard";
import ApplyLeave from "../components/employee/ApplyLeave";

export default function AppRoutes() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/" element={<LoginSelect />} />
      <Route path="/login" element={<LoginSelect />} />
      <Route path="/login/:role" element={<Login />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ VIEW ALL EMPLOYEES */}
      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute role="ADMIN">
            <EmployeeList />
          </ProtectedRoute>
        }
      />

      {/* ✅ EDIT EMPLOYEE */}
      <Route
        path="/admin/employees/edit"
        element={
          <ProtectedRoute role="ADMIN">
            <EditEmployee />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/employees/new"
        element={
          <ProtectedRoute role="ADMIN">
            <AddEmployee />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/leaves"
        element={
          <ProtectedRoute role="ADMIN">
            <LeaveRequests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/employeesLateIn"
        element={
          <ProtectedRoute role="ADMIN">
            <EmployeesLateIn />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/employeesEarlyOut"
        element={
          <ProtectedRoute role="ADMIN">
            <EmployeesEarlyOut />
          </ProtectedRoute>
        }
      />

      {/* ================= EMPLOYEE ================= */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/apply-leave"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <ApplyLeave />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
