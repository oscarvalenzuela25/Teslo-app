export type Role = 'admin' | 'client';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}
