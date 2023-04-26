/* eslint-disable no-undef */
import server from './api/server'

export interface IFriend {
  id: string
  email: string
  name: string
}

type IResponseData = IFriend[]

export const getFriendsService = async (): Promise<IResponseData> => {
  const accessToken = localStorage.getItem('access_token')
  if (!accessToken) {
    throw new Error('Unauthorized')
  }

  // Executing sign in route
  const response = await server.get('/friend', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (response.status !== 200) {
    throw new Error('Unauthorized')
  }

  return response.data.data
}
