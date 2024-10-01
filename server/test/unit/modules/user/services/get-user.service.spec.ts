import { UserNotFoundError } from '@modules/user/errors/user-not-found.error';
import { User } from '@modules/user/infra/db/entities/user';
import { UsersRepository } from '@modules/user/repositories/users-repository';
import { GetUserService } from '@modules/user/services/get-user.service';
import { Test } from '@nestjs/testing';
import { fakeUserObject } from '@test/unit/mock/fake-user-object';

describe('GetUserService', () => {
  let usersRepository: UsersRepository;
  let sut: GetUserService;

  const expectedUser = new User(fakeUserObject, fakeUserObject.id);

  beforeEach(async () => {
    const fakeUsersRepository = {
      find: jest.fn().mockResolvedValue(expectedUser),
      create: jest.fn().mockResolvedValue(expectedUser),
    };

    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        { provide: UsersRepository, useValue: fakeUsersRepository },
        GetUserService,
      ],
    }).compile();
    // Get repository
    usersRepository = moduleFixture.get(UsersRepository);
    // Get service
    sut = moduleFixture.get(GetUserService);
  });

  describe('execute', () => {
    const params = {
      userId: 'fake-id',
    };

    it('should be able to get user', async () => {
      const user = await sut.execute(params);
      expect(user).toEqual({ user: expectedUser.toHTTP() });
    });

    it('should call UsersRepository::find with right parameters', async () => {
      const spy = jest.spyOn(usersRepository, 'find');
      await sut.execute(params);
      expect(spy).toBeCalledWith(params.userId);
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if UsersRepository::find throws unknown error', async () => {
      jest
        .spyOn(usersRepository, 'find')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.execute(params);
      expect(promise).rejects.toThrow(new Error('unknown'));
    });

    it('should throw UserNotFoundError if UsersRepository::find returns an invalid user', async () => {
      jest.spyOn(usersRepository, 'find').mockResolvedValueOnce(null);
      const promise = sut.execute(params);
      expect(promise).rejects.toThrow(new UserNotFoundError());
    });
  });
});
