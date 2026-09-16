import pool from '../../config/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { LoginPayload, AuthResponse } from './auth.types'

export const loginService = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const { email, password } = payload

  //  Get user by email
  const result = await pool.query(
    'SELECT id, email, password, role FROM users WHERE email = $1',
    [email]
  )

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password')
  }

  const user = result.rows[0]

  //  Compare password
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Invalid email or password')
  }

  //  Generate JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  )

  return {
    token,
    role: user.role,
  }
}
