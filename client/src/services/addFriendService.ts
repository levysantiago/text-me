/* eslint-disable no-undef */
import server from './api/server'

interface IRequest {
  friendEmail: string
}

export const addFriendService = async ({
  friendEmail,
}: IRequest): Promise<boolean> => {
  const accessToken = localStorage.getItem('access_token')
  if (!accessToken) {
    throw new Error('Unauthorized')
  }

  // Executing sign in route
  const response = await server.post(
    '/friend',
    { friendEmail },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )

  if (response.status !== 200) {
    throw new Error('Unauthorized')
  }

  return true
}
