import 'reflect-metadata'
import { GetUpdatedContextService } from '@modules/chat/services/get-updated-context.service'
import { SendAiResponseService } from '@modules/chat/services/send-ai-response.service'
import { IAiProvider } from '@shared/container/providers/ai-provider/types/iai-provider'
import { ICacheProvider } from '@shared/container/providers/cache-provider/types/icache-provider'
import { ISocketProvider } from '@shared/container/providers/socket-client-provider/types/isocket-provider'
import { mock } from 'jest-mock-extended'
import { ConversationHelper } from '@shared/resources/lib/conversation-helper'
import { ErrorMessageManager } from '@shared/resources/errors/error-message-manager'

jest.mock('ioredis', () => class {})
jest.mock('socket.io-client', () => ({}))
jest.mock('openai', () => ({}))

describe('SendAiResponseService', () => {
  let cacheProvider: ICacheProvider
  let aiProvider: IAiProvider
  let socketProvider: ISocketProvider
  let getUpdatedContextService: GetUpdatedContextService
  let sut: SendAiResponseService

  beforeEach(() => {
    cacheProvider = mock()
    aiProvider = mock()
    socketProvider = mock()
    getUpdatedContextService = mock()

    sut = new SendAiResponseService(
      cacheProvider,
      aiProvider,
      socketProvider,
      getUpdatedContextService,
    )

    // Mock cacheProvider
    jest.spyOn(cacheProvider, 'retrieve').mockResolvedValue('fake_access_token')
    jest.spyOn(cacheProvider, 'save').mockResolvedValue()

    // Mock aiProvider
    jest
      .spyOn(aiProvider, 'sendMessage')
      .mockResolvedValue({ message: 'message' })

    // Mock socketProvider
    jest.spyOn(socketProvider, 'emit').mockReturnValue()

    // Mock getUpdatedContextService
    jest
      .spyOn(getUpdatedContextService, 'execute')
      .mockResolvedValue([{ role: 'assistant', content: 'content' }])

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
      fromUserId: 'fake_from_user_id',
      toUserId: 'fake_to_user_id',
      content: 'fake_content',
    }

    it('should be able to execute service', async () => {
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

    it('should be able to call SocketProvider::emit with right parameters', async () => {
      const spy = jest.spyOn(socketProvider, 'emit')
      await sut.execute(params)
      expect(spy).toHaveBeenNthCalledWith(1, 'typing', {
        toUserId: params.fromUserId,
      })
    })

    it('should be able to call SocketProvider::emit with right parameters', async () => {
      const spy = jest.spyOn(socketProvider, 'emit')
      await sut.execute(params)
      expect(spy).toHaveBeenNthCalledWith(2, 'newMessage', {
        toUserId: params.fromUserId,
        content: 'message',
      })
    })

    it('should be able to call AiProvider::sendMessage with right parameters', async () => {
      const spy = jest.spyOn(aiProvider, 'sendMessage')
      await sut.execute(params)
      expect(spy).toHaveBeenCalledWith({
        context: [
          { role: 'assistant', content: 'content' },
          { role: 'user', content: params.content },
        ],
      })
    })

    it('should be able to call CacheProvider::save with right parameters', async () => {
      const ttl = 1 * 24 * 60 * 60 // 1 day
      const spy = jest.spyOn(cacheProvider, 'save')
      await sut.execute(params)
      expect(spy).toHaveBeenCalledWith(
        'context:fake_conversation',
        JSON.stringify([
          { role: 'assistant', content: 'content' },
          { role: 'user', content: params.content },
        ]),
        ttl,
      )
    })

    it('should throw error and emit event to user if a service throws', async () => {
      jest
        .spyOn(getUpdatedContextService, 'execute')
        .mockRejectedValueOnce(new Error('unknown'))
      const spy = jest.spyOn(socketProvider, 'emit')
      const promise = sut.execute(params)
      expect(promise).rejects.toEqual(new Error())
      promise.catch(() => {
        expect(spy).toHaveBeenCalledWith('newMessage', {
          toUserId: params.fromUserId,
          content: 'fake_excuse_message',
        })
      })
    })

    it('should clearInterval on success or error', async () => {
      const spy = jest.spyOn(global, 'clearInterval')
      await sut.execute(params)
      expect(spy).toHaveBeenCalledWith(expect.anything())
      expect(spy).toHaveBeenCalledTimes(1)

      jest
        .spyOn(getUpdatedContextService, 'execute')
        .mockRejectedValueOnce(new Error('unknown'))
      const promise = sut.execute(params)
      expect(promise).rejects.toEqual(new Error())
      expect(spy).toHaveBeenCalledWith(expect.anything())
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})
