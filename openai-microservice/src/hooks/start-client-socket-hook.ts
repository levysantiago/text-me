import { container } from 'tsyringe'
import { ICacheProvider } from '../providers/cache-provider/types/icache-provider'
import { io } from 'socket.io-client'
import { textmeServer } from '../api/textme-server'
import { env } from '../env'
import { IHandleCreatedMessageDTO } from './dtos/ihandle-created-message.dto'
import { IAiProvider } from '@src/providers/ai-provider/types/iai-provider'
import { IContext } from '@src/providers/ai-provider/types/icontext'
import { IChatMessage } from '@src/providers/ai-provider/types/ichat-message'
import { getConversationFromUsers } from '@src/lib/get-conversation-from-users-helper'

export async function startClientSocketHook() {
  // Catching cache provider
  const cacheProvider = container.resolve<ICacheProvider>('CacheProvider')
  // getting AI provider
  const aiProvider = container.resolve<IAiProvider>('AiProvider')

  // Retrieving access token
  const accessToken = await cacheProvider.retrieve('access_token')
  if (!accessToken) {
    throw new Error('Microservice not logged')
  }

  // Starting socket
  const socket = io(env.WEBSOCKET_SERVER, {
    query: { access_token: accessToken },
  })

  socket.on(
    'handleCreatedMessage',
    async ({
      fromUserId,
      toUserId,
      content,
      role,
    }: IHandleCreatedMessageDTO) => {
      // Get conversation id
      const conversationId = getConversationFromUsers({ fromUserId, toUserId })

      // Getting context from cache if exists
      const contextJson = await cacheProvider.retrieve(
        `context:${conversationId}`,
      )
      let context: IContext = []

      // Is message from assistant
      let isMessageFromFriend = false
      if (fromUserId !== env.USER_ID) isMessageFromFriend = true

      if (contextJson) {
        context = JSON.parse(contextJson)

        // Pushing new message
        context.push({ role, content })
      } else {
        // Getting messages context
        const response = await textmeServer.get('chat', {
          params: { fromUserId },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        // Recreating context
        context = []
        response.data.data.map((message: IChatMessage) => {
          context.push({ role: message.role, content: message.content })
          return message
        })

        // Defining ttl
        const ttl = 1 * 24 * 60 * 60 // 1 day

        // Saving context to cache
        await cacheProvider.save(
          `context:${conversationId}`,
          JSON.stringify(context),
          ttl,
        )
      }

      // If who sent the message is not the microservice
      if (isMessageFromFriend) {
        // Emitting typing event
        const typingInterval = setInterval(() => {
          socket.emit('typing', {
            toUserId: fromUserId,
            access_token: accessToken,
          })
        }, 1000)

        // Recovering response from AI
        const response = await aiProvider.sendMessage({ context })

        clearInterval(typingInterval)

        if (response.message) {
          // Emitting new Message
          socket.emit('newMessage', {
            toUserId: fromUserId,
            content: response.message,
            access_token: accessToken,
          })
        }
      }
    },
  )
}
