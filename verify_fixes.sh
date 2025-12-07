#!/bin/bash
# FaceSense Project - Verification & Testing Script
# Run this script to verify all changes are correctly applied

echo "🔍 FaceSense Project Verification Script"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1 exists"
        return 0
    else
        echo -e "${RED}❌${NC} $1 NOT FOUND"
        return 1
    fi
}

# Function to check content in file
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $1 contains '$2'"
        return 0
    else
        echo -e "${RED}❌${NC} $1 missing '$2'"
        return 1
    fi
}

echo "📁 Checking Backend Files..."
echo "----------------------------"
check_file "backend/requirements.txt"
check_file "backend/.env"
check_file "backend/.env.example"
check_file "backend/app/core/config.py"
check_file "backend/app/auth.py"
check_file "backend/app/students.py"
check_file "backend/app/attendance.py"
check_file "backend/app/analytics.py"
check_file "backend/app/schemas.py"
check_file "backend/app/utils.py"
check_file "backend/app/main.py"

echo ""
echo "📁 Checking Frontend Files..."
echo "-----------------------------"
check_file "frontend/web/.env.example"
check_file "frontend/web/src/api/axios.js"
check_file "frontend/web/package.json"

echo ""
echo "📁 Checking Documentation Files..."
echo "-----------------------------------"
check_file "FIX_DOCUMENTATION.md"
check_file "DEPLOYMENT_GUIDE.md"
check_file "README_FIXES.txt"
check_file "CHANGES_SUMMARY.md"

echo ""
echo "🔍 Checking Backend Configuration..."
echo "------------------------------------"
check_content "backend/requirements.txt" "motor==3.3.2"
check_content "backend/requirements.txt" "fastapi==0.104.1"
! grep -q "sqlalchemy" "backend/requirements.txt" && echo -e "${GREEN}✅${NC} SQLAlchemy removed from dependencies" || echo -e "${RED}❌${NC} SQLAlchemy still in dependencies"

check_content "backend/app/core/config.py" "MONGO_URI"
check_content "backend/app/core/config.py" "MONGO_DB"
! grep -q "DATABASE_URL" "backend/app/core/config.py" && echo -e "${GREEN}✅${NC} SQLite DATABASE_URL removed from config" || echo -e "${RED}❌${NC} SQLite config still present"

check_content "backend/.env" "MONGO_URI"
check_content "backend/.env" "MONGO_DB"

echo ""
echo "🔍 Checking Auth Module..."
echo "---------------------------"
check_content "backend/app/auth.py" "db\[\"users\"\]"
! grep -q "AsyncSession" "backend/app/auth.py" && echo -e "${GREEN}✅${NC} SQLAlchemy AsyncSession removed from auth" || echo -e "${RED}❌${NC} Auth still uses SQLAlchemy"

echo ""
echo "🔍 Checking Students Module..."
echo "-------------------------------"
check_content "backend/app/students.py" "db\[\"students\"\]"
check_content "backend/app/students.py" "ObjectId"
! grep -q "AsyncSession" "backend/app/students.py" && echo -e "${GREEN}✅${NC} SQLAlchemy removed from students" || echo -e "${RED}❌${NC} Students still uses SQLAlchemy"

echo ""
echo "🔍 Checking Attendance Module..."
echo "--------------------------------"
check_content "backend/app/attendance.py" "db\[\"attendance\"\]"
check_content "backend/app/attendance.py" "student_name"
! grep -q "AsyncSession" "backend/app/attendance.py" && echo -e "${GREEN}✅${NC} SQLAlchemy removed from attendance" || echo -e "${RED}❌${NC} Attendance still uses SQLAlchemy"

echo ""
echo "🔍 Checking Analytics Module..."
echo "-------------------------------"
check_content "backend/app/analytics.py" "count_documents"
! grep -q "func.count" "backend/app/analytics.py" && echo -e "${GREEN}✅${NC} SQLAlchemy func.count removed" || echo -e "${RED}❌${NC} Analytics still uses SQLAlchemy"

echo ""
echo "🔍 Checking Schemas..."
echo "---------------------"
check_content "backend/app/schemas.py" "id: str"
! grep -q "id: int" "backend/app/schemas.py" && echo -e "${GREEN}✅${NC} ID types updated to string" || echo -e "${RED}❌${NC} ID types still int"

echo ""
echo "🔍 Checking Utils..."
echo "-------------------"
check_content "backend/app/utils.py" "from app.core.config import settings"
! grep -q "SECRET_KEY =" "backend/app/utils.py" && echo -e "${GREEN}✅${NC} Hardcoded secrets removed" || echo -e "${RED}❌${NC} Utils still has hardcoded secrets"

echo ""
echo "🔍 Checking Frontend API..."
echo "---------------------------"
check_content "frontend/web/src/api/axios.js" "VITE_API_BASE_URL"
check_content "frontend/web/src/api/axios.js" "import.meta.env"

echo ""
echo "=========================================="
echo "✅ Verification Complete!"
echo ""
echo "Next Steps:"
echo "1. Start MongoDB: mongod (or docker run -d -p 27017:27017 mongo:latest)"
echo "2. Install backend: cd backend && pip install -r requirements.txt"
echo "3. Start backend: python -m uvicorn app.main:app --reload"
echo "4. Install frontend: cd frontend/web && npm install"
echo "5. Start frontend: npm run dev"
echo "6. Login with: teacher1 / password123"
echo ""
echo "For detailed information, see:"
echo "  - FIX_DOCUMENTATION.md (detailed changes)"
echo "  - DEPLOYMENT_GUIDE.md (setup & deployment)"
echo "  - README_FIXES.txt (quick reference)"
echo "=========================================="
