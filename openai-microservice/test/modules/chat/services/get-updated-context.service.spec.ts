import 'reflect-metadata'
import { GetUpdatedContextService } from '@modules/chat/services/get-updated-context.service'
import { ICacheProvider } from '@shared/container/providers/cache-provider/types/icache-provider'
import { mock } from 'jest-mock-extended'
import { ConversationHelper } from '@shared/resources/lib/conversation-helper'
import { env } from '@shared/resources/env'
import { textmeServer } from '@shared/resources/api/textme-server'

jest.mock('ioredis', () => class {})

describe('GetUpdatedContextService', () => {
  let cacheProvider: ICacheProvider
  let sut: GetUpdatedContextService

  const fakeExpectedCacheContext = [{ role: 'assistant', content: 'content' }]

  beforeEach(() => {
    cacheProvider = mock()

    sut = new GetUpdatedContextService(cacheProvider)

    // Mock cacheProvider
    jest
      .spyOn(cacheProvider, 'retrieve')
      .mockResolvedValueOnce('fake_access_token')
    jest
      .spyOn(cacheProvider, 'retrieve')
      .mockResolvedValueOnce(JSON.stringify(fakeExpectedCacheContext))

    // Mock conversation helper
    jest
      .spyOn(ConversationHelper, 'getConversationFromUsers')
      .mockReturnValue('fake_conversation')

    // Mock textme server
    jest.spyOn(textmeServer, 'get').mockResolvedValue({
      data: {
        data: [{ role: 'user', content: 'content' }],
      },
    })
  })

  describe('execute', () => {
    const params = {
      fromUserId: 'fake_from_user_id',
      toUserId: 'fake_to_user_id',
    }

    it('should be able to handle created message', async () => {
      const result = await sut.execute(params)
      expect(result).toEqual(fakeExpectedCacheContext)
    })

    it('should be able to call ConversationHelper::getConversationFromUsers with right parameters', async () => {
      const spy = jest.spyOn(ConversationHelper, 'getConversationFromUsers')
      await sut.execute(params)
      expect(spy).toHaveBeenCalledWith({
        fromUserId: params.fromUserId,
        toUserId: params.toUserId,
      })
    })

    it('should be able to call CacheProvider::retrieve with right parameters', async () => {
      const spy = jest.spyOn(cacheProvider, 'retrieve')
      await sut.execute(params)
      expect(spy).toHaveBeenNthCalledWith(1, 'access_token')
      expect(spy).toHaveBeenNthCalledWith(2, 'context:fake_conversation')
    })

    it('should be able to call textmeServer::get with right parameters if cache do not return context', async () => {
      const _cacheProvider: ICacheProvider = mock()
      const _sut = new GetUpdatedContextService(_cacheProvider)
      jest
        .spyOn(_cacheProvider, 'retrieve')
        .mockResolvedValueOnce('fake_access_token')
      jest.spyOn(_cacheProvider, 'retrieve').mockResolvedValueOnce(null)
      const spy = jest.spyOn(textmeServer, 'get')
      const result = await _sut.execute(params)
      expect(spy).toHaveBeenCalledWith(`chat/${params.fromUserId}`, {
        headers: {
          Authorization: `Bearer fake_access_token`,
        },
      })
      expect(result).toEqual([])
    })
  })
})
