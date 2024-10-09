import { container } from 'tsyringe'
import { IQueueProvider } from '@shared/container/providers/queue-provider/types/iqueue.provider'
import { ICacheProvider } from '@shared/container/providers/cache-provider/types/icache-provider'
import { ISocketProvider } from '@shared/container/providers/socket-client-provider/types/isocket-provider'

export async function disconnectServicesHook() {
  // getting Queue provider
  const queueProvider = container.resolve<IQueueProvider>('QueueProvider')
  // getting Cache provider
  const cacheProvider = container.resolve<ICacheProvider>('CacheProvider')
  // getting Socket provider
  const socketProvider = container.resolve<ISocketProvider>('SocketProvider')
  // Disconnecting
  await queueProvider.disconnect()
  await cacheProvider.disconnect()
  socketProvider.disconnect()
}
