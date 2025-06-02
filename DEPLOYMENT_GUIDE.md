# InboxSquire Production Deployment Guide

Complete guide for deploying InboxSquire Forms system to production using Vercel + GitHub CICD.

## 🚀 Pre-Deployment Checklist

### ✅ Code Readiness
- [x] **Monorepo Structure**: Turbo-powered with proper `apps/`, `functions/`, `infra/`
- [x] **Vercel Configuration**: `vercel.json` configured for Next.js monorepo
- [x] **Build Configuration**: `turbo.json` with proper build tasks
- [x] **Forms System**: Complete Phase 1 implementation
- [x] **TypeScript Types**: Full type safety implemented
- [x] **Database Schema**: Supabase migration ready

### 🔧 Required Configurations

#### 1. Environment Variables (Production)
Create these in Vercel dashboard:

```bash
# Supabase Configuration (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Optional: Custom Domain for Forms
NEXT_PUBLIC_FORM_BASE_URL=https://inboxsquire.com

# Optional: Analytics & Monitoring
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

#### 2. Supabase Production Setup
- [ ] Create production Supabase project
- [ ] Apply forms migration: `20250102120000_create_forms_tables.sql`
- [ ] Configure Row Level Security (RLS) policies
- [ ] Set up authentication (Gmail OAuth for users)
- [ ] Generate production API keys

#### 3. GitHub Repository Setup
- [ ] Ensure repository is public/accessible to Vercel
- [ ] Main branch contains latest forms system code
- [ ] All dependencies properly committed
- [ ] `.env.local.example` file created for reference

## 📋 Step-by-Step Deployment

### Step 1: Prepare Supabase Production

1. **Create Production Project**
   ```bash
   # Login to Supabase
   npx supabase login
   
   # Create new project (or use existing)
   npx supabase projects create inboxsquire-prod
   ```

2. **Apply Database Migration**
   ```bash
   # Navigate to infra directory
   cd infra/supabase
   
   # Apply migration to production
   npx supabase db push --project-ref YOUR_PROJECT_REF
   ```

3. **Get Production Keys**
   - Go to Supabase Dashboard → Project Settings → API
   - Copy `Project URL` and `anon public` key
   - Copy `service_role` key (keep secret!)

### Step 2: Connect GitHub to Vercel

1. **Import Project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub repository
   - Select the InboxSquire repository

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build --workspace=web
   Output Directory: apps/web/.next
   Install Command: npm install
   ```

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all production environment variables
   - Ensure they're set for "Production" environment

### Step 3: Domain Configuration

1. **Add Custom Domain**
   - In Vercel dashboard → Domains
   - Add `inboxsquire.com` (or your domain)
   - Configure DNS records as instructed

2. **SSL Certificate**
   - Vercel automatically provides SSL
   - Verify HTTPS is working

### Step 4: Test Deployment

1. **Trigger Deployment**
   ```bash
   # Push to main branch triggers automatic deployment
   git push origin main
   ```

2. **Verify Functionality**
   - [ ] Landing page loads correctly
   - [ ] Forms dashboard accessible at `/dashboard/forms`
   - [ ] Can create forms via API
   - [ ] Public forms render at `/forms/[token]`
   - [ ] Form submissions work end-to-end
   - [ ] Database connections working
   - [ ] Authentication flows (if implemented)

## 🔧 Build Optimization

### Update Vercel Configuration
Our current `vercel.json` is good, but let's enhance it:

```json
{
  "version": 2,
  "framework": "nextjs",
  "installCommand": "npm install",
  "buildCommand": "npm run build --workspace=web",
  "outputDirectory": "apps/web/.next",
  "env": {
    "NODE_VERSION": "18.x"
  },
  "functions": {
    "apps/web/.next/server/pages/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/forms/:token*",
      "destination": "/apps/web/forms/:token*"
    }
  ]
}
```

### Performance Optimizations

1. **Next.js Configuration**
   ```typescript
   // apps/web/next.config.js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     experimental: {
       turbopack: true
     },
     images: {
       domains: ['your-domain.com'],
       formats: ['image/webp', 'image/avif']
     },
     async headers() {
       return [
         {
           source: '/api/(.*)',
           headers: [
             { key: 'Cache-Control', value: 's-maxage=86400, stale-while-revalidate' }
           ]
         }
       ]
     }
   }
   
   module.exports = nextConfig
   ```

## 📊 Monitoring & Analytics

### Error Tracking Setup

1. **Vercel Analytics** (Built-in)
   ```bash
   npm install @vercel/analytics
   ```
   
   ```typescript
   // apps/web/src/app/layout.tsx
   import { Analytics } from '@vercel/analytics/react'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   ```

2. **Sentry Integration** (Optional)
   ```bash
   npm install @sentry/nextjs
   ```

### Health Checks

Create a health check endpoint:

```typescript
// apps/web/src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Test database connection
    const { data, error } = await supabase
      .from('forms')
      .select('count(*)')
      .limit(1)
    
    if (error) throw error
    
    return NextResponse.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    )
  }
}
```

## 🚨 Security Considerations

### Production Security Checklist

- [ ] **Environment Variables**: All secrets properly configured in Vercel
- [ ] **Supabase RLS**: Row Level Security policies active
- [ ] **API Rate Limiting**: Consider implementing rate limiting
- [ ] **CORS Configuration**: Properly configured for production domain
- [ ] **Input Validation**: All form inputs validated and sanitized
- [ ] **Error Messages**: No sensitive information leaked in errors

### Security Headers

```typescript
// apps/web/next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

## 🔄 CICD Pipeline

### Automatic Deployment Flow

1. **Push to GitHub** → Triggers Vercel build
2. **Vercel Build** → Runs `npm run build --workspace=web`
3. **Deploy** → Automatically deploys to production URL
4. **DNS Update** → Updates custom domain

### Branch-based Deployments

- `main` → Production deployment (`inboxsquire.com`)
- `staging` → Preview deployment (`staging-inboxsquire.vercel.app`)
- Feature branches → Automatic preview deployments

## 📈 Post-Deployment Tasks

### Immediate Verification

1. **Smoke Tests**
   - [ ] Homepage loads
   - [ ] Forms system accessible
   - [ ] Database operations working
   - [ ] Form creation and submission

2. **Performance Check**
   - [ ] Lighthouse score >90
   - [ ] Page load times <3s
   - [ ] API response times <500ms

3. **SEO & Analytics**
   - [ ] Meta tags configured
   - [ ] Analytics tracking active
   - [ ] Search console setup

### Ongoing Monitoring

- Set up Vercel alerts for deployment failures
- Monitor Supabase usage and performance
- Track form usage analytics
- Monitor error rates and performance

---

## 🎯 Quick Deployment Commands

```bash
# 1. Ensure environment is ready
npm install
npm run build

# 2. Connect to Vercel (first time only)
npx vercel login
npx vercel --prod

# 3. Future deployments (automatic via GitHub)
git push origin main
```

## 📞 Support & Troubleshooting

### Common Issues

1. **Build Failures**: Check `package.json` workspace configuration
2. **Database Connection**: Verify Supabase environment variables
3. **Form Rendering**: Check Next.js routing and API endpoints
4. **Authentication**: Ensure Supabase auth configuration

### Debug Commands

```bash
# Local build test
npm run build --workspace=web

# Check dependencies
npm list --workspace=web

# Vercel logs
npx vercel logs
```

---

**🚀 Ready for Production!** The InboxSquire Forms system is fully prepared for production deployment with this comprehensive setup. 