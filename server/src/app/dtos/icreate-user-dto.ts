export interface ICreateUserDTO {
  email: string;
  password: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}
