import { IRole } from '@shared/resources/types/irole';

export interface ICreateMessageDTO {
  fromUserId: string;
  toUserId: string;
  content: string;
  visualized?: boolean;
  role?: IRole;
  createdAt?: Date;
  updatedAt?: Date;
}
