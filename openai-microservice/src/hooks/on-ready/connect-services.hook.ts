import { container } from 'tsyringe'
import { IQueueProvider } from '@src/providers/queue-provider/types/iqueue.provider'

export async function connectServicesHook() {
  // getting Queue provider
  const queueProvider = container.resolve<IQueueProvider>('QueueProvider')
  // Connecting
  await queueProvider.connect()
}
