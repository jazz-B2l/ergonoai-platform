export type Role = 'hr' | 'employee'

export type HazardCategory =
  | 'Physical'
  | 'Chemical'
  | 'Mechanical'
  | 'Biological'
  | 'Fire'
  | 'Negative/Passive'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface Department {
  id: string
  name: string
  site: string
  headcount: number
  responseRate: number
  anonymizationThreshold: number
  responseThreshold: number
  cadence: 'monthly' | 'quarterly' | 'biannual'
  lastAssessment: string
  overallScore: number
  trend: number
}

export interface HazardItem {
  id: string
  category: HazardCategory
  item: string
  status: 'compliant' | 'non-compliant' | 'needs-review' | 'not-applicable'
  notes: string
  lastChecked: string
  riskLevel: RiskLevel
}

export interface HazardObservation {
  id: string
  title: string
  description: string
  category: HazardCategory
  location: string
  reportedBy: string
  anonymous: boolean
  date: string
  status: 'open' | 'in-progress' | 'resolved'
  riskLevel: RiskLevel
}

export interface AIRecommendation {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  department: string
  category: string
  affectedEmployees: number
  action: string
}

export interface AssessmentQuestion {
  id: string
  category: 'musculoskeletal' | 'environment'
  question: string
  bodyRegion?: string
  scale: [number, number]
  lowLabel: string
  highLabel: string
}

export interface EmployeeAssessmentResult {
  questionId: string
  score: number
}

export interface WellbeingTrendPoint {
  month: string
  musculoskeletal: number
  environment: number
  overall: number
}

export interface DepartmentScore {
  category: string
  score: number
  benchmark: number
}

export interface PersonalData {
  fullName: string
  workPosition: string
  gender: 'male' | 'female' | 'other' | ''
  dateOfBirth: string
  placeOfBirth: string
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | ''
  height: string
  weight: string
  yearsWorking: string
  workingHoursPerDay: string
  hasPartTimeJob: boolean | null
}

export const NMQ_BODY_REGIONS = [
  'Neck',
  'Shoulders',
  'Upper Back',
  'Elbows',
  'Wrists / Hands',
  'Lower Back',
  'Hips / Thighs',
  'Knees',
  'Ankles / Feet',
] as const

export type NMQBodyRegion = (typeof NMQ_BODY_REGIONS)[number]

export type AnswerType = 'yesno' | 'scale' | 'duration' | 'radio' | 'text'

export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  id: string
  section: 'NMQ_summary' | 'NMQ_detail' | 'ISO7730'
  bodyRegion?: NMQBodyRegion
  text: string
  answerType: AnswerType
  options?: QuestionOption[]
  scaleMin?: number
  scaleMax?: number
  scaleLowLabel?: string
  scaleHighLabel?: string
}

export interface ActiveAssessment {
  id: string
  title: string
  createdAt: string
}

export interface SubmittedForm {
  id: string
  assessmentId?: string
  submittedAt: string
  questionCount: number
  answeredCount: number
  sections: string[]
  answers: Record<string, string>
  notes: Record<string, string>
}

export interface StandaloneNote {
  id: string
  text: string
  department: string
  submittedAt: string
}

// ─── Legacy Mock Data Variables (exported as empty to prevent compilation errors) ───
export const departments: Department[] = []
export const hazardChecklist: HazardItem[] = []
export const hazardObservations: HazardObservation[] = []
export const aiRecommendations: AIRecommendation[] = []
export const mockSubmittedForms: SubmittedForm[] = []
export const mockStandaloneNotes: StandaloneNote[] = []
export const assessmentQuestions: AssessmentQuestion[] = []
export const employeeWellbeingHistory: WellbeingTrendPoint[] = []
export const organizationWellbeingTrend: WellbeingTrendPoint[] = []
export const departmentScores: DepartmentScore[] = []

// ─── Authentication & Authorization Types ───

export type UserStatus = 'active' | 'suspended' | 'pending' | 'deleted' | 'invited'

export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  avatar_url?: string
  status: UserStatus
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  logo_url?: string
  created_at: string
  updated_at: string
}

export interface CompanyMember {
  id: string
  user_id: string
  company_id: string
  role: Role // using existing Role type
  joined_at: string
}

export interface AppPermission {
  id: string
  name: string
  description: string
}

export interface RolePermissions {
  role: Role
  permissions: AppPermission[]
}

// Global Auth State
export interface AuthState {
  user: UserProfile | null
  activeCompany: Company | null
  role: Role | null
  permissions: AppPermission[]
  isAuthenticated: boolean
  isLoading: boolean
}
