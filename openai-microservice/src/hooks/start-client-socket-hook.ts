import { container } from 'tsyringe'
import { ICacheProvider } from '../providers/CacheProvider/types/icache-provider'
import { io } from 'socket.io-client'
import OpenAiService from '../services/openai-service'

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

      // If who sent the message is not the microsservice
      if (fromUserId !== myId) {
        // Emiting typing event
        socket.emit('typing', {
          toUserId: fromUserId,
          access_token: accessToken,
        })

        // Recovering response from AI
        const response = await openaiService.sendMessage([
          { role: 'user', content },
        ])
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
