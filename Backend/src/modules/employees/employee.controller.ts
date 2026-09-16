import { IncomingMessage, ServerResponse } from "http";
import {
  createEmployeeService,
  getAllEmployeesService,
  getEmployeeByIdService,
  updateEmployeeService,
} from "./employee.service";
import { verifyJWT, AuthRequest } from "../../middlewares/auth.middleware";
import pool from "../../config/db";
import { getWorkingDaysInMonth } from "../../utils/data.utils";

// Create Employee
export const createEmployeeController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (!verifyJWT(req as AuthRequest, res)) return;

  const user = (req as AuthRequest).user;
  if (user.role !== "ADMIN") {
    res.writeHead(403);
    res.end(JSON.stringify({ message: "Access denied" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));

  req.on("end", async () => {
    try {
      const data = JSON.parse(body);
      const result = await createEmployeeService(data);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (err: any) {
      res.writeHead(400);
      res.end(JSON.stringify({ message: err.message }));
    }
  });
};

// Get All Employee
export const getAllEmployeesController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (!verifyJWT(req as AuthRequest, res)) return;

  const user = (req as AuthRequest).user;
  if (user.role !== "ADMIN") {
    res.writeHead(403);
    res.end(JSON.stringify({ message: "Access denied" }));
    return;
  }

  const data = await getAllEmployeesService();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

// Get Employee by Id
export const getEmployeeByIdController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (!verifyJWT(req as AuthRequest, res)) return;

  const id = Number(req.url?.split("/").pop());
  const data = await getEmployeeByIdService(id);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

// UPDATE EMPLOYEE
export const updateEmployeeController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (!verifyJWT(req as AuthRequest, res)) return;

  const id = Number(req.url?.split("/").pop());

  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));

  req.on("end", async () => {
    try {
      const data = JSON.parse(body);
      await updateEmployeeService(id, data);
      res.writeHead(200);
      res.end(JSON.stringify({ message: "Employee updated" }));
    } catch (err: any) {
      console.error("Update employee error:", err);
      res.writeHead(500);
      res.end(JSON.stringify({ message: err.message || "Internal server error" }));
    }
  });
};

// Get Employee Dashboard
export const getEmployeeDashboardController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (!verifyJWT(req as AuthRequest, res)) return;

  const user = (req as AuthRequest).user;

  // Get employee data
  const empRes = await pool.query(
    "SELECT id, full_name, leave_balance FROM employees WHERE user_id = $1",
    [user.userId]
  );

  if (empRes.rows.length === 0) {
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Employee not found" }));
    return;
  }

  const employeeId = empRes.rows[0].id;

  // Get latest attendance
  const attendanceRes = await pool.query(
    `
    SELECT punch_in, punch_out
    FROM attendance
    WHERE employee_id = $1
    ORDER BY date DESC, id DESC
    LIMIT 1
    `,
    [employeeId]
  );

  const row = attendanceRes.rows[0];
  const checkedIn = row ? !!row.punch_in && !row.punch_out : false;
  const lastActionTime = row?.punch_out || row?.punch_in || null;

  // Get working days
  const now = new Date();
  const workingDays = getWorkingDaysInMonth(
    now.getFullYear(),
    now.getMonth()
  );

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      employeeName: empRes.rows[0].full_name,
      availableLeaves: empRes.rows[0].leave_balance,
      checkedIn,
      lastActionTime,
      workingDays,
    })
  );
};

// GET EMPLOYEE PROFILE
export const getEmployeeProfileController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    if (!verifyJWT(req as AuthRequest, res)) return;

    const user = (req as AuthRequest).user;
    
    // Fetch user profile from database
    const userRes = await pool.query(
      `SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.role, 
        u.created_at,
        e.id as employee_id,
        e.full_name, 
        e.department, 
        e.position, 
        e.phone, 
        e.hire_date,
        e.leave_balance, 
        e.salary, 
        e.address, 
        e.emergency_contact,
        e.updated_at
      FROM users u
      LEFT JOIN employees e ON u.id = e.user_id
      WHERE u.id = $1`,
      [user.userId]
    );

    if (userRes.rows.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ message: 'User not found' }));
      return;
    }

    const userData = userRes.rows[0];
    
    // Format response data
    const profileData = {
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        createdAt: userData.created_at,
      },
      employee: {
        id: userData.employee_id,
        fullName: userData.full_name,
        department: userData.department,
        position: userData.position,
        phone: userData.phone,
        hireDate: userData.hire_date,
        leaveBalance: userData.leave_balance,
        salary: userData.salary,
        address: userData.address,
        emergencyContact: userData.emergency_contact,
        updatedAt: userData.updated_at,
      }
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: profileData
    }));
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ 
      message: 'Failed to load profile data' 
    }));
  }
};

// Update Employee Profile
export const updateEmployeeProfileController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    if (!verifyJWT(req as AuthRequest, res)) return;

    const user = (req as AuthRequest).user;

    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));

    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const { 
          fullName, 
          phone, 
          address, 
          emergencyContact,
          department,
          position 
        } = data;

        // Update employee profile
        const result = await pool.query(
          `UPDATE employees 
           SET 
             full_name = COALESCE($1, full_name),
             phone = COALESCE($2, phone),
             address = COALESCE($3, address),
             emergency_contact = COALESCE($4, emergency_contact),
             department = COALESCE($5, department),
             position = COALESCE($6, position),
             updated_at = NOW()
           WHERE user_id = $7
           RETURNING 
             id, 
             full_name, 
             phone, 
             address, 
             emergency_contact,
             department,
             position,
             updated_at`,
          [
            fullName, 
            phone, 
            address, 
            emergencyContact,
            department,
            position,
            user.userId
          ]
        );

        if (result.rows.length === 0) {
          res.writeHead(404);
          res.end(JSON.stringify({ message: 'Employee not found' }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          success: true,
          message: 'Profile updated successfully',
          data: result.rows[0]
        }));
      } catch (err: any) {
        console.error('Update error:', err);
        res.writeHead(400);
        res.end(JSON.stringify({ 
          message: err.message || 'Failed to update profile' 
        }));
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ 
      message: 'Failed to update profile' 
    }));
  }
};


