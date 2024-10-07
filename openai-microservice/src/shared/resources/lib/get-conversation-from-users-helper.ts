import { createHash } from 'node:crypto'

export function getConversationFromUsers({
  fromUserId,
  toUserId,
}: {
  fromUserId: string
  toUserId: string
}) {
  let leftSide = fromUserId
  let rightSide = toUserId

  if (fromUserId.charCodeAt(0) <= toUserId.charCodeAt(0)) {
    leftSide = toUserId
    rightSide = fromUserId
  }

  return createHash('sha1').update(`${leftSide}-${rightSide}`).digest('hex')
}
