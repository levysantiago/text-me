/* eslint-disable no-useless-constructor */
import { env } from '@src/env'
import { getConversationFromUsers } from '@src/lib/get-conversation-from-users-helper'
import { ICacheProvider } from '@src/providers/cache-provider/types/icache-provider'
import { IQueueProvider } from '@src/providers/queue-provider/types/iqueue.provider'
import { IHandleCreatedMessageDTO } from '@src/providers/socket-client-provider/dtos/ihandle-created-message.dto'
import { inject, injectable } from 'tsyringe'
import { GetUpdatedContextService } from './get-updated-context.service'

@injectable()
export class HandleCreatedMessageService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
    @inject(GetUpdatedContextService)
    private getUpdatedContextService: GetUpdatedContextService,
  ) {}

  execute = async ({
    fromUserId,
    toUserId,
    content,
    role,
  }: IHandleCreatedMessageDTO) => {
    // Is message from assistant
    let isMessageFromFriend = false
    if (fromUserId !== env.USER_ID) isMessageFromFriend = true

    if (!isMessageFromFriend) {
      // Getting updated context
      const context = await this.getUpdatedContextService.execute({
        fromUserId,
        toUserId,
      })

      // Add message content to context
      context.push({ role: 'assistant', content })

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
    } else {
      // Add message to queue
      await this.queueProvider.sendMessage({
        fromUserId,
        content,
        toUserId,
      })
    }
  }
}
