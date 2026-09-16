import { IncomingMessage, ServerResponse } from 'http'
import {
  applyLeaveController,
  getAllLeavesController,
  updateLeaveStatusController,
  getMyLeaveBalanceController,
  getMyLeaveStatusController
} from './leaves.controller'
import { verifyJWT, AuthRequest } from '../../middlewares/auth.middleware'

export const leaveRoutes = (
  req: IncomingMessage,
  res: ServerResponse
): boolean => {
  const cleanUrl = decodeURIComponent(req.url || '').trim().replace(/\/+$/, '')

  // APPLY LEAVE
  if (req.method === 'POST' && cleanUrl === '/leaves') {
    if (!verifyJWT(req as AuthRequest, res)) return true
    applyLeaveController(req, res)
    return true
  }

  // GET ALL LEAVES (ADMIN)
if (req.method === 'GET' && cleanUrl === '/api/admin/leaves') {
  if (!verifyJWT(req as AuthRequest, res)) return true
  getAllLeavesController(req, res)
  return true
}

  // APPROVE / REJECT LEAVE
  if (req.method === 'PATCH' && cleanUrl.startsWith('/leaves/')) {
    if (!verifyJWT(req as AuthRequest, res)) return true
    const id = Number(cleanUrl.split('/')[2])
    updateLeaveStatusController(req, res, id)
    return true
  }

  // GET MY LEAVE BALANCE
if (req.method === "GET" && cleanUrl === "/leaves/balance") {
  if (!verifyJWT(req as AuthRequest, res)) return true;
  console.log("RAW URL:", JSON.stringify(req.url));
console.log("CLEAN URL:", cleanUrl);
  getMyLeaveBalanceController(req, res);
  return true;
}
// my leave Status
if (req.method === 'GET' && cleanUrl === '/leaves/my-status') {
    if (!verifyJWT(req as AuthRequest, res)) return true;
    getMyLeaveStatusController(req, res);
    return true;
  }

  return false
}
