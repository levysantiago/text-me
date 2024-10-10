import 'reflect-metadata'
import { mock } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { connectSocketServiceHook } from '@shared/infra/hooks/on-ready/connect-socket-service.hook'
import { ISocketProvider } from '@shared/container/providers/socket-client-provider/types/isocket-provider'
import { HandleCreatedMessageService } from '@modules/chat/services/handle-created-message.service'

describe('connectSocketServiceHook', () => {
  let socketProvider: ISocketProvider
  let handleCreatedMessageService: HandleCreatedMessageService
  const sut = connectSocketServiceHook

  beforeEach(() => {
    socketProvider = mock()
    handleCreatedMessageService = mock()

    // Mock socketProvider
    jest.spyOn(container, 'resolve').mockReturnValueOnce(socketProvider)
    jest.spyOn(socketProvider, 'subscribe').mockReturnValue()

    // Mock handleCreatedMessageService
    jest
      .spyOn(container, 'resolve')
      .mockReturnValueOnce(handleCreatedMessageService)
  })

  it('should be able to connect to socket', async () => {
    const promise = sut()
    expect(promise).resolves.toBeUndefined()
  })

  it('should be able to call socketProvider::connect with right parameters', async () => {
    const spy = jest.spyOn(socketProvider, 'connect')
    await sut()
    expect(spy).toHaveBeenCalledWith()
  })

  it('should be able to call socketProvider::subscribe with right parameters', async () => {
    const spy = jest.spyOn(socketProvider, 'subscribe')
    await sut()
    expect(spy).toHaveBeenCalledWith(
      'handleCreatedMessage',
      handleCreatedMessageService.execute,
    )
  })
})
