import { container } from 'tsyringe'
import { IQueueProvider } from '@src/providers/queue-provider/types/iqueue.provider'
import { ICacheProvider } from '@src/providers/cache-provider/types/icache-provider'
import { ISocketProvider } from '@src/providers/socket-client-provider/types/isocket-provider'

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
  await socketProvider.disconnect()
}
