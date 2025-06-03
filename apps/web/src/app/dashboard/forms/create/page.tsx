"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Plus, Zap, Users, Briefcase, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function CreateFormPage() {
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
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-foreground">Create New Form</h1>
            <Badge variant="secondary">Builder Coming Soon</Badge>
          </div>
          <p className="text-muted-foreground">
            Choose a template or start from scratch to create your form
          </p>
        </div>

        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Start</span>
            </CardTitle>
            <CardDescription>
              Get started with one of our popular templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start" 
                disabled
              >
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-blue-600 mt-1" />
                  <div className="text-left">
                    <div className="font-medium">Contact Form</div>
                    <div className="text-xs text-muted-foreground">
                      Basic contact information collection
                    </div>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start" 
                disabled
              >
                <div className="flex items-start space-x-3">
                  <Briefcase className="h-5 w-5 text-green-600 mt-1" />
                  <div className="text-left">
                    <div className="font-medium">Vendor Evaluation</div>
                    <div className="text-xs text-muted-foreground">
                      Comprehensive vendor assessment
                    </div>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start" 
                disabled
              >
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 text-purple-600 mt-1" />
                  <div className="text-left">
                    <div className="font-medium">Feedback Survey</div>
                    <div className="text-xs text-muted-foreground">
                      Customer feedback collection
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
            <CardTitle>Form Templates</CardTitle>
            <CardDescription>
              Choose from our library of professionally designed forms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Business Templates</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Vendor Evaluation Form</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Partnership Assessment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Due Diligence Checklist</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Client Onboarding</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">General Templates</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span>Contact Information</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span>Event Registration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span>Feedback Survey</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span>Job Application</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Builder Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Visual Form Builder</span>
            </CardTitle>
            <CardDescription>
              Our drag-and-drop form builder is coming soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Advanced Form Builder</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create complex forms with conditional logic, custom styling, and advanced validation using our visual builder
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button asChild variant="outline">
                  <Link href="/dashboard/forms">
                    Back to Forms
                  </Link>
                </Button>
                <Button disabled>
                  Launch Builder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What you&apos;ll be able to do:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Drag & drop form elements</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Conditional logic and branching</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Custom validation rules</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Real-time preview</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Mobile-responsive design</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question Types Available:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span>Text, Email, Phone inputs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span>Multiple choice & checkboxes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span>Dropdown & rating scales</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span>Date & time pickers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span>File uploads & signatures</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
} 