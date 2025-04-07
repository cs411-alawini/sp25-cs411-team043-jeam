import express, { Request, Response } from 'express';
import studentsRoutes from './routes/studentsRoutes';

const app = express();
const PORT = 3007;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Homepage of my RSO Matcher.');
});

app.use("/students", studentsRoutes);

app.listen(PORT, () => {
  console.log(`RSO Matcher is running on http://localhost:${PORT}`);
});
