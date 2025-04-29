import express, { Request, Response } from 'express';
import pool from '../services/connection';
import { ResultSetHeader } from 'mysql2';

const router = express.Router();

// Update the search query to include all fields
router.get("/", async (req: Request, res: Response) => {
  try {
    if (req.query.search) {
      const [rows] = await pool.query(
        'SELECT * FROM Students WHERE name LIKE ? OR netId LIKE ? OR major LIKE ?',
        [`%${req.query.search}%`, `%${req.query.search}%`, `%${req.query.search}%`]
      );
      res.json(rows);
    } else {
      const [rows] = await pool.query('SELECT * FROM Students');
      res.json(rows);
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const student = req.body;
    
    await connection.query(
      'INSERT INTO Students (netId, name, year, minor, major, taggedPref, prefTimeComm) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [student.netId, student.name, student.year, student.minor, student.major, student.taggedPref, student.prefTimeComm]
    );
    
    // Explicitly type the query result
    const [[newStudent]] = await connection.query<any[]>(
      'SELECT * FROM Students WHERE netId = ?', 
      [student.netId]
    );
    
    await connection.commit();
    res.status(201).json(newStudent);
  } catch (error) {
    await connection.rollback();
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  } finally {
    connection.release();
  }
});

router.get("/stats/club-membership", async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query(`
      SELECT 
        r.RSO_name,
        COUNT(r.netId) as member_count,
        GROUP_CONCAT(DISTINCT s.major) as member_majors,
        (
          SELECT GROUP_CONCAT(DISTINCT si.interest1) 
          FROM Student_Interests si 
          WHERE si.netId IN (
            SELECT netId FROM Roster WHERE RSO_name = r.RSO_name
          )
        ) as common_interests
      FROM Roster r
      JOIN Students s ON r.netId = s.netId
      GROUP BY r.RSO_name
      ORDER BY member_count DESC
    `);
    
    await connection.commit();
    res.json(rows);
  } catch (error) {
    await connection.rollback();
    console.error('Error getting club statistics:', error);
    res.status(500).json({ error: 'Failed to get club statistics' });
  } finally {
    connection.release();
  }
});

router.delete('/:netId', async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { netId } = req.params;
    
    console.log(`Attempting to delete student: ${netId}`);

    // Delete from dependent tables first
    await connection.query('DELETE FROM Student_Interests WHERE netId = ?', [netId]);
    console.log('Deleted from Student_Interests');

    await connection.query('DELETE FROM Roster WHERE netId = ?', [netId]);
    console.log('Deleted from Roster');

    // Finally delete from Students table
    const [result] = await connection.query<ResultSetHeader>('DELETE FROM Students WHERE netId = ?', [netId]);

    if (result.affectedRows === 0) {
      throw new Error('No student found with that netId');
    }

    await connection.commit();
    res.status(200).json({ 
      message: 'Student deleted successfully',
      deletedNetId: netId
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting student:', error);
    
    const statusCode = (error as Error).message.includes('No student found') ? 404 : 500;
    res.status(statusCode).json({ 
      error: 'Deletion failed',
      details: (error as Error).message
    });
  } finally {
    connection.release();
  }
});

interface RSOMatch {
  RSOName: string;
  department: string;
  taggedPref: string;
  current_members: number;
  rso_interests: string;
  match_score: number;
}

import { RowDataPacket } from 'mysql2';

interface RSOMatch extends RowDataPacket {
  RSOName: string;
  department: string;
  taggedPref: string;
  current_members: number;
  rso_interests: string;
  match_score: number;
}

router.get("/:netId/rso-matches", async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const { netId } = req.params;
    const [rows] = await connection.query<RSOMatch[]>(`
      WITH StudentInterests AS (
        SELECT interest1, interest2, interest3
        FROM Student_Interests
        WHERE netId = ?
      )
      SELECT DISTINCT 
        r.RSOName,
        r.department,
        r.taggedPref,
        COUNT(DISTINCT ros.netId) as current_members,
        GROUP_CONCAT(DISTINCT ri.RSOInterest1, ', ', ri.RSOInterest2, ', ', ri.RSOInterest3) as rso_interests,
        (
          CASE 
            WHEN ri.RSOInterest1 IN (SELECT interest1 FROM StudentInterests) OR
                 ri.RSOInterest1 IN (SELECT interest2 FROM StudentInterests) OR
                 ri.RSOInterest1 IN (SELECT interest3 FROM StudentInterests) OR
                 ri.RSOInterest2 IN (SELECT interest1 FROM StudentInterests) OR
                 ri.RSOInterest2 IN (SELECT interest2 FROM StudentInterests) OR
                 ri.RSOInterest2 IN (SELECT interest3 FROM StudentInterests) OR
                 ri.RSOInterest3 IN (SELECT interest1 FROM StudentInterests) OR
                 ri.RSOInterest3 IN (SELECT interest2 FROM StudentInterests) OR
                 ri.RSOInterest3 IN (SELECT interest3 FROM StudentInterests)
            THEN 1
            ELSE 0
          END
        ) as match_score
      FROM RSOs r
      LEFT JOIN Roster ros ON r.RSOName = ros.RSO_name
      LEFT JOIN RSO_Interests ri ON r.RSOName = ri.RSOname
      WHERE EXISTS (
        SELECT 1 FROM StudentInterests si
        WHERE ri.RSOInterest1 IN (si.interest1, si.interest2, si.interest3)
        OR ri.RSOInterest2 IN (si.interest1, si.interest2, si.interest3)
        OR ri.RSOInterest3 IN (si.interest1, si.interest2, si.interest3)
      )
      GROUP BY r.RSOName, r.department, r.taggedPref, ri.RSOInterest1, ri.RSOInterest2, ri.RSOInterest3
      HAVING match_score > 0
      ORDER BY match_score DESC, current_members DESC
    `, [netId]);

    console.log('Student NetID:', netId);
    console.log('Number of matches found:', rows.length);
    console.log('First few matches:', rows.slice(0, 3));

    res.json(rows);
  } catch (error) {
    console.error('Error getting RSO matches:', error);
    res.status(500).json({ error: 'Failed to get RSO matches' });
  } finally {
    connection.release();
  }
});

router.get("/:netId/similar", async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const { netId } = req.params;
    const [rows] = await connection.query(`
      WITH StudentInterests AS (
        SELECT interest1, interest2, interest3
        FROM Student_Interests
        WHERE netId = ?
      )
      SELECT DISTINCT 
        s.netId,
        s.name,
        s.year,
        s.major,
        s.minor,
        GROUP_CONCAT(DISTINCT si.interest1, ', ', si.interest2, ', ', si.interest3) as interests,
        COUNT(DISTINCT si.interest1) as match_count
      FROM Students s
      JOIN Student_Interests si ON s.netId = si.netId
      JOIN StudentInterests search 
      WHERE s.netId != ?
      AND (
        si.interest1 IN (SELECT interest1 FROM StudentInterests)
        OR si.interest1 IN (SELECT interest2 FROM StudentInterests)
        OR si.interest1 IN (SELECT interest3 FROM StudentInterests)
        OR si.interest2 IN (SELECT interest1 FROM StudentInterests)
        OR si.interest2 IN (SELECT interest2 FROM StudentInterests)
        OR si.interest2 IN (SELECT interest3 FROM StudentInterests)
        OR si.interest3 IN (SELECT interest1 FROM StudentInterests)
        OR si.interest3 IN (SELECT interest2 FROM StudentInterests)
        OR si.interest3 IN (SELECT interest3 FROM StudentInterests)
      )
      GROUP BY s.netId, s.name, s.year, s.major, s.minor
      ORDER BY match_count DESC
    `, [netId, netId]);

    console.log('Found similar students:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Error finding similar students:', error);
    res.status(500).json({ error: 'Failed to find similar students' });
  } finally {
    connection.release();
  }
});

export default router;