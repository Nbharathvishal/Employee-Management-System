// src/modules/attendance/attendance.routes.ts
import { IncomingMessage, ServerResponse } from "http";
import * as controller from "./attendance.controller";
import { verifyJWT, AuthRequest } from "../../middlewares/auth.middleware";

export const attendanceRoutes = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const pathname = url.pathname;

  console.log('Route Handler - Path:', pathname);
  console.log('Route Handler - Method:', req.method);

  // Handle GET /attendance/today
  if (req.method === "GET" && pathname === "/attendance/today") {
    console.log('✅ Route matched: GET /attendance/today');
    
    const ok = verifyJWT(req as AuthRequest, res);
    console.log('verifyJWT returned:', ok);
    
    if (!ok) {
      console.log('⛔ Authentication failed, stopping request');
      return true;
    }
    
    console.log('✅ Authentication passed, calling controller');
    await controller.getTodayAttendanceController(req, res);
    return true;
  }

  // Handle POST /attendance/check-in
  if (req.method === "POST" && pathname === "/attendance/check-in") {
    console.log('✅ Route matched: POST /attendance/check-in');
    
    const ok = verifyJWT(req as AuthRequest, res);
    if (!ok) {
      return true;
    }
    
    await controller.checkInController(req, res);
    return true;
  }

  // Handle POST /attendance/check-out
  if (req.method === "POST" && pathname === "/attendance/check-out") {
    console.log('✅ Route matched: POST /attendance/check-out');
    
    const ok = verifyJWT(req as AuthRequest, res);
    if (!ok) {
      return true;
    }
    
    await controller.checkOutController(req, res);
    return true;
  }

  console.log('❌ Route not matched');
  return false;
};