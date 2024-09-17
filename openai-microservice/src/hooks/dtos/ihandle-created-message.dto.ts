import { IRole } from '../types/irole'

export interface IHandleCreatedMessageDTO {
  fromUserId: string
  toUserId: string
  content: string
  role: IRole
}
