import { container } from 'tsyringe'
import { IQueueProvider } from '@shared/container/providers/queue-provider/types/iqueue.provider'
import { SendAiResponseService } from '@modules/chat/services/send-ai-response.service'

export async function connectQueueServiceHook() {
  // getting Queue provider
  const queueProvider = container.resolve<IQueueProvider>('QueueProvider')
  // Get sendAiResponseService
  const sendAiResponseService = container.resolve(SendAiResponseService)
  // Connecting
  await queueProvider.connect()
  // Start consumer
  queueProvider.consume(sendAiResponseService.execute)
}
