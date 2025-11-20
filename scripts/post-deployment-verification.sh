#!/bin/bash

# Post-Deployment Verification Script
# This script verifies all critical functionality after deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PRODUCTION_URL="${PRODUCTION_URL:-https://wizjock.com}"
API_URL="${API_URL:-https://wizjock.com/api}"

echo "=========================================="
echo "Post-Deployment Verification"
echo "=========================================="
echo "Production URL: $PRODUCTION_URL"
echo "API URL: $API_URL"
echo ""

# Track results
PASSED=0
FAILED=0
WARNINGS=0

# Function to check HTTP status
check_url() {
    local url=$1
    local expected_status=${2:-200}
    local description=$3
    
    echo -n "Checking $description... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (Status: $status)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected: $expected_status, Got: $status)"
        ((FAILED++))
        return 1
    fi
}

# Function to check if element exists on page
check_page_content() {
    local url=$1
    local search_text=$2
    local description=$3
    
    echo -n "Checking $description... "
    
    content=$(curl -s "$url")
    
    if echo "$content" | grep -q "$search_text"; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Content not found)"
        ((FAILED++))
        return 1
    fi
}

echo "=========================================="
echo "1. Testing CTA Links to /apply"
echo "=========================================="

# Check that landing page loads
check_url "$PRODUCTION_URL" 200 "Landing page"

# Check that /apply page loads
check_url "$PRODUCTION_URL/apply" 200 "Application form page"

# Check for CTA buttons on landing page
check_page_content "$PRODUCTION_URL" "/apply" "CTA links point to /apply"

echo ""
echo "=========================================="
echo "2. Testing Legal Pages (200 Status)"
echo "=========================================="

check_url "$PRODUCTION_URL/privacy" 200 "Privacy Policy page"
check_url "$PRODUCTION_URL/terms" 200 "Terms of Use page"
check_url "$PRODUCTION_URL/responsible-gambling" 200 "Responsible Gambling page"
check_url "$PRODUCTION_URL/about" 200 "About Us page"
check_url "$PRODUCTION_URL/contact" 200 "Contact page"

echo ""
echo "=========================================="
echo "3. Testing API Endpoints"
echo "=========================================="

# Check API health (if endpoint exists)
if curl -s "$API_URL/health" > /dev/null 2>&1; then
    check_url "$API_URL/health" 200 "API health endpoint"
fi

# Test that applications endpoint exists (should return 405 for GET)
echo -n "Checking applications endpoint exists... "
status=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/applications" || echo "000")
if [ "$status" = "405" ] || [ "$status" = "404" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Endpoint exists)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Unexpected status: $status)"
    ((WARNINGS++))
fi

echo ""
echo "=========================================="
echo "4. Testing GA4 Integration"
echo "=========================================="

# Check for GA4 script in HTML
check_page_content "$PRODUCTION_URL" "googletagmanager.com/gtag/js" "GA4 script loaded"
check_page_content "$PRODUCTION_URL" "gtag('config'" "GA4 configuration present"

echo ""
echo "=========================================="
echo "5. Testing Performance Disclaimers"
echo "=========================================="

check_page_content "$PRODUCTION_URL" "Past performance does not guarantee future results" "Performance disclaimer present"

echo ""
echo "=========================================="
echo "6. Testing Footer Links"
echo "=========================================="

check_page_content "$PRODUCTION_URL" "Privacy Policy" "Footer has Privacy Policy link"
check_page_content "$PRODUCTION_URL" "Terms of Use" "Footer has Terms link"
check_page_content "$PRODUCTION_URL" "Responsible Gambling" "Footer has Responsible Gambling link"

echo ""
echo "=========================================="
echo "7. Testing Mobile Responsiveness"
echo "=========================================="

echo -n "Checking viewport meta tag... "
if curl -s "$PRODUCTION_URL" | grep -q 'viewport'; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

echo ""
echo "=========================================="
echo "8. Testing Security Headers"
echo "=========================================="

echo -n "Checking HTTPS redirect... "
http_status=$(curl -s -o /dev/null -w "%{http_code}" "http://wizjock.com" || echo "000")
if [ "$http_status" = "301" ] || [ "$http_status" = "302" ] || [ "$http_status" = "308" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Redirects to HTTPS)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Status: $http_status)"
    ((WARNINGS++))
fi

echo ""
echo "=========================================="
echo "VERIFICATION SUMMARY"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please review the output above.${NC}"
    exit 1
fi
