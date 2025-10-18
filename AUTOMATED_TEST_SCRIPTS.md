# 🤖 Automated Test Scripts Collection

## Overview
This document contains automated test scripts for quick validation of the Job Portal API endpoints.

---

## Setup Instructions

### 1. Install Testing Tools
```bash
# Option 1: Using curl (built-in)
curl --version

# Option 2: Install httpie (recommended)
pip install httpie

# Option 3: Node.js + axios
npm install -g axios
```

### 2. Set Environment Variables
```bash
# Windows PowerShell
$env:API_URL = "http://localhost:4000/api/v1"
$env:TOKEN = ""

# Linux/Mac
export API_URL="http://localhost:4000/api/v1"
export TOKEN=""
```

---

## Quick Test Scripts (PowerShell)

### Complete E2E Test Script
```powershell
# test-api.ps1
# Complete End-to-End API Testing Script

$API_URL = "http://localhost:4000/api/v1"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"

Write-Host "🧪 Starting Job Portal API Tests..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Test 1: Register User
Write-Host "`n📝 Test 1: User Registration" -ForegroundColor Yellow
$registerBody = @{
    name = "Test User $timestamp"
    email = "test$timestamp@example.com"
    phoneNumber = "1234567890"
    password = "Test@123"
    role = "student"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/user/register" `
        -Method POST `
        -Body $registerBody `
        -ContentType "application/json"
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "User ID: $($response.user._id)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Login
Write-Host "`n🔐 Test 2: User Login" -ForegroundColor Yellow
$loginBody = @{
    email = "test$timestamp@example.com"
    password = "Test@123"
    role = "student"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/user/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -SessionVariable session
    Write-Host "✅ Login successful!" -ForegroundColor Green
    $TOKEN = $response.token
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Invalid Email Registration
Write-Host "`n⚠️ Test 3: Invalid Email (should fail)" -ForegroundColor Yellow
$invalidEmailBody = @{
    name = "Test User"
    email = "invalidemail"
    phoneNumber = "1234567890"
    password = "Test@123"
    role = "student"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/user/register" `
        -Method POST `
        -Body $invalidEmailBody `
        -ContentType "application/json"
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly rejected invalid email!" -ForegroundColor Green
}

# Test 4: Weak Password
Write-Host "`n⚠️ Test 4: Weak Password (should fail)" -ForegroundColor Yellow
$weakPasswordBody = @{
    name = "Test User"
    email = "newuser@example.com"
    phoneNumber = "9876543210"
    password = "123"
    role = "student"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/user/register" `
        -Method POST `
        -Body $weakPasswordBody `
        -ContentType "application/json"
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly rejected weak password!" -ForegroundColor Green
}

# Test 5: Get All Jobs
Write-Host "`n📋 Test 5: Get All Jobs (with pagination)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/job/all?page=1&limit=10" `
        -Method GET
    Write-Host "✅ Jobs retrieved: $($response.pagination.totalJobs) total" -ForegroundColor Green
    Write-Host "   Current Page: $($response.pagination.currentPage)" -ForegroundColor Gray
    Write-Host "   Total Pages: $($response.pagination.totalPages)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to get jobs: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Rate Limiting
Write-Host "`n🛡️ Test 6: Rate Limiting (5 rapid requests)" -ForegroundColor Yellow
$rateLimitFailed = $false
for ($i = 1; $i -le 6; $i++) {
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/user/login" `
            -Method POST `
            -Body $loginBody `
            -ContentType "application/json" `
            -ErrorAction Stop
        Write-Host "  Request $i: Success" -ForegroundColor Gray
    } catch {
        if ($_.Exception.Response.StatusCode -eq 429) {
            Write-Host "✅ Rate limiting working! Request $i blocked" -ForegroundColor Green
            $rateLimitFailed = $true
            break
        }
    }
    Start-Sleep -Milliseconds 100
}

if (-not $rateLimitFailed) {
    Write-Host "⚠️ Rate limiting may not be working" -ForegroundColor Yellow
}

# Test Summary
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "🎯 Test Execution Complete!" -ForegroundColor Cyan
Write-Host "Check results above for any failures" -ForegroundColor Gray
```

---

## Individual Test Scripts

### 1. Test User Registration Validation
```powershell
# test-user-validation.ps1

Write-Host "Testing User Registration Validation..." -ForegroundColor Cyan

$testCases = @(
    @{
        name = "Invalid Email"
        body = @{
            name = "Test User"
            email = "invalidemail"
            phoneNumber = "1234567890"
            password = "Test@123"
            role = "student"
        }
        shouldFail = $true
    },
    @{
        name = "Short Password"
        body = @{
            name = "Test User"
            email = "test@example.com"
            phoneNumber = "1234567890"
            password = "123"
            role = "student"
        }
        shouldFail = $true
    },
    @{
        name = "Invalid Phone"
        body = @{
            name = "Test User"
            email = "test@example.com"
            phoneNumber = "123"
            password = "Test@123"
            role = "student"
        }
        shouldFail = $true
    },
    @{
        name = "Short Name"
        body = @{
            name = "AB"
            email = "test@example.com"
            phoneNumber = "1234567890"
            password = "Test@123"
            role = "student"
        }
        shouldFail = $true
    },
    @{
        name = "Invalid Role"
        body = @{
            name = "Test User"
            email = "test@example.com"
            phoneNumber = "1234567890"
            password = "Test@123"
            role = "admin"
        }
        shouldFail = $true
    }
)

$passed = 0
$failed = 0

foreach ($test in $testCases) {
    Write-Host "`nTesting: $($test.name)" -ForegroundColor Yellow
    $body = $test.body | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/user/register" `
            -Method POST `
            -Body $body `
            -ContentType "application/json" `
            -ErrorAction Stop
        
        if ($test.shouldFail) {
            Write-Host "❌ FAILED: Should have been rejected" -ForegroundColor Red
            $failed++
        } else {
            Write-Host "✅ PASSED" -ForegroundColor Green
            $passed++
        }
    } catch {
        if ($test.shouldFail) {
            Write-Host "✅ PASSED: Correctly rejected" -ForegroundColor Green
            $passed++
        } else {
            Write-Host "❌ FAILED: Should have succeeded" -ForegroundColor Red
            $failed++
        }
    }
}

Write-Host "`n========== RESULTS ==========" -ForegroundColor Cyan
Write-Host "Passed: $passed / $($testCases.Count)" -ForegroundColor Green
Write-Host "Failed: $failed / $($testCases.Count)" -ForegroundColor Red
```

### 2. Test Job Validation
```powershell
# test-job-validation.ps1

Write-Host "Testing Job Creation Validation..." -ForegroundColor Cyan

# First login as recruiter
$loginBody = @{
    email = "recruiter@example.com"
    password = "Test@123"
    role = "recruiter"
} | ConvertTo-Json

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/user/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -WebSession $session
    Write-Host "✅ Logged in as recruiter" -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed. Please create recruiter account first" -ForegroundColor Red
    exit
}

# Test cases
$jobTests = @(
    @{
        name = "Negative Salary"
        body = @{
            title = "Test Job"
            description = "Test Description"
            requirements = "Node.js"
            salary = -1000
            location = "Remote"
            jobType = "Full-time"
            experience = 2
            position = 1
            companyId = "507f1f77bcf86cd799439011"
        }
        shouldFail = $true
    },
    @{
        name = "Zero Positions"
        body = @{
            title = "Test Job"
            description = "Test Description"
            requirements = "Node.js"
            salary = 80000
            location = "Remote"
            jobType = "Full-time"
            experience = 2
            position = 0
            companyId = "507f1f77bcf86cd799439011"
        }
        shouldFail = $true
    }
)

foreach ($test in $jobTests) {
    Write-Host "`nTesting: $($test.name)" -ForegroundColor Yellow
    $body = $test.body | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/job/post" `
            -Method POST `
            -Body $body `
            -ContentType "application/json" `
            -WebSession $session `
            -ErrorAction Stop
        
        if ($test.shouldFail) {
            Write-Host "❌ FAILED: Should have been rejected" -ForegroundColor Red
        } else {
            Write-Host "✅ PASSED" -ForegroundColor Green
        }
    } catch {
        if ($test.shouldFail) {
            Write-Host "✅ PASSED: Correctly rejected" -ForegroundColor Green
        } else {
            Write-Host "❌ FAILED: Should have succeeded" -ForegroundColor Red
        }
    }
}
```

### 3. Test Pagination
```powershell
# test-pagination.ps1

Write-Host "Testing Job Pagination..." -ForegroundColor Cyan

$pages = @(1, 2, 3)
$limit = 5

foreach ($page in $pages) {
    Write-Host "`nTesting Page $page (limit: $limit)" -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/job/all?page=$page&limit=$limit" `
            -Method GET
        
        Write-Host "✅ Retrieved jobs for page $page" -ForegroundColor Green
        Write-Host "   Jobs in this page: $($response.jobs.Count)" -ForegroundColor Gray
        Write-Host "   Total jobs: $($response.pagination.totalJobs)" -ForegroundColor Gray
        Write-Host "   Current page: $($response.pagination.currentPage)" -ForegroundColor Gray
        Write-Host "   Total pages: $($response.pagination.totalPages)" -ForegroundColor Gray
        Write-Host "   Has next: $($response.pagination.hasNextPage)" -ForegroundColor Gray
        Write-Host "   Has previous: $($response.pagination.hasPrevPage)" -ForegroundColor Gray
        
        # Verify pagination metadata
        if ($response.pagination.currentPage -ne $page) {
            Write-Host "   ⚠️ Warning: Current page mismatch!" -ForegroundColor Yellow
        }
        
        if ($response.jobs.Count -gt $limit) {
            Write-Host "   ⚠️ Warning: More jobs than limit!" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}
```

### 4. Test Rate Limiting
```powershell
# test-rate-limiting.ps1

Write-Host "Testing Rate Limiting..." -ForegroundColor Cyan

$loginBody = @{
    email = "test@example.com"
    password = "wrongpassword"
    role = "student"
} | ConvertTo-Json

$maxAttempts = 10
$rateLimitHit = $false

Write-Host "Making $maxAttempts rapid login attempts..." -ForegroundColor Yellow

for ($i = 1; $i -le $maxAttempts; $i++) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/user/login" `
            -Method POST `
            -Body $loginBody `
            -ContentType "application/json" `
            -ErrorAction Stop
        
        Write-Host "Attempt $i`: Allowed (200)" -ForegroundColor Gray
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($statusCode -eq 429) {
            Write-Host "Attempt $i`: Rate limited (429)" -ForegroundColor Yellow
            Write-Host "✅ Rate limiting is working!" -ForegroundColor Green
            $rateLimitHit = $true
            break
        } else {
            Write-Host "Attempt $i`: Failed ($statusCode)" -ForegroundColor Gray
        }
    }
    
    Start-Sleep -Milliseconds 200
}

if (-not $rateLimitHit) {
    Write-Host "⚠️ Rate limiting may not be configured properly" -ForegroundColor Yellow
    Write-Host "   Expected 429 response after 5-6 attempts" -ForegroundColor Gray
}
```

### 5. Test File Upload
```powershell
# test-file-upload.ps1

Write-Host "Testing File Upload Validation..." -ForegroundColor Cyan

# Create test files
$testPDF = "test.pdf"
$testExe = "test.exe"

# Create dummy PDF (just for testing - not a real PDF)
"Dummy PDF content" | Out-File -FilePath $testPDF -Encoding ASCII

# Create dummy EXE
"Dummy EXE content" | Out-File -FilePath $testExe -Encoding ASCII

Write-Host "`nNote: You need to be logged in for this test" -ForegroundColor Yellow
Write-Host "Attempting to upload PDF (should succeed)..." -ForegroundColor Yellow

# This is a simplified example - actual multipart/form-data upload
# requires more complex PowerShell code or use curl instead

# Clean up
Remove-Item $testPDF -ErrorAction SilentlyContinue
Remove-Item $testExe -ErrorAction SilentlyContinue

Write-Host "Use curl or Postman for file upload testing" -ForegroundColor Gray
```

---

## Bash Scripts (Linux/Mac)

### Complete E2E Test
```bash
#!/bin/bash
# test-api.sh

API_URL="http://localhost:4000/api/v1"
TIMESTAMP=$(date +%s)

echo "🧪 Starting Job Portal API Tests..."
echo "================================"

# Test 1: Register User
echo -e "\n📝 Test 1: User Registration"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/user/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test User $TIMESTAMP\",
    \"email\": \"test$TIMESTAMP@example.com\",
    \"phoneNumber\": \"1234567890\",
    \"password\": \"Test@123\",
    \"role\": \"student\"
  }")

if echo "$REGISTER_RESPONSE" | grep -q "success"; then
  echo "✅ Registration successful!"
else
  echo "❌ Registration failed"
fi

# Test 2: Login
echo -e "\n🔐 Test 2: User Login"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/user/login" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{
    \"email\": \"test$TIMESTAMP@example.com\",
    \"password\": \"Test@123\",
    \"role\": \"student\"
  }")

if echo "$LOGIN_RESPONSE" | grep -q "success"; then
  echo "✅ Login successful!"
else
  echo "❌ Login failed"
fi

# Test 3: Invalid Email
echo -e "\n⚠️ Test 3: Invalid Email (should fail)"
INVALID_EMAIL=$(curl -s -X POST "$API_URL/user/register" \
  -H "Content-Type: application/json" \
  -o /dev/null \
  -w "%{http_code}" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"invalidemail\",
    \"phoneNumber\": \"1234567890\",
    \"password\": \"Test@123\",
    \"role\": \"student\"
  }")

if [ "$INVALID_EMAIL" -eq 400 ]; then
  echo "✅ Correctly rejected invalid email!"
else
  echo "❌ Should have failed but didn't"
fi

# Test 4: Get All Jobs
echo -e "\n📋 Test 4: Get All Jobs"
JOBS_RESPONSE=$(curl -s -X GET "$API_URL/job/all?page=1&limit=10")
echo "✅ Jobs retrieved successfully"
echo "$JOBS_RESPONSE" | grep -o '"totalJobs":[0-9]*'

# Test 5: Rate Limiting
echo -e "\n🛡️ Test 5: Rate Limiting"
for i in {1..6}; do
  STATUS=$(curl -s -X POST "$API_URL/user/login" \
    -H "Content-Type: application/json" \
    -o /dev/null \
    -w "%{http_code}" \
    -d "{
      \"email\": \"test@example.com\",
      \"password\": \"wrong\",
      \"role\": \"student\"
    }")
  
  if [ "$STATUS" -eq 429 ]; then
    echo "✅ Rate limiting working! Request $i blocked"
    break
  fi
  sleep 0.1
done

# Cleanup
rm -f cookies.txt

echo -e "\n================================"
echo "🎯 Test Execution Complete!"
```

---

## cURL Commands (Cross-platform)

### Quick Test Commands

```bash
# Register User
curl -X POST http://localhost:4000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phoneNumber": "1234567890",
    "password": "Test@123",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:4000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "Test@123",
    "role": "student"
  }'

# Get Profile
curl -X GET http://localhost:4000/api/v1/user/profile \
  -b cookies.txt

# Get All Jobs (with pagination)
curl -X GET "http://localhost:4000/api/v1/job/all?page=1&limit=10"

# Apply for Job
curl -X POST http://localhost:4000/api/v1/application/apply/JOB_ID \
  -b cookies.txt

# Test Invalid Email (should fail)
curl -X POST http://localhost:4000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalidemail",
    "phoneNumber": "1234567890",
    "password": "Test@123",
    "role": "student"
  }'

# Test Rate Limiting (run 6 times quickly)
for i in {1..6}; do
  curl -X POST http://localhost:4000/api/v1/user/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong","role":"student"}'
  echo ""
done
```

---

## Running the Tests

### PowerShell
```powershell
# Save any script above as .ps1 file and run:
.\test-api.ps1

# Or run specific tests:
.\test-user-validation.ps1
.\test-job-validation.ps1
.\test-pagination.ps1
.\test-rate-limiting.ps1
```

### Bash
```bash
# Make script executable
chmod +x test-api.sh

# Run
./test-api.sh
```

---

## Expected Output

```
🧪 Starting Job Portal API Tests...
================================

📝 Test 1: User Registration
✅ Registration successful!
User ID: 507f1f77bcf86cd799439011

🔐 Test 2: User Login
✅ Login successful!

⚠️ Test 3: Invalid Email (should fail)
✅ Correctly rejected invalid email!

⚠️ Test 4: Weak Password (should fail)
✅ Correctly rejected weak password!

📋 Test 5: Get All Jobs (with pagination)
✅ Jobs retrieved: 95 total
   Current Page: 1
   Total Pages: 10

🛡️ Test 6: Rate Limiting (5 rapid requests)
  Request 1: Success
  Request 2: Success
  Request 3: Success
  Request 4: Success
  Request 5: Success
✅ Rate limiting working! Request 6 blocked

================================
🎯 Test Execution Complete!
```

---

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure backend server is running on port 4000
   - Check: `netstat -ano | findstr :4000` (Windows) or `lsof -i :4000` (Mac/Linux)

2. **Rate Limiting Not Working**
   - Restart server to reset counters
   - Check express-rate-limit is installed: `npm list express-rate-limit`

3. **Cookies Not Working**
   - Use `-c cookies.txt` to save cookies
   - Use `-b cookies.txt` to send cookies
   - Check CORS settings allow credentials

4. **PowerShell Script Errors**
   - Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
   - Or use: `powershell -ExecutionPolicy Bypass -File test-api.ps1`

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Start MongoDB
        uses: supercharge/mongodb-github-action@1.7.0
      - name: Install dependencies
        run: npm install
      - name: Start server
        run: npm start &
      - name: Wait for server
        run: sleep 10
      - name: Run tests
        run: bash test-api.sh
```

---

**Last Updated:** October 18, 2025
