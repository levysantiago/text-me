import { container } from 'tsyringe'
import { RabbitMqQueueService } from './implementations/rabbitmq-queue.provider'
import { IQueueProvider } from './types/iqueue.provider'

const implementations = {
  rabbitmq: RabbitMqQueueService,
}

container.registerSingleton<IQueueProvider>(
  'QueueProvider',
  implementations.rabbitmq,
)
