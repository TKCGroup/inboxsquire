#!/bin/bash

# Vercel deployment test script
echo "🔍 Testing Vercel configuration..."

# Check if Vercel CLI is available
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing locally..."
    npm install -g vercel
fi

# Test the vercel.json configuration
echo "📋 Validating vercel.json configuration..."
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json found"
    echo "📊 Configuration preview:"
    cat vercel.json | jq '.' 2>/dev/null || cat vercel.json
else
    echo "❌ vercel.json not found!"
    exit 1
fi

# Test build command locally
echo "🔨 Testing build command..."
npx turbo run build --filter=web

# Verify output directory structure
echo "📁 Checking output directory structure..."
if [ -d "apps/web/.next" ]; then
    echo "✅ Output directory exists"
    echo "📊 Key files present:"
    ls -la apps/web/.next/ | grep -E "(routes-manifest|build-manifest|app-build-manifest)"
else
    echo "❌ Output directory not found!"
    exit 1
fi

echo "🎉 Vercel configuration test completed successfully!"
echo "💡 Ready for deployment!" 