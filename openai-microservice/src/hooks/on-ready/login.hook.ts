import { z } from 'zod'
import { container } from 'tsyringe'
import { ICacheProvider } from '@src/providers/cache-provider/types/icache-provider'
import { textmeServer } from '@src/api/textme-server'
import { env } from '@src/env'

export async function loginHook() {
  const cacheProvider = container.resolve<ICacheProvider>('CacheProvider')

  const response = await textmeServer.post('/auth', {
    email: env.USER_EMAIL,
    password: env.USER_PASSWORD,
  })

  if (response.status !== 200) {
    throw new Error('Failed to sign in')
  }

  // Validating response data
  const responseDataSchema = z.object({
    data: z.object({ access_token: z.string() }),
  })

  // Parsing response data
  const responseData = responseDataSchema.safeParse(response.data)
  if (!responseData.success) {
    throw new Error('Invalid server response data')
  }

  await cacheProvider.save('access_token', responseData.data.data.access_token)
}
