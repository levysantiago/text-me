import { container } from 'tsyringe'
import { ISocketProvider } from '@shared/container/providers/socket-client-provider/types/isocket-provider'
import { HandleCreatedMessageService } from '@modules/chat/services/handle-created-message.service'

export async function connectSocketServiceHook() {
  // getting Socket provider
  const socketProvider = container.resolve<ISocketProvider>('SocketProvider')
  // getting HandleCreatedMessageService
  const handleCreatedMessageService = container.resolve(
    HandleCreatedMessageService,
  )

  // Starting socket
  await socketProvider.connect()

  // Register callback services
  socketProvider.subscribe(
    'handleCreatedMessage',
    handleCreatedMessageService.execute,
  )
}
