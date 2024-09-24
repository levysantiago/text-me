/* eslint-disable no-useless-constructor */
import { IAiProvider } from '@src/providers/ai-provider/types/iai-provider'
import { ICacheProvider } from '@src/providers/cache-provider/types/icache-provider'
import { ISocketProvider } from '@src/providers/socket-client-provider/types/isocket-provider'
import { inject, injectable } from 'tsyringe'
import { ISendAiResponseDTO } from './dtos/isend-ai-response.dto'
import { GetUpdatedContextService } from './get-updated-context.service'
import { getConversationFromUsers } from '@src/lib/get-conversation-from-users-helper'

@injectable()
export class SendAiResponseService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('AiProvider')
    private aiProvider: IAiProvider,
    @inject('SocketProvider')
    private socketProvider: ISocketProvider,
    @inject(GetUpdatedContextService)
    private getUpdatedContextService: GetUpdatedContextService,
  ) {}

  execute = async ({ fromUserId, toUserId, content }: ISendAiResponseDTO) => {
    // Retrieving access token
    const accessToken = await this.cacheProvider.retrieve('access_token')
    if (!accessToken) {
      throw new Error('Microservice not logged')
    }

    // Getting updated context
    const context = await this.getUpdatedContextService.execute({
      fromUserId,
      toUserId,
    })

    // Add message content to context
    context.push({ role: 'user', content })

    // Emitting typing event
    const typingInterval = setInterval(() => {
      this.socketProvider.emit('typing', {
        toUserId: fromUserId,
        access_token: accessToken,
      })
    }, 1000)

    try {
      // Recovering response from AI
      const response = await this.aiProvider.sendMessage({ context })

      if (response.message) {
        // Emitting new Message
        this.socketProvider.emit('newMessage', {
          toUserId: fromUserId,
          content: response.message,
          access_token: accessToken,
        })
      }

      // Get conversation id
      const conversationId = getConversationFromUsers({
        fromUserId,
        toUserId,
      })

      // Defining ttl
      const ttl = 1 * 24 * 60 * 60 // 1 day

      // Saving context to cache
      await this.cacheProvider.save(
        `context:${conversationId}`,
        JSON.stringify(context),
        ttl,
      )
    } catch (err: any) {
      console.log('SendAiResponseService: ', err)
      throw new Error(err.message)
    } finally {
      clearInterval(typingInterval)
    }
  }
}
