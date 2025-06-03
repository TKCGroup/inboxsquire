# InboxSquire Forms - Feature Specification

> **Value-Add Feature:** AI-Powered Dynamic Forms for InboxSquire Users  
> **Positioning:** "Lightweight, AI-enabled Typeform alternative for busy executives"  
> **Business Model:** Free for all InboxSquire subscribers, viral marketing via "Powered by InboxSquire"

---

## 🎯 **Strategic Overview**

### **Core Value Proposition**
*"Skip the back-and-forth emails. Create professional requirement forms in 60 seconds, powered by the same AI that manages your inbox."*

### **Target Personas**
- **Primary:** InboxSquire users (executives, founders, decision-makers)
- **Secondary:** Their prospects/partners who fill out forms (viral exposure)
- **Use Cases:** Vendor evaluation, partnership discussions, due diligence, event planning, customer research, hiring, project requirements

### **Business Benefits**
- **User Retention:** Increased stickiness with additional value
- **Viral Marketing:** Every shared form = InboxSquire brand exposure
- **Competitive Differentiation:** No other email tools offer this
- **Lead Generation:** Form respondents become potential prospects
- **Platform Expansion:** Positions InboxSquire as complete productivity suite
- **Premium Revenue:** AI form generation as paid feature drives subscription upgrades
- **Time Savings:** Users create professional forms in 30 seconds vs 30 minutes

---

## 📋 **Phase 1: Core Token-Based Forms System**

*Target: MVP for immediate user value and viral marketing*

### **1.1 Core Features**

#### **Form Creation Dashboard**
- **Location:** New "Forms" section in InboxSquire user dashboard
- **Creation Flow:**
  1. Click "Create New Form"
  2. Choose template or start blank
  3. Add/edit questions (drag & drop)
  4. Customize branding (company name, colors)
  5. Generate shareable token URL
- **Form Types:**
  - Contact & Company Information
  - Requirements Gathering
  - Vendor Evaluation
  - Partnership Assessment
  - Custom (blank template)

#### **Token-Based URL System**
```
inboxsquire.com/forms/[token]
```
- **Token Generation:** 8-character alphanumeric (e.g., `abc12def`)
- **Custom Aliases:** Optional user-defined aliases (e.g., `vendor-eval-2024`)
- **Expiration:** Optional expiration dates
- **Usage Tracking:** View count, completion rate, last accessed

#### **Form Builder Interface**
- **Question Types:**
  - Text input (short/long)
  - Multiple choice (single/multi-select)
  - Dropdown menus
  - Number input
  - Date/time picker
  - File upload
  - Rating scales
  - Yes/No toggles
- **Logic Features:**
  - Required/optional fields
  - Conditional questions (if X then show Y)
  - Question grouping/sections
  - Progress indicators

#### **Branding & Customization**
- **User Branding:**
  - Company name and logo
  - Custom header message
  - Brand colors (primary/secondary)
  - Custom thank you message
- **InboxSquire Attribution:**
  - Tasteful "Powered by InboxSquire" footer
  - Link to InboxSquire landing page
  - Consistent across all forms

#### **Response Management**
- **Dashboard View:**
  - All forms with response counts
  - Recent submissions
  - Pending/completed status
- **Individual Form Analytics:**
  - Response list with timestamps
  - Export to CSV/PDF
  - Response filtering and search
- **Notifications:**
  - Email alerts on new submissions
  - Daily/weekly digest options
  - High-priority response flagging

### **1.2 Technical Architecture**

#### **Database Schema (Supabase)**
```sql
-- Forms table
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  token TEXT UNIQUE NOT NULL,
  custom_alias TEXT,
  template_type TEXT,
  questions JSONB NOT NULL,
  branding JSONB,
  settings JSONB,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form responses table
CREATE TABLE form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES forms(id),
  respondent_email TEXT,
  respondent_name TEXT,
  response_data JSONB NOT NULL,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form analytics table
CREATE TABLE form_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES forms(id),
  event_type TEXT, -- 'view', 'start', 'complete', 'abandon'
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **API Routes**
```
/api/forms                    # CRUD operations for forms
/api/forms/[token]           # Public form rendering
/api/forms/[token]/submit    # Form submission
/api/forms/[token]/analytics # Form analytics
/api/forms/ai-generate       # NEW: AI form generation (paid feature)
/api/templates               # Form templates
```

#### **File Structure**
```
apps/web/src/
├── app/
│   ├── forms/
│   │   └── [token]/
│   │       └── page.tsx     # Public form rendering
│   ├── dashboard/
│   │   └── forms/
│   │       ├── page.tsx     # Forms management dashboard
│   │       ├── create/
│   │       ├── [id]/
│   │       └── analytics/
│   └── api/
│       └── forms/
│           └── ai-generate/
│               └── route.ts # AI form generation endpoint
├── components/
│   ├── forms/
│   │   ├── FormBuilder.tsx
│   │   ├── FormRenderer.tsx
│   │   ├── AIFormGenerator.tsx  # NEW: AI prompt interface
│   │   ├── QuestionTypes/
│   │   └── Analytics/
```

### **1.3 User Experience Flow**

#### **Form Creator Flow**
1. **Dashboard:** User sees "Forms" tab in navigation
2. **Create:** Click "New Form" → Choose template or blank
3. **Build:** Drag-and-drop questions, customize branding
4. **Configure:** Set expiration, notifications, access settings
5. **Generate:** Get shareable URL with token
6. **Share:** Copy link and send to prospects/partners

#### **Form Respondent Flow**
1. **Access:** Click `inboxsquire.com/forms/abc123`
2. **Landing:** See branded form with progress indicator
3. **Complete:** Fill out questions with smart validation
4. **Submit:** Confirmation page with next steps
5. **Follow-up:** Optional email confirmation to respondent

#### **Response Management Flow**
1. **Notification:** User gets email/dashboard alert
2. **Review:** Access responses in dashboard
3. **Analyze:** View response data and analytics
4. **Export:** Download CSV/PDF for further processing
5. **Follow-up:** Contact respondents based on responses

### **1.4 Templates & Question Banks**

#### **Pre-built Templates**
- **Vendor Evaluation:**
  - Company information
  - Security practices
  - Compliance certifications
  - Integration capabilities
  - Pricing and support
- **Partnership Assessment:**
  - Company overview
  - Partnership model
  - Technical capabilities
  - Market presence
  - Success metrics
- **Due Diligence:**
  - Financial information
  - Legal structure
  - Operational metrics
  - Risk factors
  - Growth projections
- **Customer Research:**
  - Current solutions
  - Pain points
  - Requirements
  - Budget and timeline
  - Decision process

#### **Question Library**
- **Common Questions:** Pre-written, tested questions by category
- **Industry-Specific:** Questions tailored to different verticals
- **Compliance:** GDPR, SOC2, HIPAA related questions
- **Technical:** API capabilities, security, scalability

---

## 🤖 **Phase 2: AI-Enabled Enhancements**

*Target: Advanced AI features for intelligent form creation and analysis*

### **2.1 AI-Powered Form Creation**

#### **🎯 AI Prompt-to-Form Generation (PRIORITY - Paid Feature)**
- **Natural Language Interface:** "Create a vendor evaluation form for enterprise software" → Complete form with 12-15 relevant questions
- **Gemini-2.5-Flash Integration:** Cost-effective AI model for form generation (cheapest option available)
- **Built-in UI Component:** Integrated directly into FormBuilder with a "Generate with AI" modal
- **Smart Question Types:** AI automatically selects appropriate question types (text, select, radio, rating, etc.)
- **Professional Formatting:** Generated forms include proper structure, descriptions, and validation rules
- **Instant Preview:** Real-time preview of AI-generated form with ability to edit before saving
- **Usage Examples:**
  - "Build a customer research survey for SaaS companies"
  - "Create a due diligence questionnaire for startup investments" 
  - "Generate a partnership evaluation form with security questions"
  - "Make an employee onboarding form for remote teams"

#### **Smart Template Suggestions**
- **Intent Detection:** "I need to evaluate vendors" → Suggests vendor evaluation template
- **Context Awareness:** Based on user's industry/role → Tailored suggestions
- **Question Recommendations:** AI suggests relevant questions based on form purpose

#### **Dynamic Question Generation**
- **Natural Language Input:** "I need to know about their security practices"
- **AI Question Creation:** Generates multiple relevant security questions
- **Question Optimization:** Improves question clarity and response rates

#### **Intelligent Conditional Logic**
- **Auto-Logic Creation:** AI suggests when to show/hide questions
- **Smart Branching:** Dynamic paths based on previous responses
- **Personalization:** Adapt questions based on respondent profile

### **2.2 AI-Enhanced Response Analysis**

#### **Response Intelligence**
- **Auto-Summarization:** AI generates executive summaries of responses
- **Key Insights Extraction:** Highlights important information and red flags
- **Sentiment Analysis:** Gauges respondent enthusiasm and concerns
- **Comparison Analysis:** Compare responses across similar forms

#### **Smart Categorization**
- **Auto-Tagging:** Categorize responses by priority, industry, size, etc.
- **Risk Assessment:** Flag potential concerns or compliance issues
- **Opportunity Scoring:** Rate prospects based on fit and potential
- **Follow-up Suggestions:** AI recommends next steps based on responses

#### **Response Quality Enhancement**
- **Incomplete Response Handling:** Smart follow-up for partial submissions
- **Clarification Requests:** AI identifies vague responses needing follow-up
- **Data Enrichment:** Supplement responses with public data (company info, news, etc.)

### **2.3 Intelligent Form Optimization**

#### **Performance Analytics**
- **Completion Rate Analysis:** Identify questions causing drop-offs
- **Response Quality Metrics:** Flag low-quality or inconsistent responses
- **A/B Testing:** AI suggests form variations to test
- **Optimization Recommendations:** Improve forms based on performance data

#### **Dynamic Form Adaptation**
- **Real-time Adjustments:** Modify questions based on response patterns
- **Personalized Experiences:** Adapt form based on respondent's company/role
- **Smart Defaults:** Pre-fill fields based on available information
- **Progressive Profiling:** Gradually collect information across multiple interactions

### **2.4 Integration with InboxSquire Core**

#### **Email Classification Enhancement**
- **Form Context:** Use form responses to better classify emails from respondents
- **Priority Scoring:** Emails from high-scoring form respondents get priority
- **Auto-Labeling:** Tag emails based on form submission data

#### **Unified Contact Intelligence**
- **Contact Enrichment:** Merge form data with email interaction history
- **Relationship Mapping:** Track entire relationship lifecycle
- **Communication Insights:** AI analysis of both email and form interactions

---

## 📊 **Success Metrics & KPIs**

### **Phase 1 Metrics**
- **Adoption:** % of InboxSquire users who create forms
- **Usage:** Average forms created per user per month
- **Viral Reach:** Unique visitors to public forms
- **Completion Rate:** % of form views that result in submissions
- **User Satisfaction:** NPS score for forms feature

### **Phase 2 Metrics**
- **AI Accuracy:** Quality of AI-generated questions/insights
- **Time Savings:** Reduction in form creation time with AI
- **Response Quality:** Improvement in response completeness/quality
- **Insight Value:** User ratings of AI-generated insights
- **Conversion Impact:** Correlation between AI insights and successful outcomes

---

## 🚀 **Implementation Timeline**

### **Phase 1: Core System (8-12 weeks) - COMPLETED** ✅
- **✅ Week 1-2:** Database schema and API foundation
- **✅ Week 3-4:** Form builder interface (Advanced FormBuilder component)
- **✅ Week 5-6:** Public form rendering and submission
- **✅ Week 7-8:** Response management dashboard
- **✅ Week 9-10:** Templates and question library
- **✅ Week 11-12:** Testing, polish, and launch

### **Phase 1.5: AI Form Generation (2-3 weeks) - NEXT PRIORITY** 🎯
- **Week 1:** AI form generation API with Gemini-2.5-Flash integration
- **Week 2:** AI form generator UI component and FormBuilder integration
- **Week 3:** Testing, paid feature gates, and user onboarding

### **Phase 2: Advanced AI Features (8-12 weeks)**
- **Week 1-3:** Response intelligence and auto-analysis
- **Week 4-6:** Form optimization recommendations
- **Week 7-9:** Smart conditional logic generation
- **Week 10-12:** Advanced integrations and enterprise features

---

## 💼 **Business Considerations**

### **Pricing Strategy**
- **Core Forms:** Free for all InboxSquire subscribers (basic form creation)
- **AI Form Generation:** Premium feature for paid subscribers only
- **Usage limits:** 5 AI generations/month for Pro, 25/month for Enterprise
- **Advanced features:** Analytics, integrations, and unlimited AI generations for higher tiers
- **Freemium Hook:** Free users see "Generate with AI" but must upgrade to use

### **Competitive Positioning**
- **vs. Typeform:** More AI-powered, integrated with email workflow
- **vs. Google Forms:** Professional branding, better analytics
- **vs. JotForm:** Simpler for executives, InboxSquire ecosystem integration

### **Risk Mitigation**
- **Data Security:** Enterprise-grade security for sensitive form data
- **Compliance:** GDPR, CCPA compliance for international users
- **Abuse Prevention:** Rate limiting, spam detection, content moderation
- **Performance:** Scalable infrastructure for viral growth

---

## 🎯 **Next Steps**

### **Immediate Actions (Phase 1.5 - AI Form Generation)**
1. **✅ Core System Complete:** All Phase 1 functionality is operational
2. **🚀 Priority Implementation:** AI form generation with Gemini-2.5-Flash
3. **💰 Monetization Setup:** Implement paid feature gates and usage tracking
4. **🎨 UI Integration:** Seamless AI generation within existing FormBuilder

### **Technical Implementation Plan**
1. **Backend API:** `/api/forms/ai-generate` endpoint with Gemini integration
2. **Frontend Component:** `AIFormGenerator.tsx` with prompt interface and loading states
3. **FormBuilder Integration:** "Generate with AI" button in existing UI
4. **User Experience:** Instant preview → edit → save workflow
5. **Billing Integration:** Usage tracking and subscription tier validation

### **Success Metrics (90-day AI Feature)**
- **Conversion Rate:** % of free users who upgrade to use AI generation
- **Generation Success:** >85% of AI-generated forms are saved and used
- **Time Savings:** <30 seconds average generation time vs >15 minutes manual
- **User Satisfaction:** >4.5/5 rating for AI-generated form quality
- **Revenue Impact:** AI feature drives 15%+ increase in paid subscriptions

---

## 🛠️ **Technical Implementation Details - AI Form Generation**

### **Backend Implementation**

#### **API Endpoint Structure**
```typescript
// POST /api/forms/ai-generate
interface AIGenerateRequest {
  prompt: string
  formType?: 'survey' | 'evaluation' | 'questionnaire' | 'onboarding'
  targetAudience?: string
  estimatedLength?: 'short' | 'medium' | 'long'
}

interface AIGenerateResponse {
  success: boolean
  form: FormData
  generationId: string
  tokensUsed: number
  suggestions?: string[]
}
```

#### **Gemini Integration**
```typescript
// Using Gemini-2.5-Flash for cost optimization
const geminiPrompt = `
Create a professional form based on this request: "${prompt}"

Requirements:
- Generate 8-15 relevant questions
- Use appropriate question types (text, select, radio, checkbox, rating)
- Include proper validation and required fields
- Add helpful descriptions and placeholders
- Structure with logical flow and grouping

Return a JSON structure matching the FormData interface.
`
```

### **Frontend Implementation**

#### **AI Form Generator Component**
```tsx
// components/forms/AIFormGenerator.tsx
interface AIFormGeneratorProps {
  onFormGenerated: (form: FormData) => void
  userPlan: 'free' | 'pro' | 'enterprise'
  remainingGenerations: number
}

export function AIFormGenerator({ onFormGenerated, userPlan, remainingGenerations }) {
  // Prompt interface with real-time character count
  // Loading states with progress indicators
  // Preview modal with edit capabilities
  // Upgrade prompts for free users
}
```

#### **FormBuilder Integration**
```tsx
// Enhanced FormBuilder with AI generation
export function FormBuilder({ initialForm, onSave }: FormBuilderProps) {
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  
  // Add "Generate with AI" button to existing UI
  // Seamless integration with current drag-and-drop builder
  // Preserve existing functionality while adding AI capabilities
}
```

### **User Experience Flow**

#### **AI Generation Process**
1. **Access:** User clicks "Generate with AI" in FormBuilder
2. **Authentication:** Check subscription tier and remaining generations
3. **Prompt Input:** User enters natural language description
4. **Generation:** Show loading with estimated time (15-30 seconds)
5. **Preview:** Display generated form with edit options
6. **Integration:** Merge with existing FormBuilder state
7. **Save:** Standard form save process with AI generation tracking

#### **Upgrade Flow for Free Users**
1. **Feature Discovery:** Show "Generate with AI" button with lock icon
2. **Upgrade Prompt:** Modal explaining AI benefits and pricing
3. **Conversion:** Direct link to subscription upgrade
4. **Immediate Access:** Unlock feature upon successful payment

### **Cost & Performance Optimization**

#### **Gemini-2.5-Flash Advantages**
- **Cost:** ~90% cheaper than GPT-4 for form generation
- **Speed:** 2-3x faster response times
- **Quality:** Excellent for structured content generation
- **Reliability:** High success rate for JSON output formatting

#### **Caching Strategy**
```typescript
// Cache common form patterns to reduce API calls
interface FormCache {
  promptHash: string
  generatedForm: FormData
  createdAt: Date
  usageCount: number
}
```

### **Monetization & Usage Tracking**

#### **Billing Integration**
```sql
-- Track AI usage for billing
CREATE TABLE ai_form_generations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  prompt TEXT NOT NULL,
  tokens_used INTEGER,
  generation_time_ms INTEGER,
  success BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Usage Limits**
- **Free Users:** See feature but must upgrade
- **Pro Users:** 5 generations per month
- **Enterprise Users:** 25 generations per month
- **Overage:** Additional generations at $0.50 each

---

*This feature positions InboxSquire as a complete communication productivity platform while creating viral marketing opportunities through every shared form.* 