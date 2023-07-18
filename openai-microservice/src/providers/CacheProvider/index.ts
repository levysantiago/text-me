import { container } from 'tsyringe'
import LocalCacheProvider from './implementations/local-cache-provider'
import { ICacheProvider } from './types/icache-provider'

const implementations = {
  local: LocalCacheProvider,
}

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  implementations.local,
)
