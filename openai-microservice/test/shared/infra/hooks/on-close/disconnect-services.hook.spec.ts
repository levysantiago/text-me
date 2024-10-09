import 'reflect-metadata'
import { mock } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { IQueueProvider } from '@shared/container/providers/queue-provider/types/iqueue.provider'
import { disconnectServicesHook } from '@shared/infra/hooks/on-close/disconnect-services.hook'
import { ICacheProvider } from '@shared/container/providers/cache-provider/types/icache-provider'
import { ISocketProvider } from '@shared/container/providers/socket-client-provider/types/isocket-provider'

describe('connectQueueServiceHook', () => {
  let queueProvider: IQueueProvider
  let cacheProvider: ICacheProvider
  let socketProvider: ISocketProvider
  const sut = disconnectServicesHook

  beforeEach(() => {
    queueProvider = mock()
    cacheProvider = mock()
    socketProvider = mock()

    // Mock providers
    jest.spyOn(container, 'resolve').mockReturnValueOnce(queueProvider)
    jest.spyOn(container, 'resolve').mockReturnValueOnce(cacheProvider)
    jest.spyOn(container, 'resolve').mockReturnValueOnce(socketProvider)

    jest.spyOn(queueProvider, 'disconnect').mockResolvedValue()
    jest.spyOn(cacheProvider, 'disconnect').mockResolvedValue()
    jest.spyOn(socketProvider, 'disconnect').mockReturnValue()
  })

  it('should be able to disconnect services', async () => {
    const promise = sut()
    expect(promise).resolves.toBeUndefined()
  })

  it('should be able to call queueProvider::disconnect with right parameters', async () => {
    const spy = jest.spyOn(queueProvider, 'disconnect')
    await sut()
    expect(spy).toHaveBeenCalledWith()
  })

  it('should be able to call cacheProvider::disconnect with right parameters', async () => {
    const spy = jest.spyOn(cacheProvider, 'disconnect')
    await sut()
    expect(spy).toHaveBeenCalledWith()
  })

  it('should be able to call socketProvider::disconnect with right parameters', async () => {
    const spy = jest.spyOn(socketProvider, 'disconnect')
    await sut()
    expect(spy).toHaveBeenCalledWith()
  })
})
