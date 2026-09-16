// src/modules/attendance/attendance.controller.ts
import { IncomingMessage, ServerResponse } from "http";
import * as service from "./attendance.service";
import { verifyJWT, AuthRequest } from "../../middlewares/auth.middleware";

/* ============ EMPLOYEE ============ */
export const checkInController = async (req: IncomingMessage, res: ServerResponse) => {
  if (!verifyJWT(req as AuthRequest, res)) return;

  try {
    const user = (req as AuthRequest).user;
    const data = await service.checkInService(user.userId);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ punchInTime: data.punch_in }));
  } catch (err: any) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: err.message }));
  }
};

// src/modules/attendance/attendance.controller.ts
export const checkOutController = async (req: IncomingMessage, res: ServerResponse) => {
  if (!verifyJWT(req as AuthRequest, res)) return;

  try {
    const user = (req as AuthRequest).user;
    const data = await service.checkOutService(user.userId);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ 
      message: "Checked out successfully",
      punchOutTime: data.punch_out,
      totalHours: data.total_hours 
    }));
  } catch (err: any) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: err.message }));
  }
};

export const getTodayAttendanceController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const user = (req as AuthRequest).user;

    const today = await service.getTodayAttendanceService(user.userId);
    const lastActionTime = await service.getLastActionTimeService(user.userId);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ...today, lastActionTime }));
  } catch (err: any) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: err.message }));
  }
};


/* ============ ADMIN CONTROLLERS ============ */
export const getAllAttendanceController = async (req, res) => {
  if (!verifyJWT(req as AuthRequest, res)) return;
  const data = await service.getAllAttendanceService();
  res.writeHead(200).end(JSON.stringify(data));
};
