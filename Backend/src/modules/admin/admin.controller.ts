import pool from "../../config/db";
import {
  getMonthlyAttendanceSummaryService,
  getDailyAttendanceSummaryService,
  getWeeklyAttendanceSummaryService,
  getLateEntriesService,
  getEarlyExitsService,
} from "../attendance/attendance.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { getWorkingDaysInMonth } from "../../utils/data.utils";


// Admin Attendance
export const getAdminMonthlyDashboardSummary = async (
  req: AuthRequest,
  res: any
) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const monthIndex = now.getMonth(); // 0-based
    const monthStr = now.toISOString().slice(0, 7); // YYYY-MM

    // TOTAL EMPLOYEES
    const empRes = await pool.query(
      "SELECT COUNT(*) FROM employees"
    );
    const totalEmployees = Number(empRes.rows[0].count);

    // Parse view from URL query: ?view=DAILY | WEEKLY | MONTHLY
    const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
    const view = (urlObj.searchParams.get('view') || 'DAILY').toUpperCase();

    let totalPresent = 0;
    let expectedAttendance = totalEmployees;
    let workingDays = 1;

    if (view === 'DAILY') {
      const todayStr = now.toISOString().slice(0, 10);
      const dailyRes = await getDailyAttendanceSummaryService(todayStr);
      totalPresent = Number(dailyRes?.present || 0);
      expectedAttendance = totalEmployees;
      workingDays = 1;
    } else if (view === 'WEEKLY') {
      const day = now.getDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);

      const mondayStr = monday.toISOString().slice(0, 10);
      const fridayStr = friday.toISOString().slice(0, 10);
      const weeklyRes = await getWeeklyAttendanceSummaryService(mondayStr, fridayStr);
      totalPresent = Number(weeklyRes?.present || 0);
      workingDays = 5;
      expectedAttendance = totalEmployees * workingDays;
    } else { // MONTHLY
      workingDays = getWorkingDaysInMonth(year, monthIndex);
      const attendance = await getMonthlyAttendanceSummaryService(monthStr);
      totalPresent = Number(attendance?.present || 0);
      expectedAttendance = totalEmployees * workingDays;
    }

    const attendancePercentage =
      expectedAttendance === 0
        ? 0
        : Math.round((totalPresent / expectedAttendance) * 100);

    // LATE & EARLY
    const late = await getLateEntriesService();
    const early = await getEarlyExitsService();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        view,
        workingDays,
        totalEmployees,
        totalPresent,
        expectedAttendance,
        attendancePercentage,
        lateCheckIns: late.length,
        earlyCheckOuts: early.length,
      })
    );
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ message: "Dashboard summary error" }));
  }
};

export const getDashboardStats = async (
  req: AuthRequest,
  res: any
) => {
  try {
    const totalEmployeesRes = await pool.query(
      "SELECT COUNT(*) FROM employees"
    );

    const presentTodayRes = await pool.query(`
      SELECT COUNT(DISTINCT employee_id)
      FROM attendance
      WHERE date = CURRENT_DATE
      AND status = 'PRESENT'
    `);

    const onLeaveRes = await pool.query(`
      SELECT COUNT(DISTINCT employee_id)
      FROM leaves
      WHERE status = 'APPROVED'
      AND CURRENT_DATE BETWEEN from_date AND to_date
    `);

    const pendingLeavesRes = await pool.query(`
      SELECT COUNT(*)
      FROM leaves
      WHERE status = 'PENDING'
    `);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        totalEmployees: Number(totalEmployeesRes.rows[0].count),
        presentToday: Number(presentTodayRes.rows[0].count),
        onLeave: Number(onLeaveRes.rows[0].count),
        pendingLeaves: Number(pendingLeavesRes.rows[0].count),
      })
    );
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ message: "Dashboard stats error" }));
  }
};


// admin.controller.ts - Late In Employees Controller
export const getLateEntriesController = async (
  req: AuthRequest,
  res: any
) => {
  try {
    console.log('⏰ Admin fetching late punch-in employees...');
    
    // Import the service
    const { getLateEntriesService } = await import('../attendance/attendance.service');
    
    const lateEntries = await getLateEntriesService();
    
    console.log(`✅ Found ${lateEntries.length} late entries`);
    
    // Simple response - no summary needed for your UI
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: lateEntries,  // Just the 6 fields array
      count: lateEntries.length
    }));
  } catch (err: any) {
    console.error('❌ Error in getLateEntriesController:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: false,
      message: 'Failed to fetch late punch-ins',
      error: err.message 
    }));
  }
};

// admin.controller.ts - Early Exits Controller
export const getEarlyExitsController = async (
  req: AuthRequest,
  res: any
) => {
  try {
    console.log('🕒 Admin fetching early exits...');
    
    // Import service
    const { getEarlyExitsService } = await import('../attendance/attendance.service');
    
    const earlyExits = await getEarlyExitsService();
    
    console.log(`✅ Found ${earlyExits.length} early exits`);
    
    // Add summary
    const summary = {
      totalEarlyExits: earlyExits.length,
      uniqueEmployees: [...new Set(earlyExits.map(e => e.empId))].length,
      departments: [...new Set(earlyExits.map(e => e.department))],
      earliestExit: earlyExits.length > 0 
        ? earlyExits.reduce((earliest, current) => 
            current.earlyByMinutes > earliest.earlyByMinutes ? current : earliest
          )
        : null,
      averageEarlyByMinutes: earlyExits.length > 0 
        ? Math.round(earlyExits.reduce((sum, e) => sum + e.earlyByMinutes, 0) / earlyExits.length)
        : 0
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      summary,
      data: earlyExits,
      count: earlyExits.length
    }));
  } catch (err: any) {
    console.error('❌ Error in getEarlyExitsController:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: false,
      message: 'Failed to fetch early exits',
      error: err.message 
    }));
  }
};