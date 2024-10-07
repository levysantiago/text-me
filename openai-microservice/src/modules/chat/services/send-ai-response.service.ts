/* eslint-disable no-useless-constructor */
import { IAiProvider } from '@shared/container/providers/ai-provider/types/iai-provider'
import { ICacheProvider } from '@shared/container/providers/cache-provider/types/icache-provider'
import { ISocketProvider } from '@shared/container/providers/socket-client-provider/types/isocket-provider'
import { inject, injectable } from 'tsyringe'
import { ISendAiResponseDTO } from './dtos/isend-ai-response.dto'
import { GetUpdatedContextService } from './get-updated-context.service'
import { getConversationFromUsers } from '@shared/resources/lib/get-conversation-from-users-helper'
import { MicroserviceNotLoggedError } from '../errors/microservice-not-logged.error'
import { ErrorMessageManager } from '@shared/resources/errors/error-message-manager'

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
    let accessToken: string | null = null
    let typingInterval: NodeJS.Timeout | undefined
    try {
      // Retrieving access token
      accessToken = await this.cacheProvider.retrieve('access_token')
      if (!accessToken) {
        throw new MicroserviceNotLoggedError()
      }

      // Getting updated context
      const context = await this.getUpdatedContextService.execute({
        fromUserId,
        toUserId,
      })

      // Add message content to context
      context.push({ role: 'user', content })

      // Emitting typing event
      this.socketProvider.emit('typing', {
        toUserId: fromUserId,
        access_token: accessToken,
      })
      // Initiate interval to keep informing it is typing
      typingInterval = setInterval(() => {
        this.socketProvider.emit('typing', {
          toUserId: fromUserId,
          access_token: accessToken,
        })
      }, 1000)

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
    } catch (err) {
      console.log(`SendAiResponseService: ${err}`)

      if (accessToken) {
        // Emitting error Message to user
        this.socketProvider.emit('newMessage', {
          toUserId: fromUserId,
          content: ErrorMessageManager.getUserExcuseMessage(),
          access_token: accessToken,
        })
      }
    } finally {
      clearInterval(typingInterval)
    }
  }
}
