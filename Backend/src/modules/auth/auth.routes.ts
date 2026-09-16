import { IncomingMessage, ServerResponse } from 'http'
import { loginController } from './auth.controller'

export const authRoutes = (
  req: IncomingMessage,
  res: ServerResponse
): boolean => {
 
  const rawUrl = req.url || ''
  const cleanUrl = decodeURIComponent(rawUrl).trim().replace(/\/+$/, '')

  if (req.method === 'POST' && cleanUrl === '/auth/login') {
    loginController(req, res)
    return true
  }

  return false
}
