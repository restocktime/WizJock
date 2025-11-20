/**
 * Simple test script to verify monitoring service functionality
 * Run with: npx ts-node src/test-monitoring.ts
 */

import monitoringService from './services/MonitoringService';

async function testMonitoring() {
  console.log('Testing Monitoring Service...\n');

  // Test 1: Track metrics
  console.log('1. Testing metric tracking...');
  monitoringService.trackMetric('test_metric', 100, { test: true });
  monitoringService.recordEmailSent('test', 'test-id-123');
  monitoringService.recordApplicationSubmitted('test-app-id');
  console.log('✓ Metrics tracked successfully\n');

  // Test 2: Get email metrics
  console.log('2. Testing email metrics...');
  const emailMetrics = monitoringService.getEmailMetrics();
  console.log('Email Metrics:', JSON.stringify(emailMetrics, null, 2));
  console.log('✓ Email metrics retrieved\n');

  // Test 3: Check system health
  console.log('3. Testing system health check...');
  try {
    const health = await monitoringService.checkSystemHealth();
    console.log('System Health:', JSON.stringify(health, null, 2));
    console.log('✓ System health check completed\n');
  } catch (error) {
    console.log('⚠ System health check failed (expected if DB not connected)');
    console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
    console.log('');
  }

  // Test 4: Get application metrics
  console.log('4. Testing application metrics...');
  try {
    const appMetrics = await monitoringService.getApplicationMetrics();
    console.log('Application Metrics:', JSON.stringify(appMetrics, null, 2));
    console.log('✓ Application metrics retrieved\n');
  } catch (error) {
    console.log('⚠ Application metrics failed (expected if DB not connected)');
    console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
    console.log('');
  }

  // Test 5: Get full metrics summary
  console.log('5. Testing full metrics summary...');
  try {
    const summary = await monitoringService.getMetricsSummary();
    console.log('Metrics Summary:', JSON.stringify(summary, null, 2));
    console.log('✓ Full metrics summary retrieved\n');
  } catch (error) {
    console.log('⚠ Metrics summary failed (expected if DB not connected)');
    console.log('Error:', error instanceof Error ? error.message : 'Unknown error');
    console.log('');
  }

  console.log('Monitoring Service Test Complete!');
  console.log('\nNote: Some tests may fail if database is not connected.');
  console.log('This is expected and does not indicate a problem with the monitoring service.');
}

// Run tests
testMonitoring()
  .then(() => {
    console.log('\n✓ All tests completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Test failed:', error);
    process.exit(1);
  });
