'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  ArrowLeft,
  Download,
  Search,
  Filter,
  Eye,
  Calendar,
  Mail,
  User,
  FileText,
  Trash2,
  MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'
import { Form, FormResponse, FormQuestion, APIResponse } from '@/lib/types/forms'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'

interface FormResponsesResponse {
  form: Form
  responses: FormResponse[]
  total: number
}

export default function FormResponsesPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string

  const [form, setForm] = useState<Form | null>(null)
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null)
  const [totalResponses, setTotalResponses] = useState(0)

  const fetchResponses = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/forms/${formId}/responses`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch responses')
      }

      const data: APIResponse<FormResponsesResponse> = await response.json()
      
      if (data.success && data.data) {
        setForm(data.data.form)
        setResponses(data.data.responses)
        setTotalResponses(data.data.total)
      } else {
        toast.error('Failed to fetch responses')
        router.push('/dashboard/forms')
      }
    } catch (error) {
      console.error('Error fetching responses:', error)
      toast.error('Failed to fetch responses')
      router.push('/dashboard/forms')
    } finally {
      setLoading(false)
    }
  }, [formId, router])

  useEffect(() => {
    if (formId) {
      fetchResponses()
    }
  }, [formId, fetchResponses])

  const handleDeleteResponse = async (responseId: string) => {
    if (!confirm('Are you sure you want to delete this response? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/forms/${formId}/responses/${responseId}`, {
        method: 'DELETE'
      })
      
      const data: APIResponse = await response.json()
      
      if (data.success) {
        toast.success('Response deleted successfully')
        fetchResponses() // Refresh the list
      } else {
        toast.error('Failed to delete response')
      }
    } catch (error) {
      console.error('Error deleting response:', error)
      toast.error('Failed to delete response')
    }
  }

  const handleExportResponses = async () => {
    try {
      const response = await fetch(`/api/forms/${formId}/responses/export`)
      
      if (!response.ok) {
        throw new Error('Failed to export responses')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${form?.title || 'form'}-responses.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Responses exported successfully')
    } catch (error) {
      console.error('Error exporting responses:', error)
      toast.error('Failed to export responses')
    }
  }

  const filteredResponses = responses.filter(response => {
    const matchesSearch = !searchTerm || 
      (response.respondent_email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (response.respondent_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || response.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getResponseValue = (response: FormResponse, questionId: string) => {
    const responseData = response.response_data as Record<string, unknown>
    const value = responseData[questionId]
    
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    
    return value?.toString() || '-'
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Form not found</h1>
          <p className="text-muted-foreground mt-2">The form you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/forms">Back to Forms</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="p-2">
              <Link href="/dashboard/forms">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Form Responses</h1>
              <p className="text-muted-foreground">
                {form.title}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleExportResponses}
              disabled={responses.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button asChild>
              <Link href={`/forms/${form.token}`} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                View Form
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Responses</p>
                  <p className="text-2xl font-bold">{totalResponses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Form Views</p>
                  <p className="text-2xl font-bold">{form.view_count || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">
                    {form.view_count ? Math.round((totalResponses / form.view_count) * 100) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Avg. Completion</p>
                  <p className="text-2xl font-bold">
                    {responses.length > 0 
                      ? `${Math.round(responses.filter(r => r.status === 'completed').length / responses.length * 100)}%`
                      : '0%'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Responses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="abandoned">Abandoned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Responses Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Responses ({filteredResponses.length})</CardTitle>
                <CardDescription>
                  {filteredResponses.length === 0 
                    ? 'No responses match your filters'
                    : 'Click on a response to view details'
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredResponses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>
                  {responses.length === 0 
                    ? 'No responses yet. Share your form to start collecting responses.'
                    : 'No responses match your current filters.'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Respondent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Completion Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResponses.map((response) => (
                      <TableRow key={response.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {response.respondent_email ? (
                              <Mail className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <User className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div>
                              <div className="font-medium">
                                {response.respondent_name || 'Anonymous'}
                              </div>
                              {response.respondent_email && (
                                <div className="text-sm text-muted-foreground">
                                  {response.respondent_email}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              response.status === 'completed' ? 'default' :
                              response.status === 'partial' ? 'secondary' : 'destructive'
                            }
                          >
                            {response.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {response.submitted_at ? format(new Date(response.submitted_at), 'MMM d, yyyy HH:mm') : '-'}
                        </TableCell>
                        <TableCell>
                          {response.completion_time_seconds 
                            ? `${Math.round(response.completion_time_seconds / 60)}m ${response.completion_time_seconds % 60}s`
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedResponse(response)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle>Response Details</DialogTitle>
                                  <DialogDescription>
                                    Submitted {response.submitted_at ? format(new Date(response.submitted_at), 'MMM d, yyyy HH:mm') : 'Unknown'}
                                  </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="max-h-[60vh] pr-4">
                                  {selectedResponse && (
                                    <div className="space-y-6">
                                      {/* Respondent Info */}
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-sm font-medium">Name</Label>
                                          <p className="text-sm">{selectedResponse.respondent_name || 'Not provided'}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Email</Label>
                                          <p className="text-sm">{selectedResponse.respondent_email || 'Not provided'}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="border-t pt-6">
                                        <h3 className="font-medium mb-4">Responses</h3>
                                        <div className="space-y-4">
                                          {(form.questions as unknown as FormQuestion[])?.map((question) => (
                                            <div key={question.id} className="border-b pb-4 last:border-b-0">
                                              <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-medium text-sm">{question.title}</h4>
                                                <Badge variant="outline" className="text-xs">
                                                  {question.type}
                                                </Badge>
                                              </div>
                                              {question.description && (
                                                <p className="text-xs text-muted-foreground mb-2">
                                                  {question.description}
                                                </p>
                                              )}
                                              <div className="p-3 bg-muted rounded-lg">
                                                <p className="text-sm">
                                                  {getResponseValue(selectedResponse, question.id)}
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleDeleteResponse(response.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Response
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 