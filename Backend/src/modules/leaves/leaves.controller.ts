import { IncomingMessage, ServerResponse } from 'http'
import pool from '../../config/db'
import {
  applyLeaveService,
  getAllLeavesService,
  updateLeaveStatusService,
  getLeaveBalanceForEmployee
} from './leaves.service'
import { verifyJWT,AuthRequest } from '../../middlewares/auth.middleware'




export const applyLeaveController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  let body = ''

  req.on('data', chunk => {
    body += chunk.toString()
    console.log('📥 Chunk:', chunk.toString());
  })

  req.on('end', async () => {
    console.log('📦 FULL BODY:', body);
    console.log('📦 Is body empty?', body.length === 0);
    
    try {
      // Check if body is empty
      if (!body.trim()) {
        throw new Error('Request body is empty. Please send JSON data.');
      }
      
      const data = JSON.parse(body);
      console.log('📋 PARSED DATA:', data);
      console.log('🔍 leave_type exists?', 'leave_type' in data);
      console.log('🔍 leave_type value:', data.leave_type);
      console.log('🔍 All fields:', Object.keys(data));
      
      const user = (req as AuthRequest).user;
      console.log('👤 User:', user);
      
      const employeeResult = await pool.query(
        'SELECT id FROM employees WHERE user_id = $1',
        [user.userId]
      )

      if (employeeResult.rows.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Employee profile not found' }))
        return
      }

      const employeeId = employeeResult.rows[0].id
      console.log('👤 Employee ID:', employeeId);
      
      
      const servicePayload = {
        employeeId,
        leaveType: data.leave_type,
        fromDate: data.from_date,
        toDate: data.to_date,
        reason: data.reason,
      };
      
      console.log('🚀 Calling applyLeaveService with:', servicePayload);
      console.log('🔍 leaveType in payload:', servicePayload.leaveType);
      console.log('🔍 Type of leaveType:', typeof servicePayload.leaveType);
      
      const leave = await applyLeaveService(servicePayload);

      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(leave))
    } catch (error: any) {
      console.error('❌ FULL ERROR:', error);
      console.error('❌ ERROR STACK:', error.stack);
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ 
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }))
    }
  })
}


export const getAllLeavesController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const user = (req as AuthRequest).user

    if (user.role !== 'ADMIN') {
      res.writeHead(403, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Access denied' }))
      return
    }

    const leaves = await getAllLeavesService()

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(leaves))
  } catch (error: any) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: error.message }))
  }
}


export const updateLeaveStatusController = async (
  req: IncomingMessage,
  res: ServerResponse,
  leaveId: number
) => {
  let body = ''

  req.on('data', chunk => {
    body += chunk.toString()
  })

  req.on('end', async () => {
    try {
      const user = (req as AuthRequest).user

      if (user.role !== 'ADMIN') {
        res.writeHead(403, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Access denied' }))
        return
      }

      const data = JSON.parse(body)

      const updatedLeave = await updateLeaveStatusService(
        leaveId,
        data.status,
        data.admin_remarks || null
      )

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(updatedLeave))
    } catch (error: any) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  })
}

export const getMyLeaveBalanceController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (!verifyJWT(req as AuthRequest, res)) return;

  const user = (req as AuthRequest).user;

  try {
    const empRes = await pool.query(
      "SELECT id FROM employees WHERE user_id = $1",
      [user.userId]
    );

    if (empRes.rows.length === 0) {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "Employee not found" }));
      return;
    }

    const employeeId = empRes.rows[0].id;

    const balance = await getLeaveBalanceForEmployee(employeeId);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ availableLeaves: balance }));
  } catch {
    res.writeHead(500);
    res.end(JSON.stringify({ message: "Leave balance error" }));
  }
};

export const getMyLeaveStatusController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const user = (req as AuthRequest).user;
    
    // Get employee ID
    const employeeResult = await pool.query(
      'SELECT id FROM employees WHERE user_id = $1',
      [user.userId]
    );

    if (employeeResult.rows.length === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: false, 
        message: 'Employee not found' 
      }));
      return;
    }

    const employeeId = employeeResult.rows[0].id;
    
    // ✅ CORRECTED QUERY - using created_at instead of applied_on
    const result = await pool.query(`
      SELECT 
        id,
        leave_type as "leaveType",
        from_date as "fromDate",
        to_date as "toDate",
        reason,
        status,
        admin_remarks as "adminRemarks",
        created_at as "appliedOn"
      FROM leaves 
      WHERE employee_id = $1
        AND status IN ('PENDING', 'APPROVED', 'REJECTED')
      ORDER BY created_at DESC
    `, [employeeId]);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      count: result.rows.length,
      leaves: result.rows
    }));

  } catch (error: any) {
    console.error('Error fetching leave status:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: false, 
      message: error.message 
    }));
  }
};