import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  USER_EMAIL: z.string(),
  USER_ID: z.string(),
  USER_PASSWORD: z.string(),
  OPENAI_KEY: z.string(),
  PORT: z.number().default(3001),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.log('Invalid environment variables!', _env.error.format())

  throw new Error(`Invalid environment variables!`)
}

export const env = _env.data
