import { Departments } from "../department";
import { Roster } from "../roster";
import { RSO_Interests } from "../rso_interest";
import { RSO } from "../rso";
import { Student_Interests } from "../student_interests";
import { Students } from "../students";

import { loadData } from "../../../data/dataparser";
let sd: Students[] = [];
let rsoi: RSO_Interests[] = [];
let si: Student_Interests[] = [];
let rso: RSO[] = [];

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
  console.log("Loaded", rsoInterests.length, "RSO's");

  const dd: Departments[] = departments
  const rd: Roster[] = roster
  const rid: RSO_Interests[] = rsoInterests
  const rsod: RSO[] = rsos
  const sid: Student_Interests[] = studentInterests
  sd = students
  rsoi = rsoInterests
  si = studentInterests
  rso = rsos

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

  export async function getAllRSOS(): Promise<RSO_Interests[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(rsoi);
      }, 300);
    });
  }

  export async function getRSOByName(name: string): Promise<RSO_Interests[]> {
    const queryName = name.toLowerCase();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(rsoi.filter(s => s.RSOname.toLowerCase().includes(queryName)));
      }, 300);
    });
  }

  export function addStudent(
    newStudent: Students,
    interests: { interest1: string; interest2: string; interest3: string }
  ): void {
    if (!sd.find(s => s.netId === newStudent.netId)) {
      sd.push(newStudent);

      const nextId =
        si.length === 0
          ? "1"
          : (Math.max(...si.map(i => parseInt(i.studentInterestId))) + 1).toString();
  
      const newStudentInterests: Student_Interests = {
        studentInterestId: nextId,
        netId: newStudent.netId,
        interest1: interests.interest1,
        interest2: interests.interest2,
        interest3: interests.interest3,
      };
  
      si.push(newStudentInterests);
    } else {
      console.warn(`Student with ID ${newStudent.netId} already exists.`);
    }
  }
  

  export function deleteStudent(studentId: string): void {
    sd = sd.filter(s => s.netId !== studentId);
    si = si.filter(s => s.netId !== studentId);
  }

  export function addRSO(
    newRSO: RSO,
    interests: { interest1: string; interest2: string; interest3: string }
  ): void {
    if (!rso.find(s => s.RSOName === newRSO.RSOName)) {
      rso.push(newRSO);
  
      // Get the next RSOInterestId as string
      const nextId =
        rsoi.length === 0
          ? "1"
          : (Math.max(...rsoi.map(i => parseInt(i.RSOInterestId))) + 1).toString();
  
      const newRSOInterests: RSO_Interests = {
        RSOInterestId: nextId,
        RSOname: newRSO.RSOName,
        RSOInterest1: interests.interest1,
        RSOInterest2: interests.interest2,
        RSOInterest3: interests.interest3,
      };
  
      rsoi.push(newRSOInterests);
    } else {
      console.warn(`RSO with Name ${newRSO.RSOName} already exists.`);
    }
  }
  

  export function deleteRSO(rsoName: string): void {
    rso = rso.filter(s => s.RSOName !== rsoName);
    rsoi = rsoi.filter(s => s.RSOname !== rsoName);
  }

  export async function updateStudentInterests(netId: string, newInterests: { interest1: string; interest2: string; interest3: string }): Promise<void> {
    const entry = si.find((interest) => interest.netId === netId);
    if (entry) {
      if(!entry.interest1) {
        entry.interest1 = "NA";
      } else {
        entry.interest1 = newInterests.interest1;
      }

      if(!entry.interest2) {
        entry.interest2 = "NA";
      } else {
        entry.interest2 = newInterests.interest2;
      }

      if(!entry.interest3) {
        entry.interest3 = "NA";
      } else {
        entry.interest3 = newInterests.interest3;
      }
    } else {
      console.warn(`No student interests found for netId: ${netId}`);
    }
  }
  
  