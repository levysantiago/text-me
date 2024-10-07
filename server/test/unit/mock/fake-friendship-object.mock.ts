import { Friendship as RawFriendship, User as RawUser } from '@prisma/client';

export const fakeFriendshipObject: RawFriendship & { friend: RawUser } = {
  id: 'fake-id',
  userId: 'fake-user-id',
  friendId: 'fake-friend-id',
  friend: {
    id: 'fake-id',
    name: 'fake-name',
    email: 'fake-email',
    password: 'fake-password',
    isAssistant: false,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  updatedAt: new Date(),
  createdAt: new Date(),
};
