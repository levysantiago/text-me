import 'reflect-metadata'
import { ICacheProvider } from '@shared/container/providers/cache-provider/types/icache-provider'
import { loginHook } from '@shared/infra/hooks/on-ready/login.hook'
import { textmeServer } from '@shared/resources/api/textme-server'
import { mock } from 'jest-mock-extended'
import { container } from 'tsyringe'
import { env } from '@shared/resources/env'

describe('LoginHook', () => {
  let cacheProvider: ICacheProvider
  const sut = loginHook

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    cacheProvider = mock()

    // Mock cacheProvider
    jest.spyOn(container, 'resolve').mockReturnValue(cacheProvider)
    jest.spyOn(cacheProvider, 'save').mockResolvedValue()
    // Mock textmeServer
    jest.spyOn(textmeServer, 'post').mockResolvedValue({
      status: 200,
      data: {
        data: {
          access_token: 'fake_access_token',
        },
      },
    })
  })

  it('should be able to login to server', async () => {
    const promise = sut()
    expect(promise).resolves.toBeUndefined()
  })

  it('should be able to call textmeServer::post with right parameters', async () => {
    const spy = jest.spyOn(textmeServer, 'post')
    await sut()
    expect(spy).toHaveBeenCalledWith('/auth', {
      email: env.USER_EMAIL,
      password: env.USER_PASSWORD,
    })
  })

  it('should be able to call CacheProvider::save with right parameters', async () => {
    const spy = jest.spyOn(cacheProvider, 'save')
    await sut()
    expect(spy).toHaveBeenCalledWith('access_token', 'fake_access_token')
  })

  it('should be able to handle status not 200', async () => {
    jest.spyOn(textmeServer, 'post').mockResolvedValueOnce({ status: 404 })
    const promise = sut()
    expect(promise).rejects.toEqual(new Error('Failed to sign in'))
  })

  it('should be able to handle validation error', async () => {
    jest.spyOn(textmeServer, 'post').mockResolvedValueOnce({
      status: 200,
      data: {
        data: {},
      },
    })
    const promise = sut()
    expect(promise).rejects.toEqual(new Error('Invalid server response data'))
  })
})
