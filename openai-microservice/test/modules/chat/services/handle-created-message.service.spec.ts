import 'reflect-metadata'
import { GetUpdatedContextService } from '@modules/chat/services/get-updated-context.service'
import { ICacheProvider } from '@shared/container/providers/cache-provider/types/icache-provider'
import { ISocketProvider } from '@shared/container/providers/socket-client-provider/types/isocket-provider'
import { mock } from 'jest-mock-extended'
import { ConversationHelper } from '@shared/resources/lib/conversation-helper'
import { ErrorMessageManager } from '@shared/resources/errors/error-message-manager'
import { HandleCreatedMessageService } from '@modules/chat/services/handle-created-message.service'
import { IQueueProvider } from '@shared/container/providers/queue-provider/types/iqueue.provider'
import { env } from '@shared/resources/env'

jest.mock('ioredis', () => class {})
jest.mock('socket.io-client', () => ({}))
jest.mock('openai', () => ({}))

describe('HandleCreatedMessageService', () => {
  let cacheProvider: ICacheProvider
  let queueProvider: IQueueProvider
  let socketProvider: ISocketProvider
  let getUpdatedContextService: GetUpdatedContextService
  let sut: HandleCreatedMessageService

  beforeEach(() => {
    cacheProvider = mock()
    queueProvider = mock()
    socketProvider = mock()
    getUpdatedContextService = mock()

    sut = new HandleCreatedMessageService(
      cacheProvider,
      queueProvider,
      socketProvider,
      getUpdatedContextService,
    )

    // Mock cacheProvider
    jest.spyOn(cacheProvider, 'retrieve').mockResolvedValue('fake_access_token')
    jest.spyOn(cacheProvider, 'save').mockResolvedValue()

    // Mock queueProvider
    jest.spyOn(queueProvider, 'publish').mockResolvedValue()

    // Mock socketProvider
    jest.spyOn(socketProvider, 'emit').mockReturnValue()

    // Mock getUpdatedContextService
    jest
      .spyOn(getUpdatedContextService, 'execute')
      .mockResolvedValue([{ role: 'user', content: 'content' }])

    // Mock conversation helper
    jest
      .spyOn(ConversationHelper, 'getConversationFromUsers')
      .mockReturnValue('fake_conversation')

    // Mock error message helper
    jest
      .spyOn(ErrorMessageManager, 'getUserExcuseMessage')
      .mockReturnValue('fake_excuse_message')
  })

  describe('execute', () => {
    const params = {
      fromUserId: env.USER_ID,
      toUserId: 'fake_to_user_id',
      content: 'fake_content',
    }

    it('should be able to handle created message', async () => {
      const promise = sut.execute(params)
      expect(promise).resolves.toBeUndefined()
    })

    it('should be able to call GetUpdatedContextService::execute with right parameters', async () => {
      const spy = jest.spyOn(getUpdatedContextService, 'execute')
      await sut.execute(params)
      expect(spy).toHaveBeenCalledWith({
        fromUserId: params.fromUserId,
        toUserId: params.toUserId,
      })
    })

    it('should be able to call ConversationHelper::getConversationFromUsers with right parameters', async () => {
      const spy = jest.spyOn(ConversationHelper, 'getConversationFromUsers')
      await sut.execute(params)
      expect(spy).toHaveBeenCalledWith({
        fromUserId: params.fromUserId,
        toUserId: params.toUserId,
      })
    })

    it('should be able to call CacheProvider::save with right parameters', async () => {
      const ttl = 1 * 24 * 60 * 60 // 1 day
      const spy = jest.spyOn(cacheProvider, 'save')
      await sut.execute(params)
      expect(spy).toHaveBeenCalledWith(
        'context:fake_conversation',
        JSON.stringify([
          { role: 'user', content: 'content' },
          { role: 'assistant', content: params.content },
        ]),
        ttl,
      )
    })

    it('should be able to call QueueProvider::publish with right parameters if message is from user', async () => {
      const spy = jest.spyOn(queueProvider, 'publish')
      await sut.execute({ ...params, fromUserId: 'fake_from_user_id' })
      expect(spy).toHaveBeenCalledWith({
        fromUserId: 'fake_from_user_id',
        toUserId: params.toUserId,
        content: params.content,
      })
    })

    it('should be able to send excuse message to user if fails to publish to queue', async () => {
      jest
        .spyOn(queueProvider, 'publish')
        .mockRejectedValueOnce(new Error('undefined'))
      const spy = jest.spyOn(socketProvider, 'emit')
      await sut.execute({ ...params, fromUserId: 'fake_from_user_id' })
      expect(spy).toHaveBeenCalledWith('newMessage', {
        toUserId: 'fake_from_user_id',
        content: 'fake_excuse_message',
      })
    })
  })
})
