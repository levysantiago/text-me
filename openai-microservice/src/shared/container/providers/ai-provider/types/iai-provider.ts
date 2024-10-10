import { ISendMessageDTO } from '../dtos/isend-message.dto'
import { ISendMessageResponse } from '../dtos/isend-message.response'

export interface IAiProvider {
  sendMessage(param: ISendMessageDTO): Promise<ISendMessageResponse>
}
