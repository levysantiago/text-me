import { Message as RawMessage } from '@prisma/client';

export const fakeMessageObject: RawMessage = {
  id: 'fake-id',
  fromUserId: 'fake-from-user-id',
  toUserId: 'fake-to-user-id',
  content: 'fake-content',
  visualized: false,
  conversation: 'fake-conversation',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
};
