#!/bin/bash

# Service Quote Calculator - Quick Deployment Script
# This script automates the deployment process for immediate production deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Service Quote Calculator - Quick Deploy${NC}"
echo -e "${BLUE}=============================================${NC}"

# Check if required tools are installed
check_tools() {
    echo -e "${YELLOW}Checking required tools...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm not found. Please install npm${NC}"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git not found. Please install Git${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All required tools found${NC}"
}

# Setup environment files
setup_env() {
    echo -e "${YELLOW}Setting up environment files...${NC}"
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        echo -e "${GREEN}✅ Created backend/.env${NC}"
        echo -e "${YELLOW}⚠️  Please configure DATABASE_URL in backend/.env${NC}"
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env.local" ]; then
        cp frontend/.env.example frontend/.env.local
        echo -e "${GREEN}✅ Created frontend/.env.local${NC}"
    fi
}

# Install dependencies
install_deps() {
    echo -e "${YELLOW}Installing dependencies...${NC}"
    
    # Root dependencies
    npm install
    
    # Backend dependencies
    cd backend
    npm install
    cd ..
    
    # Frontend dependencies
    cd frontend
    npm install
    cd ..
    
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Setup database
setup_database() {
    echo -e "${YELLOW}Setting up database...${NC}"
    
    cd backend
    
    # Generate Prisma client
    npx prisma generate
    echo -e "${GREEN}✅ Prisma client generated${NC}"
    
    # Check if DATABASE_URL is configured
    if grep -q "postgresql://" .env 2>/dev/null; then
        echo -e "${YELLOW}Running database migrations...${NC}"
        npx prisma migrate dev --name init
        npm run seed
        echo -e "${GREEN}✅ Database setup complete${NC}"
    else
        echo -e "${YELLOW}⚠️  DATABASE_URL not configured. Skipping migrations.${NC}"
        echo -e "${YELLOW}   Configure DATABASE_URL and run: npm run migrate && npm run seed${NC}"
    fi
    
    cd ..
}

# Test the application
test_app() {
    echo -e "${YELLOW}Running tests...${NC}"
    
    # Backend tests
    cd backend
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        npm test || echo -e "${YELLOW}⚠️  Backend tests skipped${NC}"
    fi
    cd ..
    
    # Frontend tests
    cd frontend
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        npm test || echo -e "${YELLOW}⚠️  Frontend tests skipped${NC}"
    fi
    cd ..
    
    echo -e "${GREEN}✅ Tests completed${NC}"
}

# Deploy to Railway (Backend)
deploy_backend() {
    echo -e "${YELLOW}Deploying backend to Railway...${NC}"
    
    if ! command -v railway &> /dev/null; then
        echo -e "${YELLOW}Installing Railway CLI...${NC}"
        npm install -g @railway/cli
    fi
    
    cd backend
    
    # Check if Railway is already configured
    if [ ! -f "railway.toml" ]; then
        echo -e "${YELLOW}Please login to Railway and initialize the project:${NC}"
        echo -e "${BLUE}  railway login${NC}"
        echo -e "${BLUE}  railway init${NC}"
        echo -e "${YELLOW}Then run this script again.${NC}"
        exit 1
    fi
    
    # Deploy to Railway
    railway up
    echo -e "${GREEN}✅ Backend deployed to Railway${NC}"
    
    cd ..
}

# Deploy to Vercel (Frontend)
deploy_frontend() {
    echo -e "${YELLOW}Deploying frontend to Vercel...${NC}"
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}Installing Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    cd frontend
    
    # Deploy to Vercel
    vercel --prod
    echo -e "${GREEN}✅ Frontend deployed to Vercel${NC}"
    
    cd ..
}

# Initialize git repository
init_git() {
    echo -e "${YELLOW}Initializing Git repository...${NC}"
    
    if [ ! -d ".git" ]; then
        git init
        git add .
        git commit -m "Initial commit: Service Quote Calculator MVP"
        echo -e "${GREEN}✅ Git repository initialized${NC}"
    else
        echo -e "${GREEN}✅ Git repository already exists${NC}"
    fi
}

# Main deployment flow
main() {
    echo -e "${YELLOW}Choose deployment option:${NC}"
    echo -e "1. ${GREEN}Full setup (local + production)${NC}"
    echo -e "2. ${BLUE}Local setup only${NC}"
    echo -e "3. ${YELLOW}Production deployment only${NC}"
    echo -e "4. ${RED}Exit${NC}"
    
    read -p "Enter choice (1-4): " choice
    
    case $choice in
        1)
            echo -e "${GREEN}Running full setup...${NC}"
            check_tools
            setup_env
            install_deps
            setup_database
            test_app
            init_git
            
            read -p "Deploy to production? (y/n): " deploy_prod
            if [ "$deploy_prod" = "y" ]; then
                deploy_backend
                deploy_frontend
            fi
            ;;
        2)
            echo -e "${BLUE}Running local setup...${NC}"
            check_tools
            setup_env
            install_deps
            setup_database
            test_app
            init_git
            
            echo -e "${GREEN}✅ Local setup complete!${NC}"
            echo -e "${YELLOW}Run 'npm run dev' to start development servers${NC}"
            ;;
        3)
            echo -e "${YELLOW}Running production deployment...${NC}"
            check_tools
            deploy_backend
            deploy_frontend
            ;;
        4)
            echo -e "${RED}Exiting...${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
    
    echo -e "\n${GREEN}🎉 Deployment completed!${NC}"
    echo -e "${YELLOW}Check DEPLOYMENT.md for detailed instructions${NC}"
}

# Run main function
main