export interface PublicProfile {
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  avatarImageUrl?: string;
}

export interface PublicSkillItem {
  name: string;
  proficiency: string;
  yearsOfExperience: number;
  icon?: string;
  isFeatured: boolean;
}

export interface PublicSkillCategory {
  name: string;
  sortOrder: number;
  items: PublicSkillItem[];
}

export interface PublicProject {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  featured: boolean;
  sortOrder: number;
}

export interface PublicExperience {
  roleTitle: string;
  companyName: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
  sortOrder: number;
}

export interface PublicEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  gradeOrGpa?: string;
  description?: string;
  sortOrder: number;
}

export interface PublicCertificate {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  sortOrder: number;
}

export interface PublicPortfolioSummary {
  profile: PublicProfile;
  skillCategories: PublicSkillCategory[];
  featuredProjects: PublicProject[];
  experience: PublicExperience[];
  education: PublicEducation[];
  certificates: PublicCertificate[];
}

export interface ModuleRoute {
  path: string;
  label: string;
  icon?: string;
  isExact: boolean;
  requiresAuth: boolean;
  permission?: string;
}

export interface PublicModule {
  moduleId: string;
  displayName: string;
  icon: string;
  navGroup: string;
  sortOrder: number;
  avatarThemeId?: string;
  routes: ModuleRoute[];
  featureFlags: Record<string, unknown>;
}
