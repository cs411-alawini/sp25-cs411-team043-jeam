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

  export const searchStudentData = (query: string): Promise<Student[]> => {
    return httpClient
    .get("http://localhost:3007/students", {
      params: { search: query },
    })
    .then((response) => response.data);
  };

  export const searchRSOData = (query: string): Promise<RSOInterest[]> => {
    return httpClient
    .get("http://localhost:3007/rsos", {
      params: { search: query },
    })
    .then((response) => response.data);
  };

  export const deleteStudent = async (netId: string): Promise<void> => {
    try {
        await fetch(`http://localhost:3007/students/${netId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
};


interface SimilarStudent {
  netId: string;
  name: string;
  year: number;
  major: string;
  minor: string;
  common_interests: string[];
  match_score: number;
}

export const findSimilarStudents = async (netId: string): Promise<SimilarStudent[]> => {
  try {
    const response = await httpClient.get(`/students/${netId}/similar`);
    return response.data;
  } catch (error) {
    console.error('Error finding similar students:', error);
    throw error;
  }
};