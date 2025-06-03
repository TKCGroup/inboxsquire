# Vercel Configuration Verification Checklist

## 🔍 Dashboard Settings to Check

### 1. **Build & Development Settings**
Go to: `Vercel Dashboard → Project → Settings → General`

**Root Directory:** `./` (should be empty/root)
**Build Command:** Should be empty (uses vercel.json)
**Output Directory:** Should be empty (uses vercel.json)
**Install Command:** Should be empty (uses vercel.json)

### 2. **Environment Variables**
Go to: `Vercel Dashboard → Project → Settings → Environment Variables`

Required variables:
- [ ] `NEXT_PUBLIC_SUPABASE_URL` (Production, Preview, Development)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Production, Preview, Development)

### 3. **Node.js Version**
Go to: `Vercel Dashboard → Project → Settings → General`

**Node.js Version:** `18.x` (matches our vercel.json)

### 4. **Git Integration**
Go to: `Vercel Dashboard → Project → Settings → Git`

**Root Directory:** Should be empty
**Build Command Override:** Should be empty
**Output Directory Override:** Should be empty

## 🚨 Common Issues

### **Dashboard Overrides vercel.json**
If you see any values in the dashboard build settings, they override your `vercel.json`. Clear them to use your file-based config.

### **Missing Environment Variables**
Even with fallbacks in code, build process needs real Supabase credentials for:
- Database type generation
- Auth configuration validation
- API route compilation

### **Old Cache**
Vercel might cache the old failing build configuration. Force a new deployment after fixing settings.

## ✅ Verification Steps

1. [ ] All dashboard build settings are empty
2. [ ] Environment variables are set for all environments
3. [ ] Node.js version matches vercel.json (18.x)
4. [ ] Clear cache and redeploy
5. [ ] Check deployment logs for our new build command

## 🎯 Expected Success

After fixing these, your deployment logs should show:
```
Running "npm run vercel-build"
✓ Turbo build successful
✓ Next.js build complete
```

Instead of:
```
npm error No workspaces found: --workspace=apps/web
``` 