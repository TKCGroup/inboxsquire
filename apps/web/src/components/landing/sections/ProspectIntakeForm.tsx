"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Section } from "@/components/ui/section";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  CheckCircle, 
  Mail, 
  Users, 
  Building, 
  DollarSign, 
  Calendar, 
  Target,
  AlertCircle 
} from "lucide-react";

const prospectIntakeSchema = z.object({
  // Contact Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  
  // Company Information
  company: z.string().min(2, "Company name is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  companySize: z.enum(["1-10", "11-50", "51-200", "201-1000", "1000+"]),
  industry: z.string().min(2, "Industry is required"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  
  // Email Management Pain Points
  currentEmailVolume: z.enum(["under-50", "50-100", "100-200", "200-500", "500+"]),
  timeSpentOnEmail: z.enum(["under-1h", "1-2h", "2-4h", "4-6h", "6h+"]),
  biggestPainPoints: z.array(z.string()).min(1, "Please select at least one pain point"),
  currentSolutions: z.string().optional(),
  
  // Project Details
  primaryGoals: z.array(z.string()).min(1, "Please select at least one goal"),
  timeline: z.enum(["immediate", "1-month", "3-months", "6-months", "exploring"]),
  budget: z.enum(["under-1k", "1k-5k", "5k-15k", "15k-50k", "50k+", "no-budget"]),
  decisionMakers: z.enum(["me-only", "me-plus-1", "small-team", "large-committee"]),
  
  // Technical Requirements
  technicalRequirements: z.string().optional(),
  integrationNeeds: z.array(z.string()),
  securityRequirements: z.string().optional(),
  
  // Additional Information
  additionalNotes: z.string().optional(),
  preferredContactMethod: z.enum(["email", "phone", "video-call", "in-person"]),
  bestTimeToContact: z.string().optional(),
});

type ProspectIntakeFormData = z.infer<typeof prospectIntakeSchema>;

export default function ProspectIntakeForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProspectIntakeFormData>({
    resolver: zodResolver(prospectIntakeSchema),
    defaultValues: {
      biggestPainPoints: [],
      primaryGoals: [],
      integrationNeeds: [],
    },
  });

  const onSubmit = async (data: ProspectIntakeFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/prospect-intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }
      
      const result = await response.json();
      console.log('Form submitted successfully:', result);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      // TODO: Show user-friendly error message
      alert('There was an error submitting your form. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-white rounded-2xl shadow-xl p-12"
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You for Your Interest!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
                          We&apos;ve received your information and will review your requirements. 
            A member of our team will reach out within 24 hours to discuss how Squire can help transform your email management.
            </p>
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                Personalized solution recommendations based on your requirements
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                Custom implementation timeline and pricing
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                Priority access to beta features and updates
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tell Us About Your Email Management Needs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Skip the discovery call. Fill out this form and we&apos;ll provide personalized recommendations 
            for how Squire can transform your inbox management.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-8 lg:p-12"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Contact Information Section */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center mb-6">
                  <Users className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="john@company.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Company Information Section */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center mb-6">
                  <Building className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Company Information</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="CEO, CTO, VP Engineering" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Size *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-1000">201-1000 employees</SelectItem>
                            <SelectItem value="1000+">1000+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry *</FormLabel>
                        <FormControl>
                          <Input placeholder="Technology, Healthcare, Finance" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Company Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Email Management Pain Points */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center mb-6">
                  <Mail className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Current Email Challenges</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <FormField
                    control={form.control}
                    name="currentEmailVolume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Email Volume *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select email volume" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="under-50">Under 50 emails/day</SelectItem>
                            <SelectItem value="50-100">50-100 emails/day</SelectItem>
                            <SelectItem value="100-200">100-200 emails/day</SelectItem>
                            <SelectItem value="200-500">200-500 emails/day</SelectItem>
                            <SelectItem value="500+">500+ emails/day</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeSpentOnEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Spent on Email Daily *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time spent" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="under-1h">Under 1 hour</SelectItem>
                            <SelectItem value="1-2h">1-2 hours</SelectItem>
                            <SelectItem value="2-4h">2-4 hours</SelectItem>
                            <SelectItem value="4-6h">4-6 hours</SelectItem>
                            <SelectItem value="6h+">6+ hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="biggestPainPoints"
                  render={() => (
                    <FormItem>
                      <FormLabel>Biggest Email Pain Points * (Select all that apply)</FormLabel>
                      <div className="grid md:grid-cols-2 gap-3 mt-3">
                        {[
                          "Too much vendor/sales outreach",
                          "Difficulty prioritizing important emails",
                          "Time wasted on irrelevant demos",
                          "AI-generated spam and outreach",
                          "Missing important opportunities",
                          "Inefficient email organization",
                          "Lack of email analytics/insights",
                          "Poor email delegation workflow"
                        ].map((painPoint) => (
                          <FormField
                            key={painPoint}
                            control={form.control}
                            name="biggestPainPoints"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={painPoint}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(painPoint)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, painPoint])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== painPoint
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {painPoint}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSolutions"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>Current Email Management Tools/Solutions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What tools or processes do you currently use to manage your email? (e.g., Gmail filters, assistants, other software)"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Project Goals & Timeline */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center mb-6">
                  <Target className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Project Goals & Timeline</h3>
                </div>

                <FormField
                  control={form.control}
                  name="primaryGoals"
                  render={() => (
                    <FormItem className="mb-6">
                      <FormLabel>Primary Goals * (Select all that apply)</FormLabel>
                      <div className="grid md:grid-cols-2 gap-3 mt-3">
                        {[
                          "Reduce time spent on email management",
                          "Improve email prioritization and organization",
                          "Automate vendor outreach responses",
                          "Better qualify sales opportunities",
                          "Reduce inbox overwhelm and stress",
                          "Increase team productivity",
                          "Implement email analytics and reporting",
                          "Integrate with existing workflow tools"
                        ].map((goal) => (
                          <FormField
                            key={goal}
                            control={form.control}
                            name="primaryGoals"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={goal}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(goal)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, goal])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== goal
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {goal}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Implementation Timeline *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate (within 2 weeks)</SelectItem>
                            <SelectItem value="1-month">Within 1 month</SelectItem>
                            <SelectItem value="3-months">Within 3 months</SelectItem>
                            <SelectItem value="6-months">Within 6 months</SelectItem>
                            <SelectItem value="exploring">Just exploring options</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="decisionMakers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Decision-Making Process *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Who's involved in decisions?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="me-only">I make the decision alone</SelectItem>
                            <SelectItem value="me-plus-1">Me + 1 other person</SelectItem>
                            <SelectItem value="small-team">Small team (3-5 people)</SelectItem>
                            <SelectItem value="large-committee">Large committee/formal process</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Budget & Investment */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Budget & Investment</h3>
                </div>

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anticipated Budget Range *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="under-1k">Under $1,000</SelectItem>
                          <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                          <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                          <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
                          <SelectItem value="50k+">$50,000+</SelectItem>
                          <SelectItem value="no-budget">No budget established yet</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Technical Requirements */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center mb-6">
                  <AlertCircle className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Technical Requirements</h3>
                </div>

                <FormField
                  control={form.control}
                  name="integrationNeeds"
                  render={() => (
                    <FormItem className="mb-6">
                      <FormLabel>Required Integrations (Select all that apply)</FormLabel>
                      <div className="grid md:grid-cols-2 gap-3 mt-3">
                        {[
                          "Gmail/Google Workspace",
                          "Outlook/Microsoft 365",
                          "Slack",
                          "Microsoft Teams",
                          "Salesforce",
                          "HubSpot",
                          "Pipedrive",
                          "Calendly/Calendar tools",
                          "Zoom",
                          "Custom CRM",
                          "Other (specify in notes)"
                        ].map((integration) => (
                          <FormField
                            key={integration}
                            control={form.control}
                            name="integrationNeeds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={integration}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(integration)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, integration])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== integration
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {integration}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="technicalRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specific Technical Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any specific technical requirements, API needs, custom features, or compliance requirements?"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="securityRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security & Compliance Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Do you have specific security, privacy, or compliance requirements? (GDPR, HIPAA, SOC 2, etc.)"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Preferences */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center mb-6">
                  <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Contact Preferences</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="preferredContactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Contact Method *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="How should we contact you?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone call</SelectItem>
                            <SelectItem value="video-call">Video call</SelectItem>
                            <SelectItem value="in-person">In-person meeting</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bestTimeToContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Best Time to Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Weekdays 9-5 EST, Tuesday afternoons" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Anything else you'd like us to know about your email management challenges or requirements?"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full sm:w-auto px-12 py-4 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Requirements"}
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  We&apos;ll review your requirements and provide personalized recommendations within 24 hours.
                </p>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </Section>
  );
} 