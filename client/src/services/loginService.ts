import { z } from 'zod'
import server from './api/server'

interface ILoginServiceProps {
  email: string
  password: string
}

interface IResponseData {
  data: { access_token: string }
}

export const loginService = async ({
  email,
  password,
}: ILoginServiceProps): Promise<IResponseData> => {
  // Executing sign in route
  const response = await server.post('/auth', { email, password })
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

  return responseData.data
}
