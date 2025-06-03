'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormRenderer } from '@/components/forms/FormRenderer'
import { APIResponse, PublicForm, FormSubmission, FormSubmissionResponse } from '@/lib/types/forms'
import { toast } from 'sonner'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: {
    token: string
  }
}

export default function PublicFormPage({ params }: PageProps) {
  const [form, setForm] = useState<PublicForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitResponse, setSubmitResponse] = useState<FormSubmissionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [startTime] = useState(new Date())

  useEffect(() => {
    fetchForm()
  }, [params.token])

  const fetchForm = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/forms/public/${params.token}`)
      const data: APIResponse<PublicForm> = await response.json()
      
      if (data.success && data.data) {
        setForm(data.data)
        setError(null)
      } else {
        setError(data.error || 'Form not found')
      }
    } catch (error) {
      console.error('Error fetching form:', error)
      setError('Failed to load form')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (submission: FormSubmission) => {
    if (!form) return

    try {
      setSubmitting(true)
      
      const response = await fetch(`/api/forms/public/${params.token}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...submission,
          metadata: {
            ...submission.metadata,
            startTime: startTime.toISOString(),
            completionTime: Date.now() - startTime.getTime()
          }
        })
      })
      
      const data: APIResponse<FormSubmissionResponse> = await response.json()
      
      if (data.success && data.data) {
        setSubmitResponse(data.data)
        setSubmitted(true)
        toast.success('Form submitted successfully!')
        
        // Redirect if specified
        if (data.data?.redirectUrl) {
          setTimeout(() => {
            window.location.href = data.data!.redirectUrl!
          }, 2000)
        }
      } else {
        toast.error(data.error || 'Failed to submit form')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to submit form')
    } finally {
      setSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading form...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Form Not Available</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state
  if (submitted && submitResponse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
              {submitResponse.message}
            </p>
            {submitResponse.redirectUrl && (
              <p className="text-sm text-muted-foreground">
                You will be redirected shortly...
              </p>
            )}
            
            {/* Powered by InboxSquire */}
            <div className="mt-8 pt-4 border-t w-full">
              <p className="text-xs text-muted-foreground">
                Powered by{' '}
                <Link 
                  href="https://inboxsquire.com" 
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                >
                  InboxSquire
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Form rendering state
  if (!form) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Form Header */}
          <Card className="mb-6">
            <CardHeader 
              className="text-center"
              style={{
                backgroundColor: form.branding?.primaryColor ? `${form.branding.primaryColor}10` : undefined
              }}
            >
              {form.branding?.companyName && (
                <div className="flex justify-center mb-4">
                  {form.branding.logo ? (
                    <img 
                      src={form.branding.logo} 
                      alt={form.branding.companyName}
                      className="h-12 object-contain"
                    />
                  ) : (
                    <div 
                      className="px-4 py-2 rounded-lg text-white font-semibold"
                      style={{
                        backgroundColor: form.branding.primaryColor || '#3b82f6'
                      }}
                    >
                      {form.branding.companyName}
                    </div>
                  )}
                </div>
              )}
              <CardTitle className="text-2xl">{form.title}</CardTitle>
              {form.description && (
                <CardDescription className="text-base mt-2">
                  {form.description}
                </CardDescription>
              )}
              {form.branding?.headerMessage && (
                <p className="text-sm text-muted-foreground mt-2">
                  {form.branding.headerMessage}
                </p>
              )}
            </CardHeader>
          </Card>

          {/* Form Content */}
          <FormRenderer
            form={form}
            onSubmit={handleSubmit}
            submitting={submitting}
          />

          {/* Powered by InboxSquire */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Powered by{' '}
              <Link 
                href="https://inboxsquire.com" 
                className="text-primary hover:underline font-medium"
                target="_blank"
              >
                InboxSquire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 