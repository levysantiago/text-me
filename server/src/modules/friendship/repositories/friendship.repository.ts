import { Friendship } from '../infra/db/entities/friendship';

export abstract class FriendshipRepository {
  abstract create(friendship: Friendship): Promise<void>;
  abstract delete(userId: string, friendId: string): Promise<void>;
  abstract findAllOfUser(userId: string): Promise<Friendship[]>;
  abstract findByUsers(
    userId: string,
    friendId: string,
  ): Promise<Friendship | null>;
}
