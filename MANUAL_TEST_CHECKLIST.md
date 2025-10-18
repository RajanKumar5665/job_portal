# 🧪 Manual Test Execution Checklist

## Pre-Testing Setup
- [ ] Backend server running on port 4000
- [ ] MongoDB connected successfully
- [ ] Frontend dev server running on port 5173
- [ ] Clear browser cache and cookies
- [ ] Postman/Thunder Client ready for API testing

---

## 1. Authentication Testing ✅

### Registration Flow
- [ ] Navigate to `/register`
- [ ] Test with invalid email: `invalidemail` → Should show error
- [ ] Test with short password: `12345` → Should show error "min 6 characters"
- [ ] Test with invalid phone: `123` → Should show error "10 digits required"
- [ ] Test with short name: `AB` → Should show error "min 3 characters"
- [ ] Test with invalid role: Change role via DevTools to "admin" → Should show error
- [ ] Register valid user:
  ```
  Name: Test User
  Email: test@example.com
  Phone: 1234567890
  Password: Test@123
  Role: student
  ```
- [ ] Verify redirect to `/login`
- [ ] Try registering same email → Should show "User already exists"

### Login Flow
- [ ] Navigate to `/login`
- [ ] Test wrong password → Should show "Incorrect password"
- [ ] Test wrong email → Should show "User not found"
- [ ] Test correct credentials → Should redirect to home
- [ ] Verify JWT cookie set (check DevTools → Application → Cookies)
- [ ] Verify user data in localStorage/context

### Rate Limiting Test
- [ ] Make 6 rapid login attempts → 6th attempt should fail with "Too many attempts"
- [ ] Wait 15 minutes or restart server
- [ ] Verify can login again

### Logout Flow
- [ ] Click logout button
- [ ] Verify redirect to home
- [ ] Verify cookie cleared
- [ ] Try accessing protected route → Should redirect to login

---

## 2. Job Management Testing ✅

### View Jobs (As Student)
- [ ] Navigate to `/jobs`
- [ ] Verify jobs load with pagination
- [ ] Check pagination controls (Previous/Next)
- [ ] Test search: Enter "developer" in search box
- [ ] Verify filtered results
- [ ] Click on a job card → Should open job details

### Create Job (As Recruiter)
- [ ] Logout and register as recruiter
- [ ] Register a company first (if not exists)
- [ ] Navigate to `/post-job` or Create Job page
- [ ] Test with negative salary: `-1000` → Should show error
- [ ] Test with zero positions: `0` → Should show error
- [ ] Test with all valid data:
  ```
  Title: Senior React Developer
  Description: Looking for experienced React developers
  Requirements: React, Node.js, TypeScript
  Salary: 120000
  Location: Remote
  Job Type: Full-time
  Experience: 3
  Positions: 2
  ```
- [ ] Verify job created successfully
- [ ] Navigate to "My Jobs" → Verify new job appears

### Job Details
- [ ] Click on any job
- [ ] Verify all details display correctly:
  - Title, Company, Salary, Location
  - Description, Requirements
  - Apply button (for students)
  - View Applicants (for recruiters)
- [ ] Test apply button (as student)

### Pagination Test
- [ ] Open DevTools → Network tab
- [ ] Navigate to jobs page
- [ ] Check request: `GET /api/v1/job/all?page=1&limit=10`
- [ ] Click "Next" page
- [ ] Verify request: `GET /api/v1/job/all?page=2&limit=10`
- [ ] Verify response includes pagination metadata

---

## 3. Application Testing ✅

### Apply for Job (As Student)
- [ ] Login as student
- [ ] Navigate to job details
- [ ] Click "Apply Now"
- [ ] Verify success message
- [ ] Try applying again → Should show "Already applied"
- [ ] Navigate to "My Applications"
- [ ] Verify application appears with "pending" status

### Manage Applications (As Recruiter)
- [ ] Login as recruiter
- [ ] Navigate to "My Jobs"
- [ ] Click on a job with applications
- [ ] Click "View Applicants"
- [ ] Verify list of applicants
- [ ] Test update status:
  - [ ] Select "Accepted" → Should update successfully
  - [ ] Select "Rejected" → Should update successfully
- [ ] Verify status change reflected immediately

### Application Status Test
- [ ] As student, check "My Applications"
- [ ] Verify status updated (if recruiter changed it)
- [ ] Verify different status colors:
  - Pending: Yellow/Orange
  - Accepted: Green
  - Rejected: Red

---

## 4. Profile Management Testing ✅

### View Profile
- [ ] Click on profile icon/name
- [ ] Navigate to profile page
- [ ] Verify all user details display:
  - Name, Email, Phone
  - Role, Bio, Skills
  - Resume (if uploaded)

### Edit Profile
- [ ] Click "Edit Profile"
- [ ] Update bio: "Passionate software developer"
- [ ] Add skills: "React, Node.js, MongoDB"
- [ ] Click "Save"
- [ ] Verify changes saved
- [ ] Refresh page → Verify data persists

### Resume Upload
- [ ] Click "Upload Resume"
- [ ] Test with .exe file → Should reject
- [ ] Test with 10MB PDF → Should reject (max 5MB)
- [ ] Test with valid PDF (< 5MB) → Should succeed
- [ ] Verify resume link appears
- [ ] Click resume link → Should download/open PDF

### Profile Photo Upload
- [ ] Upload valid image (JPG/PNG < 5MB)
- [ ] Verify image appears
- [ ] Verify image URL from Cloudinary

---

## 5. Company Management Testing ✅

### Register Company (As Recruiter)
- [ ] Navigate to company section
- [ ] Click "Register Company"
- [ ] Test with 1 character name: `A` → Should show error
- [ ] Test with valid name: `Tech Solutions Inc.`
- [ ] Verify company created
- [ ] Try creating same company again → Should show "Already exists"

### Update Company
- [ ] Click "Edit Company"
- [ ] Update description: "Leading tech company"
- [ ] Update location: "San Francisco, CA"
- [ ] Test invalid website: `not-a-url` → Should show error
- [ ] Test valid website: `https://techsolutions.com`
- [ ] Click "Save"
- [ ] Verify changes saved

### Company Profile
- [ ] View company profile
- [ ] Verify all details:
  - Name, Description, Location
  - Website, Logo
  - Number of jobs posted

---

## 6. Security Testing 🔒

### File Upload Security
- [ ] Try uploading .exe file → Should reject
- [ ] Try uploading .php file → Should reject
- [ ] Try uploading .sh script → Should reject
- [ ] Try uploading 10MB file → Should reject
- [ ] Valid PDF/JPG should work

### JWT Token Security
- [ ] Login and copy JWT from cookie
- [ ] Logout
- [ ] Try using old token in Postman → Should fail
- [ ] Check cookie flags:
  - [ ] httpOnly: true
  - [ ] sameSite: strict (local) / none (prod)
  - [ ] secure: true (production)

### Input Validation Security
- [ ] Try SQL injection: `' OR '1'='1` in email
- [ ] Try XSS: `<script>alert('xss')</script>` in bio
- [ ] Verify all inputs sanitized

### Rate Limiting
```bash
# Run this in terminal multiple times quickly
curl -X POST http://localhost:4000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}'
```
- [ ] 6th request should return 429 Too Many Requests

---

## 7. API Testing (Postman/Thunder Client) 🔌

### Authentication APIs
```bash
# Register
POST http://localhost:4000/api/v1/user/register
Content-Type: application/json
{
  "name": "API Test User",
  "email": "apitest@example.com",
  "phoneNumber": "9876543210",
  "password": "Test@123",
  "role": "student"
}
Expected: 201 Created

# Login
POST http://localhost:4000/api/v1/user/login
Content-Type: application/json
{
  "email": "apitest@example.com",
  "password": "Test@123",
  "role": "student"
}
Expected: 200 OK + Set-Cookie header

# Get Profile
GET http://localhost:4000/api/v1/user/profile
Cookie: token=<JWT_TOKEN>
Expected: 200 OK + User data

# Logout
GET http://localhost:4000/api/v1/user/logout
Cookie: token=<JWT_TOKEN>
Expected: 200 OK + Clear cookie
```

### Job APIs
```bash
# Get All Jobs (with pagination)
GET http://localhost:4000/api/v1/job/all?page=1&limit=10&keyword=developer
Expected: 200 OK + Jobs array + pagination metadata

# Get Job by ID
GET http://localhost:4000/api/v1/job/:jobId
Expected: 200 OK + Job details

# Create Job (Recruiter only)
POST http://localhost:4000/api/v1/job/post
Cookie: token=<RECRUITER_JWT>
Content-Type: application/json
{
  "title": "Backend Developer",
  "description": "Node.js expert needed",
  "requirements": "Node.js, Express, MongoDB",
  "salary": 90000,
  "location": "New York",
  "jobType": "Full-time",
  "experience": 3,
  "position": 2,
  "companyId": "<COMPANY_ID>"
}
Expected: 201 Created
```

### Application APIs
```bash
# Apply for Job
POST http://localhost:4000/api/v1/application/apply/:jobId
Cookie: token=<STUDENT_JWT>
Expected: 201 Created

# Apply again (should fail)
POST http://localhost:4000/api/v1/application/apply/:jobId
Cookie: token=<STUDENT_JWT>
Expected: 400 "Already applied"

# Get My Applications
GET http://localhost:4000/api/v1/application/get
Cookie: token=<STUDENT_JWT>
Expected: 200 OK + Applications array

# Update Application Status (Recruiter only)
POST http://localhost:4000/api/v1/application/status/:applicationId/update
Cookie: token=<RECRUITER_JWT>
Content-Type: application/json
{
  "status": "accepted"
}
Expected: 200 OK

# Try invalid status
POST http://localhost:4000/api/v1/application/status/:applicationId/update
Cookie: token=<RECRUITER_JWT>
Content-Type: application/json
{
  "status": "invalid_status"
}
Expected: 400 Bad Request
```

### Company APIs
```bash
# Register Company
POST http://localhost:4000/api/v1/company/register
Cookie: token=<RECRUITER_JWT>
Content-Type: application/json
{
  "CompanyName": "New Tech Corp"
}
Expected: 201 Created

# Get Company by ID
GET http://localhost:4000/api/v1/company/get/:companyId
Expected: 200 OK + Company data

# Update Company
PUT http://localhost:4000/api/v1/company/update/:companyId
Cookie: token=<RECRUITER_JWT>
Content-Type: application/json
{
  "name": "New Tech Corp Updated",
  "description": "Innovative tech company",
  "location": "Silicon Valley",
  "website": "https://newtechcorp.com"
}
Expected: 200 OK
```

---

## 8. Validation Testing ⚠️

### Email Validation
Test these emails (should all FAIL):
- [ ] `invalidemail` → "Invalid email format"
- [ ] `test@` → "Invalid email format"
- [ ] `@example.com` → "Invalid email format"
- [ ] `test@com` → "Invalid email format"

Valid emails (should PASS):
- [ ] `test@example.com` ✅
- [ ] `user.name@company.co.uk` ✅
- [ ] `john-doe@subdomain.example.com` ✅

### Phone Validation
Test these phones (should all FAIL):
- [ ] `123` → "Invalid phone number"
- [ ] `12345678901` (11 digits) → "Invalid phone number"
- [ ] `abcdefghij` (letters) → "Invalid phone number"

Valid phones (should PASS):
- [ ] `1234567890` ✅
- [ ] `9876543210` ✅

### Password Validation
Test these passwords (should all FAIL):
- [ ] `12345` (5 chars) → "Min 6 characters"
- [ ] Empty password → "Required"

Valid passwords (should PASS):
- [ ] `Test@123` ✅
- [ ] `SecurePass123` ✅

### Salary/Position Validation
Test these values (should all FAIL):
- [ ] Salary: `-1000` → "Must be positive"
- [ ] Salary: `0` → "Must be positive"
- [ ] Position: `-5` → "Must be positive"
- [ ] Position: `0` → "Must be positive"

Valid values (should PASS):
- [ ] Salary: `80000` ✅
- [ ] Position: `5` ✅

---

## 9. Edge Cases Testing 🔍

### Empty States
- [ ] Login as new student (no applications)
- [ ] Navigate to "My Applications" → Should show empty state message
- [ ] Login as new recruiter (no jobs)
- [ ] Navigate to "My Jobs" → Should show empty state message

### Large Data Sets
- [ ] Create 50+ jobs
- [ ] Navigate to job listing
- [ ] Verify pagination works correctly
- [ ] Verify performance is acceptable (< 2 seconds load time)

### Special Characters
- [ ] Register with name: `José María` (accents)
- [ ] Add bio with emojis: `💻 Developer 🚀`
- [ ] Verify data saves and displays correctly

### Concurrent Operations
- [ ] Open two browser tabs
- [ ] Login same user in both
- [ ] Apply for job in tab 1
- [ ] Try applying in tab 2 → Should show "Already applied"

---

## 10. Responsive Design Testing 📱

### Mobile View (< 768px)
- [ ] Open DevTools → Toggle device toolbar
- [ ] Select iPhone/Android device
- [ ] Test navigation menu → Should show hamburger icon
- [ ] Test forms → Should be usable on mobile
- [ ] Test job cards → Should stack vertically
- [ ] Test buttons → Should be easily tappable

### Tablet View (768px - 1024px)
- [ ] Select iPad device
- [ ] Test layout → Should adapt appropriately
- [ ] Test grid layouts → Should show 2 columns

### Desktop View (> 1024px)
- [ ] Full-width layout
- [ ] Multi-column grids
- [ ] All features accessible

---

## 11. Browser Compatibility Testing 🌐

Test in each browser:
- [ ] **Chrome**: All features
- [ ] **Firefox**: All features  
- [ ] **Safari**: All features (especially cookies)
- [ ] **Edge**: All features

Known Issues:
- Safari may require additional cookie settings for cross-origin

---

## 12. Error Handling Testing ❌

### Network Errors
- [ ] Disconnect internet
- [ ] Try any API operation
- [ ] Verify error message displays
- [ ] Reconnect internet
- [ ] Retry operation → Should work

### 404 Errors
- [ ] Navigate to `/nonexistent-page`
- [ ] Verify 404 page or redirect

### 500 Errors
- [ ] Stop MongoDB
- [ ] Try any database operation
- [ ] Verify error message
- [ ] Restart MongoDB

---

## 13. Performance Testing 🚀

### Load Time Testing
- [ ] Clear cache
- [ ] Open DevTools → Network tab
- [ ] Navigate to home → Measure load time (< 2s)
- [ ] Navigate to jobs → Measure load time (< 2s)
- [ ] Navigate to profile → Measure load time (< 2s)

### API Response Time
- [ ] Check Network tab for API calls
- [ ] Verify all APIs respond in < 500ms
- [ ] Large dataset queries (pagination) < 1s

---

## 14. Accessibility Testing ♿

### Keyboard Navigation
- [ ] Navigate using Tab key
- [ ] Verify focus indicators visible
- [ ] Test form submission with Enter key
- [ ] Test modal close with Escape key

### Screen Reader
- [ ] Use screen reader (NVDA/VoiceOver)
- [ ] Verify alt text on images
- [ ] Verify form labels read correctly
- [ ] Verify button purposes clear

### Color Contrast
- [ ] Check text readability
- [ ] Verify error messages visible
- [ ] Check button contrast

---

## ✅ Test Completion Checklist

After completing all tests:
- [ ] All authentication flows working
- [ ] All CRUD operations working
- [ ] All validations working
- [ ] Security measures verified
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Error handling working
- [ ] No console errors
- [ ] No memory leaks
- [ ] Ready for production

---

## 📊 Test Results Summary

Total Tests: _____ / _____
Pass Rate: _____%
Blockers: _____
Critical Issues: _____
Recommendations: _____

**Tester Name:** __________________
**Date:** __________________
**Sign-off:** __________________

---

## 🐛 Issues Found During Testing

| Issue # | Description | Severity | Status | Fixed? |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## 📝 Notes

Add any additional observations or comments here:

