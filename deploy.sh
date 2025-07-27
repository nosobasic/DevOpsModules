#!/bin/bash

# DevOps Modules Deployment Script
# This script helps prepare your application for deployment

echo "🚀 DevOps Modules Deployment Preparation"
echo "========================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote repository is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote repository found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/your-repo.git"
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Check for environment files
echo "🔧 Checking environment configuration..."

if [ -f ".env" ]; then
    echo "⚠️  Warning: .env file found. Make sure it's in .gitignore"
else
    echo "✅ No .env file found (good for security)"
fi

# Check if .gitignore includes sensitive files
if grep -q "\.env" .gitignore; then
    echo "✅ .env files are properly ignored"
else
    echo "⚠️  Warning: .env files not in .gitignore"
fi

# Display deployment instructions
echo ""
echo "🎯 Deployment Instructions"
echo "=========================="
echo ""
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy Backend to Render:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set build command: npm install && npm run build:server"
echo "   - Set start command: npm start"
echo "   - Add environment variables (see DEPLOYMENT_GUIDE.md)"
echo ""
echo "3. Deploy Frontend to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Create new project"
echo "   - Import your GitHub repository"
echo "   - Set framework preset to Vite"
echo "   - Add environment variables (see DEPLOYMENT_GUIDE.md)"
echo ""
echo "4. Update URLs:"
echo "   - After getting your Vercel URL, update CLIENT_URL in Render"
echo "   - Redeploy the backend service"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "🔗 Useful URLs:"
echo "   - Render: https://render.com"
echo "   - Vercel: https://vercel.com"
echo "   - GitHub: https://github.com"
echo ""

# Check if all required files exist
echo "📋 Required Files Check"
echo "======================="

required_files=("package.json" "vercel.json" "render.yaml" "DEPLOYMENT_GUIDE.md")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
    fi
done

echo ""
echo "🎉 Deployment preparation complete!"
echo "Follow the instructions above to deploy your application." 