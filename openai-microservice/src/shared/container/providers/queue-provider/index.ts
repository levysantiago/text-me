import { container } from 'tsyringe'
import { RabbitMqQueueProvider } from './implementations/rabbitmq-queue.provider'
import { IQueueProvider } from './types/iqueue.provider'

const implementations = {
  rabbitmq: RabbitMqQueueProvider,
}

container.registerSingleton<IQueueProvider>(
  'QueueProvider',
  implementations.rabbitmq,
)
