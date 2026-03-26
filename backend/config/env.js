import { config } from 'dotenv'

config({ path: '.env' })

export const {
  PORT,
  DB_URI,
  NODE_ENV,
  JWT_SECRET,
  USER_PASS_SALT_ROUNDS,
  JWT_COOKIE_NAME,
  GOOGLE_API_KEY,
  REDIS_CLIENT_OBJECT
} = process.env;