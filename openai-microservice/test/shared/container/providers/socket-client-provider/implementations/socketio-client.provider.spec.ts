/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata'
import { ICacheProvider } from '@shared/container/providers/cache-provider/types/icache-provider'
import { SocketIoClientProvider } from '@shared/container/providers/socket-client-provider/implementations/socketio-client.provider'
import * as socketLib from 'socket.io-client'
import { env } from '@shared/resources/env'
import { mock } from 'jest-mock-extended'

jest.mock('ioredis', () => class {})

const fakeSocketOn = jest.fn(() => undefined)
const fakeSocketEmit = jest.fn(() => undefined)
const fakeSocketDisconnect = jest.fn(() => undefined)

jest.mock('socket.io-client', () => ({
  io: jest.fn(
    () =>
      ({
        on: fakeSocketOn,
        emit: fakeSocketEmit,
        disconnect: fakeSocketDisconnect,
      } as any),
  ),
}))

describe('SocketIoClientProvider', () => {
  let sut: SocketIoClientProvider
  let cacheProvider: ICacheProvider

  beforeAll(() => {})

  beforeEach(() => {
    cacheProvider = mock()
    sut = new SocketIoClientProvider(cacheProvider)

    jest.spyOn(cacheProvider, 'retrieve').mockResolvedValue('fake_access_token')
  })

  describe('connect', () => {
    it('should be able to connect to socket server', async () => {
      const promise = sut.connect()
      expect(promise).resolves.toBeUndefined()
    })

    it('should be able to call cacheProvider::retrieve with right parameters', async () => {
      const spy = jest.spyOn(cacheProvider, 'retrieve')
      await sut.connect()
      expect(spy).toHaveBeenCalledWith('access_token')
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should be able to call socket::io with right parameters', async () => {
      const spy = jest.spyOn(socketLib, 'io')
      await sut.connect()
      expect(spy).toHaveBeenCalledWith(env.WEBSOCKET_SERVER, {
        query: { access_token: 'fake_access_token' },
      })
    })

    it('should be able to call socket::on with right parameters', async () => {
      const spy = fakeSocketOn
      await sut.connect()
      expect(spy).toHaveBeenCalledWith(
        'handleCreatedMessage',
        expect.any(Function),
      )
    })
  })

  describe('subscribe', () => {
    it('should be able to subscribe a callback to event', async () => {
      const callback = async (data: any) => undefined
      sut.subscribe('handleCreatedMessage', callback)
      expect(sut['handlersByEvent'].handleCreatedMessage).toEqual([callback])
    })
  })

  describe('emit', () => {
    async function _beforeEach() {
      await sut.connect()
    }

    it('should be able to emit an event', async () => {
      await _beforeEach()
      expect(sut.emit('newMessage', {})).toBeUndefined()
    })

    it('should be able to call socket::emit with right parameters', async () => {
      await _beforeEach()
      const spy = fakeSocketEmit
      sut.emit('newMessage', {})
      expect(spy).toHaveBeenCalledWith('newMessage', {})
    })
  })

  describe('disconnect', () => {
    async function _beforeEach() {
      await sut.connect()
    }

    it('should be able to disconnect', async () => {
      await _beforeEach()
      expect(sut.disconnect()).toBeUndefined()
    })

    it('should be able to call socket::disconnect with right parameters', async () => {
      await _beforeEach()
      const spy = fakeSocketDisconnect
      await sut.disconnect()
      expect(spy).toHaveBeenCalledWith()
    })
  })
})
