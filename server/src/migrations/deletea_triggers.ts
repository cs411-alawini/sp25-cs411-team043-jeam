import { Connection } from 'mysql2/promise';

export async function cleanupTriggers(connection: Connection) {
  try {
    console.log('Starting trigger cleanup...');

    // Drop specific known triggers first
    const knownTriggers = [
      'after_roster_insert',
      'after_roster_delete',
      'after_roster_insert_count',
      'after_roster_delete_count',
      'roster_update_stats',
      'roster_delete_stats',
      'member_count_update'
    ];

    for (const trigger of knownTriggers) {
      await connection.query(`DROP TRIGGER IF EXISTS ${trigger}`);
      console.log(`Explicitly dropped trigger: ${trigger}`);
    }

    // Get and drop all remaining triggers
    const [triggers] = await connection.query(`
      SELECT TRIGGER_NAME, EVENT_OBJECT_TABLE
      FROM information_schema.TRIGGERS 
      WHERE TRIGGER_SCHEMA = DATABASE()
    `);

    for (const trigger of triggers as any[]) {
      await connection.query(`DROP TRIGGER IF EXISTS ${trigger.TRIGGER_NAME}`);
      console.log(`Dropped trigger: ${trigger.TRIGGER_NAME}`);
    }

    // Drop all stats-related tables
    await connection.query('DROP TABLE IF EXISTS RSO_Stats');
    await connection.query('DROP TABLE IF EXISTS RSO_Member_Count');
    await connection.query('DROP TABLE IF EXISTS RSO_Statistics');
    console.log('Dropped statistics tables');

    // Verify no triggers remain
    const [remainingTriggers] = await connection.query(`
      SELECT COUNT(*) as count
      FROM information_schema.TRIGGERS 
      WHERE TRIGGER_SCHEMA = DATABASE()
    `);
    console.log('Remaining triggers count:', (remainingTriggers as any[])[0].count);

  } catch (error) {
    console.error('Error cleaning up triggers:', error);
    throw error;
  }
}