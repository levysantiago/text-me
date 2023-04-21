import { User } from 'src/app/entities/user';
import { UserRepository } from 'src/app/repositories/user-repository';

export class CacheUserRepository implements UserRepository {
  private cache: User[] = [];

  constructor() {
    const user = new User({
      email: 'john@gmail.com',
      name: 'John',
      password: '123',
    });

    const user2 = new User({
      email: 'mary@gmail.com',
      name: 'Mary',
      password: '123',
    });

    this.cache.push(user);
    this.cache.push(user2);
  }

  findAll(): Promise<User[]> {
    return new Promise((resolve) => {
      resolve(this.cache);
    });
  }

  create(user: User): Promise<void> {
    return new Promise((resolve) => {
      this.cache.push(user);
      resolve();
    });
  }

  findBy(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const user = this.cache.filter((_user) => {
        return _user.id === id;
      });

      if (!user.length) {
        // throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        reject();
      }

      resolve(user[0]);
    });
  }

  findByEmail(email: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const user = this.cache.filter((_user) => {
        return _user.email === email;
      });

      if (!user.length) {
        reject(null);
      }

      resolve(user[0]);
    });
  }
}
