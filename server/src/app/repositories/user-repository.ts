import { User } from '../entities/user';

export abstract class UserRepository {
  abstract findBy(id: string): Promise<User>;
  abstract findByEmail(email: string): Promise<User>;
  abstract create(user: User): Promise<void>;
  abstract findAll(): Promise<User[]>;
}
