import { IRole } from '../entities/types/irole';

export interface ICreateMessageDTO {
  fromUserId: string;
  toUserId: string;
  content: string;
  visualized?: boolean;
  role?: IRole;
  createdAt?: Date;
  updatedAt?: Date;
}
