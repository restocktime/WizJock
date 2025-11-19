import { query, closePool } from './connection';

/**
 * Simple script to test database connection and verify schema
 */
async function testConnection() {
  try {
    console.log('Testing database connection...');

    // Test basic connection
    const result = await query('SELECT NOW() as current_time');
    console.log('✓ Database connection successful');
    console.log('  Current time:', result.rows[0].current_time);

    // Check if migrations table exists
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log('\n✓ Found', tablesResult.rows.length, 'tables:');
    tablesResult.rows.forEach((row: any) => {
      console.log('  -', row.table_name);
    });

    // Check if sample data exists
    const reportsResult = await query('SELECT COUNT(*) as count FROM reports');
    const picksResult = await query('SELECT COUNT(*) as count FROM picks');
    const injuriesResult = await query('SELECT COUNT(*) as count FROM injuries');

    console.log('\n✓ Data counts:');
    console.log('  Reports:', reportsResult.rows[0].count);
    console.log('  Picks:', picksResult.rows[0].count);
    console.log('  Injuries:', injuriesResult.rows[0].count);

    console.log('\n✓ All tests passed!');
  } catch (error) {
    console.error('✗ Test failed:', error);
    throw error;
  } finally {
    await closePool();
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testConnection()
    .then(() => {
      console.log('\nTest completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nTest failed:', error);
      process.exit(1);
    });
}

export default testConnection;
