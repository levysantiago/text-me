/* eslint-disable no-useless-constructor */
import { IAiProvider } from '@shared/container/providers/ai-provider/types/iai-provider'
import { ICacheProvider } from '@shared/container/providers/cache-provider/types/icache-provider'
import { ISocketProvider } from '@shared/container/providers/socket-client-provider/types/isocket-provider'
import { inject, injectable } from 'tsyringe'
import { ISendAiResponseDTO } from './dtos/isend-ai-response.dto'
import { GetUpdatedContextService } from './get-updated-context.service'
import { ErrorMessageManager } from '@shared/resources/errors/error-message-manager'
import { ConversationHelper } from '@shared/resources/lib/conversation-helper'

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
    let typingInterval: NodeJS.Timeout | undefined
    try {
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
      })
      // Initiate interval to keep informing it is typing
      typingInterval = setInterval(() => {
        this.socketProvider.emit('typing', {
          toUserId: fromUserId,
        })
      }, 1000)

      // Recovering response from AI
      const response = await this.aiProvider.sendMessage({ context })

      if (response.message) {
        // Emitting new Message
        this.socketProvider.emit('newMessage', {
          toUserId: fromUserId,
          content: response.message,
        })
      }

      // Get conversation id
      const conversationId = ConversationHelper.getConversationFromUsers({
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

      // Emitting error Message to user
      this.socketProvider.emit('newMessage', {
        toUserId: fromUserId,
        content: ErrorMessageManager.getUserExcuseMessage(),
      })

      // Throw error so the consumption of the queue keep the data in queue
      throw new Error()
    } finally {
      clearInterval(typingInterval)
    }
  }
}
