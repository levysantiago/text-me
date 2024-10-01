import { UserNotFoundError } from '@modules/user/errors/user-not-found.error';
import { User } from '@modules/user/infra/db/entities/user';
import { UsersRepository } from '@modules/user/repositories/users-repository';
import { UpdateUserService } from '@modules/user/services/update-user.service';
import { Test } from '@nestjs/testing';
import { fakeUserObject } from '@test/unit/mock/fake-user-object';

describe('UpdateUserService', () => {
  let usersRepository: UsersRepository;
  let sut: UpdateUserService;

  const expectedUser = new User(fakeUserObject, fakeUserObject.id);

  beforeEach(async () => {
    const fakeUsersRepository = {
      find: jest.fn().mockResolvedValue(expectedUser),
      save: jest.fn().mockResolvedValue(expectedUser),
    };

    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        { provide: UsersRepository, useValue: fakeUsersRepository },
        UpdateUserService,
      ],
    }).compile();
    // Get repository
    usersRepository = moduleFixture.get(UsersRepository);
    // Get service
    sut = moduleFixture.get(UpdateUserService);
  });

  describe('execute', () => {
    const params = {
      id: 'fake-id',
      name: 'new name',
      password: '87654321',
    };

    it('should be able to update user', async () => {
      const user = await sut.execute(params);
      expect(user).toEqual({ user: expectedUser.toHTTP() });
    });

    it('should call UsersRepository::find with right parameters', async () => {
      const spy = jest.spyOn(usersRepository, 'find');
      await sut.execute(params);
      expect(spy).toBeCalledWith(params.id);
      expect(spy).toBeCalledTimes(1);
    });

    it('should call UsersRepository::save with right parameters', async () => {
      const spy = jest.spyOn(usersRepository, 'save');
      await sut.execute(params);
      expect(spy).toBeCalledWith({
        ...expectedUser,
        name: params.name,
        password: params.password,
      });
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if UsersRepository::save throws unknown error', async () => {
      jest
        .spyOn(usersRepository, 'save')
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
