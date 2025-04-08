import fs from "fs";
import path from "path";
// import { parse } from "csv-parse";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3007';

export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔹 Define your types here
type Student = {
  netId: string;
  name: string;
  year: number;
  minor: string;
  major: string;
  taggedPref: string;
  prefTimeComm: string;
};

type StudentInterest = {
  studentInterestId: string;
  netId: string;
  interest1: string;
  interest2: string;
  interest3: string;
};

type Department = {
  departmentName: string;
  mainOfficeLocation: string;
  numberOfStudents: number;
};

type RSO = {
  RSOName: string;
  department: string;
  expTimeComm: string;
  taggedPref: string;
};

type RosterEntry = {
  netId: string;
  RSO_name: string;
};

type RSOInterest = {
  RSOInterestId: string;
  RSOname: string;
  RSOInterest1: string;
  RSOInterest2: string;
  RSOInterest3: string;
};

// 🔹 CSV parser
// const parseCSV = <T>(filePath: string): Promise<T[]> => {
//   return new Promise((resolve, reject) => {
//     const records: T[] = [];
//     fs.createReadStream(filePath)
//       .pipe(parse({ columns: true, trim: true }))
//       .on("data", (row: T) => records.push(row))
//       .on("end", () => resolve(records))
//       .on("error", reject);
//   });
// };

// export const loadData = async () => {
//     const basePath = path.join(__dirname, "../data");
  
//     const students = await parseCSV<Student>(path.join(basePath, "Students.csv"));
//     const studentInterests = await parseCSV<StudentInterest>(path.join(basePath, "Student_Interests.csv"));
//     const departments = await parseCSV<Department>(path.join(basePath, "Departments.csv"));
//     const rsos = await parseCSV<RSO>(path.join(basePath, "RSOs.csv"));
//     const roster = await parseCSV<RosterEntry>(path.join(basePath, "Roster.csv"));
//     const rsoInterests = await parseCSV<RSOInterest>(path.join(basePath, "RSO_Interests.csv"));
  
//     return {
//       students,
//       studentInterests,
//       departments,
//       rsos,
//       roster,
//       rsoInterests
//     };
//   };

// let sd: Student[] = [];

// (async () => {
//   const {
//     students,
//     rsos,
//     studentInterests,
//     departments,
//     roster,
//     rsoInterests
//   } = await loadData();

//   console.log("Loaded", students.length, "students");

//   // const dd: Departments[] = departments
//   // const rd: Roster[] = roster
//   // const rid: RSO_Interests[] = rsoInterests
//   // const rsod: RSO[] = rsos
//   // const sid: Student_Interests[] = studentInterests
//   sd = students

// })();

  export const searchStudentData = (query: string): Promise<Student[]> => {
    return httpClient
    .get("http://localhost:3007/students", {
      params: { search: query },
    })
    .then((response) => response.data);
  };