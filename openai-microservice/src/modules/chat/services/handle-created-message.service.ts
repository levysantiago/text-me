/* eslint-disable no-useless-constructor */
import { env } from '@shared/resources/env'
import { ICacheProvider } from '@shared/container/providers/cache-provider/types/icache-provider'
import { IQueueProvider } from '@shared/container/providers/queue-provider/types/iqueue.provider'
import { IHandleCreatedMessageDTO } from '@shared/container/providers/socket-client-provider/dtos/ihandle-created-message.dto'
import { inject, injectable } from 'tsyringe'
import { GetUpdatedContextService } from './get-updated-context.service'
import { ISocketProvider } from '@shared/container/providers/socket-client-provider/types/isocket-provider'
import { MicroserviceNotLoggedError } from '../errors/microservice-not-logged.error'
import { ErrorMessageManager } from '@shared/resources/errors/error-message-manager'
import { ConversationHelper } from '@shared/resources/lib/conversation-helper'

@injectable()
export class HandleCreatedMessageService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
    @inject('SocketProvider')
    private socketProvider: ISocketProvider,
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
      try {
        // Getting updated context
        const context = await this.getUpdatedContextService.execute({
          fromUserId,
          toUserId,
        })

        // Add message content to context
        context.push({ role: 'assistant', content })

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
        console.log(
          'HandleCreatedMessageService: Failed to update the context.',
        )
        console.log(err)
      }
    } else {
      try {
        // Add message to queue
        await this.queueProvider.publish({
          fromUserId,
          content,
          toUserId,
        })
      } catch (err) {
        // Retrieving access token
        const accessToken = await this.cacheProvider.retrieve('access_token')
        if (!accessToken) {
          console.log(new MicroserviceNotLoggedError())
        }

        if (accessToken) {
          // Emitting error Message to user
          this.socketProvider.emit('newMessage', {
            toUserId: fromUserId,
            content: ErrorMessageManager.getUserExcuseMessage(),
            access_token: accessToken,
          })
        }
      }
    }
  }
}
