import { Message } from '@modules/chat/infra/db/entities/message';
import { PrismaMessageMapper } from '@modules/chat/infra/db/mappers/prisma-message.mapper';
import { Message as RawMessage } from '@prisma/client';

describe('PrismaMessageRepository', () => {
  describe('toPrisma', () => {
    it('should be able to transform from Message entity to RawMessage prisma class', () => {
      const message = new Message({
        content: 'fake-content',
        fromUserId: 'fake-from-user-id',
        toUserId: 'fake-to-user-id',
      });

      const expectedRawMessage: RawMessage = {
        content: 'fake-content',
        fromUserId: 'fake-from-user-id',
        toUserId: 'fake-to-user-id',
        createdAt: message.createdAt,
        id: message.id,
        updatedAt: message.updatedAt,
        conversation: message.conversation,
        role: message.role,
        visualized: message.visualized,
      };

      const rawMessage = PrismaMessageMapper.toPrisma(message);
      expect(rawMessage).toEqual(expectedRawMessage);
    });
  });

  describe('fromPrisma', () => {
    it('should be able to transform from RawMessage prisma to Message entity', () => {
      const rawMessage: RawMessage = {
        id: 'fake-message-id',
        content: 'fake-content',
        fromUserId: 'fake-from-user-id',
        toUserId: 'fake-to-user-id',
        conversation: 'fake-conversation',
        role: 'user',
        visualized: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const message = PrismaMessageMapper.fromPrisma(rawMessage);
      expect(message).toBeInstanceOf(Message);
      expect(message.id).toEqual(rawMessage.id);
    });
  });
});
