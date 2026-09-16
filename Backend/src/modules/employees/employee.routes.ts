import { IncomingMessage, ServerResponse } from "http";
import {
  createEmployeeController,
  getAllEmployeesController,
  getEmployeeByIdController,
  updateEmployeeController,
  getEmployeeDashboardController,
  getEmployeeProfileController,
  updateEmployeeProfileController
} from "./employee.controller";
import { verifyJWT, AuthRequest } from "../../middlewares/auth.middleware";

export const employeeRoutes = (
  req: IncomingMessage,
  res: ServerResponse
): boolean => {
  const cleanUrl = decodeURIComponent(req.url || "")
    .trim()
    .replace(/\/+$/, "");

  console.log("🔍 EmployeeRoutes checking:", {
    originalUrl: req.url,
    cleanUrl: cleanUrl,
    method: req.method
  });

  // ADMIN: Create employee
  if (req.method === "POST" && cleanUrl === "/api/admin/employees") {
    if (!verifyJWT(req as AuthRequest, res)) return true;

    const user = (req as AuthRequest).user;
    if (user.role !== "ADMIN") {
      res.writeHead(403);
      res.end(JSON.stringify({ message: "Access denied" }));
      return true;
    }

    createEmployeeController(req, res);
    return true;
  }

  // ADMIN: Get all employees
  if (req.method === "GET" && cleanUrl === "/api/admin/employees") {
    if (!verifyJWT(req as AuthRequest, res)) return true;

    const user = (req as AuthRequest).user;
    if (user.role !== "ADMIN") {
      res.writeHead(403);
      res.end(JSON.stringify({ message: "Access denied" }));
      return true;
    }

    getAllEmployeesController(req, res);
    return true;
  }

  // ADMIN: Get employee by ID
  if (
    req.method === "GET" &&
    cleanUrl.startsWith("/api/admin/employees/")
  ) {
    if (!verifyJWT(req as AuthRequest, res)) return true;

    const user = (req as AuthRequest).user;
    if (user.role !== "ADMIN") {
      res.writeHead(403);
      res.end(JSON.stringify({ message: "Access denied" }));
      return true;
    }

    getEmployeeByIdController(req, res);
    return true;
  }
  // ADMIN: Update employee
  // ✅ PUT — actual update
if (
  req.method === "PUT" &&
  cleanUrl.startsWith("/api/admin/employees/")
) {
  if (!verifyJWT(req as AuthRequest, res)) return true;

  const user = (req as AuthRequest).user;
  if (user.role !== "ADMIN") {
    res.writeHead(403);
    res.end(JSON.stringify({ message: "Access denied" }));
    return true;
  }

  updateEmployeeController(req, res);
  return true;
}


  // EMPLOYEE: Dashboard
  if (req.method === "GET" && cleanUrl === "/api/employee/dashboard") {
    if (!verifyJWT(req as AuthRequest, res)) return true;
    getEmployeeDashboardController(req, res);
    return true;
  }

  // EMPLOYEE: Get Profile (with /api prefix)
  if (req.method === "GET" && cleanUrl === "/api/employee/profile") {
    if (!verifyJWT(req as AuthRequest, res)) return true;
    getEmployeeProfileController(req, res);
    return true;
  }

  // EMPLOYEE: Get Profile (without /api prefix)
  if (req.method === "GET" && cleanUrl === "/employee/profile") {
    if (!verifyJWT(req as AuthRequest, res)) return true;
    getEmployeeProfileController(req, res);
    return true;
  }

  // EMPLOYEE: Update Profile (with /api prefix)
  if (req.method === "PUT" && cleanUrl === "/api/employee/profile") {
    if (!verifyJWT(req as AuthRequest, res)) return true;
    updateEmployeeProfileController(req, res);
    return true;
  }

  // EMPLOYEE: Update Profile (without /api prefix)
  if (req.method === "PUT" && cleanUrl === "/employee/profile") {
    if (!verifyJWT(req as AuthRequest, res)) return true;
    updateEmployeeProfileController(req, res);
    return true;
  }

  return false;
};