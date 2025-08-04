# CordKit Publishing Setup Guide

This guide helps you set up automatic publishing to NPM when pushing to GitHub.

## 🚀 Quick Setup

### 1. **Prepare GitHub Repository**

```bash
# Initialize git if not already done
git init
git add .
git commit -m "feat: initial CordKit v1.5.0 release"
git branch -M main

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/cordkit.git
git push -u origin main
```

### 2. **Create NPM Account & Token**

1. Sign up at [npmjs.com](https://npmjs.com)
2. Go to Account → Access Tokens
3. Click "Generate New Token" → **Automation**
4. Copy the token (starts with `npm_...`)

### 3. **Add NPM Token to GitHub**

1. Go to your GitHub repo → Settings → Secrets and Variables → Actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Your NPM token from step 2
5. Click "Add secret"

### 4. **Test Local Build**

```bash
# Test that everything works
bun run test:publish

# Clean up test files
bun run clean
```

## 📦 **NPX/BUNX Compatibility Results**

### ✅ **NPX Support: WORKING**

```bash
# Once published, users can run:
npx cordkit init --name my-bot --template typescript
npx cordkit@latest generate --type command --name ping
```

### ⚠️ **BUNX Support: LIMITED**

```bash
# Bunx works differently - will work once published:
bunx cordkit init --name my-bot
bunx cordkit@latest --help
```

**Note**: Local tarball testing with bunx has limitations, but published packages work fine.

## 🔄 **Publishing Workflow**

### **Automatic Publishing (Recommended)**

```bash
# Patch release (1.5.0 → 1.5.1)
bun run version:patch

# Minor release (1.5.0 → 1.6.0)
bun run version:minor

# Major release (1.5.0 → 2.0.0)
bun run version:major

# Quick patch release
bun run release
```

### **What Happens Automatically:**

1. 📝 Updates version in package.json
2. 📌 Creates git tag (v1.5.1)
3. 🚀 Pushes to GitHub
4. 🤖 GitHub Actions builds & tests
5. 📦 Publishes to NPM
6. ✅ Available within minutes via npx/bunx

### **Manual Publishing (Backup)**

```bash
# If automatic fails, manual backup:
bun run build
npm publish
```

## 🧪 **Testing Commands**

### **Local Development**

```bash
bun run dev          # Watch mode development
bun run test         # Test CLI locally
bun run test:build   # Test built package
```

### **Pre-Publish Testing**

```bash
bun run test:publish # Full publishing simulation
npm pack            # Create tarball
npx ./cordkit-1.5.0.tgz --help  # Test npx compatibility
```

### **Post-Publish Verification**

```bash
# After publishing, test installation:
npx cordkit@latest --version
npx cordkit@latest --help
bunx cordkit@latest init --help
```

## 📋 **Checklist Before First Publish**

- [ ] GitHub repository created and linked
- [ ] NPM account created
- [ ] NPM_TOKEN added to GitHub secrets
- [ ] GitHub Actions workflow in place (`.github/workflows/publish.yml`)
- [ ] Package builds successfully (`bun run build`)
- [ ] Built package runs with Node.js (`bun run test:build`)
- [ ] NPX compatibility verified (`bun run test:npx`)
- [ ] Version scripts work (`bun run version:patch --dry-run`)
- [ ] Clean build directory (`bun run clean`)

## 🎯 **Usage After Publishing**

### **Global Installation**

```bash
npm install -g cordkit
# or
bun install -g cordkit
```

### **One-time Usage**

```bash
npx cordkit init --name my-awesome-bot
bunx cordkit generate --type slash-command --name help
```

### **Project-specific Installation**

```bash
npm install --save-dev cordkit
bun add --dev cordkit
```

## 🔧 **Troubleshooting**

### **GitHub Actions Fails**

- Check NPM_TOKEN is correctly set in GitHub secrets
- Verify package.json has correct repository URL
- Ensure all dependencies are in package.json

### **NPX Doesn't Work**

- Verify `bin` field in package.json points to `./dist/index.js`
- Check that dist/index.js starts with `#!/usr/bin/env node`
- Ensure package builds for Node.js target

### **Version Conflicts**

```bash
# Reset version if needed
git tag -d v1.5.0  # Delete local tag
git push origin --delete v1.5.0  # Delete remote tag
```

## 🚀 **Ready to Publish!**

Your CordKit package is ready for automatic publishing!

1. Run `bun run version:patch` to trigger your first release
2. Watch GitHub Actions build and publish automatically
3. Within 5-10 minutes, users can install with `npx cordkit`

---

**Need help?** Open an issue at https://github.com/YOUR_USERNAME/cordkit/issues
