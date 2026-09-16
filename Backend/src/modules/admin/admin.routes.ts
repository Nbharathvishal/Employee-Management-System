import { IncomingMessage, ServerResponse } from "http";
import { verifyJWT, authorize, AuthRequest } from "../../middlewares/auth.middleware";
import {
  getDashboardStats,
  getAdminMonthlyDashboardSummary,
  getEarlyExitsController,
  getLateEntriesController
} from "./admin.controller";

export const adminRoutes = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> => {
  const url = req.url || "";
  console.log(`👑 Checking adminRoutes for: ${req.method} ${url}`);

  
  if (
    req.method === "GET" &&
    url === "/api/admin/dashboard-stats"
  ) {
    if (!verifyJWT(req as AuthRequest, res)) return true;
    if (!authorize(req as AuthRequest, res, "ADMIN")) return true;

    await getDashboardStats(req as AuthRequest, res);
    return true;
  }


  if (
    req.method === "GET" &&
    url.startsWith("/api/admin/dashboard-attendance")
  ) {
    if (!verifyJWT(req as AuthRequest, res)) return true;
    if (!authorize(req as AuthRequest, res, "ADMIN")) return true;

    await getAdminMonthlyDashboardSummary(req as AuthRequest, res);
    return true;
  }

 // admin.routes.ts - Add this route
if (req.method === "GET" && url === "/admin/attendance/early-exits") {
  console.log("✅ adminRoutes matched /admin/attendance/early-exits");
  
  if (!verifyJWT(req as AuthRequest, res)) {
    console.log("❌ JWT verification failed");
    return true;
  }
  
  if (!authorize(req as AuthRequest, res, "ADMIN")) {
    console.log("❌ Authorization failed");
    return true;
  }

  await getEarlyExitsController(req as AuthRequest, res);
  return true;
}

// admin.routes.ts - Add this route
if (req.method === "GET" && url === "/admin/attendance/late-entries") {
  console.log("✅ adminRoutes matched /admin/attendance/late-entries");
  
  if (!verifyJWT(req as AuthRequest, res)) {
    console.log("❌ JWT verification failed");
    return true;
  }
  
  if (!authorize(req as AuthRequest, res, "ADMIN")) {
    console.log("❌ Authorization failed");
    return true;
  }

  await getLateEntriesController(req as AuthRequest, res);
  return true;
}

  return false;
};
