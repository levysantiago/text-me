import { createHash } from 'node:crypto'

export class ConversationHelper {
  public static getConversationFromUsers({
    fromUserId,
    toUserId,
  }: {
    fromUserId: string
    toUserId: string
  }) {
    if (!fromUserId || !toUserId) {
      throw new Error(
        `Invalid IDs fromUserId: ${fromUserId} | toUserId: ${toUserId}`,
      )
    }
    let leftSide = fromUserId
    let rightSide = toUserId

    if (fromUserId.charCodeAt(0) <= toUserId.charCodeAt(0)) {
      leftSide = toUserId
      rightSide = fromUserId
    }

    return createHash('sha1').update(`${leftSide}-${rightSide}`).digest('hex')
  }
}
