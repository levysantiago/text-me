/* eslint-disable no-useless-constructor */
import { env } from '@shared/resources/env'
import { ICacheProvider } from '@shared/container/providers/cache-provider/types/icache-provider'
import { io, Socket } from 'socket.io-client'
import { inject, singleton } from 'tsyringe'
import { ISocketProvider } from '../types/isocket-provider'
import { IHandlerCallback } from '../types/ihandler-callback'
import { ISubscribeEventName } from '../types/isubscribe-event-names'
import { IEmitEventName } from '../types/iemit-event-name'

@singleton()
export class SocketIoClientProvider implements ISocketProvider {
  private socket!: Socket

  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async connect(): Promise<void> {
    // Retrieving access token
    const accessToken = await this.cacheProvider.retrieve('access_token')
    if (!accessToken) {
      throw new Error('Microservice not logged')
    }

    // Starting socket
    this.socket = io(env.WEBSOCKET_SERVER, {
      query: { access_token: accessToken },
    })
  }

  subscribe(eventName: ISubscribeEventName, callback: IHandlerCallback): void {
    // Subscribe to events 'handleCreatedMessage'
    this.socket.on(eventName, callback)
  }

  emit(eventName: IEmitEventName, data: any): void {
    this.socket.emit(eventName, data)
  }

  disconnect(): void {
    this.socket.disconnect()
  }
}
