/* eslint-disable no-undef */
import server from './api/server'

export interface IMessage {
  content: string
  fromUserId: string
  toUserId: string
}

export interface IResume {
  unseenMessages: number
  lastMessage: string
}

interface IResponseData {
  [x: string]: IResume
}

export const getAmountOfUnseenMessagesService =
  async (): Promise<IResponseData> => {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      throw new Error('Unauthorized')
    }

    // Executing sign in route
    const response = await server.get('/chat/amount/unseen', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (response.status !== 200) {
      throw new Error('Unauthorized')
    }

    return response.data.data
  }
