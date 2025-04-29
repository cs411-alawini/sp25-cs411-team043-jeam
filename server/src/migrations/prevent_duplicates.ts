import { Connection } from 'mysql2/promise';

export async function up(connection: Connection) {
  // Create trigger to prevent duplicate netIDs
  await connection.query(`
    CREATE TRIGGER before_student_insert
    BEFORE INSERT ON Students
    FOR EACH ROW
    BEGIN
      IF EXISTS (SELECT 1 FROM Students WHERE netId = NEW.netId) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Account already exists under this netID';
      END IF;
    END;
  `);
}