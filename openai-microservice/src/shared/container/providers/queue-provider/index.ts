import { container } from 'tsyringe'
import { RabbitMqQueueProvider } from './implementations/rabbitmq-queue.provider'
import { IQueueProvider } from './types/iqueue.provider'
import { env } from '@shared/resources/env'

const implementations = {
  rabbitmq: RabbitMqQueueProvider,
}

container.registerSingleton<IQueueProvider>(
  'QueueProvider',
  implementations[env.QUEUE_PROVIDER],
)
