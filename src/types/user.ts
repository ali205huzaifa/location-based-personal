export interface Role {
  _id: string;
  name: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  role: Role | string;
  accessLevel?: string;
  status?: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}
