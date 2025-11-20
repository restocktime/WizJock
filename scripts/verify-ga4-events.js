#!/usr/bin/env node

/**
 * GA4 Event Verification Script
 * 
 * This script helps verify that GA4 events are being tracked correctly
 * by checking the page source for gtag calls and providing a testing guide.
 */

const https = require('https');

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://wizjock.com';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

console.log(`${colors.blue}==========================================`);
console.log('GA4 Event Verification');
console.log(`==========================================${colors.reset}`);
console.log(`Production URL: ${PRODUCTION_URL}\n`);

// Expected GA4 events
const expectedEvents = [
  { name: 'page_view', description: 'Automatic page view tracking' },
  { name: 'cta_click', description: 'CTA button clicks with location parameter' },
  { name: 'form_start', description: 'User starts filling out form' },
  { name: 'form_submit', description: 'Form submission (success/error)' },
  { name: 'whatsapp_click', description: 'WhatsApp link clicks' },
];

// Function to fetch page content
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Function to check for GA4 setup
async function verifyGA4Setup() {
  console.log(`${colors.yellow}Checking GA4 Setup...${colors.reset}\n`);
  
  try {
    const html = await fetchPage(PRODUCTION_URL);
    
    // Check for gtag.js script
    const hasGtagScript = html.includes('googletagmanager.com/gtag/js');
    console.log(`${hasGtagScript ? colors.green + '✓' : colors.red + '✗'} gtag.js script loaded${colors.reset}`);
    
    // Check for GA4 config
    const hasConfig = html.includes("gtag('config'");
    console.log(`${hasConfig ? colors.green + '✓' : colors.red + '✗'} GA4 config present${colors.reset}`);
    
    // Extract measurement ID
    const measurementIdMatch = html.match(/gtag\('config',\s*'(G-[A-Z0-9]+)'/);
    if (measurementIdMatch) {
      console.log(`${colors.green}✓ Measurement ID: ${measurementIdMatch[1]}${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ Could not find measurement ID${colors.reset}`);
    }
    
    console.log('');
    
    if (hasGtagScript && hasConfig) {
      console.log(`${colors.green}✓ GA4 is properly configured${colors.reset}\n`);
      return true;
    } else {
      console.log(`${colors.red}✗ GA4 setup is incomplete${colors.reset}\n`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error fetching page: ${error.message}${colors.reset}\n`);
    return false;
  }
}

// Function to display testing instructions
function displayTestingInstructions() {
  console.log(`${colors.blue}==========================================`);
  console.log('Manual Testing Instructions');
  console.log(`==========================================${colors.reset}\n`);
  
  console.log('1. Open Google Analytics 4:');
  console.log('   - Go to https://analytics.google.com');
  console.log('   - Select your WizJock property');
  console.log('   - Navigate to Reports → Realtime\n');
  
  console.log('2. Test Events:\n');
  
  expectedEvents.forEach((event, index) => {
    console.log(`   ${colors.yellow}${event.name}${colors.reset}`);
    console.log(`   Description: ${event.description}`);
    
    switch (event.name) {
      case 'page_view':
        console.log('   Test: Visit any page on the site');
        console.log('   Expected: Event appears in GA4 Realtime with page_location parameter\n');
        break;
      
      case 'cta_click':
        console.log('   Test: Click any CTA button (GET STARTED, Request Access, etc.)');
        console.log('   Expected: Event appears with location parameter (e.g., "header", "hero", "pricing")\n');
        break;
      
      case 'form_start':
        console.log('   Test: Click on first field in application form');
        console.log('   Expected: Event appears with form_name="application"\n');
        break;
      
      case 'form_submit':
        console.log('   Test: Submit application form');
        console.log('   Expected: Event appears with success=true and form_name="application"\n');
        break;
      
      case 'whatsapp_click':
        console.log('   Test: Click "Join WhatsApp" button');
        console.log('   Expected: Event appears in GA4 Realtime\n');
        break;
    }
  });
  
  console.log(`${colors.blue}==========================================`);
  console.log('Verification Checklist');
  console.log(`==========================================${colors.reset}\n`);
  
  console.log('For each event, verify:');
  console.log('  [ ] Event appears in GA4 Realtime within 10 seconds');
  console.log('  [ ] Event has correct name');
  console.log('  [ ] Event has expected parameters');
  console.log('  [ ] Event count increments correctly\n');
  
  console.log(`${colors.blue}==========================================`);
  console.log('Debugging Tips');
  console.log(`==========================================${colors.reset}\n`);
  
  console.log('If events are not appearing:');
  console.log('  1. Check browser console for errors');
  console.log('  2. Verify gtag is defined: window.gtag');
  console.log('  3. Check Network tab for gtag requests');
  console.log('  4. Verify measurement ID is correct');
  console.log('  5. Check if ad blockers are interfering');
  console.log('  6. Wait up to 30 seconds for events to appear\n');
  
  console.log('Browser Console Commands:');
  console.log(`  ${colors.yellow}// Check if gtag is loaded${colors.reset}`);
  console.log('  typeof window.gtag\n');
  
  console.log(`  ${colors.yellow}// Manually trigger test event${colors.reset}`);
  console.log("  gtag('event', 'test_event', { test_param: 'test_value' })\n");
  
  console.log(`  ${colors.yellow}// Check dataLayer${colors.reset}`);
  console.log('  window.dataLayer\n');
}

// Main execution
async function main() {
  const isSetup = await verifyGA4Setup();
  
  if (isSetup) {
    displayTestingInstructions();
    
    console.log(`${colors.green}==========================================`);
    console.log('Next Steps');
    console.log(`==========================================${colors.reset}\n`);
    
    console.log('1. Follow the manual testing instructions above');
    console.log('2. Document which events are working correctly');
    console.log('3. Fix any events that are not tracking');
    console.log('4. Re-test after fixes\n');
    
    process.exit(0);
  } else {
    console.log(`${colors.red}==========================================`);
    console.log('Action Required');
    console.log(`==========================================${colors.reset}\n`);
    
    console.log('GA4 setup is incomplete. Please:');
    console.log('1. Verify VITE_GA_MEASUREMENT_ID is set in environment');
    console.log('2. Check that gtag script is added to index.html');
    console.log('3. Rebuild and redeploy the application');
    console.log('4. Run this script again\n');
    
    process.exit(1);
  }
}

main();
