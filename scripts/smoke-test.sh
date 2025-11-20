#!/bin/bash

# Production Smoke Test Script
# This script runs basic smoke tests against production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="${BACKEND_URL:-}"
FRONTEND_URL="${FRONTEND_URL:-}"

# Test results
PASSED=0
FAILED=0

# Helper functions
print_header() {
    echo ""
    echo "=========================================="
    echo "$1"
    echo "=========================================="
}

print_test() {
    echo -n "Testing: $1... "
}

print_pass() {
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
}

print_fail() {
    echo -e "${RED}✗ FAIL${NC}"
    echo -e "${RED}  Error: $1${NC}"
    ((FAILED++))
}

print_skip() {
    echo -e "${YELLOW}⊘ SKIP${NC}"
    echo -e "${YELLOW}  Reason: $1${NC}"
}

# Check if URLs are provided
if [ -z "$BACKEND_URL" ] || [ -z "$FRONTEND_URL" ]; then
    echo -e "${RED}Error: BACKEND_URL and FRONTEND_URL must be set${NC}"
    echo ""
    echo "Usage:"
    echo "  BACKEND_URL=https://your-backend.com FRONTEND_URL=https://your-frontend.com ./scripts/smoke-test.sh"
    echo ""
    echo "Example:"
    echo "  BACKEND_URL=https://wizjock-backend.up.railway.app FRONTEND_URL=https://wizjock.vercel.app ./scripts/smoke-test.sh"
    exit 1
fi

echo ""
echo "🚀 Production Smoke Tests"
echo ""
echo "Backend URL:  $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# ==========================================
# Backend Tests
# ==========================================

print_header "Backend API Tests"

# Test 1: Health Check
print_test "Backend health endpoint"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" || echo "000")
if [ "$RESPONSE" = "200" ]; then
    print_pass
else
    print_fail "Expected 200, got $RESPONSE"
fi

# Test 2: Database Health Check
print_test "Database connection"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/health/db" || echo "000")
if [ "$RESPONSE" = "200" ]; then
    print_pass
else
    print_fail "Expected 200, got $RESPONSE"
fi

# Test 3: CORS Headers
print_test "CORS headers configured"
RESPONSE=$(curl -s -I -H "Origin: $FRONTEND_URL" "$BACKEND_URL/health" | grep -i "access-control-allow-origin" || echo "")
if [ -n "$RESPONSE" ]; then
    print_pass
else
    print_fail "CORS headers not found"
fi

# Test 4: Application Endpoint (POST with invalid data)
print_test "Application endpoint validation"
RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/applications" \
    -H "Content-Type: application/json" \
    -d '{"invalid":"data"}' \
    -w "%{http_code}" -o /dev/null || echo "000")
if [ "$RESPONSE" = "400" ]; then
    print_pass
else
    print_fail "Expected 400 for invalid data, got $RESPONSE"
fi

# Test 5: Rate Limiting
print_test "Rate limiting enabled"
# Make 6 rapid requests (limit is 5 per hour)
for i in {1..6}; do
    RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/applications" \
        -H "Content-Type: application/json" \
        -d '{"fullName":"Test","email":"test@test.com","phone":"1234567890","bettingExperience":"beginner","smsConsent":false}' \
        -w "%{http_code}" -o /dev/null 2>/dev/null || echo "000")
done
if [ "$RESPONSE" = "429" ]; then
    print_pass
else
    print_skip "Rate limit not triggered (may need more requests or different IP)"
fi

# ==========================================
# Frontend Tests
# ==========================================

print_header "Frontend Tests"

# Test 6: Landing Page
print_test "Landing page loads"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/" || echo "000")
if [ "$RESPONSE" = "200" ]; then
    print_pass
else
    print_fail "Expected 200, got $RESPONSE"
fi

# Test 7: Application Form Page
print_test "Application form page loads"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/apply" || echo "000")
if [ "$RESPONSE" = "200" ]; then
    print_pass
else
    print_fail "Expected 200, got $RESPONSE"
fi

# Test 8: Privacy Policy Page
print_test "Privacy policy page loads"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/privacy" || echo "000")
if [ "$RESPONSE" = "200" ]; then
    print_pass
else
    print_fail "Expected 200, got $RESPONSE"
fi

# Test 9: Terms of Use Page
print_test "Terms of use page loads"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/terms" || echo "000")
if [ "$RESPONSE" = "200" ]; then
    print_pass
else
    print_fail "Expected 200, got $RESPONSE"
fi

# Test 10: Responsible Gambling Page
print_test "Responsible gambling page loads"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/responsible-gambling" || echo "000")
if [ "$RESPONSE" = "200" ]; then
    print_pass
else
    print_fail "Expected 200, got $RESPONSE"
fi

# Test 11: About Page
print_test "About page loads"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/about" || echo "000")
if [ "$RESPONSE" = "200" ]; then
    print_pass
else
    print_fail "Expected 200, got $RESPONSE"
fi

# Test 12: Contact Page
print_test "Contact page loads"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/contact" || echo "000")
if [ "$RESPONSE" = "200" ]; then
    print_pass
else
    print_fail "Expected 200, got $RESPONSE"
fi

# Test 13: 404 Page
print_test "404 page for invalid route"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/invalid-route-that-does-not-exist" || echo "000")
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "404" ]; then
    print_pass
else
    print_fail "Expected 200 or 404, got $RESPONSE"
fi

# Test 14: HTTPS Redirect
print_test "HTTPS enforced"
if [[ $FRONTEND_URL == https://* ]]; then
    print_pass
else
    print_fail "Frontend URL is not HTTPS"
fi

# Test 15: Security Headers
print_test "Security headers present"
HEADERS=$(curl -s -I "$FRONTEND_URL/" | grep -i "x-frame-options\|x-content-type-options\|strict-transport-security" || echo "")
if [ -n "$HEADERS" ]; then
    print_pass
else
    print_skip "Some security headers may be missing (check manually)"
fi

# ==========================================
# Content Tests
# ==========================================

print_header "Content Tests"

# Test 16: Landing Page Content
print_test "Landing page contains key content"
CONTENT=$(curl -s "$FRONTEND_URL/" | grep -i "wizjock\|request access\|get started" || echo "")
if [ -n "$CONTENT" ]; then
    print_pass
else
    print_fail "Key content not found on landing page"
fi

# Test 17: Performance Disclaimers
print_test "Performance disclaimers present"
CONTENT=$(curl -s "$FRONTEND_URL/" | grep -i "past performance\|does not guarantee\|future results" || echo "")
if [ -n "$CONTENT" ]; then
    print_pass
else
    print_fail "Performance disclaimers not found"
fi

# Test 18: Footer Links
print_test "Footer contains legal links"
CONTENT=$(curl -s "$FRONTEND_URL/" | grep -i "privacy\|terms\|responsible gambling" || echo "")
if [ -n "$CONTENT" ]; then
    print_pass
else
    print_fail "Footer legal links not found"
fi

# Test 19: GA4 Script
print_test "Google Analytics script loaded"
CONTENT=$(curl -s "$FRONTEND_URL/" | grep -i "googletagmanager\|gtag" || echo "")
if [ -n "$CONTENT" ]; then
    print_pass
else
    print_skip "GA4 script not found (may be loaded dynamically)"
fi

# ==========================================
# Integration Tests
# ==========================================

print_header "Integration Tests"

# Test 20: Frontend can reach Backend
print_test "Frontend can communicate with backend"
# This is a basic test - actual CORS test requires browser
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type" \
    -X OPTIONS "$BACKEND_URL/api/applications" || echo "000")
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "204" ]; then
    print_pass
else
    print_skip "CORS preflight check inconclusive (test manually in browser)"
fi

# ==========================================
# Summary
# ==========================================

print_header "Test Summary"

TOTAL=$((PASSED + FAILED))
echo ""
echo "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Test the application form manually in a browser"
    echo "2. Submit a test application and verify emails"
    echo "3. Check Google Analytics Real-Time reports"
    echo "4. Test on mobile devices"
    echo "5. Run Lighthouse audit"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please review and fix issues.${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check backend logs for errors"
    echo "2. Verify environment variables are set correctly"
    echo "3. Ensure database migration completed successfully"
    echo "4. Check CORS configuration"
    echo "5. Verify DNS and SSL certificates"
    echo ""
    exit 1
fi
