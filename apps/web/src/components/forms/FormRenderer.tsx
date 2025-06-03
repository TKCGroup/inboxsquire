'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { PublicForm, FormSubmission, FormQuestion, QuestionResponse } from '@/lib/types/forms'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface FormRendererProps {
  form: PublicForm
  onSubmit: (submission: FormSubmission) => Promise<void>
  submitting: boolean
}

export function FormRenderer({ form, onSubmit, submitting }: FormRendererProps) {
  const [responses, setResponses] = useState<Record<string, string | string[]>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [respondentInfo, setRespondentInfo] = useState({
    email: '',
    name: ''
  })

  // Group questions by sections for step-by-step navigation
  const questionGroups = groupQuestionsBySections(form.questions)
  const totalSteps = questionGroups.length

  function groupQuestionsBySections(questions: FormQuestion[]): FormQuestion[][] {
    const groups: FormQuestion[][] = []
    let currentGroup: FormQuestion[] = []

    for (const question of questions) {
      if (question.type === 'section' && currentGroup.length > 0) {
        groups.push(currentGroup)
        currentGroup = [question]
      } else {
        currentGroup.push(question)
      }
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }

    return groups.length > 0 ? groups : [questions]
  }

  const handleInputChange = (questionId: string, value: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
    
    // Clear error for this field if it exists
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const validateCurrentStep = (): boolean => {
    const currentQuestions = questionGroups[currentStep]
    const stepErrors: Record<string, string> = {}

    for (const question of currentQuestions) {
      if (question.type === 'section') continue
      
      if (question.required && !responses[question.id]) {
        stepErrors[question.id] = 'This field is required'
      }
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return

    // Validate required respondent info if form requires it
    if (form.settings?.requireEmail && !respondentInfo.email) {
      toast.error('Email is required')
      return
    }

    const questionResponses: QuestionResponse[] = Object.entries(responses).map(([questionId, value]) => ({
      questionId,
      value
    }))

    const submission: FormSubmission = {
      formId: form.id,
      respondentEmail: respondentInfo.email || undefined,
      respondentName: respondentInfo.name || undefined,
      responses: questionResponses,
      metadata: {
        userAgent: navigator.userAgent,
        referrer: document.referrer
      }
    }

    await onSubmit(submission)
  }

  const renderQuestion = (question: FormQuestion) => {
    if (question.type === 'section') {
      return (
        <div key={question.id} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{question.title}</h3>
          {question.description && (
            <p className="text-muted-foreground mb-4">{question.description}</p>
          )}
        </div>
      )
    }

    const value = responses[question.id] || ''
    const error = errors[question.id]

    return (
      <div key={question.id} className="space-y-2 mb-4">
        <Label htmlFor={question.id} className="flex items-center gap-2">
          {question.title}
          {question.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
        </Label>
        
        {question.description && (
          <p className="text-sm text-muted-foreground">{question.description}</p>
        )}

        {renderQuestionInput(question, value, handleInputChange)}
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }

  const renderQuestionInput = (question: FormQuestion, value: string | string[], onChange: (id: string, value: string | string[]) => void) => {
    switch (question.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'tel':
        return (
          <Input
            id={question.id}
            type={question.type}
            value={value as string}
            onChange={(e) => onChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            maxLength={question.maxLength}
          />
        )

      case 'textarea':
        return (
          <Textarea
            id={question.id}
            value={value as string}
            onChange={(e) => onChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            maxLength={question.maxLength}
            rows={question.rows || 3}
          />
        )

      case 'select':
        return (
          <Select value={value as string} onValueChange={(val) => onChange(question.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'radio':
        return (
          <RadioGroup value={value as string} onValueChange={(val) => onChange(question.id, val)}>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'checkbox':
      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : []
        return (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    const newValues = checked
                      ? [...selectedValues, option]
                      : selectedValues.filter(v => v !== option)
                    onChange(question.id, newValues)
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )

      case 'yesno':
        return (
          <RadioGroup value={value as string} onValueChange={(val) => onChange(question.id, val)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`}>No</Label>
            </div>
          </RadioGroup>
        )

             default:
         return (
           <Input
             id={question.id}
             value={value as string}
             onChange={(e) => onChange(question.id, e.target.value)}
             placeholder={'placeholder' in question ? question.placeholder : undefined}
           />
         )
    }
  }

  const currentQuestions = questionGroups[currentStep] || []
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      {form.settings?.showProgressBar && totalSteps > 1 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* Form Content */}
      <Card>
        <CardContent className="p-6">
          {currentQuestions.map(renderQuestion)}

          {/* Respondent Info Section */}
          {currentStep === totalSteps - 1 && (form.settings?.requireEmail || form.settings?.allowMultipleSubmissions) && (
            <div className="space-y-4 mt-6 pt-6 border-t">
              <h4 className="font-medium">Contact Information</h4>
              {form.settings?.requireEmail && (
                <div className="space-y-2">
                  <Label htmlFor="respondent-email">Email Address *</Label>
                  <Input
                    id="respondent-email"
                    type="email"
                    value={respondentInfo.email}
                    onChange={(e) => setRespondentInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@company.com"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="respondent-name">Full Name (Optional)</Label>
                <Input
                  id="respondent-name"
                  value={respondentInfo.name}
                  onChange={(e) => setRespondentInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        {currentStep < totalSteps - 1 ? (
          <Button onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={submitting}
            className="min-w-[100px]"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        )}
      </div>
    </div>
  )
} 