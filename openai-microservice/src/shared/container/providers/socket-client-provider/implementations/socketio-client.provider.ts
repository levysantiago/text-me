/* eslint-disable no-useless-constructor */
import { env } from '@shared/resources/env'
import { IHandleCreatedMessageDTO } from '@shared/container/providers/socket-client-provider/dtos/ihandle-created-message.dto'
import { ICacheProvider } from '@shared/container/providers/cache-provider/types/icache-provider'
import { io, Socket } from 'socket.io-client'
import { inject, singleton } from 'tsyringe'
import { ISocketProvider } from '../types/isocket-provider'
import { IHandlerCallback } from '../types/ihandler-callback'
import { ISubscribeEventName } from '../types/isubscribe-event-names'
import { IEmitEventName } from '../types/iemit-event-name'

interface IHandlersByEvent {
  [x: string]: IHandlerCallback[]
}

@singleton()
export class SocketIoClientProvider implements ISocketProvider {
  private socket!: Socket
  private handlersByEvent: IHandlersByEvent = {
    handleCreatedMessage: [] as IHandlerCallback[],
  }

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

    // Subscribe to events
    this.socket.on(
      'handleCreatedMessage',
      ({ fromUserId, toUserId, content, role }: IHandleCreatedMessageDTO) => {
        // Calling handlers
        this.handlersByEvent.handleCreatedMessage.map((handler) =>
          handler({
            fromUserId,
            toUserId,
            content,
            role,
          }),
        )
      },
    )
  }

  subscribe(eventName: ISubscribeEventName, callback: IHandlerCallback): void {
    this.handlersByEvent[eventName].push(callback)
  }

  emit(eventName: IEmitEventName, data: any): void {
    this.socket.emit(eventName, data)
  }

  disconnect(): void {
    this.socket.disconnect()
  }
}
