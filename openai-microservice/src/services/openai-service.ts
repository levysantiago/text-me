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
    const response: AxiosResponse<CreateChatCompletionResponse, any> =
      await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: context,
      })

    return response
  }
}

export default OpenAiService
