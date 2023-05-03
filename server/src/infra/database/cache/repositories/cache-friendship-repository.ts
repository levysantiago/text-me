import { HttpException, HttpStatus } from '@nestjs/common';
import { Friendship } from 'src/app/entities/friendship';
import { FriendshipRepository } from 'src/app/repositories/friendship-repository';

export class CacheFriendshipRepository implements FriendshipRepository {
  private cache: Friendship[] = [];

  create(friendship: Friendship): Promise<void> {
    return new Promise((resolve) => {
      this.cache.push(friendship);
      resolve();
    });
  }

  findAllOfUser(userId: string): Promise<Friendship[]> {
    return new Promise((resolve) => {
      const friendships = this.cache.filter((_friendship) => {
        return _friendship.userId === userId;
      });

      resolve(friendships);
    });
  }

  findByUsers(userId: string, friendId: string): Promise<Friendship | null> {
    return new Promise((resolve) => {
      const friendship = this.cache.filter((_friendship) => {
        return (
          _friendship.userId === userId && _friendship.friendId === friendId
        );
      })[0];

      resolve(friendship);
    });
  }

  delete(userId: string, friendId: string): Promise<void> {
    return new Promise((resolve) => {
      let indexToRemove: number | undefined;
      this.cache.map((_friendship, index) => {
        if (
          _friendship.userId === userId &&
          _friendship.friendId === friendId
        ) {
          indexToRemove = index;
        }
      });
      if (!indexToRemove) {
        throw new HttpException('FRIENDSHIP_NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      delete this.cache[indexToRemove];

      resolve();
    });
  }
}
