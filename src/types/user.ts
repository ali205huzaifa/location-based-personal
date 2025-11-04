export interface Role {
  _id: string;
  name: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id?: string;
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
  dob?: string;
  status?: string;
  notificationsEnabled?: boolean;
  privacy?: string;
  age?: number;
  bio?: string;
  image?: string;
  language?: string;
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
  location: string;
  type: string;
  experience?: string;
  posted?: string;
  postedDate?: string;
  status: string;
  positions?: string;
  workArrangement?: string;
  TotalCount?: string;
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
  fieldType: "TEXT" | "DROPDOWN" | "Radio";
  isRequired?: boolean;
  options?: string[];
};

export type Filters = {
  department: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
};

export type Country = {
  _id: string;
  name: string;
  code: string;
};

export interface City {
  _id: string;
  name: string;
  countryId?: string | Country;
  country?: Country;
}

export type ModalMode = "create" | "edit";

export type Department = {
  _id: string;
  name: string;
  description: string;
};

export type Skill = {
  _id: string;
  name: string;
  departmentId: string;
  department?: Department;
};

export type PageMeta = {
  page: number;
  pageSize: number;
  total: number;
};

export const defaultPageMeta: PageMeta = { page: 1, pageSize: 10, total: 0 };

export interface NdaDocument {
  _id: string;
  candidateName: string;
  email: string;
  signedDate?: string;
  [key: string]: any;
}
