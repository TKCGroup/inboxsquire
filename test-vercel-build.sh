#!/bin/bash

echo "🚀 Testing Vercel Build Process Locally"
echo "======================================="

# Test install command
echo "📦 Testing install command..."
npm ci --include-workspace-root
if [ $? -ne 0 ]; then
    echo "❌ Install failed"
    exit 1
fi
echo "✅ Install successful"

# Test build command
echo "🔨 Testing build command..."
npm run vercel-build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"

# Check output directory
echo "📁 Checking output directory..."
if [ -d "apps/web/.next" ]; then
    echo "✅ Output directory exists: apps/web/.next"
    ls -la apps/web/.next/
else
    echo "❌ Output directory missing: apps/web/.next"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Deployment should work."
echo ""
echo "📋 Summary of fixes made:"
echo "  1. Fixed vercel.json buildCommand from 'npm run build --workspace=apps/web' to 'npm run vercel-build'"
echo "  2. Updated Next.js from 14.2.15 to 14.2.29 (security fix)"
echo "  3. Regenerated package-lock.json"
echo "  4. Verified workspace configuration works with Turbo" 