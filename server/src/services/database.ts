import { Departments } from "../department";
import { Roster } from "../roster";
import { RSO_Interests } from "../rso_interest";
import { RSO } from "../rso";
import { Student_Interests } from "../student_interests";
import { Students } from "../students";

import { loadData } from "../../../data/dataparser";

import pool from './connection';
import { RowDataPacket } from "mysql2";

let sd: Students[] = [];

(async () => {
  const {
    students,
    rsos,
    studentInterests,
    departments,
    roster,
    rsoInterests
  } = await loadData();

  console.log("Loaded", students.length, "students");

  const dd: Departments[] = departments
  const rd: Roster[] = roster
  const rid: RSO_Interests[] = rsoInterests
  const rsod: RSO[] = rsos
  const sid: Student_Interests[] = studentInterests
  sd = students

})();

export async function getAllStudents(): Promise<Students[]> {
    const [rows] = await pool.query('SELECT * FROM student LIMIT 20;');
    return rows as Students[];
  }

export async function getStudentByName(name: string): Promise<Students[]> {
    const queryName = name.toLowerCase();
    const sqlQuery = `SELECT * FROM student WHERE name LIKE '%${queryName}%';`;
    const [rows] = await pool.query(sqlQuery);
    return rows as Students[];
  }