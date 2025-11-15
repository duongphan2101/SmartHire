export interface ContactInfo {
  phone: string;
  email: string;
  github: string;
  website: string;
}

export interface Education {
  university: string;
  major: string;
  gpa: string;
  startYear: string;
  endYear: string;
}

export interface Experience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  projectName: string;
  projectDescription: string;
}

export interface CVData {
  name: string;
  jobTitle: string;
  introduction: string;
  professionalSkills: string;
  softSkills: string;
  experience: Experience[];
  certifications: string;
  activitiesAwards: string;
  contact: ContactInfo;
  education: Education[];
  projects: Project[];
}

export interface CustomSettings {
  color: string;
  fontFamily: string;
}

export type TemplateName = 'fresh' | 'twoColumn' | 'modernCentered';

export interface Interview {
  _id: string;
  chatRoomId: string;
  hrId: string;
  candidateId: string;
  jobId: string;
  scheduledAt: Date | string;
  location: string;
  mode: 'online' | 'offline';
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'failed';
  note: string;
}

export interface Job {
  _id: string;
  jobTitle: string;
  jobType: string;
  jobLevel: string;
  department: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createBy: {
    _id: string;
    fullname: string;
    avatar?: string;
  };
  requirement: string[];
  skills: string[];
  benefits: string[];
  salary: string;
  location: string;
  address: string;
  workingHours: string;
  jobDescription: string[];
  experience: string;
  endDate: string;
  num: number;
  createdAt: string;
  districts?: { name: string }[];
  accepted: number;
}

export interface Department {
  _id: string;
  name: string;
  address: string;
  avatar: string;
  description: string;
  website: string;
}

export interface JoinCodeData {
  message: string;
  code: string
  expiresAt: Date | string;
}

export interface JoinResponse {
  message: string;
  departmentId: string;
}

export interface InviteData {
  _id: string;
  code: string;
  departmentId: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
}

export interface ChatMessage {
    senderId: string;
    message: string;
    messageType?: "text" | "file" | "system";
    createdAt: string;
}

export interface ChatRoom {
    _id: string;
    jobId: string;
    members: string[];
    chats: ChatMessage[];
    lastMessage: string;
    isActive: boolean;
}

export interface ChatRequest {
    _id: string;
    hrId: string;
    candidateId: string;
    jobId: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    updatedAt: string;
}