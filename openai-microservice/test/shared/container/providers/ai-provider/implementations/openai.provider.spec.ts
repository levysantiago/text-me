/* eslint-disable dot-notation */
import OpenAiProvider from '@shared/container/providers/ai-provider/implementations/openai.provider'
import { IContext } from '@shared/container/providers/ai-provider/types/icontext'
import { env } from '@shared/resources/env'

jest.mock('openai', () => ({
  OpenAI: class {
    public apiKey: string
    public organization: string
    public chat = {
      completions: {
        create: () => ({
          choices: [{ message: { content: 'openai-message' } }],
        }),
      },
    }

    constructor({
      apiKey,
      organization,
    }: {
      apiKey: string
      organization: string
    }) {
      this.apiKey = apiKey
      this.organization = organization
    }
  },
}))

describe('OpenAiProvider', () => {
  let sut: OpenAiProvider

  beforeEach(() => {
    sut = new OpenAiProvider()
  })

  describe('constructor', () => {
    it('should be able to call OpenAI constructor with right parameters', async () => {
      expect(sut['openai'].apiKey).toEqual(env.OPENAI_KEY)
      expect(sut['openai'].organization).toEqual(env.OPENAI_ORGANIZATION)
    })
  })

  describe('sendMessage', () => {
    const params = {
      context: [{ role: 'user', content: 'message' }] as IContext,
    }

    it('should be able to send message to OpenAI', async () => {
      const result = await sut.sendMessage(params)
      expect(result).toEqual({ message: 'openai-message' })
    })

    it('should be able to call OpenAI::create with right parameters', async () => {
      const spy = jest.spyOn(sut['openai'].chat.completions, 'create')
      await sut.sendMessage(params)
      expect(spy).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages: sut['startupContext'].concat(params.context),
      })
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})
