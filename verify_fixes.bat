@echo off
REM FaceSense Project - Verification & Testing Script (Windows)
REM Run this script to verify all changes are correctly applied

echo.
echo FaceSense Project Verification Script
echo ======================================
echo.

setlocal enabledelayedexpansion

REM Function to check file exists
:check_file
if exist "%~1" (
    echo [OK] %~1 exists
    goto :eof
) else (
    echo [FAIL] %~1 NOT FOUND
    goto :eof
)

echo Checking Backend Files...
echo --------------------------
call :check_file "backend\requirements.txt"
call :check_file "backend\.env"
call :check_file "backend\.env.example"
call :check_file "backend\app\core\config.py"
call :check_file "backend\app\auth.py"
call :check_file "backend\app\students.py"
call :check_file "backend\app\attendance.py"
call :check_file "backend\app\analytics.py"
call :check_file "backend\app\schemas.py"
call :check_file "backend\app\utils.py"
call :check_file "backend\app\main.py"

echo.
echo Checking Frontend Files...
echo ---------------------------
call :check_file "frontend\web\.env.example"
call :check_file "frontend\web\src\api\axios.js"
call :check_file "frontend\web\package.json"

echo.
echo Checking Documentation Files...
echo --------------------------------
call :check_file "FIX_DOCUMENTATION.md"
call :check_file "DEPLOYMENT_GUIDE.md"
call :check_file "README_FIXES.txt"
call :check_file "CHANGES_SUMMARY.md"

echo.
echo Checking Backend Configuration...
echo ----------------------------------

REM Check for motor in requirements
findstr /M "motor" "backend\requirements.txt" >nul
if %errorlevel%==0 (
    echo [OK] Motor found in requirements.txt
) else (
    echo [FAIL] Motor not found in requirements.txt
)

REM Check for SQLAlchemy NOT in requirements
findstr /M "sqlalchemy" "backend\requirements.txt" >nul
if %errorlevel%==0 (
    echo [FAIL] SQLAlchemy still in requirements.txt
) else (
    echo [OK] SQLAlchemy removed from requirements.txt
)

REM Check config.py for MongoDB settings
findstr /M "MONGO_URI" "backend\app\core\config.py" >nul
if %errorlevel%==0 (
    echo [OK] MONGO_URI found in config.py
) else (
    echo [FAIL] MONGO_URI not found in config.py
)

REM Check .env for MongoDB settings
findstr /M "MONGO_URI" "backend\.env" >nul
if %errorlevel%==0 (
    echo [OK] MONGO_URI found in .env
) else (
    echo [FAIL] MONGO_URI not found in .env
)

echo.
echo Checking Auth Module...
echo -----------------------

REM Check auth.py for MongoDB operations
findstr /M "db\[\"users\"\]" "backend\app\auth.py" >nul
if %errorlevel%==0 (
    echo [OK] MongoDB operations found in auth.py
) else (
    echo [FAIL] MongoDB operations not found in auth.py
)

REM Check auth.py does NOT use AsyncSession
findstr /M "AsyncSession" "backend\app\auth.py" >nul
if %errorlevel%==0 (
    echo [FAIL] auth.py still uses SQLAlchemy AsyncSession
) else (
    echo [OK] SQLAlchemy removed from auth.py
)

echo.
echo Checking Students Module...
echo ---------------------------

REM Check students.py for MongoDB operations
findstr /M "db\[\"students\"\]" "backend\app\students.py" >nul
if %errorlevel%==0 (
    echo [OK] MongoDB operations found in students.py
) else (
    echo [FAIL] MongoDB operations not found in students.py
)

REM Check students.py for ObjectId handling
findstr /M "ObjectId" "backend\app\students.py" >nul
if %errorlevel%==0 (
    echo [OK] ObjectId handling found in students.py
) else (
    echo [FAIL] ObjectId handling not found in students.py
)

echo.
echo Checking Attendance Module...
echo ----------------------------

REM Check attendance.py for student_name field
findstr /M "student_name" "backend\app\attendance.py" >nul
if %errorlevel%==0 (
    echo [OK] student_name field found in attendance.py
) else (
    echo [FAIL] student_name field not found in attendance.py
)

echo.
echo Checking Analytics Module...
echo ---------------------------

REM Check analytics.py for count_documents
findstr /M "count_documents" "backend\app\analytics.py" >nul
if %errorlevel%==0 (
    echo [OK] count_documents found in analytics.py
) else (
    echo [FAIL] count_documents not found in analytics.py
)

REM Check analytics.py does NOT use func.count
findstr /M "func.count" "backend\app\analytics.py" >nul
if %errorlevel%==0 (
    echo [FAIL] analytics.py still uses SQLAlchemy func.count
) else (
    echo [OK] SQLAlchemy func.count removed from analytics.py
)

echo.
echo Checking Schemas...
echo ------------------

REM Check schemas.py for string IDs
findstr /M "id: str" "backend\app\schemas.py" >nul
if %errorlevel%==0 (
    echo [OK] String IDs found in schemas.py
) else (
    echo [FAIL] String IDs not found in schemas.py
)

echo.
echo Checking Utils...
echo ----------------

REM Check utils.py imports settings
findstr /M "from app.core.config import settings" "backend\app\utils.py" >nul
if %errorlevel%==0 (
    echo [OK] Settings import found in utils.py
) else (
    echo [FAIL] Settings import not found in utils.py
)

REM Check utils.py does NOT have hardcoded SECRET_KEY
findstr /M "SECRET_KEY =" "backend\app\utils.py" >nul
if %errorlevel%==0 (
    echo [FAIL] Hardcoded SECRET_KEY still in utils.py
) else (
    echo [OK] Hardcoded secrets removed from utils.py
)

echo.
echo Checking Frontend API...
echo -----------------------

REM Check axios.js for VITE_API_BASE_URL
findstr /M "VITE_API_BASE_URL" "frontend\web\src\api\axios.js" >nul
if %errorlevel%==0 (
    echo [OK] VITE_API_BASE_URL found in axios.js
) else (
    echo [FAIL] VITE_API_BASE_URL not found in axios.js
)

REM Check axios.js for import.meta.env
findstr /M "import.meta.env" "frontend\web\src\api\axios.js" >nul
if %errorlevel%==0 (
    echo [OK] import.meta.env found in axios.js
) else (
    echo [FAIL] import.meta.env not found in axios.js
)

echo.
echo ======================================
echo Verification Complete!
echo.
echo Next Steps:
echo 1. Start MongoDB: mongod (or use Docker)
echo 2. Install backend: cd backend ^&^& pip install -r requirements.txt
echo 3. Start backend: python -m uvicorn app.main:app --reload
echo 4. Install frontend: cd frontend\web ^&^& npm install
echo 5. Start frontend: npm run dev
echo 6. Login with: teacher1 / password123
echo.
echo For detailed information, see:
echo   - FIX_DOCUMENTATION.md (detailed changes)
echo   - DEPLOYMENT_GUIDE.md (setup ^& deployment)
echo   - README_FIXES.txt (quick reference)
echo ======================================
echo.

pause
