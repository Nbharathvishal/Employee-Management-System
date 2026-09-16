import pool from "../../config/db";
import bcrypt from "bcrypt";
import { isNewMonth } from "../../utils/data.utils";

/* =====================================================
   CREATE EMPLOYEE (USER + EMPLOYEE)
===================================================== */
export const createEmployeeService = async (data: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  role: "EMPLOYEE" | "ADMIN";
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const namePart = data.email.split('@')[0];
    const username = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    // 👤 Create user
    const userRes = await client.query(
      `
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [username, data.email, hashedPassword, data.role]
    );

    const userId = userRes.rows[0].id;
    const employeeCode = 'EMP' + String(userId).padStart(3, '0');

    // 🧑‍💼 Create employee
    await client.query(
      `
      INSERT INTO employees
      (
        user_id,
        full_name,
        email,
        phone,
        department,
        designation,
        position,
        date_of_joining,
        hire_date,
        leave_balance,
        leave_reset_at,
        salary,
        address,
        emergency_contact,
        employee_code
      )
      VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $7, 3, CURRENT_DATE, 50000, '', '', $8)
      `,
      [
        userId,
        data.fullName,
        data.email,
        data.phone || null,
        data.department,
        data.designation,
        data.dateOfJoining || null,
        employeeCode,
      ]
    );

    await client.query("COMMIT");

    return { message: "Employee created successfully" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

/* =====================================================
   GET ALL EMPLOYEES (ADMIN)
===================================================== */
export const getAllEmployeesService = async () => {
  const result = await pool.query(`
    SELECT
      e.id,
      e.full_name,
      e.phone,
      e.department,
      e.designation,
      e.status,
      e.date_of_joining,
      e.leave_balance,
      u.email,
      u.role
    FROM employees e
    JOIN users u ON u.id = e.user_id
    ORDER BY e.created_at DESC
  `);

  return result.rows;
};

/* =====================================================
   GET EMPLOYEE BY ID (EDIT)
===================================================== */
export const getEmployeeByIdService = async (id: number) => {
  const result = await pool.query(
    `
    SELECT
      e.id,
      e.full_name,
      e.phone,
      e.department,
      e.designation,
      e.date_of_joining,
      e.status,
      e.leave_balance,
      u.email,
      u.role
    FROM employees e
    JOIN users u ON u.id = e.user_id
    WHERE e.id = $1
    `,
    [id]
  );

  return result.rows[0];
};

/* =====================================================
   UPDATE EMPLOYEE
===================================================== */
export const updateEmployeeService = async (
  id: number,
  data: {
    fullName: string;
    email?: string;
    phone?: string;
    department: string;
    designation: string;
    status: string;
  }
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `
      UPDATE employees
      SET
        full_name = $1,
        phone = $2,
        department = $3,
        designation = $4,
        position = $4,
        status = $5,
        email = COALESCE($6, email),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      `,
      [
        data.fullName,
        data.phone || null,
        data.department,
        data.designation,
        data.status,
        data.email || null,
        id,
      ]
    );

    if (data.email) {
      await client.query(
        `
        UPDATE users
        SET email = $1
        WHERE id = (SELECT user_id FROM employees WHERE id = $2)
        `,
        [data.email, id]
      );
    }

    await client.query("COMMIT");
    return { message: "Employee updated successfully" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};


/* =====================================================
   MONTHLY LEAVE RESET
===================================================== */
export const resetMonthlyLeaveIfNeeded = async (employeeId: number) => {
  const res = await pool.query(
    "SELECT leave_reset_at FROM employees WHERE id = $1",
    [employeeId]
  );

  const lastReset = res.rows[0]?.leave_reset_at;

  if (!lastReset || isNewMonth(new Date(lastReset))) {
    await pool.query(
      `
      UPDATE employees
      SET leave_balance = 3,
          leave_reset_at = CURRENT_DATE
      WHERE id = $1
      `,
      [employeeId]
    );
  }
};


export const getEmployeeProfileService = async (userId: number) => {
  const result = await pool.query(
    `
    SELECT 
      e.full_name,
      COALESCE(e.email, u.email) as email,
      e.phone,
      e.address,
      e.department,
      e.designation,
      e.position,
      e.date_of_joining,
      e.hire_date,
      e.employee_code
    FROM employees e
    JOIN users u ON u.id = e.user_id
    WHERE e.user_id = $1
    `,
    [userId]
  );

  return result.rows[0];
};


