import { ConversationHelper } from '@shared/resources/lib/conversation-helper'

describe('Conversation Helper', () => {
  const sut = ConversationHelper

  describe('getConversationFromUsers', () => {
    it('should be able to generate the same conversation id', () => {
      let areResultsTheSame = true
      const firstResult = sut.getConversationFromUsers({
        fromUserId: 'fake_from_user_id',
        toUserId: 'fake_to_user_id',
      })
      for (let i = 0; i < 1000; i++) {
        const nextResult = sut.getConversationFromUsers({
          fromUserId: 'fake_from_user_id',
          toUserId: 'fake_to_user_id',
        })

        if (nextResult !== firstResult) areResultsTheSame = false
      }
      expect(areResultsTheSame).toBeTruthy()
    })

    it('should be able to generate different conversation id', () => {
      const firstResult = sut.getConversationFromUsers({
        fromUserId: 'fake_from_user_id_diff',
        toUserId: 'fake_to_user_id',
      })

      const secondResult = sut.getConversationFromUsers({
        fromUserId: 'fake_from_user_id',
        toUserId: 'fake_to_user_id',
      })

      expect(firstResult).not.toEqual(secondResult)
    })
  })
})
