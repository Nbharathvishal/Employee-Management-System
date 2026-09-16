import http from "http";
import dotenv from "dotenv";
import pool from "./config/db";

import { authRoutes } from "./modules/auth/auth.routes";
import { employeeRoutes } from "./modules/employees/employee.routes";
import { leaveRoutes } from "./modules/leaves/leaves.routes";
import { attendanceRoutes } from "./modules/attendance/attendance.routes";
import { adminRoutes } from "./modules/admin/admin.routes"; // Import the real one

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const server = http.createServer(async (req, res) => {
  console.log("REQ =>", req.method, req.url);

  // Add debug to see which routes are checked
  console.log("🔍 Checking routes for:", req.method, req.url);

  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "*"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  res.setHeader("Content-Type", "application/json");

  // ✅ CORRECT ORDER with ALL route checks
  console.log("1. Checking authRoutes...");
  if (authRoutes(req, res)) {
    console.log("✅ Handled by authRoutes");
    return;
  }

  console.log("2. Checking leaveRoutes...");
  if (leaveRoutes(req, res)) {
    console.log("✅ Handled by leaveRoutes");
    return;
  }

  console.log("3. Checking attendanceRoutes...");
  const attendanceHandled = await attendanceRoutes(req, res);
  if (attendanceHandled) {
    console.log("✅ Handled by attendanceRoutes");
    return;
  } else {
    console.log("❌ attendanceRoutes did not handle it");
  }

  console.log("4. Checking employeeRoutes...");
  if (employeeRoutes(req, res)) {
    console.log("✅ Handled by employeeRoutes");
    return;
  }

  // ✅ ADD THIS: Check adminRoutes
  console.log("5. Checking adminRoutes...");
  const adminHandled = await adminRoutes(req, res);
  if (adminHandled) {
    console.log("✅ Handled by adminRoutes");
    return;
  } else {
    console.log("❌ adminRoutes did not handle it");
  }

  console.log("❌ No route handler matched");

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ message: "Backend running 🚀" }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});