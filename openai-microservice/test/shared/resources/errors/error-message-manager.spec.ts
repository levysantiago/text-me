import { ErrorMessageManager } from '@shared/resources/errors/error-message-manager'

describe('ErrorMessageManager', () => {
  const sut = ErrorMessageManager

  describe('getMessages', () => {
    it('should be able to get english messages', () => {
      const messages = sut.getMessages('en')
      expect(messages).toHaveProperty('INTERNAL_SERVER_ERROR')
      expect(messages).toEqual(expect.any(Object))
    })

    it('should be able to get portuguese messages', () => {
      const messages = sut.getMessages('pt')
      expect(messages).toHaveProperty('INTERNAL_SERVER_ERROR')
      expect(messages).toEqual(expect.any(Object))
    })
  })

  describe('getUserExcuseMessage', () => {
    it('should be able to return excuse message', () => {
      const result = sut.getUserExcuseMessage()
      expect(result).toEqual(expect.any(String))
    })
  })
})
