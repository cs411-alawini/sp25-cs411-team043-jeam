"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("../services/connection"));
const router = express_1.default.Router();
// Update the search query to include all fields
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.query.search) {
            const [rows] = yield connection_1.default.query('SELECT * FROM Students WHERE name LIKE ? OR netId LIKE ? OR major LIKE ?', [`%${req.query.search}%`, `%${req.query.search}%`, `%${req.query.search}%`]);
            res.json(rows);
        }
        else {
            const [rows] = yield connection_1.default.query('SELECT * FROM Students');
            res.json(rows);
        }
    }
    catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield connection_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        const student = req.body;
        yield connection.query('INSERT INTO Students (netId, name, year, minor, major, taggedPref, prefTimeComm) VALUES (?, ?, ?, ?, ?, ?, ?)', [student.netId, student.name, student.year, student.minor, student.major, student.taggedPref, student.prefTimeComm]);
        // Explicitly type the query result
        const [[newStudent]] = yield connection.query('SELECT * FROM Students WHERE netId = ?', [student.netId]);
        yield connection.commit();
        res.status(201).json(newStudent);
    }
    catch (error) {
        yield connection.rollback();
        console.error('Error creating student:', error);
        res.status(500).json({ error: 'Failed to create student' });
    }
    finally {
        connection.release();
    }
}));
router.get("/stats/club-membership", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield connection_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        const [rows] = yield connection.query(`
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
        yield connection.commit();
        res.json(rows);
    }
    catch (error) {
        yield connection.rollback();
        console.error('Error getting club statistics:', error);
        res.status(500).json({ error: 'Failed to get club statistics' });
    }
    finally {
        connection.release();
    }
}));
router.delete('/:netId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield connection_1.default.getConnection();
    try {
        yield connection.beginTransaction();
        const { netId } = req.params;
        console.log(`Attempting to delete student: ${netId}`);
        // Delete from dependent tables first
        yield connection.query('DELETE FROM Student_Interests WHERE netId = ?', [netId]);
        console.log('Deleted from Student_Interests');
        yield connection.query('DELETE FROM Roster WHERE netId = ?', [netId]);
        console.log('Deleted from Roster');
        // Finally delete from Students table
        const [result] = yield connection.query('DELETE FROM Students WHERE netId = ?', [netId]);
        if (result.affectedRows === 0) {
            throw new Error('No student found with that netId');
        }
        yield connection.commit();
        res.status(200).json({
            message: 'Student deleted successfully',
            deletedNetId: netId
        });
    }
    catch (error) {
        yield connection.rollback();
        console.error('Error deleting student:', error);
        const statusCode = error.message.includes('No student found') ? 404 : 500;
        res.status(statusCode).json({
            error: 'Deletion failed',
            details: error.message
        });
    }
    finally {
        connection.release();
    }
}));
router.get("/:netId/rso-matches", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield connection_1.default.getConnection();
    try {
        const { netId } = req.params;
        const [rows] = yield connection.query(`
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
    }
    catch (error) {
        console.error('Error getting RSO matches:', error);
        res.status(500).json({ error: 'Failed to get RSO matches' });
    }
    finally {
        connection.release();
    }
}));
router.get("/:netId/similar", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield connection_1.default.getConnection();
    try {
        const { netId } = req.params;
        const [rows] = yield connection.query(`
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
    }
    catch (error) {
        console.error('Error finding similar students:', error);
        res.status(500).json({ error: 'Failed to find similar students' });
    }
    finally {
        connection.release();
    }
}));
exports.default = router;
