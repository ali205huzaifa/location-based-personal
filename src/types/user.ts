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
  fullName: string;
  email: string;
  phoneNumber: string;
  accessLevel: string;
  lastLogin: string;
  profilePicture: string;
  role: {
    _id: string;
    name: string;
    permissions: string[];
  };
  isActive: boolean;
  isBlocked: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
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
