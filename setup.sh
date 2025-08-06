#!/bin/bash

# Vantage Vertical - Quick Setup Script
# This script automates the initial setup process

echo "🚁 Welcome to Vantage Vertical Setup!"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not detected on your system."
    echo ""
    echo "   📋 You have two options:"
    echo "   1. 💻 Install MongoDB locally (recommended for development)"
    echo "   2. ☁️  Use MongoDB Atlas (cloud database - free tier available)"
    echo ""
    echo "   📖 See MONGODB_SETUP.md for detailed installation instructions"
    echo "   🌐 Quick links:"
    echo "      • Local: https://www.mongodb.com/try/download/community"
    echo "      • Cloud: https://www.mongodb.com/atlas"
    echo ""
    echo "   ⚡ Quick install (Ubuntu/Debian):"
    echo "      wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -"
    echo "      echo 'deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse' | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list"
    echo "      sudo apt-get update && sudo apt-get install -y mongodb-org"
    echo "      sudo systemctl start mongod"
    echo ""
else
    echo "✅ MongoDB detected: $(mongod --version | head -n1)"
    
    # Check if MongoDB is running
    if pgrep mongod > /dev/null; then
        echo "✅ MongoDB service is running"
    else
        echo "⚠️  MongoDB is installed but not running"
        echo "   Start it with: sudo systemctl start mongod"
    fi
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install root dependencies
echo ""
echo "📦 Installing root dependencies..."
npm install

# Fix any security vulnerabilities in root
echo "🔒 Fixing security vulnerabilities in root..."
npm audit fix --silent

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Note about frontend vulnerabilities
echo "ℹ️  Note: Some frontend vulnerabilities are in development dependencies"
echo "   and are not critical for production builds."

cd ..

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Fix backend vulnerabilities
echo "🔒 Fixing backend security vulnerabilities..."
npm audit fix --silent

cd ..

# Setup environment files
echo ""
echo "🔧 Setting up environment files..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created root .env file"
else
    echo "ℹ️  Root .env file already exists"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend .env file"
else
    echo "ℹ️  Frontend .env file already exists"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend .env file"
else
    echo "ℹ️  Backend .env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. 🗄️  Start MongoDB service:"
echo "   • Windows: mongod"
echo "   • macOS: brew services start mongodb-community"
echo "   • Linux: sudo systemctl start mongod"
echo "   • Or use MongoDB Atlas (cloud database)"
echo ""
echo "2. ⚙️  Review and update the .env files:"
echo "   • .env (root configuration)"
echo "   • frontend/.env (React app settings)"
echo "   • backend/.env (API server settings)"
echo ""
echo "3. 🚀 Start the development servers:"
echo "   npm start"
echo ""
echo "4. 🌐 Access your application:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend API: http://localhost:5000"
echo "   • Health check: http://localhost:5000/health"
echo ""
echo "📚 For more information, check the README.md file"
echo "🐛 If you encounter issues, see CONTRIBUTING.md for troubleshooting"
echo ""
echo "Happy coding! 🚀"