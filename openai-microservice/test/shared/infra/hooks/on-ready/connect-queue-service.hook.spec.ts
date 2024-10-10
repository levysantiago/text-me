import 'reflect-metadata'
import { mock } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { connectQueueServiceHook } from '@shared/infra/hooks/on-ready/connect-queue-service.hook'
import { SendAiResponseService } from '@modules/chat/services/send-ai-response.service'
import { IQueueProvider } from '@shared/container/providers/queue-provider/types/iqueue.provider'

describe('connectQueueServiceHook', () => {
  let queueProvider: IQueueProvider
  let sendAiResponseService: SendAiResponseService
  const sut = connectQueueServiceHook

  beforeEach(() => {
    queueProvider = mock()
    sendAiResponseService = mock()

    // Mock socketProvider
    jest.spyOn(container, 'resolve').mockReturnValueOnce(queueProvider)
    jest.spyOn(queueProvider, 'consume').mockResolvedValue()

    // Mock handleCreatedMessageService
    jest.spyOn(container, 'resolve').mockReturnValueOnce(sendAiResponseService)
  })

  it('should be able to connect to queueProvider', async () => {
    const promise = sut()
    expect(promise).resolves.toBeUndefined()
  })

  it('should be able to call queueProvider::connect with right parameters', async () => {
    const spy = jest.spyOn(queueProvider, 'connect')
    await sut()
    expect(spy).toHaveBeenCalledWith()
  })

  it('should be able to call queueProvider::consume with right parameters', async () => {
    const spy = jest.spyOn(queueProvider, 'consume')
    await sut()
    expect(spy).toHaveBeenCalledWith(sendAiResponseService.execute)
  })
})
