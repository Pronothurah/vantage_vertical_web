#!/bin/bash

# Vantage Vertical - Next.js Setup Script
# This script automates the initial setup process for the Next.js application

echo "🚁 Welcome to Vantage Vertical Setup!"
echo "======================================"
echo "Setting up Next.js application with TypeScript and Tailwind CSS"
echo ""

# Function to compare version numbers
version_compare() {
    if [[ $1 == $2 ]]; then
        return 0
    fi
    local IFS=.
    local i ver1=($1) ver2=($2)
    # Fill empty fields in ver1 with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++)); do
        ver1[i]=0
    done
    for ((i=0; i<${#ver1[@]}; i++)); do
        if [[ -z ${ver2[i]} ]]; then
            # Fill empty fields in ver2 with zeros
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]})); then
            return 1
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]})); then
            return 2
        fi
    done
    return 0
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo ""
    echo "   📥 Please install Node.js 18.0.0 or higher:"
    echo "   • Download from: https://nodejs.org/"
    echo "   • Recommended: Use Node Version Manager (nvm)"
    echo "     - Linux/macOS: https://github.com/nvm-sh/nvm"
    echo "     - Windows: https://github.com/coreybutler/nvm-windows"
    echo ""
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | sed 's/v//')
REQUIRED_NODE_VERSION="18.0.0"

echo "🔍 Checking Node.js version..."
echo "   Current: v$NODE_VERSION"
echo "   Required: v$REQUIRED_NODE_VERSION or higher"

version_compare $NODE_VERSION $REQUIRED_NODE_VERSION
case $? in
    0) echo "✅ Node.js version is exactly the minimum required" ;;
    1) echo "✅ Node.js version meets requirements" ;;
    2) 
        echo "❌ Node.js version is too old!"
        echo ""
        echo "   📥 Please update Node.js to v$REQUIRED_NODE_VERSION or higher:"
        echo "   • Download from: https://nodejs.org/"
        echo "   • Or use nvm: nvm install --lts && nvm use --lts"
        echo ""
        exit 1
        ;;
esac

# Check npm version
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

NPM_VERSION=$(npm --version)
REQUIRED_NPM_VERSION="8.0.0"

echo "🔍 Checking npm version..."
echo "   Current: v$NPM_VERSION"
echo "   Required: v$REQUIRED_NPM_VERSION or higher"

version_compare $NPM_VERSION $REQUIRED_NPM_VERSION
case $? in
    0) echo "✅ npm version is exactly the minimum required" ;;
    1) echo "✅ npm version meets requirements" ;;
    2) 
        echo "⚠️  npm version is older than recommended"
        echo "   Consider updating: npm install -g npm@latest"
        echo "   Continuing with current version..."
        ;;
esac

echo ""
echo "🔧 Environment Information:"
echo "   Node.js: v$NODE_VERSION"
echo "   npm: v$NPM_VERSION"
echo "   Platform: $(uname -s)"
echo ""

# Check if package.json exists
if [ ! -f package.json ]; then
    echo "❌ package.json not found. Are you in the correct directory?"
    exit 1
fi

# Install dependencies
echo "📦 Installing Next.js dependencies..."
echo "   This may take a few minutes..."
echo ""

if npm install; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    echo "   Try running: npm install --verbose"
    exit 1
fi

# Run security audit and fix
echo ""
echo "🔒 Running security audit..."
if npm audit --audit-level=high; then
    echo "✅ No high-severity vulnerabilities found"
else
    echo "⚠️  Security vulnerabilities detected. Attempting to fix..."
    npm audit fix --audit-level=high
fi

# Setup environment file
echo ""
echo "🔧 Setting up environment configuration..."

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file from .env.example"
        echo "   📝 Please review and update .env with your configuration"
    else
        echo "⚠️  .env.example not found, creating basic .env file"
        cat > .env << EOF
# Next.js Environment Variables
# Copy this file to .env.local for local development

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Vantage Vertical"

# Email Configuration (Optional - for contact forms)
# SMTP_HOST=
# SMTP_PORT=587
# SMTP_USER=
# SMTP_PASS=
# CONTACT_EMAIL=info@vantagevertical.com

# Analytics (Optional)
# NEXT_PUBLIC_GA_ID=
EOF
        echo "✅ Created basic .env file"
    fi
else
    echo "ℹ️  .env file already exists"
fi

# Type checking
echo ""
echo "🔍 Running TypeScript type check..."
if npm run type-check; then
    echo "✅ TypeScript compilation successful"
else
    echo "⚠️  TypeScript errors found. Please review and fix before development."
fi

# Run tests to ensure everything is working
echo ""
echo "🧪 Running tests to verify setup..."
if npm test -- --passWithNoTests --silent; then
    echo "✅ Test suite is ready"
else
    echo "⚠️  Some tests failed. Please review test configuration."
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. 📝 Review and update environment variables:"
echo "   • Edit .env file with your configuration"
echo "   • For production, use .env.local or environment-specific files"
echo ""
echo "2. 🚀 Start the development server:"
echo "   npm run dev"
echo ""
echo "3. 🌐 Access your application:"
echo "   • Development: http://localhost:3000"
echo "   • The app will automatically reload when you make changes"
echo ""
echo "4. 🛠️  Available commands:"
echo "   • npm run dev      - Start development server"
echo "   • npm run build    - Create production build"
echo "   • npm run start    - Start production server"
echo "   • npm run lint     - Run ESLint"
echo "   • npm run test     - Run tests"
echo ""
echo "5. 📚 Additional resources:"
echo "   • README.md - Project documentation"
echo "   • CONTRIBUTING.md - Development guidelines"
echo "   • Next.js docs: https://nextjs.org/docs"
echo ""
echo "Happy coding! 🚀"