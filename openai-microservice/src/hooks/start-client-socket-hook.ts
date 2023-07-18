import { container } from 'tsyringe'
import { ICacheProvider } from '../providers/CacheProvider/types/icache-provider'
import { io } from 'socket.io-client'
import OpenAiService from '../services/openai-service'
import { textmeServer } from '../api/textme-server'
import { ChatCompletionRequestMessage } from 'openai'

export async function startClientSocketHook() {
  // Catching cache provider
  const cacheProvider = container.resolve<ICacheProvider>('CacheProvider')

  // Retrieving access token
  const accessToken = await cacheProvider.retrieve('access_token')
  if (!accessToken) {
    throw new Error('Microservice not logged')
  }

  // Starting socket
  const socket = io('http://localhost:3333', {
    query: { access_token: accessToken },
  })

  // getting openai service
  const openaiService = container.resolve(OpenAiService)

  socket.on(
    'handleCreatedMessage',
    async ({
      fromUserId,
      toUserId,
      content,
    }: {
      fromUserId: string
      toUserId: string
      content: string
    }) => {
      // Getting or saving microsservice user id
      const myId = await cacheProvider.retrieve('my_id')
      if (!myId) {
        await cacheProvider.save('my_id', toUserId)
      }

      // Getting context from cache if exists
      const contextJson = await cacheProvider.retrieve('context')
      let context: ChatCompletionRequestMessage[] = []

      if (contextJson) {
        context = JSON.parse(contextJson)

        // Pushing new message
        context.push({ role: 'user', content })
      } else {
        // Getting messages context
        const response = await textmeServer.get('chat', {
          params: { fromUserId },
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        // Recreating context
        context = []
        response.data.data.map((message: any) => {
          if (fromUserId !== myId) {
            context.push({ role: 'user', content: message.content })
          } else {
            context.push({ role: 'assistant', content: message.content })
          }

          return message
        })

        // Saving context to cache
        await cacheProvider.save('context', JSON.stringify(context))
      }

      // If who sent the message is not the microsservice
      if (fromUserId !== myId) {
        // Emiting typing event
        socket.emit('typing', {
          toUserId: fromUserId,
          access_token: accessToken,
        })

        // Recovering response from AI
        const response = await openaiService.sendMessage(context)
        console.log(response.data.choices)

        if (response.data.choices[0].message) {
          // Emiting new Message
          socket.emit('newMessage', {
            toUserId: fromUserId,
            content: response.data.choices[0].message.content,
            access_token: accessToken,
          })
        }
      }
    },
  )
}