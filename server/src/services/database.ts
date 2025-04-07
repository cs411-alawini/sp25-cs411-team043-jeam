import { Departments } from "../department";
import { Roster } from "../roster";
import { RSO_Interests } from "../rso_interest";
import { RSO } from "../rso";
import { Student_Interests } from "../student_interests";
import { Students } from "../students";

import { loadData } from "../../../data/dataparser";
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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sd);
      }, 300);
    });
  }

export async function getStudentByName(name: string): Promise<Students[]> {
    const queryName = name.toLowerCase();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sd.filter(s => s.name.toLowerCase().includes(queryName)));
      }, 300);
    });
  }