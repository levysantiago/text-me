import { z } from 'zod';
import { config } from 'dotenv';
import { resolve } from 'path';

let envFile = '.env';
if (process.env.NODE_ENV === 'test') {
  envFile = '.env.test';
}
config({ path: resolve(__dirname, `../../../../${envFile}`) });

const createEnvSchema = z.object({
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
});
const _env = createEnvSchema.safeParse(process.env);

if (_env.success === false) {
  console.log('Invalid environment variables!', _env.error.format());

  throw new Error(`Invalid environment variables!`);
}

export const env = _env.data;
