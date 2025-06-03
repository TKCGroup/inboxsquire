'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Settings, 
  Eye, 
  Save, 
  Copy,
  Type,
  FileText,
  Hash,
  Calendar,
  CheckSquare,
  Radio,
  Star,
  Upload,
  Link2,
  Phone,
  Mail,
  AlignLeft,
  ToggleLeft
} from 'lucide-react'
import { FormQuestion, FormData } from '@/lib/types/forms'
import { FormRenderer } from './FormRenderer'
import { toast } from 'sonner'

interface FormBuilderProps {
  initialForm?: FormData
  onSave: (form: FormData) => Promise<void>
  onSaveTemplate?: (form: FormData) => Promise<void>
}

interface QuestionType {
  type: FormQuestion['type']
  label: string
  icon: React.ElementType
  color: string
  description: string
}

const QUESTION_TYPES: QuestionType[] = [
  { type: 'section', label: 'Section Header', icon: AlignLeft, color: 'bg-gray-500', description: 'Organize your form with section headers' },
  { type: 'text', label: 'Text Input', icon: Type, color: 'bg-blue-500', description: 'Single line text input' },
  { type: 'textarea', label: 'Long Text', icon: FileText, color: 'bg-blue-600', description: 'Multi-line text input' },
  { type: 'email', label: 'Email', icon: Mail, color: 'bg-green-500', description: 'Email address with validation' },
  { type: 'url', label: 'URL', icon: Link2, color: 'bg-green-600', description: 'Website URL with validation' },
  { type: 'tel', label: 'Phone', icon: Phone, color: 'bg-green-700', description: 'Phone number input' },
  { type: 'number', label: 'Number', icon: Hash, color: 'bg-orange-500', description: 'Numeric input with validation' },
  { type: 'select', label: 'Dropdown', icon: CheckSquare, color: 'bg-purple-500', description: 'Single selection dropdown' },
  { type: 'radio', label: 'Multiple Choice', icon: Radio, color: 'bg-purple-600', description: 'Single selection radio buttons' },
  { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare, color: 'bg-purple-700', description: 'Multiple selection checkboxes' },
  { type: 'yesno', label: 'Yes/No', icon: ToggleLeft, color: 'bg-indigo-500', description: 'Simple yes/no choice' },
  { type: 'date', label: 'Date', icon: Calendar, color: 'bg-red-500', description: 'Date picker' },
  { type: 'datetime', label: 'Date & Time', icon: Calendar, color: 'bg-red-600', description: 'Date and time picker' },
  { type: 'rating', label: 'Rating', icon: Star, color: 'bg-yellow-500', description: 'Star rating scale' },
  { type: 'file', label: 'File Upload', icon: Upload, color: 'bg-gray-600', description: 'File upload (coming soon)' }
]

export function FormBuilder({ initialForm, onSave, onSaveTemplate }: FormBuilderProps) {
  const [form, setForm] = useState<FormData>(initialForm || {
    title: '',
    description: '',
    questions: [],
    branding: {},
    settings: {
      showProgressBar: true,
      requireEmail: false,
      allowMultipleSubmissions: false
    }
  })
  
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('build')

  const generateQuestionId = () => `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const addQuestion = useCallback((type: FormQuestion['type']) => {
    const baseId = generateQuestionId()
    let newQuestion: FormQuestion

    switch (type) {
      case 'section':
        newQuestion = {
          id: baseId,
          type: 'section',
          title: 'New Section',
          description: 'Section description'
        }
        break
      case 'text':
        newQuestion = {
          id: baseId,
          type: 'text',
          title: 'New Question',
          required: true,
          placeholder: 'Enter text'
        }
        break
      case 'email':
        newQuestion = {
          id: baseId,
          type: 'email',
          title: 'New Question',
          required: true,
          placeholder: 'Enter email'
        }
        break
      case 'url':
        newQuestion = {
          id: baseId,
          type: 'url',
          title: 'New Question',
          required: true,
          placeholder: 'Enter URL'
        }
        break
      case 'tel':
        newQuestion = {
          id: baseId,
          type: 'tel',
          title: 'New Question',
          required: true,
          placeholder: 'Enter phone'
        }
        break
      case 'textarea':
        newQuestion = {
          id: baseId,
          type: 'textarea',
          title: 'New Question',
          required: true,
          placeholder: 'Enter details...',
          rows: 3
        }
        break
      case 'number':
        newQuestion = {
          id: baseId,
          type: 'number',
          title: 'New Question',
          required: true,
          min: 0
        }
        break
      case 'select':
        newQuestion = {
          id: baseId,
          type: 'select',
          title: 'New Question',
          required: true,
          options: ['Option 1', 'Option 2', 'Option 3']
        }
        break
      case 'radio':
        newQuestion = {
          id: baseId,
          type: 'radio',
          title: 'New Question',
          required: true,
          options: ['Option 1', 'Option 2', 'Option 3']
        }
        break
      case 'checkbox':
        newQuestion = {
          id: baseId,
          type: 'checkbox',
          title: 'New Question',
          required: true,
          options: ['Option 1', 'Option 2', 'Option 3']
        }
        break
      case 'multiselect':
        newQuestion = {
          id: baseId,
          type: 'multiselect',
          title: 'New Question',
          required: true,
          options: ['Option 1', 'Option 2', 'Option 3']
        }
        break
      case 'date':
        newQuestion = {
          id: baseId,
          type: 'date',
          title: 'New Question',
          required: true
        }
        break
      case 'datetime':
        newQuestion = {
          id: baseId,
          type: 'datetime',
          title: 'New Question',
          required: true
        }
        break
      case 'rating':
        newQuestion = {
          id: baseId,
          type: 'rating',
          title: 'New Question',
          required: true,
          scale: 5,
          labels: { low: 'Poor', high: 'Excellent' }
        }
        break
      case 'yesno':
        newQuestion = {
          id: baseId,
          type: 'yesno',
          title: 'New Question',
          required: true
        }
        break
      case 'file':
        newQuestion = {
          id: baseId,
          type: 'file',
          title: 'New Question',
          required: true,
          maxFiles: 1,
          maxFileSize: 10
        }
        break
      default:
        return
    }

    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion as FormQuestion]
    }))
    setSelectedQuestionId(newQuestion.id)
  }, [])

  const updateQuestion = useCallback((questionId: string, updates: Partial<FormQuestion>) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } as FormQuestion : q
      )
    }))
  }, [])

  const deleteQuestion = useCallback((questionId: string) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }))
    if (selectedQuestionId === questionId) {
      setSelectedQuestionId(null)
    }
  }, [selectedQuestionId])

  const duplicateQuestion = useCallback((questionId: string) => {
    const question = form.questions.find(q => q.id === questionId)
    if (!question) return

    const newQuestion = {
      ...question,
      id: generateQuestionId(),
      title: `${question.title} (Copy)`
    }

    const questionIndex = form.questions.findIndex(q => q.id === questionId)
    setForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions.slice(0, questionIndex + 1),
        newQuestion,
        ...prev.questions.slice(questionIndex + 1)
      ]
    }))
  }, [form.questions])

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(form.questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setForm(prev => ({ ...prev, questions: items }))
  }, [form.questions])

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter a form title')
      return
    }

    if (form.questions.length === 0) {
      toast.error('Please add at least one question')
      return
    }

    setSaving(true)
    try {
      await onSave(form)
      toast.success('Form saved successfully!')
    } catch (error) {
      toast.error('Failed to save form')
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAsTemplate = async () => {
    if (!onSaveTemplate) return

    if (!form.title.trim()) {
      toast.error('Please enter a form title')
      return
    }

    try {
      await onSaveTemplate(form)
      toast.success('Template saved successfully!')
    } catch (error) {
      toast.error('Failed to save template')
      console.error('Save template error:', error)
    }
  }

  const selectedQuestion = selectedQuestionId 
    ? form.questions.find(q => q.id === selectedQuestionId)
    : null

  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Form Preview</h2>
          <Button onClick={() => setPreviewMode(false)}>
            Exit Preview
          </Button>
        </div>
                 <FormRenderer
           form={{
             id: form.id || 'preview',
             title: form.title,
             description: form.description,
             questions: form.questions,
             branding: form.branding,
             settings: form.settings,
             isActive: true
           }}
           submitting={false}
           onSubmit={async () => {
             toast.success('This is just a preview - no data was submitted')
           }}
         />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-12 gap-6 h-screen">
        {/* Sidebar - Question Types */}
        <div className="col-span-3 bg-muted/50 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Add Questions
              </h3>
              <div className="space-y-2">
                {QUESTION_TYPES.map((questionType) => (
                  <Button
                    key={questionType.type}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => addQuestion(questionType.type)}
                    disabled={questionType.type === 'file'} // Disable file upload for now
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded ${questionType.color} flex items-center justify-center flex-shrink-0`}>
                        <questionType.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">{questionType.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {questionType.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-6 p-4 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="build">Build</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPreviewMode(true)}
                  disabled={form.questions.length === 0}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                {onSaveTemplate && (
                  <Button
                    variant="outline"
                    onClick={handleSaveAsTemplate}
                    disabled={!form.title.trim() || form.questions.length === 0}
                  >
                    Save as Template
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={saving || !form.title.trim() || form.questions.length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Form'}
                </Button>
              </div>
            </div>

            <TabsContent value="build" className="space-y-6">
              {/* Form Header */}
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
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter form title..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="form-description">Description (Optional)</Label>
                    <Textarea
                      id="form-description"
                      value={form.description || ''}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this form is for..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Questions */}
              <Card>
                <CardHeader>
                  <CardTitle>Questions</CardTitle>
                  <CardDescription>
                    {form.questions.length === 0 
                      ? 'Add questions from the sidebar to get started'
                      : `${form.questions.length} questions`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {form.questions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No questions yet. Add questions from the sidebar to get started.</p>
                    </div>
                  ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="questions">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                            {form.questions.map((question, index) => (
                              <Draggable key={question.id} draggableId={question.id} index={index}>
                                {(provided, snapshot) => (
                                  <motion.div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    layout
                                    className={`
                                      bg-white border rounded-lg p-4 cursor-pointer transition-all
                                      ${selectedQuestionId === question.id ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'}
                                      ${snapshot.isDragging ? 'shadow-lg' : ''}
                                    `}
                                    onClick={() => setSelectedQuestionId(question.id)}
                                  >
                                    <div className="flex items-start space-x-3">
                                      <div
                                        {...provided.dragHandleProps}
                                        className="mt-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                                      >
                                        <GripVertical className="h-4 w-4" />
                                      </div>
                                      
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            <Badge variant="secondary" className="text-xs">
                                              {question.type}
                                            </Badge>
                                                                                         {question.type !== 'section' && 'required' in question && question.required && (
                                               <Badge variant="destructive" className="text-xs">
                                                 Required
                                               </Badge>
                                             )}
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                duplicateQuestion(question.id)
                                              }}
                                            >
                                              <Copy className="h-3 w-3" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                deleteQuestion(question.id)
                                              }}
                                              className="text-destructive hover:text-destructive"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                        <h4 className="font-medium mt-2">{question.title}</h4>
                                        {question.description && (
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {question.description}
                                          </p>
                                        )}
                                        {(question.type === 'select' || question.type === 'radio' || question.type === 'checkbox') && 'options' in question && (
                                          <div className="mt-2 text-sm text-muted-foreground">
                                            {question.options.length} options
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Form Settings</CardTitle>
                  <CardDescription>Configure how your form behaves</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Progress Bar</Label>
                      <p className="text-sm text-muted-foreground">
                        Show respondents their progress through the form
                      </p>
                    </div>
                    <Switch
                      checked={form.settings?.showProgressBar || false}
                      onCheckedChange={(checked) => 
                        setForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, showProgressBar: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Require respondents to provide their email address
                      </p>
                    </div>
                    <Switch
                      checked={form.settings?.requireEmail || false}
                      onCheckedChange={(checked) => 
                        setForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, requireEmail: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Multiple Submissions</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow the same person to submit multiple responses
                      </p>
                    </div>
                    <Switch
                      checked={form.settings?.allowMultipleSubmissions || false}
                      onCheckedChange={(checked) => 
                        setForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, allowMultipleSubmissions: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Redirect URL (Optional)</Label>
                    <Input
                      value={form.settings?.redirectUrl || ''}
                      onChange={(e) => 
                        setForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, redirectUrl: e.target.value }
                        }))
                      }
                      placeholder="https://yoursite.com/thank-you"
                    />
                    <p className="text-sm text-muted-foreground">
                      Redirect respondents to this URL after submission
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="style" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                  <CardDescription>Customize the appearance of your form</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input
                      value={form.branding?.companyName || ''}
                      onChange={(e) => 
                        setForm(prev => ({
                          ...prev,
                          branding: { ...prev.branding, companyName: e.target.value }
                        }))
                      }
                      placeholder="Your Company Name"
                    />
                  </div>
                  
                  <div>
                    <Label>Primary Color</Label>
                    <Input
                      type="color"
                      value={form.branding?.primaryColor || '#000000'}
                      onChange={(e) => 
                        setForm(prev => ({
                          ...prev,
                          branding: { ...prev.branding, primaryColor: e.target.value }
                        }))
                      }
                    />
                  </div>
                  
                  <div>
                    <Label>Header Message</Label>
                    <Textarea
                      value={form.branding?.headerMessage || ''}
                      onChange={(e) => 
                        setForm(prev => ({
                          ...prev,
                          branding: { ...prev.branding, headerMessage: e.target.value }
                        }))
                      }
                      placeholder="Welcome message for your form..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label>Thank You Message</Label>
                    <Textarea
                      value={form.branding?.thankYouMessage || ''}
                      onChange={(e) => 
                        setForm(prev => ({
                          ...prev,
                          branding: { ...prev.branding, thankYouMessage: e.target.value }
                        }))
                      }
                      placeholder="Thank you message after submission..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Question Editor */}
        <div className="col-span-3 bg-muted/50 p-4 overflow-y-auto">
          {selectedQuestion ? (
            <QuestionEditor
              question={selectedQuestion}
              onUpdate={(updates) => updateQuestion(selectedQuestion.id, updates)}
              onDelete={() => deleteQuestion(selectedQuestion.id)}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Select a question to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface QuestionEditorProps {
  question: FormQuestion
  onUpdate: (updates: Partial<FormQuestion>) => void
  onDelete: () => void
}

function QuestionEditor({ question, onUpdate, onDelete }: QuestionEditorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Question Settings</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label>Question Title</Label>
          <Input
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter question title..."
          />
        </div>
        
        {question.type !== 'section' && (
          <>
            <div>
              <Label>Description (Optional)</Label>
              <Textarea
                value={question.description || ''}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Add helpful context..."
                rows={2}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Required</Label>
              <Switch
                checked={question.required || false}
                onCheckedChange={(checked) => onUpdate({ required: checked })}
              />
            </div>
          </>
        )}
        
        {('placeholder' in question) && (
          <div>
            <Label>Placeholder</Label>
            <Input
              value={question.placeholder || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder="Placeholder text..."
            />
          </div>
        )}
        
        {question.type === 'textarea' && (
          <div>
            <Label>Rows</Label>
            <Input
              type="number"
              value={question.rows || 3}
              onChange={(e) => onUpdate({ rows: parseInt(e.target.value) || 3 })}
              min={1}
              max={10}
            />
          </div>
        )}
        
        {question.type === 'number' && (
          <>
            <div>
              <Label>Minimum Value</Label>
              <Input
                type="number"
                value={question.min || ''}
                onChange={(e) => onUpdate({ min: e.target.value ? parseInt(e.target.value) : undefined })}
              />
            </div>
            <div>
              <Label>Maximum Value</Label>
              <Input
                type="number"
                value={question.max || ''}
                onChange={(e) => onUpdate({ max: e.target.value ? parseInt(e.target.value) : undefined })}
              />
            </div>
          </>
        )}
        
        {(question.type === 'select' || question.type === 'radio' || question.type === 'checkbox') && 'options' in question && (
          <div>
            <Label>Options</Label>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...question.options]
                      newOptions[index] = e.target.value
                      onUpdate({ options: newOptions })
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newOptions = question.options.filter((_, i) => i !== index)
                      onUpdate({ options: newOptions })
                    }}
                    disabled={question.options.length <= 1}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [...question.options, `Option ${question.options.length + 1}`]
                  onUpdate({ options: newOptions })
                }}
                className="w-full"
              >
                <Plus className="h-3 w-3 mr-2" />
                Add Option
              </Button>
            </div>
            
            {(question.type === 'radio' || question.type === 'checkbox' || question.type === 'select') && (
                               <div className="flex items-center justify-between">
                   <Label>Allow &quot;Other&quot; option</Label>
                <Switch
                  checked={question.allowOther || false}
                  onCheckedChange={(checked) => onUpdate({ allowOther: checked })}
                />
              </div>
            )}
          </div>
        )}
        
        {question.type === 'rating' && (
          <>
            <div>
              <Label>Scale (1 to X)</Label>
              <Select
                value={question.scale?.toString() || '5'}
                onValueChange={(value) => onUpdate({ scale: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Low Label</Label>
              <Input
                value={question.labels?.low || ''}
                onChange={(e) => onUpdate({ 
                  labels: { ...question.labels, low: e.target.value }
                })}
                placeholder="e.g., Poor"
              />
            </div>
            <div>
              <Label>High Label</Label>
              <Input
                value={question.labels?.high || ''}
                onChange={(e) => onUpdate({ 
                  labels: { ...question.labels, high: e.target.value }
                })}
                placeholder="e.g., Excellent"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
} 