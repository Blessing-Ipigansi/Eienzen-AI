import { createClient } from 'redis'
import { REDIS_CLIENT_OBJECT } from '../config/env.js'

export const redis = createClient(JSON.parse(REDIS_CLIENT_OBJECT))

redis.on('error', err => console.error('Redis Client Error: ', err))

export async function connectRedis() {
  if(!redis.isOpen) await redis.connect()
}
