import { IRole } from './irole'

export interface IChatMessage {
  role: IRole
  content: string
}
