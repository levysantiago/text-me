export interface ICreateMessageDTO {
  fromUserId: string;
  toUserId: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
}
