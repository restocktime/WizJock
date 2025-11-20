#!/bin/bash

# Monitoring Setup Script
# Sets up basic monitoring for the first 24 hours after deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PRODUCTION_URL="${PRODUCTION_URL:-https://wizjock.com}"
API_URL="${API_URL:-https://wizjock.com/api}"
CHECK_INTERVAL="${CHECK_INTERVAL:-300}" # 5 minutes
LOG_FILE="monitoring-$(date +%Y%m%d_%H%M%S).log"

echo -e "${BLUE}=========================================="
echo "24-Hour Monitoring Setup"
echo "==========================================${NC}"
echo "Production URL: $PRODUCTION_URL"
echo "Check Interval: ${CHECK_INTERVAL}s ($(($CHECK_INTERVAL / 60)) minutes)"
echo "Log File: $LOG_FILE"
echo ""

# Function to log with timestamp
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to check endpoint
check_endpoint() {
  local url=$1
  local name=$2
  
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
  response_time=$(curl -s -o /dev/null -w "%{time_total}" "$url" || echo "0")
  
  if [ "$status" = "200" ]; then
    log "✓ $name: OK (${status}, ${response_time}s)"
    return 0
  else
    log "✗ $name: FAILED (Status: ${status})"
    return 1
  fi
}

# Function to check error logs
check_error_logs() {
  log "Checking error logs..."
  
  # This is a placeholder - adjust based on your logging setup
  # Examples:
  # - If using PM2: pm2 logs backend --lines 10 --nostream --err
  # - If using Docker: docker logs backend-container --tail 10
  # - If using cloud platform: check platform-specific logs
  
  log "Note: Manual log review required. Check your hosting platform dashboard."
}

# Function to run health check
run_health_check() {
  log "=========================================="
  log "Running Health Check"
  log "=========================================="
  
  local failed=0
  
  # Check landing page
  check_endpoint "$PRODUCTION_URL" "Landing Page" || ((failed++))
  
  # Check application page
  check_endpoint "$PRODUCTION_URL/apply" "Application Page" || ((failed++))
  
  # Check legal pages
  check_endpoint "$PRODUCTION_URL/privacy" "Privacy Policy" || ((failed++))
  check_endpoint "$PRODUCTION_URL/terms" "Terms of Use" || ((failed++))
  check_endpoint "$PRODUCTION_URL/responsible-gambling" "Responsible Gambling" || ((failed++))
  check_endpoint "$PRODUCTION_URL/about" "About Us" || ((failed++))
  check_endpoint "$PRODUCTION_URL/contact" "Contact" || ((failed++))
  
  # Check API health (if endpoint exists)
  if curl -s "$API_URL/health" > /dev/null 2>&1; then
    check_endpoint "$API_URL/health" "API Health" || ((failed++))
  fi
  
  log "Health check complete. Failed checks: $failed"
  log ""
  
  return $failed
}

# Function to check metrics
check_metrics() {
  log "=========================================="
  log "Checking Metrics"
  log "=========================================="
  
  # Application submissions (requires database access)
  log "Application submissions: Check database manually"
  
  # Email delivery rate (requires email service logs)
  log "Email delivery rate: Check Resend dashboard"
  
  # GA4 events (requires GA4 access)
  log "GA4 events: Check Google Analytics dashboard"
  
  log ""
}

# Main monitoring loop
monitor() {
  log "Starting 24-hour monitoring..."
  log "Press Ctrl+C to stop"
  log ""
  
  local start_time=$(date +%s)
  local end_time=$((start_time + 86400)) # 24 hours
  local check_count=0
  
  while [ $(date +%s) -lt $end_time ]; do
    ((check_count++))
    
    log "=========================================="
    log "Check #$check_count"
    log "=========================================="
    
    # Run health check
    run_health_check
    
    # Check metrics every hour
    if [ $((check_count % 12)) -eq 0 ]; then
      check_metrics
    fi
    
    # Calculate time remaining
    local current_time=$(date +%s)
    local elapsed=$((current_time - start_time))
    local remaining=$((end_time - current_time))
    local hours_remaining=$((remaining / 3600))
    local minutes_remaining=$(((remaining % 3600) / 60))
    
    log "Elapsed: $((elapsed / 3600))h $((elapsed % 3600 / 60))m"
    log "Remaining: ${hours_remaining}h ${minutes_remaining}m"
    log "Next check in ${CHECK_INTERVAL}s"
    log ""
    
    # Sleep until next check
    sleep $CHECK_INTERVAL
  done
  
  log "=========================================="
  log "24-Hour Monitoring Complete"
  log "=========================================="
  log "Total checks: $check_count"
  log "Log file: $LOG_FILE"
}

# Display monitoring instructions
echo -e "${YELLOW}Monitoring Instructions:${NC}"
echo ""
echo "This script will monitor your production site for 24 hours."
echo "It will check:"
echo "  - All page endpoints (landing, apply, legal pages)"
echo "  - Response times"
echo "  - HTTP status codes"
echo ""
echo "Checks will run every $(($CHECK_INTERVAL / 60)) minutes."
echo ""
echo "You should also manually monitor:"
echo "  - Google Analytics 4 (Real-time and Events)"
echo "  - Email delivery (Resend dashboard)"
echo "  - Application submissions (database)"
echo "  - Error logs (hosting platform)"
echo ""
echo -e "${YELLOW}Press Enter to start monitoring, or Ctrl+C to cancel${NC}"
read

# Start monitoring
monitor

# Generate summary report
echo -e "${BLUE}=========================================="
echo "Generating Summary Report"
echo "==========================================${NC}"

# Count failures in log
total_checks=$(grep -c "Running Health Check" "$LOG_FILE" || echo "0")
failed_checks=$(grep -c "FAILED" "$LOG_FILE" || echo "0")
success_rate=$(echo "scale=2; (($total_checks - $failed_checks) / $total_checks) * 100" | bc)

echo ""
echo "24-Hour Monitoring Summary:"
echo "  Total Checks: $total_checks"
echo "  Failed Checks: $failed_checks"
echo "  Success Rate: ${success_rate}%"
echo ""
echo "Full log: $LOG_FILE"
echo ""

if [ "$failed_checks" -eq 0 ]; then
  echo -e "${GREEN}✓ No failures detected during monitoring period${NC}"
else
  echo -e "${YELLOW}⚠ $failed_checks failures detected. Review log for details.${NC}"
fi
