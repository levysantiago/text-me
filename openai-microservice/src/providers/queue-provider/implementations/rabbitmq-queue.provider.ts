import amqp from 'amqplib'
import { injectable } from 'tsyringe'
import { IQueueProvider } from '../types/iqueue.provider'
import { env } from '@src/env'
import { ISendMessageToQueueDTO } from '../dtos/isend-message-to-queue.dto'
import { IQueueName } from '../types/iqueue-name'

@injectable()
export class RabbitMqQueueService implements IQueueProvider {
  private connection!: amqp.Connection
  private channel!: amqp.Channel

  async connect(): Promise<void> {
    this.connection = await amqp.connect({
      hostname: env.RABBITMQ_HOST,
      port: env.RABBITMQ_PORT,
      username: env.RABBITMQ_USER,
      password: env.RABBITMQ_PASSWORD,
    })
    this.channel = await this.connection.createChannel()
    await this.channel.assertQueue('main_queue', { durable: true })
  }

  async sendMessage(data: ISendMessageToQueueDTO): Promise<void> {
    this.channel.sendToQueue(
      'main_queue',
      Buffer.from(JSON.stringify(data), 'utf-8'),
      {
        persistent: true,
      },
    )
  }

  async consumeMessages(
    queue: IQueueName,
    cb: (data: any) => Promise<void>,
  ): Promise<void> {
    await this.channel.consume(queue, async (dataJson) => {
      if (dataJson !== null) {
        try {
          const data: ISendMessageToQueueDTO = JSON.parse(
            dataJson.content.toString('utf-8'),
          )
          // console.log('Received:', data)

          // Callback
          await cb(data)
          this.channel.ack(dataJson)
        } catch (err) {
          this.channel.nack(dataJson, false, true)
        }
      }
    })
  }

  async disconnect(): Promise<void> {
    await this.channel.close()
    await this.connection.close()
  }
}
