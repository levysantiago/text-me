import { MessagesRepository } from '@modules/chat/repositories/messages.repository';
import { VisualizeMessagesService } from '@modules/chat/services/visualize-messages.service';
import { Test } from '@nestjs/testing';
import { ConversationHelper } from '@shared/resources/lib/conversation-helper';

describe('VisualizeMessagesService', () => {
  let messagesRepository: MessagesRepository;
  let sut: VisualizeMessagesService;

  beforeAll(() => {
    jest
      .spyOn(ConversationHelper, 'getConversationFromUsers')
      .mockReturnValue('fake-conversation');
  });

  beforeEach(async () => {
    const fakeMessageRepository = {
      visualizeMessages: jest.fn().mockResolvedValue(undefined),
    };

    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        { provide: MessagesRepository, useValue: fakeMessageRepository },
        VisualizeMessagesService,
      ],
    }).compile();
    // Get repository
    messagesRepository = moduleFixture.get(MessagesRepository);
    // Get service
    sut = moduleFixture.get(VisualizeMessagesService);
  });

  describe('execute', () => {
    const params = {
      fromUserId: 'fake-from-user-id',
      userId: 'fake-to-user-id',
    };

    it('should be able to visualize messages', async () => {
      const promise = sut.execute(params);
      expect(promise).resolves.toEqual(undefined);
    });

    it('should call MessagesRepository::visualizeMessages with right parameters', async () => {
      const spy = jest.spyOn(messagesRepository, 'visualizeMessages');
      await sut.execute(params);
      expect(spy).toBeCalledWith('fake-conversation');
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if MessagesRepository::visualizeMessages throws unknown error', async () => {
      jest
        .spyOn(messagesRepository, 'visualizeMessages')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.execute(params);
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });
});
