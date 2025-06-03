"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Search,
  Calendar,
  CheckSquare,
  ArrowLeft,
  Plus,
  Clock,
  Paintbrush
} from 'lucide-react'
import Link from 'next/link'
import { FORM_TEMPLATES, getTemplateById } from '@/lib/form-templates'
import { FormData, APIResponse } from '@/lib/types/forms'
import { FormBuilder } from '@/components/forms/FormBuilder'
import { toast } from 'sonner'

const iconMap = {
  'briefcase': Briefcase,
  'handshake': Users,
  'users': Users,
  'user': Users,
  'search': Search,
  'calendar': Calendar,
  'file': FileText,
  'message': MessageSquare
}

export default function CreateFormPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const [showAdvancedBuilder, setShowAdvancedBuilder] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    questions: [],
    branding: {},
    settings: {
      showProgressBar: true,
      requireEmail: true,
      allowMultipleSubmissions: false
    }
  })
  const [saving, setSaving] = useState(false)

  const handleTemplateSelect = (templateId: string) => {
    const template = getTemplateById(templateId)
    if (!template) return

    setFormData({
      title: template.name,
      description: template.description,
      questions: template.questions,
      branding: template.branding || {},
      settings: template.settings || {
        showProgressBar: true,
        requireEmail: true,
        allowMultipleSubmissions: false
      },
      templateType: templateId
    })
    setSelectedTemplate(templateId)
    setShowBuilder(true)
  }

  const handleStartFromScratch = () => {
    setFormData({
      title: '',
      description: '',
      questions: [],
      branding: {},
      settings: {
        showProgressBar: true,
        requireEmail: true,
        allowMultipleSubmissions: false
      }
    })
    setSelectedTemplate(null)
    setShowBuilder(true)
  }

  const handleAdvancedBuilder = () => {
    setFormData({
      title: '',
      description: '',
      questions: [],
      branding: {
        companyName: 'Hey Lieu',
        primaryColor: '#6366f1',
        headerMessage: 'Thank you for your time during our discovery call. Please help us gather some additional information to ensure we deliver the best solution for your needs.',
        thankYouMessage: 'Thank you for your submission! We\'ll review your information and follow up with next steps within 24 hours.'
      },
      settings: {
        showProgressBar: true,
        requireEmail: true,
        allowMultipleSubmissions: false
      }
    })
    setSelectedTemplate(null)
    setShowAdvancedBuilder(true)
  }

  const handleSaveForm = async (customFormData?: FormData) => {
    const dataToSave = customFormData || formData

    if (!dataToSave.title.trim()) {
      toast.error('Please enter a form title')
      return
    }

    if (dataToSave.questions.length === 0) {
      toast.error('Please add at least one question')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSave)
      })

      const result: APIResponse = await response.json()

      if (result.success) {
        toast.success('Form created successfully!')
        router.push('/dashboard/forms')
      } else {
        toast.error(result.error || 'Failed to create form')
      }
    } catch (error) {
      console.error('Error creating form:', error)
      toast.error('Failed to create form')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveClick = () => handleSaveForm()

  if (showAdvancedBuilder) {
    return (
      <div className="h-screen overflow-hidden">
        <FormBuilder
          initialForm={formData}
          onSave={async (form) => {
            setFormData(form)
            await handleSaveForm(form)
          }}
        />
      </div>
    )
  }

  if (showBuilder) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setShowBuilder(false)}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">
                  {selectedTemplate ? 'Customize Template' : 'Create Form'}
                </h1>
                <p className="text-muted-foreground">
                  {selectedTemplate ? `Based on ${getTemplateById(selectedTemplate)?.name}` : 'Build your form from scratch'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                asChild
              >
                <Link href="/dashboard/forms">Cancel</Link>
              </Button>
              <Button
                onClick={handleSaveClick}
                disabled={saving || !formData.title.trim() || formData.questions.length === 0}
              >
                {saving ? 'Creating...' : 'Create Form'}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Form Details */}
            <Card>
              <CardHeader>
                <CardTitle>Form Details</CardTitle>
                <CardDescription>Basic information about your form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="form-title">Form Title</Label>
                  <Input
                    id="form-title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter form title..."
                  />
                </div>
                <div>
                  <Label htmlFor="form-description">Description (Optional)</Label>
                  <Textarea
                    id="form-description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this form is for..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Questions Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Questions ({formData.questions.length})</span>
                  <Badge variant="secondary">
                    {selectedTemplate ? 'From Template' : 'Custom'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {formData.questions.length === 0 
                    ? 'No questions yet. Add questions to get started.'
                    : 'Preview of your form questions'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formData.questions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>
                      {selectedTemplate 
                        ? 'This template is ready to use with pre-built questions.'
                        : 'Add questions to your form to get started.'
                      }
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        if (selectedTemplate) {
                          const template = getTemplateById(selectedTemplate)
                          if (template) {
                            setFormData(prev => ({ ...prev, questions: template.questions }))
                          }
                        }
                      }}
                      disabled={!selectedTemplate}
                    >
                      {selectedTemplate ? 'Load Template Questions' : 'Advanced Builder Coming Soon'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="p-4 border rounded-lg bg-muted/20"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {question.type}
                              </Badge>
                              {question.type !== 'section' && 'required' in question && question.required && (
                                <Badge variant="destructive" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-medium">{question.title}</h4>
                            {question.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {question.description}
                              </p>
                            )}
                            {(question.type === 'select' || question.type === 'radio' || question.type === 'checkbox') && 'options' in question && (
                              <div className="mt-2 text-sm text-muted-foreground">
                                Options: {question.options.join(', ')}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Form Settings Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
                <CardDescription>Configuration options for your form</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckSquare className={`h-4 w-4 ${formData.settings?.showProgressBar ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <span className="text-sm">Progress Bar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckSquare className={`h-4 w-4 ${formData.settings?.requireEmail ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <span className="text-sm">Require Email</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckSquare className={`h-4 w-4 ${formData.settings?.allowMultipleSubmissions ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <span className="text-sm">Multiple Submissions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create New Form</h1>
              <p className="text-muted-foreground">
                Choose a template or start from scratch to create your form
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/forms">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Forms
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Quick Start</span>
            </CardTitle>
            <CardDescription>
              Get started immediately with popular options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-6 justify-start border-purple-200 bg-purple-50 hover:bg-purple-100" 
                onClick={handleAdvancedBuilder}
              >
                <div className="flex items-start space-x-3">
                  <Paintbrush className="h-6 w-6 text-purple-600 mt-1" />
                  <div className="text-left">
                    <div className="font-medium flex items-center gap-2">
                      Advanced Builder
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                        Recommended
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Full visual builder with custom branding & drag-drop
                    </div>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-6 justify-start" 
                onClick={handleStartFromScratch}
              >
                <div className="flex items-start space-x-3">
                  <FileText className="h-6 w-6 text-blue-600 mt-1" />
                  <div className="text-left">
                    <div className="font-medium">Simple Builder</div>
                    <div className="text-sm text-muted-foreground">
                      Quick form creation with basic options
                    </div>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-6 justify-start" 
                onClick={() => handleTemplateSelect('contact-information')}
              >
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-green-600 mt-1" />
                  <div className="text-left">
                    <div className="font-medium">Contact Template</div>
                    <div className="text-sm text-muted-foreground">
                      Pre-built contact information form
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Templates</CardTitle>
            <CardDescription>
              Choose from our library of professionally designed forms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FORM_TEMPLATES.map((template) => {
                const IconComponent = iconMap[template.icon as keyof typeof iconMap] || FileText
                
                return (
                  <motion.div
                    key={template.id}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow h-full"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-lg bg-${template.color}-100 flex items-center justify-center`}>
                            <IconComponent className={`h-6 w-6 text-${template.color}-600`} />
                          </div>
                          {template.estimatedTime && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {template.estimatedTime}m
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4">
                          {template.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{template.questions.length} questions</span>
                          <Badge variant="outline" className="text-xs">
                            {template.category.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Advanced Features Coming Soon</span>
            </CardTitle>
            <CardDescription>
              Enhanced functionality we&apos;re building for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Visual Form Builder</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Drag & drop question reordering</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Conditional logic and branching</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Custom question types</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Real-time form preview</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Advanced Customization</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Custom branding and themes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>File upload questions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Multi-page forms</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Save & resume progress</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 