#!/bin/bash

# Lighthouse Audit Script
# Runs Lighthouse audits on production and generates reports

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PRODUCTION_URL="${PRODUCTION_URL:-https://wizjock.com}"
OUTPUT_DIR="lighthouse-reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${BLUE}=========================================="
echo "Lighthouse Audit"
echo "==========================================${NC}"
echo "Production URL: $PRODUCTION_URL"
echo "Output Directory: $OUTPUT_DIR"
echo ""

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo -e "${RED}Error: Lighthouse CLI is not installed${NC}"
    echo "Install it with: npm install -g lighthouse"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to run lighthouse audit
run_audit() {
    local url=$1
    local device=$2
    local page_name=$3
    
    echo -e "${YELLOW}Running $device audit for $page_name...${NC}"
    
    local output_file="$OUTPUT_DIR/${page_name}_${device}_${TIMESTAMP}"
    
    if [ "$device" = "mobile" ]; then
        lighthouse "$url" \
            --preset=perf \
            --output=html \
            --output=json \
            --output-path="$output_file" \
            --chrome-flags="--headless" \
            --quiet
    else
        lighthouse "$url" \
            --preset=perf \
            --screenEmulation.disabled \
            --output=html \
            --output=json \
            --output-path="$output_file" \
            --chrome-flags="--headless" \
            --quiet
    fi
    
    # Parse scores from JSON
    local json_file="${output_file}.report.json"
    if [ -f "$json_file" ]; then
        local perf_score=$(cat "$json_file" | grep -o '"performance":[0-9.]*' | head -1 | cut -d':' -f2)
        local a11y_score=$(cat "$json_file" | grep -o '"accessibility":[0-9.]*' | head -1 | cut -d':' -f2)
        local bp_score=$(cat "$json_file" | grep -o '"best-practices":[0-9.]*' | head -1 | cut -d':' -f2)
        local seo_score=$(cat "$json_file" | grep -o '"seo":[0-9.]*' | head -1 | cut -d':' -f2)
        
        # Convert to percentage
        perf_score=$(echo "$perf_score * 100" | bc | cut -d'.' -f1)
        a11y_score=$(echo "$a11y_score * 100" | bc | cut -d'.' -f1)
        bp_score=$(echo "$bp_score * 100" | bc | cut -d'.' -f1)
        seo_score=$(echo "$seo_score * 100" | bc | cut -d'.' -f1)
        
        echo -e "${GREEN}✓ Audit complete${NC}"
        echo "  Performance: $perf_score"
        echo "  Accessibility: $a11y_score"
        echo "  Best Practices: $bp_score"
        echo "  SEO: $seo_score"
        echo "  Report: ${output_file}.report.html"
        echo ""
        
        # Check if scores meet targets
        local failed=0
        if [ "$perf_score" -lt 80 ]; then
            echo -e "${RED}  ✗ Performance score below target (80)${NC}"
            failed=1
        fi
        if [ "$a11y_score" -lt 90 ]; then
            echo -e "${RED}  ✗ Accessibility score below target (90)${NC}"
            failed=1
        fi
        
        return $failed
    else
        echo -e "${RED}✗ Failed to generate report${NC}"
        return 1
    fi
}

# Track overall results
TOTAL_AUDITS=0
PASSED_AUDITS=0

# Run audits for landing page
echo -e "${BLUE}=========================================="
echo "Landing Page Audits"
echo "==========================================${NC}"

run_audit "$PRODUCTION_URL" "mobile" "landing"
if [ $? -eq 0 ]; then ((PASSED_AUDITS++)); fi
((TOTAL_AUDITS++))

run_audit "$PRODUCTION_URL" "desktop" "landing"
if [ $? -eq 0 ]; then ((PASSED_AUDITS++)); fi
((TOTAL_AUDITS++))

# Run audits for application page
echo -e "${BLUE}=========================================="
echo "Application Page Audits"
echo "==========================================${NC}"

run_audit "$PRODUCTION_URL/apply" "mobile" "apply"
if [ $? -eq 0 ]; then ((PASSED_AUDITS++)); fi
((TOTAL_AUDITS++))

run_audit "$PRODUCTION_URL/apply" "desktop" "apply"
if [ $? -eq 0 ]; then ((PASSED_AUDITS++)); fi
((TOTAL_AUDITS++))

# Summary
echo -e "${BLUE}=========================================="
echo "Audit Summary"
echo "==========================================${NC}"
echo "Total Audits: $TOTAL_AUDITS"
echo -e "${GREEN}Passed: $PASSED_AUDITS${NC}"
echo -e "${RED}Failed: $((TOTAL_AUDITS - PASSED_AUDITS))${NC}"
echo ""
echo "Reports saved to: $OUTPUT_DIR"
echo ""

if [ $PASSED_AUDITS -eq $TOTAL_AUDITS ]; then
    echo -e "${GREEN}✓ All audits passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some audits did not meet targets. Review reports for details.${NC}"
    exit 1
fi
