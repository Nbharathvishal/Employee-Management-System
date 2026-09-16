import pool from '../../config/db'
import { ApplyLeavePayload } from './leaves.types'

// apply leave
export const applyLeaveService = async (
  payload: ApplyLeavePayload
) => {
  console.log('🟢 applyLeaveService called');
  console.log('📦 Service payload:', payload);
  
  // Check EVERY field
  if (!payload) {
    throw new Error('Service received undefined payload');
  }
  
  console.log('🔍 Checking leaveType:', payload.leaveType);
  console.log('🔍 Type of leaveType:', typeof payload.leaveType);
  
  if (payload.leaveType === undefined) {
    throw new Error('leaveType is undefined. Did you send "leave_type" in your JSON?');
  }
  
  if (payload.leaveType === null) {
    throw new Error('leaveType is null');
  }
  
  if (typeof payload.leaveType !== 'string') {
    throw new Error(`leaveType must be a string. Received: ${typeof payload.leaveType}, Value: ${payload.leaveType}`);
  }
  
  const allowedTypes = ["CASUAL", "SICK", "EARNED"];

  // Now safely call toUpperCase
  const leaveType = payload.leaveType.trim().toUpperCase();
  console.log('✅ After toUpperCase:', leaveType);

  if (!allowedTypes.includes(leaveType)) {
    throw new Error(`Invalid leave type: "${leaveType}". Allowed: ${allowedTypes.join(', ')}`);
  }

  // Check other fields too
  if (!payload.fromDate) {
    throw new Error('fromDate is required');
  }
  
  if (!payload.toDate) {
    throw new Error('toDate is required');
  }
  
  if (!payload.reason) {
    throw new Error('reason is required');
  }

  console.log('✅ All validations passed, inserting into DB...');
  
  const result = await pool.query(
    `
    INSERT INTO leaves (
      employee_id,
      leave_type,
      from_date,
      to_date,
      reason,
      status
    )
    VALUES ($1, $2, $3, $4, $5, 'PENDING')
    RETURNING *
    `,
    [
      payload.employeeId,
      leaveType,
      payload.fromDate,
      payload.toDate,
      payload.reason,
    ]
  );

  console.log('✅ DB insert successful');
  return result.rows[0];
};



// GET ALL LEAVES (ADMIN)
export const getAllLeavesService = async () => {
  const result = await pool.query(
    `SELECT l.*, e.full_name
     FROM leaves l
     JOIN employees e ON e.id = l.employee_id
     ORDER BY l.created_at DESC`
  )

  return result.rows
}

// UPDATE LEAVE STATUS (ADMIN)
export const updateLeaveStatusService = async (
  leaveId: number,
  status: "APPROVED" | "REJECTED",
  adminRemarks: string | null
) => {
  const result = await pool.query(
    `
    UPDATE leaves
    SET status = $1,
        admin_remarks = $2
    WHERE id = $3
      AND status = 'PENDING'
    RETURNING *
    `,
    [status, adminRemarks, leaveId]
  );

  if (result.rows.length === 0) {
    throw new Error("Leave already processed or not found");
  }

  // balance deduct ONLY on approve
  if (status === "APPROVED") {
    await pool.query(
      `
      UPDATE employees
      SET leave_balance = leave_balance - 1
      WHERE id = $1
      `,
      [result.rows[0].employee_id]
    );
  }

  return result.rows[0];
};


export const getLeaveBalanceForEmployee = async (
  employeeId: number
): Promise<number> => {
  const now = new Date();
  const month = now.toISOString().slice(0, 7); // YYYY-MM

  const result = await pool.query(
    `
    SELECT COUNT(*) 
    FROM leaves
    WHERE employee_id = $1
      AND status = 'APPROVED'
      AND TO_CHAR(from_date, 'YYYY-MM') = $2
    `,
    [employeeId, month]
  );

  const usedLeaves = Number(result.rows[0].count);
  const TOTAL_LEAVES = 3;

  return Math.max(TOTAL_LEAVES - usedLeaves, 0);
};


