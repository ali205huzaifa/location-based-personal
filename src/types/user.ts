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
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;
  accessLevel: string;
  isActive: boolean;
  lastLogin: string;
}
