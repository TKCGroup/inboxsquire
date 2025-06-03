#!/bin/bash

echo "🧹 Clearing Vercel Cache and Forcing Fresh Deployment"
echo "======================================================"

echo "1. 🗑️  Removing local Vercel cache..."
rm -rf .vercel

echo "2. 🔄 Force deploying to clear remote cache..."
npx vercel --prod --force

echo ""
echo "💡 Additional steps to do manually:"
echo "   1. Go to Vercel Dashboard → Settings → Environment Variables"
echo "   2. Add: NEXT_PUBLIC_SUPABASE_URL"
echo "   3. Add: NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   4. Redeploy from GitHub"
echo ""
echo "🎯 This should fix any caching issues!" 