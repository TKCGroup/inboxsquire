# 🚀 Deployment Setup Guide

## Overview

This guide covers deploying the Squire monorepo to Vercel with GitHub integration, leveraging Turborepo's caching for fast builds.

## 🏗️ Build Process

### Monorepo Structure
```
squire/
├── apps/
│   ├── web/          # Next.js 14 main application
│   └── extension/    # Browser extension (basic build)
├── functions/        # Serverless functions
├── infra/           # Infrastructure config
└── turbo.json       # Turborepo configuration
```

### Build Pipeline
- **Turborepo**: Orchestrates builds with intelligent caching
- **Next.js**: Production optimization with static generation
- **Bundle Analysis**: ~190kB main app, ~170kB dashboard
- **Performance**: Sub-100ms cached builds

## 🔧 Environment Setup

### Required Environment Variables

#### Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Vercel Configuration
```env
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

#### Optional: Turborepo Remote Caching
```env
TURBO_TOKEN=your-turbo-token
TURBO_TEAM=your-team-name
```

## 📦 Vercel Deployment

### 1. Project Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project (run from root)
vercel link
```

### 2. Configure Build Settings

The `vercel.json` is already configured with:
- **Root Directory**: `apps/web`
- **Build Command**: `cd apps/web && npm run build`
- **Output Directory**: `apps/web/.next`
- **Node.js Version**: 18.x

### 3. Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Deploy

```bash
# Production deployment
vercel --prod

# Preview deployment
vercel
```

## 🔄 GitHub Integration

### 1. Repository Setup

```bash
# Initialize Git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Add GitHub remote
git remote add origin https://github.com/username/squire.git
git push -u origin main
```

### 2. GitHub Secrets

Add these secrets in GitHub → Settings → Secrets and variables → Actions:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
TURBO_TOKEN (optional)
TURBO_TEAM (optional)
```

### 3. Automatic Deployments

The GitHub Actions workflow (`.github/workflows/ci.yml`) will:
- ✅ Run builds and tests on every PR
- 🚀 Deploy preview environments for PRs
- 🎯 Deploy to production on main branch pushes

## 🏃‍♂️ Quick Deploy Commands

### Local Development
```bash
npm run dev          # Start development servers
npm run build        # Build all packages
npm run lint         # Lint all packages
```

### Production Deployment
```bash
# Option 1: Direct Vercel deployment
vercel --prod

# Option 2: Git-based deployment
git add .
git commit -m "Deploy to production"
git push origin main  # Triggers automatic deployment
```

## 🔍 Monitoring & Health Checks

### Health Endpoint
- **URL**: `/api/health`
- **Purpose**: Database connectivity and system status
- **Fixed**: Corrected Supabase count query syntax

### Build Monitoring
- **Vercel Dashboard**: Real-time deployment status
- **GitHub Actions**: Build logs and test results
- **Bundle Analyzer**: Performance tracking

## 🚀 Performance Optimizations

### Current Metrics
- **Build Time**: 78ms (cached) / 515ms (fresh)
- **Bundle Size**: 87.2kB shared chunks
- **Routes**: Mix of static (○) and dynamic (ƒ)
- **First Load JS**: <200kB for all pages

### Optimization Features
- **Turborepo Caching**: Massive build speed improvements
- **Static Generation**: Pre-rendered pages where possible
- **Code Splitting**: Route-based bundle splitting
- **Tree Shaking**: Unused code elimination

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

#### Health Check Errors
- ✅ Fixed: Supabase count query syntax
- Ensure database connection is available
- Check environment variables

#### Deployment Issues
- Verify `vercel.json` configuration
- Check environment variables in Vercel
- Review build logs in Vercel dashboard

### Debug Commands
```bash
# Local build debugging
npm run build 2>&1 | tee build.log

# Vercel deployment debugging
vercel logs

# Check deployment status
vercel inspect
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Build passes locally
- [ ] Tests passing
- [ ] Performance metrics acceptable

### Production Deployment
- [ ] GitHub repository connected
- [ ] Vercel project configured
- [ ] Domain configured (if custom)
- [ ] SSL certificate active
- [ ] Health checks passing

### Post-Deployment
- [ ] Functionality testing
- [ ] Performance monitoring
- [ ] Error tracking setup
- [ ] Analytics configured
- [ ] Backup procedures verified

---

## 🎉 Next Steps

1. **Complete this deployment setup**
2. **Set up custom domain** (if needed)
3. **Configure monitoring** (error tracking, analytics)
4. **Implement CI/CD optimizations**
5. **Scale infrastructure** as needed

Your Squire application is now ready for production deployment with professional CI/CD practices! 🚀 