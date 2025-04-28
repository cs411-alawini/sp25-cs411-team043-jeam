import express, { Request, Response } from 'express';
import pool from '../services/connection';

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    if (req.query.search) {
      const [rows] = await pool.query(
        `SELECT ri.* FROM RSO_Interests ri 
         JOIN RSOs r ON ri.RSOname = r.RSOName 
         WHERE ri.RSOname LIKE ?`,
        [`%${req.query.search}%`]
      );
      res.json(rows);
    } else {
      const [rows] = await pool.query('SELECT * FROM RSO_Interests');
      res.json(rows);
    }
  } catch (error) {
    console.error('Error fetching RSOs:', error);
    res.status(500).json({ error: 'Failed to fetch RSOs' });
  }
});

export default router;