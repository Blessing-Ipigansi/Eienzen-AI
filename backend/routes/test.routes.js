import { Router } from 'express'
import { redis } from '../database/redis.js'
import speakeasy from 'speakeasy'

const testRouter = Router()

testRouter.post('/redis', async (req, res, next) => {
  const command = {
    "incr": redis.incr.bind(redis),
    "expire": redis.expire.bind(redis),
    "get": redis.get.bind(redis),
    "set": redis.set.bind(redis),
    "del": redis.del.bind(redis),
    "hSet": redis.hSet.bind(redis),
    "hGet": redis.hGet.bind(redis),
    "hGetAll": redis.hGetAll.bind(redis)
  }
  const cmd = req.body.command
  const args = req.body.arguments

  const result = await command[cmd](...args)
  res.json({ success: true, result })
})

testRouter.get('/totp', async (req, res, next) => {
  const secret = speakeasy.generateSecret({
    length: 20,
    name: "EienzenAI",
    issuer: "EienzenAI"
  })

  res.json(secret)
})

export default testRouter