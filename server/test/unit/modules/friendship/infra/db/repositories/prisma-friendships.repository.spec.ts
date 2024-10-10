import { Friendship } from '@modules/friendship/infra/db/entities/friendship';
import { PrismaFriendshipMapper } from '@modules/friendship/infra/db/mappers/prisma-friendship.mapper';
import { PrismaFriendshipsRepository } from '@modules/friendship/infra/db/repositories/prisma-friendships.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaDatabaseProvider } from '@shared/container/providers/database-provider/implementations/prisma-database.provider';
import { fakeFriendshipObject } from '@test/unit/mock/fake-friendship-object.mock';

describe('PrismaFriendshipsRepository', () => {
  let prismaService: PrismaDatabaseProvider;
  let sut: PrismaFriendshipsRepository;

  beforeAll(() => {
    // Mock PrismaFriendshipsMapper
    jest
      .spyOn(PrismaFriendshipMapper, 'fromPrisma')
      .mockReturnValue(
        new Friendship(fakeFriendshipObject, fakeFriendshipObject.id),
      );
    jest
      .spyOn(PrismaFriendshipMapper, 'toPrisma')
      .mockReturnValue(fakeFriendshipObject);
  });

  beforeEach(async () => {
    const FakePrismaDatabaseProvider = {
      friendship: {
        create: jest.fn().mockResolvedValue(fakeFriendshipObject),
        findUnique: jest.fn().mockResolvedValue(fakeFriendshipObject),
        findMany: jest.fn().mockResolvedValue([fakeFriendshipObject]),
        delete: jest.fn().mockResolvedValue(undefined),
      },
    };

    // Create testing module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaDatabaseProvider,
          useValue: FakePrismaDatabaseProvider,
        },
        PrismaFriendshipsRepository,
      ],
    }).compile();
    // Get prisma service
    prismaService = moduleFixture.get(PrismaDatabaseProvider);
    // Get prisma friendship repository
    sut = moduleFixture.get(PrismaFriendshipsRepository);
  });

  describe('create', () => {
    // create friendship entity
    const friendship = new Friendship(fakeFriendshipObject);

    it('should be able to create friendship successfully', async () => {
      // Create friendship
      const promise = sut.create(friendship);
      // Check
      expect(promise).resolves.toEqual(undefined);
    });

    it('should be able to call PrismaDatabaseProvider::create with right parameters', async () => {
      const spy = jest.spyOn(prismaService.friendship, 'create');
      // Create user
      await sut.create(friendship);
      expect(spy).toBeCalledWith({ data: fakeFriendshipObject });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow error to caller if PrismaDatabaseProvider::create throws', async () => {
      jest
        .spyOn(prismaService.friendship, 'create')
        .mockRejectedValueOnce(new Error('unknown'));

      // Create friendship
      const promise = sut.create(friendship);

      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });

  describe('findAllOfUser', () => {
    it('should be able to find all user friendships successfully', async () => {
      const friendships = await sut.findAllOfUser('fake-user-id');
      expect(friendships).toEqual([
        new Friendship(fakeFriendshipObject, fakeFriendshipObject.id),
      ]);
    });

    it('should be able to call PrismaDatabaseProvider::findMany with right parameters', async () => {
      const spy = jest.spyOn(prismaService.friendship, 'findMany');
      await sut.findAllOfUser('fake-user-id');
      expect(spy).toBeCalledWith({
        where: { userId: 'fake-user-id' },
        include: {
          friend: true,
        },
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow error to caller if PrismaDatabaseProvider::findMany throws', async () => {
      // spy
      jest
        .spyOn(prismaService.friendship, 'findMany')
        .mockRejectedValueOnce(new Error('unknown'));
      // execute findAllOfUser
      const promise = sut.findAllOfUser('fake-user-id');
      // expect
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });

  describe('findByUsers', () => {
    it('should be able to find user by email', async () => {
      const friendship = await sut.findByUsers(
        'fake-user-id',
        'fake-friend-id',
      );
      expect(friendship).toEqual(fakeFriendshipObject);
    });

    it('should be able to call PrismaDatabaseProvider::findUnique with right parameters', async () => {
      const spy = jest.spyOn(prismaService.friendship, 'findUnique');
      await sut.findByUsers('fake-user-id', 'fake-friend-id');
      expect(spy).toBeCalledWith({
        where: {
          userId_friendId: {
            userId: 'fake-user-id',
            friendId: 'fake-friend-id',
          },
        },
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow error to caller if PrismaDatabaseProvider::findUnique throws', async () => {
      // spy
      jest
        .spyOn(prismaService.friendship, 'findUnique')
        .mockRejectedValueOnce(new Error('unknown'));
      // execute findByUsers
      const promise = sut.findByUsers('fake-user-id', 'fake-friend-id');
      // expect
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });

  describe('delete', () => {
    it('should be able to delete friendship successfully', async () => {
      const promise = sut.delete('fake-user-id', 'fake-friend-id');
      expect(promise).resolves.toEqual(undefined);
    });

    it('should be able to call PrismaDatabaseProvider::delete with right parameters', async () => {
      const spy = jest.spyOn(prismaService.friendship, 'delete');
      await sut.delete('fake-user-id', 'fake-friend-id');
      expect(spy).toBeCalledWith({
        where: {
          userId_friendId: {
            userId: 'fake-user-id',
            friendId: 'fake-friend-id',
          },
        },
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow error to caller if PrismaDatabaseProvider::delete throws', async () => {
      // spy
      jest
        .spyOn(prismaService.friendship, 'delete')
        .mockRejectedValueOnce(new Error('unknown'));
      // execute delete
      const promise = sut.delete('fake-user-id', 'fake-friend-id');
      // expect
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });
});
