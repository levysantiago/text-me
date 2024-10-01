import { User } from '@modules/user/infra/db/entities/user';
import { PrismaUserMapper } from '@modules/user/infra/db/mappers/prisma-user-mapper';
import { PrismaUsersRepository } from '@modules/user/infra/db/repositories/prisma-users-repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaDatabaseProvider } from '@shared/container/providers/database-provider/implementations/prisma-database.provider';
import { fakeUserObject } from '@test/unit/mock/fake-user-object';

describe('PrismaUsersRepository', () => {
  let prismaService: PrismaDatabaseProvider;
  let sut: PrismaUsersRepository;

  beforeAll(() => {
    // Mock PrismaUserMapper
    jest
      .spyOn(PrismaUserMapper, 'fromPrisma')
      .mockReturnValue(new User(fakeUserObject, fakeUserObject.id));
    jest.spyOn(PrismaUserMapper, 'toPrisma').mockReturnValue(fakeUserObject);
  });

  beforeEach(async () => {
    const FakePrismaDatabaseProvider = {
      user: {
        create: jest.fn().mockResolvedValue(fakeUserObject),
        findUnique: jest.fn().mockResolvedValue(fakeUserObject),
        update: jest.fn().mockResolvedValue(fakeUserObject),
      },
    };

    // Create testing module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaDatabaseProvider,
          useValue: FakePrismaDatabaseProvider,
        },
        PrismaUsersRepository,
      ],
    }).compile();
    // Get prisma service
    prismaService = moduleFixture.get(PrismaDatabaseProvider);
    // Get prisma users repository
    sut = moduleFixture.get(PrismaUsersRepository);
  });

  describe('create', () => {
    it('should be able to create user successfully', async () => {
      // create user entity
      const user = new User({
        email: 'bob@gmail.com',
        name: 'bob',
        password: '12345678',
      });

      // Create user
      const userCreated = await sut.create(user);

      expect(userCreated).toEqual(new User(fakeUserObject, fakeUserObject.id));
    });

    it('should be able to call PrismaDatabaseProvider::create with right parameters', async () => {
      const spy = jest.spyOn(prismaService.user, 'create');

      // create user entity
      const user = new User({
        email: 'bob@gmail.com',
        name: 'bob',
        password: '12345678',
      });

      // Create user
      await sut.create(user);

      expect(spy).toBeCalledWith({ data: user });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow error to caller if PrismaDatabaseProvider::create throws', async () => {
      jest
        .spyOn(prismaService.user, 'create')
        .mockRejectedValueOnce(new Error('unknown'));

      // create user entity
      const user = new User({
        email: 'bob@gmail.com',
        name: 'bob',
        password: '12345678',
      });

      // Create user
      const promise = sut.create(user);

      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });

  describe('find', () => {
    it('should be able to find user successfully', async () => {
      const user = await sut.find('fake-id');
      expect(user).toEqual(fakeUserObject);
    });

    it('should be able to call PrismaDatabaseProvider::findUnique with right parameters', async () => {
      const spy = jest.spyOn(prismaService.user, 'findUnique');
      await sut.find('fake-id');
      expect(spy).toBeCalledWith({ where: { id: 'fake-id' } });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow error to caller if PrismaDatabaseProvider::findUnique throws', async () => {
      // spy
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockRejectedValueOnce(new Error('unknown'));
      // execute find
      const promise = sut.find('fake-id');
      // expect
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });

  describe('findByEmail', () => {
    it('should be able to find user by email', async () => {
      const user = await sut.findByEmail('bob@gmail.com');
      expect(user).toEqual(fakeUserObject);
    });

    it('should be able to call PrismaDatabaseProvider::findUnique with right parameters', async () => {
      const spy = jest.spyOn(prismaService.user, 'findUnique');
      await sut.findByEmail('bob@gmail.com');
      expect(spy).toBeCalledWith({ where: { email: 'bob@gmail.com' } });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow error to caller if PrismaDatabaseProvider::findUnique throws', async () => {
      // spy
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockRejectedValueOnce(new Error('unknown'));
      // execute findByEmail
      const promise = sut.findByEmail('bob@gmail.com');
      // expect
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });

  describe('save', () => {
    // create user entity
    const user = new User({
      email: 'bob@gmail.com',
      name: 'bob',
      password: '12345678',
    });

    it('should be able to save user successfully', async () => {
      const promise = sut.save(user);
      expect(promise).resolves.toEqual(undefined);
    });

    it('should be able to call PrismaDatabaseProvider::update with right parameters', async () => {
      const spy = jest.spyOn(prismaService.user, 'update');
      await sut.save(user);
      expect(spy).toBeCalledWith({
        data: fakeUserObject,
        where: { id: fakeUserObject.id },
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow error to caller if PrismaDatabaseProvider::update throws', async () => {
      // spy
      jest
        .spyOn(prismaService.user, 'update')
        .mockRejectedValueOnce(new Error('unknown'));
      // execute save
      const promise = sut.save(user);
      // expect
      expect(promise).rejects.toThrow(new Error('unknown'));
    });
  });
});
