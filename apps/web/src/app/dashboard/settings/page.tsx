"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Download, 
  Trash2, 
  Settings as SettingsIcon,
  Save,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    notifications: {
      email: true,
      sms: false,
      browser: true,
      formSubmissions: true,
      weeklyDigest: false
    },
    privacy: {
      analytics: true,
      marketing: false,
      dataSharing: false
    }
  })

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        displayName: user.user_metadata?.name || ''
      }))
    }
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Settings saved successfully!')
    setSaving(false)
  }

  const handleExportData = () => {
    toast.info('Data export will be available soon')
  }

  const handleDeleteAccount = () => {
    toast.error('Account deletion will be available soon')
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
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start text-primary">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" disabled>
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                    <Badge variant="secondary" className="ml-auto text-xs">Soon</Badge>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" disabled>
                    <Shield className="mr-2 h-4 w-4" />
                    Privacy
                    <Badge variant="secondary" className="ml-auto text-xs">Soon</Badge>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Palette className="mr-2 h-4 w-4" />
                    Appearance
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" disabled>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Advanced
                    <Badge variant="secondary" className="ml-auto text-xs">Soon</Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Account Information</span>
                </CardTitle>
                <CardDescription>
                  Update your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed at this time
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Enter your display name"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Account Status</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Active</Badge>
                      <Badge variant="secondary">Free Plan</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Appearance</span>
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Theme</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          theme === 'light' 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Sun className="h-4 w-4 mx-auto mb-2" />
                        <div className="text-xs">Light</div>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          theme === 'dark' 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Moon className="h-4 w-4 mx-auto mb-2" />
                        <div className="text-xs">Dark</div>
                      </button>
                      <button
                        onClick={() => setTheme('system')}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          theme === 'system' 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Monitor className="h-4 w-4 mx-auto mb-2" />
                        <div className="text-xs">System</div>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications (Preview) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                  <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Email Notifications</div>
                      <div className="text-xs text-muted-foreground">
                        Receive updates via email
                      </div>
                    </div>
                    <Switch disabled />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Form Submissions</div>
                      <div className="text-xs text-muted-foreground">
                        Get notified when forms are submitted
                      </div>
                    </div>
                    <Switch disabled />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Weekly Digest</div>
                      <div className="text-xs text-muted-foreground">
                        Summary of your form activity
                      </div>
                    </div>
                    <Switch disabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Data & Privacy</span>
                </CardTitle>
                <CardDescription>
                  Manage your data and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Export Data</h4>
                      <p className="text-xs text-muted-foreground">
                        Download all your account data
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleExportData}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-destructive">Delete Account</h4>
                      <p className="text-xs text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={handleDeleteAccount}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 