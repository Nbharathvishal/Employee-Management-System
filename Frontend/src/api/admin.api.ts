

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Dashboard top cards
export const getDashboardStats = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/dashboard-stats`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load dashboard stats");
  }

  return res.json();
};

// 🔥 Admin Dashboard Attendance Summary
export const getAdminDashboardAttendance = async (view: string = "DAILY") => {
  const res = await fetch(
    `${BASE_URL}/api/admin/dashboard-attendance?view=${view}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load admin attendance summary");
  }

  return res.json();
};

// 👇 Add Employee (ADMIN)
export interface CreateEmployeePayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  department: string;
  designation: string;
  dateOfJoining: string; // YYYY-MM-DD
  role: "EMPLOYEE" | "ADMIN";
}

export const createEmployee = async (
  payload: CreateEmployeePayload
) => {
  const res = await fetch(`${BASE_URL}/api/admin/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create employee");
  }

  return res.json();
};

//Get All Employee
export const getAllEmployees = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/employees`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load employees");
  }

  return res.json();
};



// UPDATE EMPLOYEE
export const updateEmployee = async (
  id: number,
  data: any
) => {
  const payload = {
    fullName: data.fullName || data.full_name,
    email: data.email,
    phone: data.phone,
    department: data.department,
    designation: data.designation,
    status: data.status,
    dateOfJoining: data.dateOfJoining || data.date_of_joining,
  };

  const res = await fetch(`${BASE_URL}/api/admin/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update employee");
  }

  return res.json();
};



// GET ALL LEAVE REQUESTS
export const getAllLeaveRequests = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/leaves`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load leave requests");
  }

  return res.json();
};



export const updateLeaveStatus = async (
  leaveId: number,
  status: "APPROVED" | "REJECTED",
  adminRemarks: string
) => {
  const res = await fetch(`${BASE_URL}/leaves/${leaveId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      status,
      adminRemarks,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update leave status");
  }

  return res.json();
};

// GET LATE PUNCH-IN EMPLOYEES
// api/admin.api.ts
export const getLatePunchInEmployees = async (): Promise<any[]> => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/attendance/late-entries`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load late punch-ins");
  }

  const result = await res.json();
  console.log("API Result:", result); // Debug
  
  if (result.success && Array.isArray(result.data)) {
    // Map backend fields to frontend fields
    return result.data.map((item: any) => ({
      id: item.empId,                   // Map empId to id
      employee_id: item.empId,          // Map empId to employee_id
      full_name: item.name,             // Map name to full_name
      department: item.department,
      date: item.date,
      punch_in: item.punchIn,           // Map punchIn to punch_in
      late_by: item.lateBy              // Map lateBy to late_by
    }));
  }
  
  return [];
};


// GET EARLY PUNCH-OUT EMPLOYEES
export const getEarlyPunchOutEmployees = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/attendance/early-exits`, // ← Add /admin/
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load early punch-outs");
  }

  return res.json();
};



