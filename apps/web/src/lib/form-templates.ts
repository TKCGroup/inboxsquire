import { FormQuestion, TemplateCategory, FormBranding, FormSettings } from './types/forms'

export interface FormTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  icon: string
  color: string
  questions: FormQuestion[]
  branding?: FormBranding
  settings?: FormSettings
  estimatedTime?: number
}

// Vendor Evaluation Template
const vendorEvaluationQuestions: FormQuestion[] = [
  {
    id: 'company-overview',
    type: 'section',
    title: 'Company Overview',
    description: 'Tell us about your company and organization'
  },
  {
    id: 'company-name',
    type: 'text',
    title: 'Company Name',
    required: true,
    placeholder: 'Enter your company name'
  },
  {
    id: 'website',
    type: 'url',
    title: 'Company Website',
    required: true,
    placeholder: 'https://yourcompany.com'
  },
  {
    id: 'company-size',
    type: 'select',
    title: 'Company Size',
    required: true,
    options: [
      '1-10 employees',
      '11-50 employees', 
      '51-200 employees',
      '201-1000 employees',
      '1000+ employees'
    ]
  },
  {
    id: 'industry',
    type: 'text',
    title: 'Industry/Vertical',
    required: true,
    placeholder: 'e.g., SaaS, Healthcare, Financial Services'
  },
  {
    id: 'years-in-business',
    type: 'number',
    title: 'Years in Business',
    required: true,
    min: 0,
    max: 100
  },
  {
    id: 'services-products',
    type: 'section',
    title: 'Services & Products',
    description: 'Details about your offerings'
  },
  {
    id: 'primary-services',
    type: 'textarea',
    title: 'Primary Services/Products',
    required: true,
    placeholder: 'Describe your main services or products...',
    rows: 4
  },
  {
    id: 'target-market',
    type: 'textarea',
    title: 'Target Market',
    required: true,
    placeholder: 'Who are your ideal customers?',
    rows: 3
  },
  {
    id: 'pricing-model',
    type: 'radio',
    title: 'Pricing Model',
    required: true,
    options: [
      'One-time fee',
      'Monthly subscription',
      'Annual subscription',
      'Usage-based',
      'Custom pricing',
      'Other'
    ],
    allowOther: true
  },
  {
    id: 'technical-capabilities',
    type: 'section',
    title: 'Technical Capabilities',
    description: 'Integration and technical requirements'
  },
  {
    id: 'integration-apis',
    type: 'yesno',
    title: 'Do you provide APIs for integration?',
    required: true
  },
  {
    id: 'api-documentation',
    type: 'url',
    title: 'API Documentation URL',
    placeholder: 'https://docs.yourcompany.com/api'
  },
  {
    id: 'supported-integrations',
    type: 'checkbox',
    title: 'Supported Integrations',
    options: [
      'CRM (Salesforce, HubSpot)',
      'Email (Gmail, Outlook)',
      'Calendar (Google, Outlook)',
      'Slack',
      'Microsoft Teams',
      'Zapier',
      'Webhooks',
      'Custom API'
    ]
  },
  {
    id: 'data-hosting',
    type: 'radio',
    title: 'Data Hosting',
    required: true,
    options: [
      'Cloud-hosted (our infrastructure)',
      'On-premise deployment available',
      'Hybrid options available',
      'Customer chooses'
    ]
  },
  {
    id: 'security-compliance',
    type: 'section',
    title: 'Security & Compliance',
    description: 'Security certifications and compliance standards'
  },
  {
    id: 'security-certifications',
    type: 'checkbox',
    title: 'Security Certifications',
    options: [
      'SOC 2 Type II',
      'ISO 27001',
      'GDPR Compliant',
      'HIPAA Compliant',
      'PCI DSS',
      'FedRAMP',
      'Other certification'
    ],
    allowOther: true
  },
  {
    id: 'data-encryption',
    type: 'yesno',
    title: 'Is data encrypted in transit and at rest?',
    required: true
  },
  {
    id: 'security-measures',
    type: 'textarea',
    title: 'Additional Security Measures',
    placeholder: 'Describe other security measures you have in place...',
    rows: 3
  },
  {
    id: 'support-pricing',
    type: 'section',
    title: 'Support & Pricing',
    description: 'Support options and pricing details'
  },
  {
    id: 'support-options',
    type: 'checkbox',
    title: 'Support Options Available',
    required: true,
    options: [
      'Email support',
      'Phone support',
      'Live chat',
      'Dedicated account manager',
      'Self-service portal',
      '24/7 support',
      'Video calls/screen sharing'
    ]
  },
  {
    id: 'implementation-time',
    type: 'select',
    title: 'Typical Implementation Timeline',
    required: true,
    options: [
      'Same day',
      '1-3 days',
      '1-2 weeks',
      '2-4 weeks',
      '1-3 months',
      '3+ months'
    ]
  },
  {
    id: 'pricing-range',
    type: 'select',
    title: 'Starting Price Range (per user/month)',
    options: [
      'Under $10',
      '$10-25',
      '$25-50',
      '$50-100',
      '$100-250',
      '$250+',
      'Custom pricing'
    ]
  },
  {
    id: 'additional-info',
    type: 'textarea',
    title: 'Additional Information',
    placeholder: 'Anything else you think we should know?',
    rows: 4
  }
]

// Partnership Assessment Template
const partnershipAssessmentQuestions: FormQuestion[] = [
  {
    id: 'partnership-overview',
    type: 'section',
    title: 'Partnership Overview',
    description: 'Tell us about your partnership interests'
  },
  {
    id: 'partnership-type',
    type: 'radio',
    title: 'Type of Partnership',
    required: true,
    options: [
      'Technology Integration',
      'Channel/Reseller Partner',
      'Strategic Alliance',
      'Co-marketing Partnership',
      'Joint Venture',
      'Supplier Partnership',
      'Other'
    ],
    allowOther: true
  },
  {
    id: 'partnership-goals',
    type: 'textarea',
    title: 'Partnership Goals',
    required: true,
    placeholder: 'What do you hope to achieve through this partnership?',
    rows: 4
  },
  {
    id: 'market-presence',
    type: 'section',
    title: 'Market Presence',
    description: 'Your position in the market'
  },
  {
    id: 'geographic-markets',
    type: 'checkbox',
    title: 'Geographic Markets',
    required: true,
    options: [
      'North America',
      'Europe',
      'Asia Pacific',
      'Latin America',
      'Middle East',
      'Africa',
      'Global'
    ]
  },
  {
    id: 'customer-base-size',
    type: 'select',
    title: 'Customer Base Size',
    required: true,
    options: [
      'Under 100 customers',
      '100-1,000 customers',
      '1,000-10,000 customers',
      '10,000+ customers'
    ]
  },
  {
    id: 'revenue-range',
    type: 'select',
    title: 'Annual Revenue Range',
    options: [
      'Under $1M',
      '$1M-$10M',
      '$10M-$50M',
      '$50M-$100M',
      '$100M+',
      'Prefer not to disclose'
    ]
  },
  {
    id: 'capabilities',
    type: 'section',
    title: 'Capabilities & Resources',
    description: 'What you bring to the partnership'
  },
  {
    id: 'key-strengths',
    type: 'textarea',
    title: 'Key Strengths',
    required: true,
    placeholder: 'What are your core competencies and differentiators?',
    rows: 4
  },
  {
    id: 'sales-team-size',
    type: 'select',
    title: 'Sales Team Size',
    options: [
      '1-5 people',
      '6-15 people', 
      '16-50 people',
      '50+ people',
      'No dedicated sales team'
    ]
  },
  {
    id: 'marketing-capabilities',
    type: 'checkbox',
    title: 'Marketing Capabilities',
    options: [
      'Digital marketing',
      'Content marketing',
      'Event marketing',
      'PR/Media relations',
      'Social media',
      'Email marketing',
      'Webinars',
      'Industry publications'
    ]
  },
  {
    id: 'timeline-commitment',
    type: 'section',
    title: 'Timeline & Commitment',
    description: 'Partnership expectations and timeline'
  },
  {
    id: 'partnership-timeline',
    type: 'select',
    title: 'Desired Partnership Timeline',
    required: true,
    options: [
      'Immediate (within 30 days)',
      '1-3 months',
      '3-6 months',
      '6-12 months',
      'Flexible timing'
    ]
  },
  {
    id: 'resource-commitment',
    type: 'textarea',
    title: 'Resource Commitment',
    placeholder: 'What resources can you commit to this partnership?',
    rows: 3
  },
  {
    id: 'success-metrics',
    type: 'textarea',
    title: 'Success Metrics',
    placeholder: 'How would you measure partnership success?',
    rows: 3
  },
  {
    id: 'additional-notes',
    type: 'textarea',
    title: 'Additional Notes',
    placeholder: 'Any other relevant information about your partnership interests?',
    rows: 4
  }
]

// Customer Research Template
const customerResearchQuestions: FormQuestion[] = [
  {
    id: 'background',
    type: 'section',
    title: 'Background Information',
    description: 'Tell us about yourself and your role'
  },
  {
    id: 'job-title',
    type: 'text',
    title: 'Job Title',
    required: true,
    placeholder: 'Your current role'
  },
  {
    id: 'department',
    type: 'select',
    title: 'Department',
    required: true,
    options: [
      'Executive/C-Suite',
      'Sales',
      'Marketing',
      'Operations',
      'IT/Technology',
      'Finance',
      'HR',
      'Customer Success',
      'Product',
      'Other'
    ]
  },
  {
    id: 'decision-role',
    type: 'radio',
    title: 'Role in Decision Making',
    required: true,
    options: [
      'Final decision maker',
      'Strong influence on decisions',
      'Some influence on decisions',
      'Recommend solutions to others',
      'End user only'
    ]
  },
  {
    id: 'current-situation',
    type: 'section',
    title: 'Current Situation',
    description: 'Your current tools and processes'
  },
  {
    id: 'current-solution',
    type: 'textarea',
    title: 'Current Solution',
    required: true,
    placeholder: 'What tools/solutions do you currently use for this?',
    rows: 3
  },
  {
    id: 'satisfaction-rating',
    type: 'rating',
    title: 'Satisfaction with Current Solution',
    required: true,
    scale: 5,
    labels: {
      low: 'Very unsatisfied',
      high: 'Very satisfied'
    }
  },
  {
    id: 'main-challenges',
    type: 'textarea',
    title: 'Main Challenges',
    required: true,
    placeholder: 'What are your biggest pain points or challenges?',
    rows: 4
  },
  {
    id: 'requirements',
    type: 'section',
    title: 'Requirements & Priorities',
    description: 'What you need in a solution'
  },
  {
    id: 'must-have-features',
    type: 'textarea',
    title: 'Must-Have Features',
    required: true,
    placeholder: 'What features are absolutely essential?',
    rows: 4
  },
  {
    id: 'nice-to-have-features',
    type: 'textarea',
    title: 'Nice-to-Have Features',
    placeholder: 'What features would be nice but not essential?',
    rows: 3
  },
  {
    id: 'integration-needs',
    type: 'checkbox',
    title: 'Integration Requirements',
    options: [
      'CRM system',
      'Email platforms',
      'Calendar applications',
      'Project management tools',
      'Communication tools (Slack, Teams)',
      'Analytics platforms',
      'Other business applications',
      'No integrations needed'
    ]
  },
  {
    id: 'budget-timeline',
    type: 'section',
    title: 'Budget & Timeline',
    description: 'Investment and implementation details'
  },
  {
    id: 'budget-range',
    type: 'select',
    title: 'Budget Range',
    options: [
      'Under $1,000/month',
      '$1,000-$5,000/month',
      '$5,000-$15,000/month',
      '$15,000+/month',
      'Budget not yet determined'
    ]
  },
  {
    id: 'implementation-timeline',
    type: 'select',
    title: 'Implementation Timeline',
    required: true,
    options: [
      'Immediately',
      'Within 30 days',
      '1-3 months',
      '3-6 months',
      '6+ months',
      'Just researching for now'
    ]
  },
  {
    id: 'decision-timeline',
    type: 'select',
    title: 'Decision Timeline',
    required: true,
    options: [
      'Within 2 weeks',
      'Within 1 month',
      'Within 3 months',
      'Within 6 months',
      'No specific timeline'
    ]
  },
  {
    id: 'decision-process',
    type: 'textarea',
    title: 'Decision Process',
    placeholder: 'Who else is involved in the decision? What is your evaluation process?',
    rows: 3
  },
  {
    id: 'additional-context',
    type: 'textarea',
    title: 'Additional Context',
    placeholder: 'Anything else we should know about your situation or requirements?',
    rows: 4
  }
]

// Contact Information Template
const contactInformationQuestions: FormQuestion[] = [
  {
    id: 'personal-info',
    type: 'section',
    title: 'Personal Information',
    description: 'Basic contact details'
  },
  {
    id: 'first-name',
    type: 'text',
    title: 'First Name',
    required: true,
    placeholder: 'John'
  },
  {
    id: 'last-name',
    type: 'text',
    title: 'Last Name',
    required: true,
    placeholder: 'Smith'
  },
  {
    id: 'email',
    type: 'email',
    title: 'Email Address',
    required: true,
    placeholder: 'john@company.com'
  },
  {
    id: 'phone',
    type: 'tel',
    title: 'Phone Number',
    placeholder: '+1 (555) 123-4567'
  },
  {
    id: 'company-info',
    type: 'section',
    title: 'Company Information',
    description: 'Professional details'
  },
  {
    id: 'company-name',
    type: 'text',
    title: 'Company Name',
    required: true,
    placeholder: 'Acme Corporation'
  },
  {
    id: 'job-title',
    type: 'text',
    title: 'Job Title',
    required: true,
    placeholder: 'Chief Executive Officer'
  },
  {
    id: 'company-website',
    type: 'url',
    title: 'Company Website',
    placeholder: 'https://acme.com'
  },
  {
    id: 'industry',
    type: 'select',
    title: 'Industry',
    options: [
      'Technology',
      'Healthcare',
      'Financial Services',
      'Manufacturing',
      'Retail/E-commerce',
      'Education',
      'Professional Services',
      'Real Estate',
      'Media & Entertainment',
      'Government',
      'Non-profit',
      'Other'
    ]
  },
  {
    id: 'company-size',
    type: 'select',
    title: 'Company Size',
    options: [
      'Solo/Freelancer',
      '2-10 employees',
      '11-50 employees',
      '51-200 employees',
      '201-1000 employees',
      '1000+ employees'
    ]
  },
  {
    id: 'contact-preferences',
    type: 'section',
    title: 'Contact Preferences',
    description: 'How you prefer to be contacted'
  },
  {
    id: 'preferred-contact',
    type: 'radio',
    title: 'Preferred Contact Method',
    required: true,
    options: [
      'Email',
      'Phone',
      'Text/SMS',
      'Video call',
      'In-person meeting'
    ]
  },
  {
    id: 'best-time',
    type: 'checkbox',
    title: 'Best Time to Contact',
    options: [
      'Morning (9 AM - 12 PM)',
      'Afternoon (12 PM - 5 PM)',
      'Evening (5 PM - 8 PM)',
      'Weekends'
    ]
  },
  {
    id: 'timezone',
    type: 'select',
    title: 'Timezone',
    options: [
      'Eastern Time (ET)',
      'Central Time (CT)',
      'Mountain Time (MT)',
      'Pacific Time (PT)',
      'Other (please specify in notes)'
    ]
  },
  {
    id: 'additional-notes',
    type: 'textarea',
    title: 'Additional Notes',
    placeholder: 'Any specific instructions or additional information?',
    rows: 3
  }
]

// Due Diligence Template
const dueDiligenceQuestions: FormQuestion[] = [
  {
    id: 'company-overview',
    type: 'section',
    title: 'Company Overview',
    description: 'Basic company information'
  },
  {
    id: 'legal-name',
    type: 'text',
    title: 'Legal Company Name',
    required: true
  },
  {
    id: 'incorporation-date',
    type: 'date',
    title: 'Date of Incorporation',
    required: true
  },
  {
    id: 'jurisdiction',
    type: 'text',
    title: 'Jurisdiction of Incorporation',
    required: true,
    placeholder: 'e.g., Delaware, USA'
  },
  {
    id: 'business-structure',
    type: 'radio',
    title: 'Business Structure',
    required: true,
    options: [
      'Corporation (C-Corp)',
      'S Corporation',
      'Limited Liability Company (LLC)',
      'Partnership',
      'Sole Proprietorship',
      'Other'
    ]
  },
  {
    id: 'financial-information',
    type: 'section',
    title: 'Financial Information',
    description: 'Financial performance and metrics'
  },
  {
    id: 'annual-revenue',
    type: 'select',
    title: 'Annual Revenue (Last Fiscal Year)',
    required: true,
    options: [
      'Under $1M',
      '$1M - $10M',
      '$10M - $50M',
      '$50M - $100M',
      '$100M - $500M',
      '$500M+',
      'Prefer not to disclose'
    ]
  },
  {
    id: 'profitability',
    type: 'radio',
    title: 'Current Profitability Status',
    required: true,
    options: [
      'Profitable',
      'Break-even',
      'Operating at a loss but improving',
      'Operating at a loss',
      'Prefer not to disclose'
    ]
  },
  {
    id: 'funding-history',
    type: 'textarea',
    title: 'Funding History',
    placeholder: 'Brief overview of previous funding rounds, if any',
    rows: 3
  },
  {
    id: 'outstanding-debt',
    type: 'yesno',
    title: 'Any outstanding debt or major liabilities?'
  },
  {
    id: 'operations',
    type: 'section',
    title: 'Operations',
    description: 'Operational details and capabilities'
  },
  {
    id: 'employee-count',
    type: 'number',
    title: 'Total Number of Employees',
    required: true,
    min: 0
  },
  {
    id: 'key-personnel',
    type: 'textarea',
    title: 'Key Personnel',
    required: true,
    placeholder: 'Names and roles of key management team members',
    rows: 4
  },
  {
    id: 'operational-locations',
    type: 'textarea',
    title: 'Operational Locations',
    required: true,
    placeholder: 'List all office locations and facilities',
    rows: 3
  },
  {
    id: 'technology-stack',
    type: 'textarea',
    title: 'Technology Stack',
    placeholder: 'Key technologies, platforms, and systems used',
    rows: 3
  },
  {
    id: 'legal-compliance',
    type: 'section',
    title: 'Legal & Compliance',
    description: 'Legal matters and regulatory compliance'
  },
  {
    id: 'pending-litigation',
    type: 'yesno',
    title: 'Any pending litigation or legal disputes?',
    required: true
  },
  {
    id: 'regulatory-compliance',
    type: 'checkbox',
    title: 'Regulatory Compliance',
    options: [
      'GDPR',
      'CCPA',
      'HIPAA',
      'SOX',
      'PCI DSS',
      'Industry-specific regulations',
      'No specific regulatory requirements',
      'Other (please specify)'
    ]
  },
  {
    id: 'intellectual-property',
    type: 'textarea',
    title: 'Intellectual Property',
    placeholder: 'Patents, trademarks, copyrights, trade secrets, etc.',
    rows: 3
  },
  {
    id: 'risk-factors',
    type: 'section',
    title: 'Risk Factors',
    description: 'Potential risks and challenges'
  },
  {
    id: 'business-risks',
    type: 'textarea',
    title: 'Key Business Risks',
    required: true,
    placeholder: 'Identify major risks to the business',
    rows: 4
  },
  {
    id: 'market-competition',
    type: 'textarea',
    title: 'Market & Competition',
    required: true,
    placeholder: 'Market position and competitive landscape',
    rows: 3
  },
  {
    id: 'additional-information',
    type: 'textarea',
    title: 'Additional Information',
    placeholder: 'Any other relevant information for due diligence',
    rows: 4
  }
]

// Event Planning Template
const eventPlanningQuestions: FormQuestion[] = [
  {
    id: 'event-basics',
    type: 'section',
    title: 'Event Basics',
    description: 'Basic information about your event'
  },
  {
    id: 'event-name',
    type: 'text',
    title: 'Event Name',
    required: true,
    placeholder: 'Annual Company Conference 2024'
  },
  {
    id: 'event-type',
    type: 'radio',
    title: 'Event Type',
    required: true,
    options: [
      'Conference',
      'Workshop/Training',
      'Product Launch',
      'Networking Event',
      'Awards Ceremony',
      'Corporate Retreat',
      'Trade Show',
      'Other'
    ],
    allowOther: true
  },
  {
    id: 'event-format',
    type: 'radio',
    title: 'Event Format',
    required: true,
    options: [
      'In-person only',
      'Virtual only',
      'Hybrid (in-person + virtual)'
    ]
  },
  {
    id: 'expected-attendees',
    type: 'select',
    title: 'Expected Number of Attendees',
    required: true,
    options: [
      'Under 50',
      '50-100',
      '100-250',
      '250-500',
      '500-1000',
      '1000+'
    ]
  },
  {
    id: 'timing-logistics',
    type: 'section',
    title: 'Timing & Logistics',
    description: 'When and where your event will take place'
  },
  {
    id: 'preferred-date',
    type: 'date',
    title: 'Preferred Event Date',
    required: true
  },
  {
    id: 'alternative-dates',
    type: 'textarea',
    title: 'Alternative Dates',
    placeholder: 'List 2-3 alternative dates if the preferred date is not available',
    rows: 2
  },
  {
    id: 'event-duration',
    type: 'radio',
    title: 'Event Duration',
    required: true,
    options: [
      'Half day (4 hours or less)',
      'Full day (8 hours)',
      'Multi-day (2-3 days)',
      'Extended (4+ days)'
    ]
  },
  {
    id: 'preferred-location',
    type: 'text',
    title: 'Preferred Location/City',
    placeholder: 'City, State/Country'
  },
  {
    id: 'venue-requirements',
    type: 'checkbox',
    title: 'Venue Requirements',
    options: [
      'AV equipment included',
      'Catering facilities',
      'Parking available',
      'Accessible for disabilities',
      'WiFi included',
      'Breakout rooms',
      'Exhibition space',
      'Outdoor area'
    ]
  },
  {
    id: 'budget-services',
    type: 'section',
    title: 'Budget & Services',
    description: 'Budget constraints and required services'
  },
  {
    id: 'total-budget',
    type: 'select',
    title: 'Total Event Budget',
    options: [
      'Under $10,000',
      '$10,000 - $25,000',
      '$25,000 - $50,000',
      '$50,000 - $100,000',
      '$100,000 - $250,000',
      '$250,000+',
      'Budget flexible'
    ]
  },
  {
    id: 'services-needed',
    type: 'checkbox',
    title: 'Services Needed',
    required: true,
    options: [
      'Venue sourcing',
      'Catering coordination',
      'Speaker management',
      'Registration system',
      'Marketing/promotion',
      'Photography/videography',
      'Live streaming setup',
      'Transportation coordination',
      'Accommodation booking',
      'Entertainment booking',
      'Signage and branding',
      'Gift/swag coordination'
    ]
  },
  {
    id: 'catering-preferences',
    type: 'textarea',
    title: 'Catering Preferences',
    placeholder: 'Dietary restrictions, meal preferences, special requirements',
    rows: 3
  },
  {
    id: 'special-requirements',
    type: 'section',
    title: 'Special Requirements',
    description: 'Any specific needs or considerations'
  },
  {
    id: 'accessibility-needs',
    type: 'textarea',
    title: 'Accessibility Needs',
    placeholder: 'Any specific accessibility requirements for attendees',
    rows: 2
  },
  {
    id: 'technology-needs',
    type: 'textarea',
    title: 'Technology Requirements',
    placeholder: 'Specific AV, streaming, or technical requirements',
    rows: 3
  },
  {
    id: 'branding-requirements',
    type: 'textarea',
    title: 'Branding Requirements',
    placeholder: 'Logo placement, color schemes, branding guidelines',
    rows: 2
  },
  {
    id: 'additional-details',
    type: 'textarea',
    title: 'Additional Details',
    placeholder: 'Any other important information about your event',
    rows: 4
  }
]

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: 'vendor-evaluation',
    name: 'Vendor Evaluation',
    description: 'Comprehensive assessment form for evaluating potential vendors and suppliers',
    category: 'vendor_evaluation',
    icon: 'briefcase',
    color: 'blue',
    questions: vendorEvaluationQuestions,
    estimatedTime: 15,
    settings: {
      showProgressBar: true,
      requireEmail: true,
      allowMultipleSubmissions: false
    }
  },
  {
    id: 'partnership-assessment', 
    name: 'Partnership Assessment',
    description: 'Evaluate potential strategic partnerships and business alliances',
    category: 'partnership',
    icon: 'handshake',
    color: 'green',
    questions: partnershipAssessmentQuestions,
    estimatedTime: 12,
    settings: {
      showProgressBar: true,
      requireEmail: true,
      allowMultipleSubmissions: false
    }
  },
  {
    id: 'customer-research',
    name: 'Customer Research',
    description: 'Gather insights about customer needs, pain points, and requirements',
    category: 'customer_research',
    icon: 'users',
    color: 'purple',
    questions: customerResearchQuestions,
    estimatedTime: 10,
    settings: {
      showProgressBar: true,
      requireEmail: true,
      allowMultipleSubmissions: false
    }
  },
  {
    id: 'contact-information',
    name: 'Contact Information',
    description: 'Collect basic contact details and company information',
    category: 'other',
    icon: 'user',
    color: 'orange',
    questions: contactInformationQuestions,
    estimatedTime: 5,
    settings: {
      showProgressBar: false,
      requireEmail: true,
      allowMultipleSubmissions: true
    }
  },
  {
    id: 'due-diligence',
    name: 'Due Diligence',
    description: 'Comprehensive due diligence questionnaire for investments and acquisitions',
    category: 'due_diligence',
    icon: 'search',
    color: 'red',
    questions: dueDiligenceQuestions,
    estimatedTime: 20,
    settings: {
      showProgressBar: true,
      requireEmail: true,
      allowMultipleSubmissions: false
    }
  },
  {
    id: 'event-planning',
    name: 'Event Planning',
    description: 'Gather requirements for corporate events and conferences',
    category: 'event_planning',
    icon: 'calendar',
    color: 'indigo',
    questions: eventPlanningQuestions,
    estimatedTime: 12,
    settings: {
      showProgressBar: true,
      requireEmail: true,
      allowMultipleSubmissions: false
    }
  }
]

export function getTemplateById(id: string): FormTemplate | undefined {
  return FORM_TEMPLATES.find(template => template.id === id)
}

export function getTemplatesByCategory(category: TemplateCategory): FormTemplate[] {
  return FORM_TEMPLATES.filter(template => template.category === category)
} 