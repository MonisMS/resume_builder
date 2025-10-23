export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  website: string
  summary: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  current: boolean
}

export interface ResumeData {
  id?: number
  title: string
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: string[]
}

// Form validation schemas
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}