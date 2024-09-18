export interface ICreateUserDTO {
  email: string;
  password: string;
  name: string;
  isAssistant?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
