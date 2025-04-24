import { Router, Request, Response } from "express";
import { getAllStudents, getStudentByName, addStudent, deleteStudent, updateStudentInterests } from "../services/database";
import { Students } from "../students";

const router = Router();

// students?search=Christopher Liu
router.get("/", async (req: Request, res: Response) => {
  console.log("Searching For Students");
  if (!req.query.search) {
    try {
      const allStudents: Students[] = await getAllStudents();
      res.status(200).json(allStudents);
    } catch (error) {
      res.status(500).json({ message: "Error fetching Student" });
    }
  } else {
    const query = req.query.search as string;
    try {
      const student = await getStudentByName(query);
      console.log("Got here");
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ message: "Error fetching Student" });
    }
  }
});

// POST /students
router.post("/", (req: Request, res: Response) => {
  const student: Students = req.body.student;
  const interests = req.body.interests; // { interest1, interest2, interest3 }

  if (!student || !interests) {
    res.status(400).json({ message: "Student and interests required" });
  }

  try {
    addStudent(student, interests);
    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding student" });
  }
});

// DELETE /students/:netId
router.delete("/:netId", (req: Request, res: Response) => {
  const netId = req.params.netId;

  if (!netId) {
    res.status(400).json({ message: "netId is required" });
  }

  try {
    deleteStudent(netId); 
    res.status(200).json({ message: `Student ${netId} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: "Error deleting student" });
  }
});

// PUT /students/:netId/interests
router.put("/:netId/interests", async (req: Request, res: Response) => {
  const netId = req.params.netId;
  const { interest1, interest2, interest3 } = req.body;

  if (!interest1 || !interest2 || !interest3) {
    res.status(400).json({ message: "All three interests are required" });
  }

  try {
    await updateStudentInterests(netId, { interest1, interest2, interest3 });
    res.status(200).json({ message: "Interests updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating interests" });
  }
});

export default router;