import { Departments } from "../department";
import { Roster } from "../roster";
import { RSO_Interests } from "../rso_interest";
import { RSO } from "../rso";
import { Student_Interests } from "../student_interests";
import { Students } from "../students";
import pool from './connection';
import { cleanupTriggers } from '../migrations/deletea_triggers';
import { up as initPreventDuplicateNetId } from '../migrations/prevent_duplicates';

export async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    console.log('Initializing database...');
    
    // Clean up all existing triggers first
    await cleanupTriggers(connection);
    
    // Only reinitialize the duplicate prevention trigger
    await initPreventDuplicateNetId(connection);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
}
export async function getAllStudents(): Promise<Students[]> {
  try {
    const [rows] = await pool.query('SELECT * FROM Students');
    return rows as Students[];
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

export async function getStudentByName(name: string): Promise<Students[]> {
  try {
    const [rows] = await pool.query('SELECT * FROM Students WHERE name LIKE ?', [`%${name}%`]);
    return rows as Students[];
  } catch (error) {
    console.error('Error searching for student:', error);
    throw error;
  }
}

export async function getAllRSOS(): Promise<RSO_Interests[]> {
  try {
    const [rows] = await pool.query('SELECT * FROM RSO_Interests');
    return rows as RSO_Interests[];
  } catch (error) {
    console.error('Error fetching RSOs:', error);
    throw error;
  }
}

export async function getRSOByName(name: string): Promise<RSO_Interests[]> {
  try {
    const [rows] = await pool.query('SELECT * FROM RSO_Interests WHERE RSOname LIKE ?', [`%${name}%`]);
    return rows as RSO_Interests[];
  } catch (error) {
    console.error('Error searching for RSO:', error);
    throw error;
  }
}

export async function addStudent(
  newStudent: Students,
  interests: { interest1: string; interest2: string; interest3: string }
): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      'INSERT INTO Students (netId, name, year, minor, major, taggedPref, prefTimeComm) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newStudent.netId, newStudent.name, newStudent.year, newStudent.minor, newStudent.major, 
       newStudent.taggedPref, newStudent.prefTimeComm]
    );

    await connection.query(
      'INSERT INTO Student_Interests (netId, interest1, interest2, interest3) VALUES (?, ?, ?, ?)',
      [newStudent.netId, interests.interest1, interests.interest2, interests.interest3]
    );

    await connection.commit();
  } catch (error: any) {
    await connection.rollback();
    if (error.message.includes('Account already exists under this netID')) {
      throw new Error('Account already exists under this netID');
    }
    console.error('Error adding student:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteStudent(studentId: string): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    console.log(`Attempting to delete student: ${studentId}`);

    // Delete from Roster first
    const [rosterResult] = await connection.query('DELETE FROM Roster WHERE netId = ?', [studentId]);
    console.log('Deleted from Roster');

    // Delete from Student_Interests
    const [interestsResult] = await connection.query('DELETE FROM Student_Interests WHERE netId = ?', [studentId]);
    console.log('Deleted from Student_Interests');

    // Finally delete from Students
    const [studentResult]: any = await connection.query('DELETE FROM Students WHERE netId = ?', [studentId]);
    console.log('Deleted from Students');

    await connection.commit();
    console.log(`Successfully deleted student with netId: ${studentId}`);
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting student:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export async function addRSO(
  newRSO: RSO,
  interests: { interest1: string; interest2: string; interest3: string }
): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      'INSERT INTO RSOs (RSOName, department, expTimeComm, taggedPref) VALUES (?, ?, ?, ?)',
      [newRSO.RSOName, newRSO.department, newRSO.expTimeComm, newRSO.taggedPref]
    );

    await connection.query(
      'INSERT INTO RSO_Interests (RSOname, RSOInterest1, RSOInterest2, RSOInterest3) VALUES (?, ?, ?, ?)',
      [newRSO.RSOName, interests.interest1, interests.interest2, interests.interest3]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('Error adding RSO:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteRSO(rsoName: string): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query('DELETE FROM RSO_Interests WHERE RSOname = ?', [rsoName]);
    await connection.query('DELETE FROM RSOs WHERE RSOName = ?', [rsoName]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting RSO:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateStudentInterests(
  netId: string, 
  newInterests: { interest1: string; interest2: string; interest3: string }
): Promise<void> {
  try {
    await pool.query(
      'UPDATE Student_Interests SET interest1 = ?, interest2 = ?, interest3 = ? WHERE netId = ?',
      [
        newInterests.interest1 || 'NA',
        newInterests.interest2 || 'NA',
        newInterests.interest3 || 'NA',
        netId
      ]
    );
  } catch (error) {
    console.error('Error updating student interests:', error);
    throw error;
  }
}