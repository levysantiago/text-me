import { ISendMessageResponse } from '../dtos/isend-message.response'
import { ISendMessageDTO } from '../dtos/isend-message.dto'
import { IAiProvider } from '../types/iai-provider'

class FakeAiProvider implements IAiProvider {
  async sendMessage({
    context,
  }: ISendMessageDTO): Promise<ISendMessageResponse> {
    return {
      message: `Assistant default message for "${context.at(-1)?.content}"`,
    }
  }
}

export default FakeAiProvider
