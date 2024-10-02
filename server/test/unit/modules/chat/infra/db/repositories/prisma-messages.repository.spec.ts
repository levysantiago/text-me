import { Message } from '@modules/chat/infra/db/entities/message';
import { PrismaMessageMapper } from '@modules/chat/infra/db/mappers/prisma-message.mapper';
import { PrismaMessagesRepository } from '@modules/chat/infra/db/repositories/prisma-messages.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaDatabaseProvider } from '@shared/container/providers/database-provider/implementations/prisma-database.provider';
import { fakeMessageObject } from '@test/unit/mock/fake-message-object.mock';

describe('PrismaMessagesRepository', () => {
  let prismaService: PrismaDatabaseProvider;
  let sut: PrismaMessagesRepository;

  beforeAll(() => {
    // Mock PrismaFriendshipsMapper
    jest
      .spyOn(PrismaMessageMapper, 'fromPrisma')
      .mockReturnValue(new Message(fakeMessageObject, fakeMessageObject.id));
    jest
      .spyOn(PrismaMessageMapper, 'toPrisma')
      .mockReturnValue(fakeMessageObject);
  });

  beforeEach(async () => {
    const FakePrismaDatabaseProvider = {
      message: {
        create: jest.fn().mockResolvedValue(fakeMessageObject),
        findUnique: jest.fn().mockResolvedValue(fakeMessageObject),
        findMany: jest.fn().mockResolvedValue([fakeMessageObject]),
        update: jest.fn().mockResolvedValue(fakeMessageObject),
        updateMany: jest.fn().mockResolvedValue([fakeMessageObject]),
      },
    };

    // Create testing module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaDatabaseProvider,
          useValue: FakePrismaDatabaseProvider,
        },
        PrismaMessagesRepository,
      ],
    }).compile();
    // Get prisma service
    prismaService = moduleFixture.get(PrismaDatabaseProvider);
    // Get prisma messages repository
    sut = moduleFixture.get(PrismaMessagesRepository);
  });

  describe('create', () => {
    // create message entity
    const message = new Message(fakeMessageObject);

    it('should be able to create message successfully', async () => {
      // Create message
      const promise = sut.create(message);
      // Check
      expect(promise).resolves.toEqual(undefined);
    });

    it('should be able to call PrismaDatabaseProvider::create with right parameters', async () => {
      const spy = jest.spyOn(prismaService.message, 'create');
      // Create user
      await sut.create(message);
      expect(spy).toBeCalledWith({ data: fakeMessageObject });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow error to caller if PrismaDatabaseProvider::create throws', async () => {
      jest
        .spyOn(prismaService.message, 'create')
        .mockRejectedValueOnce(new Error('unknown'));

      // Create message
      const promise = sut.create(message);

      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });

  describe('findById', () => {
    it('should be able to find message by ID', async () => {
      const message = await sut.findById('fake-id');
      expect(message).toEqual(
        new Message(fakeMessageObject, fakeMessageObject.id),
      );
    });

    it('should be able to call PrismaDatabaseProvider::findUnique with right parameters', async () => {
      const spy = jest.spyOn(prismaService.message, 'findUnique');
      await sut.findById('fake-id');
      expect(spy).toBeCalledWith({
        where: { id: 'fake-id' },
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow error to caller if PrismaDatabaseProvider::findUnique throws', async () => {
      // spy
      jest
        .spyOn(prismaService.message, 'findUnique')
        .mockRejectedValueOnce(new Error('unknown'));
      // execute findById
      const promise = sut.findById('fake-user-id');
      // expect
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });

  describe('findAllOfUser', () => {
    it('should be able to find all user messages', async () => {
      const messages = await sut.findAllOfUser('fake-user-id');
      expect(messages).toEqual([
        new Message(fakeMessageObject, fakeMessageObject.id),
      ]);
    });

    it('should be able to call PrismaDatabaseProvider::findMany with right parameters', async () => {
      const spy = jest.spyOn(prismaService.message, 'findMany');
      await sut.findAllOfUser('fake-user-id');
      expect(spy).toBeCalledWith({
        where: {
          toUserId: 'fake-user-id',
        },
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow error to caller if PrismaDatabaseProvider::findMany throws', async () => {
      // spy
      jest
        .spyOn(prismaService.message, 'findMany')
        .mockRejectedValueOnce(new Error('unknown'));
      // execute findAllOfUser
      const promise = sut.findAllOfUser('fake-user-id');
      // expect
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });

  describe('findByConversation', () => {
    it('should be able to find messages by conversation', async () => {
      const messages = await sut.findByConversation('fake-conversation');
      expect(messages).toEqual([
        new Message(fakeMessageObject, fakeMessageObject.id),
      ]);
    });

    it('should be able to call PrismaDatabaseProvider::findMany with right parameters', async () => {
      const spy = jest.spyOn(prismaService.message, 'findMany');
      await sut.findByConversation('fake-conversation');
      expect(spy).toBeCalledWith({
        where: {
          conversation: 'fake-conversation',
        },
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow error to caller if PrismaDatabaseProvider::findMany throws', async () => {
      // spy
      jest
        .spyOn(prismaService.message, 'findMany')
        .mockRejectedValueOnce(new Error('unknown'));
      // execute findByConversation
      const promise = sut.findByConversation('fake-conversation');
      // expect
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });

  describe('visualizeMessages', () => {
    it('should be able to find messages by conversation', async () => {
      const promise = sut.visualizeMessages('fake-conversation');
      expect(promise).resolves.toEqual(undefined);
    });

    it('should be able to call PrismaDatabaseProvider::updateMany with right parameters', async () => {
      const spy = jest.spyOn(prismaService.message, 'updateMany');
      await sut.visualizeMessages('fake-conversation');
      expect(spy).toBeCalledWith({
        where: { conversation: 'fake-conversation' },
        data: { visualized: true },
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow error to caller if PrismaDatabaseProvider::updateMany throws', async () => {
      // spy
      jest
        .spyOn(prismaService.message, 'updateMany')
        .mockRejectedValueOnce(new Error('unknown'));
      // execute visualizeMessages
      const promise = sut.visualizeMessages('fake-conversation');
      // expect
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });

  describe('save', () => {
    const message = new Message(fakeMessageObject, fakeMessageObject.id);

    it('should be able to update message', async () => {
      const promise = sut.save(message);
      expect(promise).resolves.toEqual(undefined);
    });

    it('should be able to call PrismaDatabaseProvider::update with right parameters', async () => {
      const spy = jest.spyOn(prismaService.message, 'update');
      await sut.save(message);
      expect(spy).toBeCalledWith({
        where: { id: fakeMessageObject.id },
        data: fakeMessageObject,
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow error to caller if PrismaDatabaseProvider::update throws', async () => {
      // spy
      jest
        .spyOn(prismaService.message, 'update')
        .mockRejectedValueOnce(new Error('unknown'));
      // execute visualizeMessages
      const promise = sut.save(message);
      // expect
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });
});
