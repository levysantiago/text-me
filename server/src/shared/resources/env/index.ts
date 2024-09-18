import { z } from 'zod';
import { config } from 'dotenv';

const createEnvSchema = z.object({
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
});
const _env = createEnvSchema.safeParse(config().parsed);

if (_env.success === false) {
  console.log('Invalid environment variables!', _env.error.format());

  throw new Error(`Invalid environment variables!`);
}

export const env = _env.data;
