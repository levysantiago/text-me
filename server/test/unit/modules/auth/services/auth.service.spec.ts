import { InvalidEmailOrPasswordError } from '@modules/auth/error/invalid-email-or-password.error';
import { AuthService } from '@modules/auth/services/auth.service';
import { User } from '@modules/user/infra/db/entities/user';
import { UsersRepository } from '@modules/user/repositories/users-repository';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { fakeUserObject } from '@test/unit/mock/fake-user-object.mock';

describe('AuthService', () => {
  let usersRepository: UsersRepository;
  let jwtService: JwtService;
  let sut: AuthService;

  const expectedUser = new User(fakeUserObject, fakeUserObject.id);

  beforeEach(async () => {
    const fakeUsersRepository = {
      findByEmail: jest.fn().mockResolvedValue(fakeUserObject),
      create: jest.fn().mockResolvedValue(expectedUser),
    };

    const fakeJwtService = {
      sign: jest.fn().mockReturnValue('fake-token'),
    };

    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      providers: [
        { provide: UsersRepository, useValue: fakeUsersRepository },
        { provide: JwtService, useValue: fakeJwtService },
        AuthService,
      ],
    }).compile();
    // Get repository
    usersRepository = moduleFixture.get(UsersRepository);
    // Get jwt service
    jwtService = moduleFixture.get(JwtService);
    // Get service
    sut = moduleFixture.get(AuthService);
  });

  describe('execute', () => {
    const params = {
      email: fakeUserObject.email,
      password: fakeUserObject.password,
    };

    it('should be able to authenticate user', async () => {
      const user = await sut.execute(params);
      expect(user).toEqual({ data: {access_token: 'fake-token'} });
    });

    it('should call UsersRepository::findByEmail with right parameters', async () => {
      const spy = jest.spyOn(usersRepository, 'findByEmail');
      await sut.execute(params);
      expect(spy).toBeCalledWith(params.email);
      expect(spy).toBeCalledTimes(1);
    });

    it('should call JwtService::sign with right parameters', async () => {
      const spy = jest.spyOn(jwtService, 'sign');
      await sut.execute(params);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          username: fakeUserObject.name,
          sub: fakeUserObject.id,
        }),
      );
      expect(spy).toBeCalledTimes(1);
    });

    it('should rethrow if UsersRepository::findByEmail throws unknown error', async () => {
      jest
        .spyOn(usersRepository, 'findByEmail')
        .mockRejectedValueOnce(new Error('unknown'));
      const promise = sut.execute(params);
      expect(promise).rejects.toThrow(new Error('unknown'));
    });

    it('should throw InvalidEmailOrPasswordError if UsersRepository::findByEmail returns an invalid user', async () => {
      jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(null);
      const promise = sut.execute(params);
      expect(promise).rejects.toThrow(new InvalidEmailOrPasswordError());
    });

    it('should throw InvalidEmailOrPasswordError if password does not match', async () => {
      const promise = sut.execute({ ...params, password: 'invalid-password' });
      expect(promise).rejects.toThrow(new InvalidEmailOrPasswordError());
    });
  });
});
