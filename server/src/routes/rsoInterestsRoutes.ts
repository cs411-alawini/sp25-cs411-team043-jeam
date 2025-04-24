import { Router, Request, Response } from "express";
import { getAllRSOS, getRSOByName, addRSO, deleteRSO } from "../services/database";
import { RSO_Interests } from "../rso_interest";
import { RSO } from "../rso";


const router = Router();

// GET
// rsos?search=Christopher Liu
router.get("/", async (req: Request, res: Response) => {
  console.log("Searching For RSOs");
  if (!req.query.search) {
    try {
      const allRSOs: RSO_Interests[] = await getAllRSOS();
      res.status(200).json(allRSOs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching RSO" });
    }
  } else {
    const query = req.query.search as string;
    try {
      const rso = await getRSOByName(query);
      console.log("Got here");
      res.status(200).json(rso);
    } catch (error) {
      res.status(500).json({ message: "Error fetching RSO" });
    }
  }
});

// POST /rsos
router.post("/", (req: Request, res: Response) => {
    const rso: RSO = req.body.rso;
    const interests = req.body.interests; // { interest1, interest2, interest3 }
  
    if (!rso || !interests) {
      res.status(400).json({ message: "RSO and interests required" });
    }
  
    try {
      addRSO(rso, interests);
      res.status(201).json({ message: "RSO added successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error adding RSO" });
    }
  });

  // DELETE /rsos/:id - Delete RSO
router.delete("/:name", async (req: Request, res: Response) => {
    const rsoName = req.params.name;
    if (!rsoName) {
        res.status(400).json({ message: "RSO Name is required" });
      }
    try {
      await deleteRSO(rsoName);
      res.status(200).json({ message: "RSO ${rsoName} deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting RSO" });
    }
  });

export default router;