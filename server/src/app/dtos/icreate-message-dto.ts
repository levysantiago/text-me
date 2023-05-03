export interface ICreateMessageDTO {
  fromUserId: string;
  toUserId: string;
  content: string;
  visualized?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
