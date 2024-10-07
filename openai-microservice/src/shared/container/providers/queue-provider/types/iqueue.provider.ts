import { ISendMessageToQueueDTO } from '../dtos/isend-message-to-queue.dto'
import { IQueueName } from './iqueue-name'

export interface IQueueProvider {
  connect(): Promise<void>
  sendMessage(data: ISendMessageToQueueDTO): Promise<void>
  consumeMessages(
    queue: IQueueName,
    cb: (data: any) => Promise<void>,
  ): Promise<void>
  disconnect(): Promise<void>
}
