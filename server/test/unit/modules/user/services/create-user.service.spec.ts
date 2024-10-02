import { EmailAlreadyExistsError } from '@modules/user/errors/email-already-exists.error';
import { User } from '@modules/user/infra/db/entities/user';
import { UsersRepository } from '@modules/user/repositories/users-repository';
import { CreateUserService } from '@modules/user/services/create-user.service';
import { Test } from '@nestjs/testing';
import { fakeUserObject } from '@test/unit/mock/fake-user-object.mock';

describe('CreateUserService', () => {
  let usersRepository: UsersRepository;
  let sut: CreateUserService;

  const expectedUser = new User(fakeUserObject, fakeUserObject.id);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const fakeUsersRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(expectedUser),
    };

    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        { provide: UsersRepository, useValue: fakeUsersRepository },
        CreateUserService,
      ],
    }).compile();
    // Get repository
    usersRepository = moduleFixture.get(UsersRepository);
    // Get service
    sut = moduleFixture.get(CreateUserService);
  });

  describe('execute', () => {
    const params = {
      email: 'bob@gmail.com',
      name: 'bob',
      password: '12345678',
    };

    it('should be able to create user', async () => {
      const user = await sut.execute(params);
      expect(user).toEqual({ user: expectedUser.toHTTP() });
    });

    it('should call UsersRepository::findByEmail with right parameters', async () => {
      const spy = jest.spyOn(usersRepository, 'findByEmail');
      await sut.execute(params);
      expect(spy).toBeCalledWith(params.email);
      expect(spy).toBeCalledTimes(1);
    });

    it('should call UsersRepository::create with right parameters', async () => {
      const spy = jest.spyOn(usersRepository, 'create');
      await sut.execute(params);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          ...params,
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if UsersRepository::create throws unknown error', async () => {
      jest
        .spyOn(usersRepository, 'create')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.execute(params);
      expect(promise).rejects.toThrow(new Error('unknown'));
    });

    it('should throw EmailAlreadyExistsError if UsersRepository::findByEmail returns a valid user', async () => {
      jest
        .spyOn(usersRepository, 'findByEmail')
        .mockResolvedValueOnce(expectedUser);
      const promise = sut.execute(params);
      expect(promise).rejects.toThrow(new EmailAlreadyExistsError());
    });
  });
});
