#!/bin/bash

# Test Application Flow Script
# Tests the complete application submission flow including email verification

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
API_URL="${API_URL:-https://wizjock.com/api}"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test+${TIMESTAMP}@example.com"

echo -e "${BLUE}=========================================="
echo "Application Flow Test"
echo "==========================================${NC}"
echo "API URL: $API_URL"
echo "Test Email: $TEST_EMAIL"
echo ""

# Track results
PASSED=0
FAILED=0

# Test 1: Submit valid application
echo -e "${YELLOW}Test 1: Submit valid application${NC}"
echo -n "Submitting application... "

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/applications" \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Test User ${TIMESTAMP}\",
    \"email\": \"${TEST_EMAIL}\",
    \"phone\": \"+1234567890\",
    \"bettingExperience\": \"intermediate\",
    \"smsConsent\": true
  }")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "201" ]; then
  echo -e "${GREEN}✓ PASS${NC} (Status: $http_code)"
  echo "Response: $body"
  ((PASSED++))
  
  # Extract application ID if present
  app_id=$(echo "$body" | grep -o '"applicationId":"[^"]*"' | cut -d'"' -f4)
  if [ -n "$app_id" ]; then
    echo "Application ID: $app_id"
  fi
else
  echo -e "${RED}✗ FAIL${NC} (Expected: 201, Got: $http_code)"
  echo "Response: $body"
  ((FAILED++))
fi
echo ""

# Test 2: Try to submit duplicate email
echo -e "${YELLOW}Test 2: Reject duplicate email${NC}"
echo -n "Submitting duplicate application... "

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/applications" \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Test User Duplicate\",
    \"email\": \"${TEST_EMAIL}\",
    \"phone\": \"+1234567890\",
    \"bettingExperience\": \"beginner\",
    \"smsConsent\": false
  }")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "409" ] || [ "$http_code" = "400" ]; then
  echo -e "${GREEN}✓ PASS${NC} (Status: $http_code - Duplicate rejected)"
  echo "Response: $body"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC} (Expected: 409 or 400, Got: $http_code)"
  echo "Response: $body"
  ((FAILED++))
fi
echo ""

# Test 3: Submit with invalid email
echo -e "${YELLOW}Test 3: Reject invalid email format${NC}"
echo -n "Submitting invalid email... "

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/applications" \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Test User\",
    \"email\": \"invalid-email\",
    \"phone\": \"+1234567890\",
    \"bettingExperience\": \"advanced\",
    \"smsConsent\": false
  }")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "400" ]; then
  echo -e "${GREEN}✓ PASS${NC} (Status: $http_code - Invalid email rejected)"
  echo "Response: $body"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC} (Expected: 400, Got: $http_code)"
  echo "Response: $body"
  ((FAILED++))
fi
echo ""

# Test 4: Submit with missing required fields
echo -e "${YELLOW}Test 4: Reject missing required fields${NC}"
echo -n "Submitting incomplete data... "

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/applications" \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Test User\",
    \"email\": \"test@example.com\"
  }")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "400" ]; then
  echo -e "${GREEN}✓ PASS${NC} (Status: $http_code - Missing fields rejected)"
  echo "Response: $body"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC} (Expected: 400, Got: $http_code)"
  echo "Response: $body"
  ((FAILED++))
fi
echo ""

# Test 5: Test rate limiting (if enabled)
echo -e "${YELLOW}Test 5: Rate limiting (optional)${NC}"
echo "Submitting 6 requests rapidly..."

rate_limit_triggered=false
for i in {1..6}; do
  response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/applications" \
    -H "Content-Type: application/json" \
    -d "{
      \"fullName\": \"Rate Test ${i}\",
      \"email\": \"ratetest${i}_${TIMESTAMP}@example.com\",
      \"phone\": \"+1234567890\",
      \"bettingExperience\": \"beginner\",
      \"smsConsent\": false
    }")
  
  http_code=$(echo "$response" | tail -n1)
  
  if [ "$http_code" = "429" ]; then
    rate_limit_triggered=true
    echo -e "${GREEN}✓ Rate limit triggered on request $i${NC}"
    break
  fi
  
  sleep 0.5
done

if [ "$rate_limit_triggered" = true ]; then
  echo -e "${GREEN}✓ PASS - Rate limiting is working${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠ Rate limiting not triggered (may not be enabled)${NC}"
  echo "This is not a failure, but verify rate limiting is configured"
fi
echo ""

# Summary
echo -e "${BLUE}=========================================="
echo "Test Summary"
echo "==========================================${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

# Email verification instructions
echo -e "${BLUE}=========================================="
echo "Email Verification (Manual)"
echo "==========================================${NC}"
echo ""
echo "Please manually verify the following:"
echo ""
echo "1. Confirmation Email to Applicant:"
echo "   - Check inbox for: ${TEST_EMAIL}"
echo "   - Subject should be: 'WizJock Application Received - Next Steps'"
echo "   - Email should contain applicant name and next steps"
echo "   - Email should be from: hello@wizjock.com or team@wizjock.com"
echo ""
echo "2. Admin Notification Email:"
echo "   - Check admin inbox (configured in ADMIN_EMAIL)"
echo "   - Subject should be: 'New WizJock Application: Test User ${TIMESTAMP}'"
echo "   - Email should contain all application details"
echo ""
echo "3. Email Timing:"
echo "   - Both emails should arrive within 60 seconds"
echo "   - Check spam folder if not in inbox"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All API tests passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Verify emails were received (see instructions above)"
  echo "2. Check application was stored in database"
  echo "3. Review error logs for any issues"
  exit 0
else
  echo -e "${RED}✗ Some tests failed. Please review the output above.${NC}"
  exit 1
fi
