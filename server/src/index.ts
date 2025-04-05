import express, { Request, Response } from 'express';

const app = express();
const PORT = 3007;

app.use(express.json());

app.get('/api/', (req: Request, res: Response) => {
  res.send('Homepage of my RSO Matcher.');
});

app.listen(PORT, () => {
  console.log(`RSO Matcher is running on http://localhost:${PORT}`);
});
