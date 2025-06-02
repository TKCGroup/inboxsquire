# InboxSquire Forms System

A comprehensive token-based forms system integrated into InboxSquire, allowing users to create, share, and manage dynamic forms for vendor evaluation, partnership assessment, customer research, and more.

## 🎯 Overview

InboxSquire Forms is a "lightweight, dynamic AI enabled Typeforms" alternative built as a value-add feature for InboxSquire users. Each form generates a unique token URL (`inboxsquire.com/forms/[token]`) that can be shared with prospects and partners, providing viral marketing through "Powered by InboxSquire" branding.

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── api/forms/                    # API routes
│   │   │   ├── route.ts                  # Forms CRUD
│   │   │   ├── [id]/route.ts            # Individual form operations
│   │   │   ├── public/[token]/          # Public form access
│   │   │   │   ├── route.ts             # Get form by token
│   │   │   │   └── submit/route.ts      # Submit form responses
│   │   │   └── templates/route.ts       # Form templates
│   │   ├── dashboard/forms/             # Admin interface
│   │   │   └── page.tsx                 # Forms management dashboard
│   │   └── forms/[token]/              # Public form rendering
│   │       └── page.tsx                 # Token-based form page
│   ├── components/
│   │   └── forms/
│   │       └── FormRenderer.tsx         # Dynamic form renderer
│   └── lib/
│       ├── supabase.ts                  # Database client
│       └── types/
│           ├── database.ts              # Supabase types
│           └── forms.ts                 # Form-specific types
└── infra/supabase/migrations/
    └── 20250102120000_create_forms_tables.sql  # Database schema
```

## 🗄️ Database Schema

### Tables

#### `forms`
Main forms metadata and configuration
- `id` - UUID primary key
- `user_id` - Foreign key to users table
- `title` - Form title
- `description` - Optional form description
- `token` - Unique 8-character token for public access
- `custom_alias` - Optional custom URL alias
- `template_type` - Template category used
- `questions` - JSONB array of form questions
- `branding` - JSONB branding configuration
- `settings` - JSONB form settings
- `is_active` - Boolean form status
- `expires_at` - Optional expiration timestamp
- `view_count` - Analytics counter
- `submission_count` - Analytics counter

#### `form_responses`
Submitted form data
- `id` - UUID primary key
- `form_id` - Foreign key to forms table
- `respondent_email` - Optional respondent email
- `respondent_name` - Optional respondent name
- `response_data` - JSONB responses to questions
- `metadata` - JSONB submission metadata
- `ip_address` - Client IP for analytics
- `user_agent` - Client user agent
- `completion_time_seconds` - Time taken to complete
- `status` - Submission status (completed, partial, abandoned)

#### `form_analytics`
Form interaction tracking
- `id` - UUID primary key
- `form_id` - Foreign key to forms table
- `event_type` - Event type (view, start, complete, abandon, etc.)
- `session_id` - User session identifier
- `question_id` - Optional question-specific events
- `ip_address` - Client IP
- `user_agent` - Client user agent
- `referrer` - HTTP referrer
- `metadata` - JSONB event metadata

#### `form_templates`
Reusable form templates
- `id` - UUID primary key
- `name` - Template name
- `description` - Template description
- `category` - Template category
- `template_data` - JSONB template configuration
- `is_active` - Template availability
- `usage_count` - Usage analytics
- `created_by` - Optional creator user ID

## 🛠️ API Endpoints

### Forms Management

#### `GET /api/forms`
List user's forms with pagination
- Query params: `page`, `limit`
- Returns: `FormListResponse`

#### `POST /api/forms`
Create new form
- Body: `FormInsert`
- Returns: Created form with generated token

#### `GET /api/forms/[id]`
Get specific form by ID
- Returns: Full form configuration

#### `PUT /api/forms/[id]`
Update form
- Body: `FormUpdate`
- Returns: Updated form

#### `DELETE /api/forms/[id]`
Delete form and all associated data

### Public Form Access

#### `GET /api/forms/public/[token]`
Get form by token (public access)
- Increments view count
- Tracks analytics
- Returns: `PublicForm`

#### `POST /api/forms/public/[token]/submit`
Submit form response
- Body: `FormSubmission`
- Increments submission count
- Tracks completion analytics
- Returns: `FormSubmissionResponse`

### Templates

#### `GET /api/forms/templates`
List available templates
- Query params: `category` (optional)
- Returns: Array of templates

#### `POST /api/forms/templates`
Create new template (admin only)

## 🎨 Form Question Types

The system supports multiple question types for flexible form building:

### Input Types
- `text` - Single line text input
- `email` - Email validation
- `url` - URL validation
- `tel` - Phone number input
- `textarea` - Multi-line text
- `number` - Numeric input with min/max

### Selection Types
- `select` - Dropdown selection
- `radio` - Single choice radio buttons
- `checkbox` - Multiple selection checkboxes
- `multiselect` - Multiple choice with limits
- `yesno` - Simple yes/no choice

### Advanced Types
- `date` - Date picker
- `datetime` - Date and time picker
- `rating` - Star rating scale
- `file` - File upload (future)

### Layout Types
- `section` - Section headers and descriptions

## ⚙️ Configuration Options

### Form Settings
```typescript
interface FormSettings {
  allowMultipleSubmissions?: boolean
  requireEmail?: boolean
  showProgressBar?: boolean
  allowSaveAndContinue?: boolean
  redirectUrl?: string
  notificationEmail?: string
  captcha?: boolean
}
```

### Form Branding
```typescript
interface FormBranding {
  companyName?: string
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  headerMessage?: string
  thankYouMessage?: string
}
```

## 📊 Analytics & Tracking

### Automatic Tracking
- Form views and unique visitors
- Submission completion rates
- Time to complete forms
- Drop-off points and abandonment
- Question-level interactions

### Privacy Compliant
- IP addresses hashed for analytics
- Optional email collection
- GDPR-compliant data handling
- User consent tracking

## 🚀 Getting Started

### Prerequisites
1. Supabase project with forms migration applied
2. Environment variables configured:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```

### Setup Steps

1. **Apply Database Migration**
   ```bash
   # Apply the forms system migration
   npx supabase db push
   ```

2. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Configure Environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Creating Your First Form

1. Navigate to `/dashboard/forms`
2. Click "Create Form"
3. Choose a template or start from scratch
4. Configure questions, branding, and settings
5. Save and get your shareable token URL

## 🎯 Use Cases

### Built-in Templates

#### Vendor Evaluation
- Company information collection
- Security certifications assessment
- Technical capabilities review
- Pricing and terms evaluation

#### Partnership Assessment
- Partnership type identification
- Market presence mapping
- Customer profile alignment
- Integration capabilities

#### Customer Research
- Current solution analysis
- Pain point identification
- Budget qualification
- Requirements gathering

### Custom Forms
- Due diligence questionnaires
- Event planning requirements
- Hiring assessments
- Project specifications
- Feedback collection

## 🔐 Security Features

### Row Level Security (RLS)
- Users can only access their own forms
- Public form submissions are isolated
- Template access is controlled

### Data Protection
- Input validation and sanitization
- XSS prevention
- CSRF protection
- Rate limiting on submissions

### Privacy Controls
- Optional email requirements
- Data retention policies
- Export and deletion capabilities
- Consent tracking

## 📈 Roadmap (Phase 2)

### AI Enhancements
- Smart question suggestions based on form type
- Dynamic question generation from descriptions
- Response intelligence and auto-categorization
- Form optimization recommendations

### Advanced Features
- Conditional logic and branching
- Multi-page forms with save/resume
- File uploads and attachments
- Integration webhooks
- Custom CSS styling
- White-label options

### Analytics Dashboard
- Advanced reporting and insights
- A/B testing capabilities
- Conversion optimization
- Response trend analysis

## 🤝 Integration with InboxSquire

### Email Classification
- Form responses can trigger email rules
- Automatic lead scoring based on responses
- CRM integration for qualified prospects

### Workflow Automation
- Email sequences based on form completion
- Follow-up task creation
- Lead nurturing campaigns

### Viral Marketing
- "Powered by InboxSquire" branding on all forms
- Professional form presentation increases brand credibility
- User retention through added value

## 📝 Contributing

### Development Guidelines
1. Follow TypeScript strict mode
2. Use proper error handling in API routes
3. Implement comprehensive input validation
4. Add proper loading and error states
5. Ensure mobile responsiveness
6. Write accessible markup

### Testing Strategy
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows
- Performance testing for form rendering

---

*This forms system represents Phase 1 of the InboxSquire Forms feature, providing a solid foundation for the AI enhancements planned in Phase 2.* 