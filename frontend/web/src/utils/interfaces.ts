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