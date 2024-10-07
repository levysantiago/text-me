import { container } from 'tsyringe'
import { SocketIoClientProvider } from './implementations/socketio-client.provider'
import { ISocketProvider } from './types/isocket-provider'

const implementations = {
  socketio: SocketIoClientProvider,
}

container.registerSingleton<ISocketProvider>(
  'SocketProvider',
  implementations.socketio,
)
