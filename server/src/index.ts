import express, { Request, Response } from 'express';
import studentsRoutes from './routes/studentsRoutes';
import rsoInterestsRoutes from './routes/rsoInterestsRoutes';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Homepage of my RSO Matcher.');
});

app.use("/students", studentsRoutes);
app.use("/rsos", rsoInterestsRoutes);

app.listen(PORT, () => {
  console.log(`RSO Matcher is running on http://localhost:${PORT}`);
});