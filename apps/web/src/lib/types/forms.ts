import { Database } from './database'

// Database types
export type Form = Database['public']['Tables']['forms']['Row']
export type FormInsert = Database['public']['Tables']['forms']['Insert']
export type FormUpdate = Database['public']['Tables']['forms']['Update']

export type FormResponse = Database['public']['Tables']['form_responses']['Row']
export type FormResponseInsert = Database['public']['Tables']['form_responses']['Insert']

export type FormAnalytics = Database['public']['Tables']['form_analytics']['Row']
export type FormAnalyticsInsert = Database['public']['Tables']['form_analytics']['Insert']

export type FormTemplate = Database['public']['Tables']['form_templates']['Row']
export type FormTemplateInsert = Database['public']['Tables']['form_templates']['Insert']

// Form Question Types
export interface BaseQuestion {
  id: string
  title: string
  description?: string
  required?: boolean
  placeholder?: string
}

export interface TextQuestion extends BaseQuestion {
  type: 'text' | 'email' | 'url' | 'tel'
  maxLength?: number
  validation?: {
    pattern?: string
    message?: string
  }
}

export interface TextareaQuestion extends BaseQuestion {
  type: 'textarea'
  maxLength?: number
  rows?: number
}

export interface NumberQuestion extends BaseQuestion {
  type: 'number'
  min?: number
  max?: number
  step?: number
}

export interface SelectQuestion extends BaseQuestion {
  type: 'select'
  options: string[]
  allowOther?: boolean
}

export interface MultiSelectQuestion extends BaseQuestion {
  type: 'multiselect'
  options: string[]
  maxSelections?: number
  allowOther?: boolean
}

export interface RadioQuestion extends BaseQuestion {
  type: 'radio'
  options: string[]
  allowOther?: boolean
}

export interface CheckboxQuestion extends BaseQuestion {
  type: 'checkbox'
  options: string[]
  maxSelections?: number
  allowOther?: boolean
}

export interface DateQuestion extends BaseQuestion {
  type: 'date' | 'datetime'
  minDate?: string
  maxDate?: string
}

export interface RatingQuestion extends BaseQuestion {
  type: 'rating'
  scale: number
  labels?: {
    low?: string
    high?: string
  }
}

export interface YesNoQuestion extends BaseQuestion {
  type: 'yesno'
}

export interface FileUploadQuestion extends BaseQuestion {
  type: 'file'
  acceptedTypes?: string[]
  maxFileSize?: number
  maxFiles?: number
}

export interface SectionHeader {
  id: string
  type: 'section'
  title: string
  description?: string
}

export type FormQuestion = 
  | TextQuestion
  | TextareaQuestion
  | NumberQuestion
  | SelectQuestion
  | MultiSelectQuestion
  | RadioQuestion
  | CheckboxQuestion
  | DateQuestion
  | RatingQuestion
  | YesNoQuestion
  | FileUploadQuestion
  | SectionHeader

// Form Configuration Types
export interface FormBranding {
  companyName?: string
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  headerMessage?: string
  thankYouMessage?: string
}

export interface FormSettings {
  allowMultipleSubmissions?: boolean
  requireEmail?: boolean
  showProgressBar?: boolean
  allowSaveAndContinue?: boolean
  redirectUrl?: string
  notificationEmail?: string
  captcha?: boolean
}

// Form Builder Types
export interface FormData {
  id?: string
  title: string
  description?: string
  questions: FormQuestion[]
  branding?: FormBranding
  settings?: FormSettings
  templateType?: string
}

// Form Response Types
export interface QuestionResponse {
  questionId: string
  value: string | string[] | number | boolean | File[]
  metadata?: {
    timeSpent?: number
    attempts?: number
  }
}

export interface FormSubmission {
  formId: string
  respondentEmail?: string
  respondentName?: string
  responses: QuestionResponse[]
  metadata?: {
    startTime?: string
    completionTime?: number
    userAgent?: string
    referrer?: string
  }
}

// Form Analytics Types
export type AnalyticsEventType = 
  | 'view'
  | 'start'
  | 'complete'
  | 'abandon'
  | 'question_skip'
  | 'question_change'
  | 'save_progress'

export interface AnalyticsEvent {
  formId: string
  eventType: AnalyticsEventType
  sessionId: string
  questionId?: string
  metadata?: Record<string, string | number | boolean>
}

// Form Templates Types
export type TemplateCategory = 
  | 'vendor_evaluation'
  | 'partnership'
  | 'due_diligence'
  | 'customer_research'
  | 'hiring'
  | 'event_planning'
  | 'project_requirements'
  | 'feedback'
  | 'other'

export interface TemplateData {
  questions: FormQuestion[]
  branding?: FormBranding
  settings?: FormSettings
}

// API Response Types
export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface FormListResponse {
  forms: Form[]
  total: number
  page: number
  limit: number
}

export interface FormAnalyticsResponse {
  form: Form
  analytics: {
    totalViews: number
    totalSubmissions: number
    conversionRate: number
    avgCompletionTime: number
    abandonmentRate: number
    popularQuestions: {
      questionId: string
      interactions: number
    }[]
    timeAnalytics: {
      date: string
      views: number
      submissions: number
    }[]
  }
}

// Validation Types
export interface ValidationResult {
  isValid: boolean
  errors: {
    field: string
    message: string
  }[]
}

// Form Builder State Types
export interface FormBuilderState {
  form: FormData
  isDirty: boolean
  isLoading: boolean
  isSaving: boolean
  validationErrors: ValidationResult['errors']
  selectedQuestionId?: string
  previewMode: boolean
}

// Public Form Types (for form rendering)
export interface PublicForm {
  id: string
  title: string
  description?: string
  questions: FormQuestion[]
  branding?: FormBranding
  settings?: FormSettings
  isActive: boolean
  expiresAt?: string
}

export interface FormSubmissionResponse {
  success: boolean
  submissionId?: string
  message?: string
  redirectUrl?: string
}

// Conditional Logic Types (for future Phase 2)
export interface ConditionalRule {
  questionId: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: string | number | boolean
  action: 'show' | 'hide' | 'require' | 'skip'
  targetQuestionIds: string[]
}

export interface ConditionalLogic {
  rules: ConditionalRule[]
  operator: 'and' | 'or'
} 