import { container } from 'tsyringe'
import { SocketIoClientProvider } from './implementations/socketio-client.provider'
import { ISocketProvider } from './types/isocket-provider'
import { env } from '@shared/resources/env'

const implementations = {
  socketio: SocketIoClientProvider,
}

container.registerSingleton<ISocketProvider>(
  'SocketProvider',
  implementations[env.SOCKET_PROVIDER],
)
