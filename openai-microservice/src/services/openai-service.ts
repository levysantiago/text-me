import { AxiosResponse } from 'axios'
import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi,
} from 'openai'
import { env } from '../env'
import { singleton } from 'tsyringe'

@singleton()
class OpenAiService {
  private openai: OpenAIApi

  constructor() {
    const configuration = new Configuration({
      apiKey: env.OPENAI_KEY,
    })

    this.openai = new OpenAIApi(configuration)
  }

  async sendMessage(
    context: ChatCompletionRequestMessage[],
  ): Promise<AxiosResponse<CreateChatCompletionResponse, any>> {
    const startupContext: ChatCompletionRequestMessage[] = [
      {
        role: 'system',
        content: `
          You are a user of a chat application. 
          You must act like a normal person.
          You must keep the conversation going.
          Your name is Andy.
          You speak portuguese from Brazil. And you speak English too.
        `,
      },
    ]

    const response: AxiosResponse<CreateChatCompletionResponse, any> =
      await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: startupContext.concat(context),
      })

    return response
  }
}

export default OpenAiService
