import express from 'express'
import { PORT } from './config/env.js'
import connectMongodb from './database/mongodb.js'
import authRouter from './routes/auth.routes.js'
import AIRouter from './routes/AI.routes.js'
import errorMiddleware from './middleware/error.middleware.js'
import cookieParser from 'cookie-parser'
import testRouter from './routes/test.routes.js'
import cors from 'cors'
import { connectRedis } from './database/redis.js'

const server = express()

server.use(cors({})) // Currently allows any origin
server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use(cookieParser())

server.use('/eienzenai/auth', authRouter)
server.use('/eienzenai/generate', AIRouter)
server.use('/eienzenai/test', testRouter)

server.use(errorMiddleware)

server.listen(PORT, async () => {
  console.log(`Eienzen AI API is running on http://localhost:${PORT}`)
  // await connectMongodb()
  // await connectRedis()
})
