import { ISendMessageToQueueDTO } from '../dtos/isend-message-to-queue.dto'

export interface IQueueProvider {
  connect(): Promise<void>
  publish(data: ISendMessageToQueueDTO): Promise<void>
  consume(cb: (data: any) => Promise<void>): Promise<void>
  disconnect(): Promise<void>
}
