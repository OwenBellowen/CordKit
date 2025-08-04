#!/bin/bash

# CordKit NPM Release Preparation Script

echo "🚀 Preparing CordKit for NPM publication..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Run linting
echo "🔍 Running linter..."
bun run lint

# Build the project
echo "🔨 Building project..."
bun run build

# Test the built CLI
echo "🧪 Testing built CLI..."
node dist/index.js --help

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Commit all changes: git add . && git commit -m 'Prepare v1.5.0 for NPM'"
    echo "2. Push to GitHub: git push origin main"
    echo "3. Create and push tag: git tag v1.5.0 && git push origin v1.5.0"
    echo "4. Publish to NPM: npm publish"
    echo ""
    echo "🎉 CordKit is ready for publication!"
else
    echo "❌ Build failed. Please fix errors before publishing."
    exit 1
fi
