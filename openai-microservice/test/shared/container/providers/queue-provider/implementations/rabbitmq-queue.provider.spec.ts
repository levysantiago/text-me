/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable dot-notation */
import { RabbitMqQueueProvider } from '@shared/container/providers/queue-provider/implementations/rabbitmq-queue.provider'
import { env } from '@shared/resources/env'
import amqp, { Connection } from 'amqplib'

describe('RabbitMqQueueService', () => {
  let sut: RabbitMqQueueProvider
  let fakeChannel = createFakeChannel()
  let fakeConnection = createFakeConnection(fakeChannel)
  const fakeConsumptionData = { content: 'fake_content' }

  function createFakeConnection(fakeChannel: any) {
    return {
      createChannel: jest.fn(() => fakeChannel),
      on: () => {},
      close: jest.fn(() => {}),
    } as any as Connection
  }

  function createFakeChannel() {
    return {
      sendToQueue: jest.fn(() => true),
      consume: jest.fn(
        async (queue: string, cb: (data: any) => Promise<void>) => {
          // eslint-disable-next-line n/no-callback-literal
          await cb({
            content: Buffer.from(JSON.stringify(fakeConsumptionData), 'utf-8'),
          })
        },
      ),
      assertQueue: jest.fn(() => {}),
      close: jest.fn(() => {}),
      ack: jest.fn(() => {}),
      nack: jest.fn(() => {}),
    }
  }

  beforeEach(() => {
    sut = new RabbitMqQueueProvider()

    fakeChannel = createFakeChannel()
    fakeConnection = createFakeConnection(fakeChannel)

    jest.spyOn(amqp, 'connect').mockResolvedValue(fakeConnection)
  })

  describe('tryConnect', () => {
    it('should be able to connect to RabbitMQ', async () => {
      const result = await sut['tryConnect']()
      expect(result).toBeTruthy()
    })

    it('should be able to call amqp::connect with right parameters', async () => {
      const spy = jest.spyOn(amqp, 'connect')
      await sut['tryConnect']()
      expect(spy).toHaveBeenCalledWith({
        hostname: env.RABBITMQ_HOST,
        port: Number(env.RABBITMQ_PORT),
        username: env.RABBITMQ_USER,
        password: env.RABBITMQ_PASSWORD,
      })
    })

    it('should be able to call connection::createChannel with right parameters', async () => {
      const spy = fakeConnection.createChannel
      await sut['tryConnect']()
      expect(spy).toHaveBeenCalledWith()
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should be able to call connection::createChannel with right parameters', async () => {
      const spy = fakeChannel.assertQueue
      await sut['tryConnect']()
      expect(spy).toHaveBeenCalledWith('main_queue', { durable: true })
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should be able to return false if connection is not mande', async () => {
      jest.spyOn(amqp, 'connect').mockRejectedValueOnce(new Error())
      const result = await sut['tryConnect']()
      expect(result).toBeFalsy()
    })
  })

  describe('connect', () => {
    it('should be able to connect to RabbitMQ', async () => {
      const promise = sut['connect']()
      expect(promise).resolves.toBeUndefined()
    })

    it('should be able to call sut::tryConnect with right parameters', async () => {
      const spy = jest.spyOn(sut as any, 'tryConnect')
      await sut['connect']()
      expect(spy).toHaveBeenCalledWith()
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('publish', () => {
    async function _beforeEach() {
      await sut.connect()
    }

    it('should be able to publish to queue', async () => {
      await _beforeEach()
      const promise = sut.publish({
        content: 'fake_content',
      })
      expect(promise).resolves.toBeUndefined()
    })

    it('should be able to call channel::sendToQueue with right parameters', async () => {
      await _beforeEach()
      const spy = jest.spyOn(fakeChannel, 'sendToQueue')
      await sut.publish({
        content: 'fake_content',
      })
      expect(spy).toHaveBeenCalledWith(
        'main_queue',
        Buffer.from(
          JSON.stringify({
            content: 'fake_content',
          }),
          'utf-8',
        ),
        { persistent: true },
      )
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('consume', () => {
    async function _beforeEach() {
      await sut.connect()
    }

    it('should be able to consume', async () => {
      await _beforeEach()
      const promise = sut.consume(async (data: any) => undefined)
      expect(promise).resolves.toBeUndefined()
    })

    it('should be able to call channel::consumeMessages with right parameters', async () => {
      await _beforeEach()
      const spy = jest.spyOn(fakeChannel, 'consume')
      await sut.consume(async (data: any) => undefined)
      expect(spy).toHaveBeenCalledWith('main_queue', expect.any(Function))
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should be able to call argument callback with right parameters', async () => {
      await _beforeEach()
      const callback = jest.fn(async (data: any) => undefined)
      await sut.consume(callback)
      expect(callback).toHaveBeenCalledWith(fakeConsumptionData)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should be able to call channel::ack with right parameters', async () => {
      await _beforeEach()
      const spy = jest.spyOn(fakeChannel, 'ack')
      await sut.consume(async (data: any) => undefined)
      expect(spy).toHaveBeenCalledWith({
        content: Buffer.from(JSON.stringify(fakeConsumptionData), 'utf-8'),
      })
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should be able to call channel::nack with right parameters if callback fails', async () => {
      await _beforeEach()
      const spy = jest.spyOn(fakeChannel, 'nack')
      const callback = jest.fn(async (data: any) => {
        throw new Error()
      })
      await sut.consume(callback)
      expect(spy).toHaveBeenCalledWith(
        {
          content: Buffer.from(JSON.stringify(fakeConsumptionData), 'utf-8'),
        },
        false,
        true,
      )
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('disconnect', () => {
    async function _beforeEach() {
      await sut.connect()
    }

    it('should be able to disconnect', async () => {
      await _beforeEach()
      const promise = sut.disconnect()
      expect(promise).resolves.toBeUndefined()
    })

    it('should be able to call channel::close and connection::close with right parameters', async () => {
      await _beforeEach()
      const spyChannel = jest.spyOn(fakeChannel, 'close')
      const spyConnection = jest.spyOn(fakeConnection, 'close')
      await sut.disconnect()
      expect(spyChannel).toHaveBeenCalledWith()
      expect(spyChannel).toHaveBeenCalledTimes(1)
      expect(spyConnection).toHaveBeenCalledWith()
      expect(spyConnection).toHaveBeenCalledTimes(1)
    })
  })
})
