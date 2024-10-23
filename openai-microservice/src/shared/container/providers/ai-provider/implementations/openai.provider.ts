import { env } from '@shared/resources/env'
import { OpenAI } from 'openai'
import { ISendMessageResponse } from '../dtos/isend-message.response'
import { ISendMessageDTO } from '../dtos/isend-message.dto'
import { IAiProvider } from '../types/iai-provider'

class OpenAiProvider implements IAiProvider {
  private openai: OpenAI
  private startupContext: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
    [
      {
        role: 'system',
        content: `
          You are a user of a chat application. 
          You must act like a normal person.
          You must keep the conversation going.
          If someone talks with you in English, you must respond in English too.
          If someone talks with you in Portuguese, you must respond in Portuguese too.
        `,
      },
    ]

  constructor() {
    this.openai = new OpenAI({
      apiKey: env.OPENAI_KEY,
      organization: env.OPENAI_ORGANIZATION,
      // project: env.OPENAI_PROJECT,
    })
  }

  async sendMessage({
    context,
  }: ISendMessageDTO): Promise<ISendMessageResponse> {
    const openAiResponse: OpenAI.Chat.Completions.ChatCompletion =
      await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: this.startupContext.concat(context),
      })

    return { message: openAiResponse.choices[0].message.content }
  }
}

export default OpenAiProvider
