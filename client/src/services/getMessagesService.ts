/* eslint-disable no-undef */
import server from './api/server'

export interface IMessage {
  content: string
  fromUserId: string
  toUserId: string
}

type IResponseData = IMessage[]

interface IRequest {
  fromUserId: string
}

export const getMessagesService = async ({
  fromUserId,
}: IRequest): Promise<IResponseData> => {
  const accessToken = localStorage.getItem('access_token')
  if (!accessToken) {
    throw new Error('Unauthorized')
  }

  // Executing sign in route
  const response = await server.get(`/chat/${fromUserId}/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (response.status !== 200) {
    throw new Error('Unauthorized')
  }

  return response.data.data
}
