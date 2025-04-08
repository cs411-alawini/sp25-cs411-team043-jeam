import express, { Request, Response } from 'express';
import studentsRoutes from './routes/studentsRoutes';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Homepage of my RSO Matcher.');
});

app.use(cors());
app.use("/students", studentsRoutes);

app.listen(PORT, () => {
  console.log(`RSO Matcher is running on http://localhost:${PORT}`);
});
