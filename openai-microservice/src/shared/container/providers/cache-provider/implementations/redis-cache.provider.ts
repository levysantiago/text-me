import { env } from '@shared/resources/env'
import { ICacheProvider } from '../types/icache-provider'
import Redis from 'ioredis'

class RedisCacheProvider implements ICacheProvider {
  private redisClient: Redis

  constructor() {
    // Connecting to Redis
    this.redisClient = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
    })
  }

  async save(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, value, 'EX', ttl)
    } else {
      await this.redisClient.set(key, value)
    }
  }

  async retrieve(key: string): Promise<string | null> {
    return await this.redisClient.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key)
  }

  async disconnect(): Promise<void> {
    this.redisClient.disconnect()
  }
}

export default RedisCacheProvider
