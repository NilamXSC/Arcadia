#!/bin/bash

echo "🚀 Arcadia Health - Deployment Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        echo "Please install $1 and try again"
        exit 1
    fi
}

echo "Checking prerequisites..."
check_tool node
check_tool npm
check_tool git

echo -e "${GREEN}✅ All prerequisites met${NC}"
echo ""

# Ask deployment target
echo "Select deployment option:"
echo "1) Deploy Backend to Render"
echo "2) Deploy Frontend to Vercel"
echo "3) Deploy Both (Render + Vercel)"
echo "4) Build for production (local)"
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo -e "${BLUE}📦 Deploying Backend to Render...${NC}"
        echo "Please follow these steps:"
        echo "1. Go to https://render.com"
        echo "2. Sign up/Login with GitHub"
        echo "3. Click 'New +' → 'Blueprint'"
        echo "4. Connect your repository"
        echo "5. Render will auto-detect render.yaml"
        echo "6. Set environment variables in dashboard"
        echo ""
        echo "render.yaml is already configured in the project root"
        ;;
    2)
        echo -e "${BLUE}📦 Deploying Frontend to Vercel...${NC}"
        cd client
        
        # Check if vercel is installed
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "Running Vercel deployment..."
        vercel --prod
        
        echo -e "${GREEN}✅ Frontend deployed!${NC}"
        ;;
    3)
        echo -e "${BLUE}📦 Deploying Full Stack...${NC}"
        echo ""
        echo "Step 1: Deploy Backend to Render"
        echo "================================"
        echo "1. Go to https://render.com"
        echo "2. Sign up/Login with GitHub"
        echo "3. Click 'New +' → 'Blueprint'"
        echo "4. Connect your repository"
        echo "5. Set environment variables"
        echo ""
        read -p "Press Enter when backend is deployed..."
        
        echo ""
        echo "Step 2: Deploy Frontend to Vercel"
        echo "=================================="
        cd client
        
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        read -p "Enter your backend URL (e.g., https://your-app.onrender.com): " backend_url
        
        echo "Setting environment variable..."
        vercel env add VITE_API_URL production
        echo $backend_url
        
        echo "Deploying frontend..."
        vercel --prod
        
        echo -e "${GREEN}✅ Full stack deployed!${NC}"
        ;;
    4)
        echo -e "${BLUE}🔨 Building for production...${NC}"
        
        # Build backend
        echo "Building backend..."
        cd server
        npm install
        echo -e "${GREEN}✅ Backend ready${NC}"
        
        # Build frontend
        echo "Building frontend..."
        cd ../client
        npm install
        npm run build
        echo -e "${GREEN}✅ Frontend built to client/dist${NC}"
        
        echo ""
        echo "Production builds complete!"
        echo "Backend: server/"
        echo "Frontend: client/dist/"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment process complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Test your deployed application"
echo "2. Set up custom domain (optional)"
echo "3. Configure monitoring"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"
