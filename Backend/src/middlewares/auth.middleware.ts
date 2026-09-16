import { IncomingMessage, ServerResponse } from 'http'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends IncomingMessage {
  user?: any
}


export const verifyJWT = (
  req: AuthRequest,
  res: ServerResponse
): boolean => {
  console.log('=== VERIFY JWT START ===');
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  console.log('All Headers:', req.headers);
  
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);

  if (!authHeader) {
    console.log('❌ No authorization header found');
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Authorization header missing' }));
    return false;
  }

  const token = authHeader.split(' ')[1];
  console.log('Extracted Token:', token ? 'Present' : 'Missing');

  if (!token) {
    console.log('❌ Token missing after Bearer prefix');
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Token missing' }));
    return false;
  }

  try {
    console.log('JWT Secret exists:', !!process.env.JWT_SECRET);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: number; role: string };
    
    console.log('✅ Token verified successfully');
    console.log('Decoded user:', decoded);
    req.user = decoded;
    return true;
  } catch (error: any) {
    console.log('❌ Token verification failed:', error.message);
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid or expired token' }));
    return false;
  }
};

export const authorize = (
  req: AuthRequest,
  res: ServerResponse,
  role: "ADMIN" | "EMPLOYEE"
): boolean => {
  console.log('=== AUTHORIZE START ===');
  console.log('User from request:', req.user);
  console.log('Required role:', role);
  
  if (!req.user) {
    console.log('❌ No user found in request');
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Unauthorized" }));
    return false;
  }

  console.log('User role:', req.user.role);
  
  if (req.user.role !== role) {
    console.log(`❌ Role mismatch. User has ${req.user.role}, required ${role}`);
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Access denied for this role" }));
    return false;
  }

  console.log('✅ Authorization successful');
  return true;
};