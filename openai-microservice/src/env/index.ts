import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  // Environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  PORT: z.number().default(3001),

  // TextMe Server
  USER_ID: z.string(),
  USER_EMAIL: z.string(),
  USER_PASSWORD: z.string(),

  // TextMe Websocket server
  WEBSOCKET_SERVER: z.string(),

  // Redis
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_PASSWORD: z.string(),

  // OpenAI
  OPENAI_KEY: z.string(),
  OPENAI_ORGANIZATION: z.string(),
  OPENAI_PROJECT: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.log('Invalid environment variables!', _env.error.format())

  throw new Error(`Invalid environment variables!`)
}

export const env = _env.data
