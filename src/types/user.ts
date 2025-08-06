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
  profilePicture?: string;
  accessLevel: string;
  isActive: boolean;
  lastLogin: string;
}

export interface Interviewer {
  _id: string;
  name: string;
  email: string;
  designation: string;
  updatedAt?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  type: string;
  experience?: string;
  posted?: string;
  postedDate?: string;
  status: string;
  positions?: string;
  workArrangement?: string;
}

export type JobPayloadType = {
  title: string;
  description: string;
  location: string;
  department: string;
  experienceLevel: string;
  employmentType: string;
  salaryRange: string;
  skills: string[];
  postingStartDate: string;
  postingEndDate: string;
  [key: string]: any;
};

export type ApplicationQuestion = {
  label: string;
  fieldType: "TEXT" | "DROPDOWN";
  isRequired?: boolean;
  options?: string[];
};