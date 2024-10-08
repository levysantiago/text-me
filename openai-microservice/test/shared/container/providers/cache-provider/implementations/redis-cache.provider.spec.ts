/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-empty-function */
import RedisCacheProvider from '@shared/container/providers/cache-provider/implementations/redis-cache.provider'
import { env } from '@shared/resources/env'

const fakeExpectedObject = { a: '' }
const fakeRedisConstructor = jest.fn(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (data: { host: string; port: string; password: string }) => {},
)

jest.mock(
  'ioredis',
  () =>
    class {
      set() {}

      get() {
        return fakeExpectedObject
      }

      del() {}

      disconnect() {}

      constructor(data: { host: string; port: string; password: string }) {
        fakeRedisConstructor(data)
      }
    },
)

describe('RedisCacheProvider', () => {
  let sut: RedisCacheProvider

  beforeEach(() => {
    sut = new RedisCacheProvider()
  })

  describe('constructor', () => {
    it('should be able to call Redis constructor with right parameters', async () => {
      const _ = new RedisCacheProvider()
      const spy = fakeRedisConstructor
      expect(spy).toHaveBeenCalledWith({
        host: env.REDIS_HOST,
        port: Number(env.REDIS_PORT),
        password: env.REDIS_PASSWORD,
      })
    })
  })

  describe('save', () => {
    it('should be able to save a data to cache', async () => {
      const promise = sut.save('key', JSON.stringify({ key: 'value' }))
      expect(promise).resolves.toBeUndefined()
    })

    it('should be able to call Redis::set with right parameters', async () => {
      const spy = jest.spyOn(sut['redisClient'], 'set')
      await sut.save('key', JSON.stringify({ key: 'value' }))
      expect(spy).toHaveBeenCalledWith('key', JSON.stringify({ key: 'value' }))
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should be able to call Redis::set with right parameters (with ttl)', async () => {
      const spy = jest.spyOn(sut['redisClient'], 'set')
      await sut.save('key', JSON.stringify({ key: 'value' }), 1000)
      expect(spy).toHaveBeenCalledWith(
        'key',
        JSON.stringify({ key: 'value' }),
        'EX',
        1000,
      )
    })
  })

  describe('retrieve', () => {
    it('should be able to retrieve a value from cache', async () => {
      const result = await sut.retrieve('key')
      expect(result).toEqual(fakeExpectedObject)
    })

    it('should be able to call Redis::get with right parameters', async () => {
      const spy = jest.spyOn(sut['redisClient'], 'get')
      await sut.retrieve('key')
      expect(spy).toHaveBeenCalledWith('key')
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('delete', () => {
    it('should be able to delete a value from cache', async () => {
      const promise = sut.delete('key')
      expect(promise).resolves.toBeUndefined()
    })

    it('should be able to call Redis::del with right parameters', async () => {
      const spy = jest.spyOn(sut['redisClient'], 'del')
      await sut.delete('key')
      expect(spy).toHaveBeenCalledWith('key')
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('disconnect', () => {
    it('should be able to disconnect', async () => {
      const promise = sut.disconnect()
      expect(promise).resolves.toBeUndefined()
    })

    it('should be able to call Redis::disconnect with right parameters', async () => {
      const spy = jest.spyOn(sut['redisClient'], 'disconnect')
      await sut.disconnect()
      expect(spy).toHaveBeenCalledWith()
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})
