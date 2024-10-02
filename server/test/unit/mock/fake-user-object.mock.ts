import { User as RawUser } from '@prisma/client';

export const fakeUserObject: RawUser = {
  id: 'fake-id',
  name: 'fake-name',
  email: 'fake-email',
  password: 'fake-password',
  isAssistant: false,
  updatedAt: new Date(),
  createdAt: new Date(),
};
