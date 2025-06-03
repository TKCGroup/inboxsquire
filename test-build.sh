#!/bin/bash

# Test build script for Vercel deployment
echo "🔍 Testing Squire build process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf apps/web/.next
rm -rf .turbo

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run the build
echo "🔨 Building web app..."
npx turbo run build --filter=web

# Check if routes-manifest.json exists
if [ -f "apps/web/.next/routes-manifest.json" ]; then
    echo "✅ routes-manifest.json found!"
    echo "📊 Build output structure:"
    ls -la apps/web/.next/
else
    echo "❌ routes-manifest.json NOT found!"
    echo "📊 Available files in .next:"
    ls -la apps/web/.next/ || echo "No .next directory found"
    exit 1
fi

echo "🎉 Build test completed successfully!" 