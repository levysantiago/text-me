import { MessagesNotFoundError } from '@modules/chat/errors/messages-not-found.error';
import { Message } from '@modules/chat/infra/db/entities/message';
import { MessagesRepository } from '@modules/chat/repositories/messages.repository';
import { GetMessagesService } from '@modules/chat/services/get-messages.service';
import { Test } from '@nestjs/testing';
import { ConversationHelper } from '@shared/resources/lib/conversation-helper';
import { fakeMessageObject } from '@test/unit/mock/fake-message-object.mock';

describe('GetMessagesService', () => {
  let messagesRepository: MessagesRepository;
  let sut: GetMessagesService;

  const expectedMessage = new Message(fakeMessageObject, fakeMessageObject.id);

  beforeAll(() => {
    jest
      .spyOn(ConversationHelper, 'getConversationFromUsers')
      .mockReturnValue('fake-conversation');
  });

  beforeEach(async () => {
    const fakeMessageRepository = {
      findByConversation: jest.fn().mockResolvedValue([expectedMessage]),
    };

    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        { provide: MessagesRepository, useValue: fakeMessageRepository },
        GetMessagesService,
      ],
    }).compile();
    // Get repository
    messagesRepository = moduleFixture.get(MessagesRepository);
    // Get service
    sut = moduleFixture.get(GetMessagesService);
  });

  describe('execute', () => {
    const params = {
      fromUserId: 'fake-from-user-id',
      toUserId: 'fake-to-user-id',
    };

    it('should be able to get messages of conversation', async () => {
      const result = await sut.execute(params);
      expect(result).toEqual({ data: [expectedMessage.toHTTP()] });
    });

    it('should call MessagesRepository::findByConversation with right parameters', async () => {
      const spy = jest.spyOn(messagesRepository, 'findByConversation');
      await sut.execute(params);
      expect(spy).toBeCalledWith('fake-conversation');
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if MessagesRepository::findByConversation throws unknown error', async () => {
      jest
        .spyOn(messagesRepository, 'findByConversation')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.execute(params);
      expect(promise).rejects.toThrow(new MessagesNotFoundError());
    });
  });
});
