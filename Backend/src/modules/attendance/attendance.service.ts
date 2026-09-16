// src/modules/attendance/attendance.service.ts
import pool from "../../config/db";


const getEmployeeIdByUserId = async (userId: number): Promise<number> => {
  const result = await pool.query(
    "SELECT id FROM employees WHERE user_id = $1",
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("Employee profile not found");
  }

  return result.rows[0].id;
};

/* ================= EMPLOYEE – CHECK IN ================= */
export const checkInService = async (userId: number) => {
  console.log("👉 CHECK-IN START, userId:", userId);

  const employeeId = await getEmployeeIdByUserId(userId);

  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const isBefore930 = hour < 9 || (hour === 9 && minute < 30);
  if (isBefore930) {
    throw new Error("Punch In allowed only after 09:30 AM");
  }

  const existing = await pool.query(
    `
    SELECT id
    FROM attendance
    WHERE employee_id = $1
      AND date = CURRENT_DATE
    `,
    [employeeId]
  );

  if (existing.rows.length > 0) {
    throw new Error(
      "Already punched in today. You can punch in again tomorrow after 09:30 AM"
    );
  }

  const result = await pool.query(
    `
    INSERT INTO attendance (employee_id, date, punch_in, status)
    VALUES ($1, CURRENT_DATE, CURRENT_TIME, 'PRESENT')
    RETURNING *
    `,
    [employeeId]
  );

  return result.rows[0];
};

/* ================= EMPLOYEE – CHECK OUT ================= */
export const checkOutService = async (userId: number) => {
  const employeeId = await getEmployeeIdByUserId(userId);

  const result = await pool.query(
    `
    UPDATE attendance
    SET punch_out = CURRENT_TIME,
        total_hours = ROUND(
          EXTRACT(EPOCH FROM (CURRENT_TIME - punch_in)) / 3600,
          2
        )
    WHERE employee_id = $1
      AND date = CURRENT_DATE
      AND punch_out IS NULL
    RETURNING *
    `,
    [employeeId]
  );

  if (result.rows.length === 0) {
    throw new Error("No active check-in found for today");
  }

  return result.rows[0];
};

/* ================= EMPLOYEE – TODAY STATUS ================= */
export const getTodayAttendanceService = async (userId: number) => {
  const employeeId = await getEmployeeIdByUserId(userId);

  const result = await pool.query(
    `
    SELECT punch_in, punch_out
    FROM attendance
    WHERE employee_id = $1
      AND date = CURRENT_DATE
    `,
    [employeeId]
  );

  if (result.rows.length === 0) {
    return {
      status: "NOT_CHECKED_IN",
      checkInTime: null,
      checkOutTime: null,
    };
  }

  const row = result.rows[0];

  return {
    status: row.punch_out ? "CHECKED_OUT" : "CHECKED_IN",
    checkInTime: row.punch_in,
    checkOutTime: row.punch_out,
  };
};

/* ================= ADMIN SERVICES ================= */
export const getAllAttendanceService = async () => {
  const result = await pool.query(`
    SELECT
      a.id,
      a.employee_id,
      e.full_name,
      e.department,
      e.designation,
      a.date,
      a.punch_in,
      a.punch_out,
      a.total_hours,
      a.status
    FROM attendance a
    JOIN employees e ON e.id = a.employee_id
    ORDER BY a.date DESC
  `);

  return result.rows;
};

export const getMissingPunchOutService = async () => {
  const result = await pool.query(`
    SELECT
      a.id,
      a.employee_id,
      e.full_name,
      e.department,
      a.date,
      a.punch_in
    FROM attendance a
    JOIN employees e ON e.id = a.employee_id
    WHERE a.punch_in IS NOT NULL
      AND a.punch_out IS NULL
      AND a.date < CURRENT_DATE
    ORDER BY a.date DESC
  `);

  return result.rows;
};

const OFFICE_START = "09:30";
const OFFICE_END = "18:30";

// attendance.service.ts - Late In Employees Service
export const getLateEntriesService = async () => {
  try {
    const result = await pool.query(`
      SELECT
        a.employee_id as "empId",
        e.full_name as "name",
        e.department,
        TO_CHAR(a.date, 'DD-MM-YYYY') as "date",
        TO_CHAR(a.punch_in, 'HH24:MI') as "punchIn",
        FLOOR(
          EXTRACT(EPOCH FROM (a.punch_in::time - TIME '09:30:00')) / 60
        )::integer as "lateByMinutes"
      FROM attendance a
      JOIN employees e ON e.id = a.employee_id
      WHERE a.punch_in IS NOT NULL
        AND a.punch_in::time > TIME '09:30:00'  -- Late if after 9:30 AM
      ORDER BY a.date DESC, "lateByMinutes" DESC
      LIMIT 100  -- Limit results
    `);

    // Format the response - Only 6 fields matching your UI
    const formatted = result.rows.map(row => ({
      empId: row.empId,
      name: row.name,
      department: row.department,
      date: row.date,
      punchIn: row.punchIn,
      lateBy: row.lateByMinutes > 60 
        ? `${Math.floor(row.lateByMinutes / 60)}h ${row.lateByMinutes % 60}m`
        : `${row.lateByMinutes}m`,
      lateByMinutes: row.lateByMinutes
    }));

    return formatted;
  } catch (error) {
    console.error('Error in getLateEntriesService:', error);
    throw error;
  }
};

// attendance.service.ts - Early Exits Service
export const getEarlyExitsService = async () => {
  try {
    const result = await pool.query(`
      SELECT
        a.employee_id as "empId",
        e.full_name as "name",
        e.department,
        TO_CHAR(a.date, 'DD-MM-YYYY') as "date",
        TO_CHAR(a.punch_out, 'HH24:MI') as "punchOut",
        FLOOR(
          EXTRACT(EPOCH FROM (TIME '18:30:00' - a.punch_out::time)) / 60
        )::integer as "earlyByMinutes"
      FROM attendance a
      JOIN employees e ON e.id = a.employee_id
      WHERE a.punch_out IS NOT NULL
        AND a.punch_out::time < TIME '18:30:00'
      ORDER BY a.date DESC, "earlyByMinutes" DESC
    `);

    // Format the response
    const formatted = result.rows.map(row => ({
      empId: row.empId,
      name: row.name,
      department: row.department,
      date: row.date,
      punchOut: row.punchOut,
      earlyBy: row.earlyByMinutes > 60 
        ? `${Math.floor(row.earlyByMinutes / 60)}h ${row.earlyByMinutes % 60}m`
        : `${row.earlyByMinutes}m`,
      earlyByMinutes: row.earlyByMinutes
    }));

    return formatted;
  } catch (error) {
    console.error('Error in getEarlyExitsService:', error);
    throw error;
  }
};

export const getDailyAttendanceSummaryService = async (date: string) => {
  const result = await pool.query(
    `
    SELECT
      COUNT(*) FILTER (WHERE punch_in IS NOT NULL) AS present,
      COUNT(*) FILTER (WHERE punch_in::time > $2) AS late
    FROM attendance
    WHERE date = $1
    `,
    [date, OFFICE_START]
  );
  return result.rows[0];
};

export const getWeeklyAttendanceSummaryService = async (
  startDate: string,
  endDate: string
) => {
  const result = await pool.query(
    `
    SELECT
      COUNT(*) FILTER (WHERE punch_in IS NOT NULL) AS present,
      COUNT(*) FILTER (WHERE punch_in::time > $3) AS late
    FROM attendance
    WHERE date BETWEEN $1 AND $2
    `,
    [startDate, endDate, OFFICE_START]
  );
  return result.rows[0];
};

export const getMonthlyAttendanceSummaryService = async (month: string) => {
  const result = await pool.query(
    `
    SELECT
      COUNT(*) FILTER (WHERE punch_in IS NOT NULL) AS present,
      COUNT(*) FILTER (WHERE punch_in::time > $2) AS late
    FROM attendance
    WHERE TO_CHAR(date, 'YYYY-MM') = $1
    `,
    [month, OFFICE_START]
  );
  return result.rows[0];
};

export const getLastActionTimeService = async (userId: number) => {
  const employeeId = await getEmployeeIdByUserId(userId);

  const result = await pool.query(
    `
    SELECT punch_in, punch_out
    FROM attendance
    WHERE employee_id = $1
    ORDER BY date DESC, id DESC
    LIMIT 1
    `,
    [employeeId]
  );

  if (result.rows.length === 0) return null;
  return result.rows[0].punch_out || result.rows[0].punch_in;
};

export const getLastMonthAttendanceService = async (userId: number) => {
  const employeeId = await getEmployeeIdByUserId(userId);

  const result = await pool.query(
    `
    SELECT date, punch_in, punch_out
    FROM attendance
    WHERE employee_id = $1
      AND date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
      AND date < date_trunc('month', CURRENT_DATE)
    ORDER BY date
    `,
    [employeeId]
  );

  return result.rows;
};
