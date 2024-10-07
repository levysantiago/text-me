import { textmeServer } from '@shared/resources/api/textme-server'
import { getConversationFromUsers } from '@shared/resources/lib/get-conversation-from-users-helper'
import { IChatMessage } from '@shared/container/providers/ai-provider/types/ichat-message'
import { IContext } from '@shared/container/providers/ai-provider/types/icontext'
import { ICacheProvider } from '@shared/container/providers/cache-provider/types/icache-provider'
import { container, injectable } from 'tsyringe'

interface IGetContextDTO {
  fromUserId: string
  toUserId: string
}

@injectable()
export class GetUpdatedContextService {
  private cacheProvider: ICacheProvider

  constructor() {
    // Catching cache provider
    this.cacheProvider = container.resolve<ICacheProvider>('CacheProvider')
  }

  async execute({ fromUserId, toUserId }: IGetContextDTO): Promise<IContext> {
    // Retrieving access token
    const accessToken = await this.cacheProvider.retrieve('access_token')

    // Get conversation id
    const conversationId = getConversationFromUsers({ fromUserId, toUserId })

    // Getting context from cache if exists
    const contextJson = await this.cacheProvider.retrieve(
      `context:${conversationId}`,
    )
    let context: IContext = []

    if (contextJson) {
      context = JSON.parse(contextJson)

      // Pushing new message
      // context.push({ role, content })
    } else {
      // Getting messages context
      const response = await textmeServer.get(`chat/${fromUserId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Recreating context
      context = []
      response.data.data.map((message: IChatMessage) => {
        context.push({ role: message.role, content: message.content })
        return message
      })
      context.pop()
    }

    return context
  }
}
