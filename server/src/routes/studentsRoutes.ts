import { Router, Request, Response } from "express";
import { getAllStudents, getStudentByName } from "../services/database";
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

export default router;