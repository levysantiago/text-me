import { container } from 'tsyringe'
import LocalCacheProvider from './implementations/local-cache.provider'
import { ICacheProvider } from './types/icache-provider'
import RedisCacheProvider from './implementations/redis-cache.provider'
import { env } from '@shared/resources/env'

const implementations = {
  local: LocalCacheProvider,
  redis: RedisCacheProvider,
}

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  implementations[env.CACHE_PROVIDER],
)
