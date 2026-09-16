import { IncomingMessage, ServerResponse } from 'http'
import { loginService } from './auth.service'


// auth.controller.ts
export const loginController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  let body = ''

  req.on('data', chunk => {
    body += chunk.toString()
  })

  req.on('end', async () => {
    try {
      if (!body) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Request body is empty' }))
        return
      }

      const data = JSON.parse(body)

      const result = await loginService(data)

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(result))
    } catch (error: any) {
      // Differentiate between different types of errors
      let statusCode = 500
      let message = 'Internal server error'
      
      if (error instanceof SyntaxError) {
        // JSON parsing error
        statusCode = 400
        message = 'Invalid JSON format'
      } else if (error.message === 'Invalid email or password') {
        // Authentication error
        statusCode = 401
        message = error.message
      } else if (error.message.includes('JWT_SECRET')) {
        // Configuration error
        statusCode = 500
        message = 'Server configuration error'
      }
      
      console.error('Login error:', error)
      res.writeHead(statusCode, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message }))
    }
  })
}