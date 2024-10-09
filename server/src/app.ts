import express, { Request, Response, Application } from 'express';
import authRoutes from './routes/auth.routes';
import cors from 'cors';

const app: Application = express();

// Middleware (si tienes alguno)
app.use(express.json());
app.use(cors());
// Define tus rutas
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from app.ts!');
});

app.use('/api/auth', authRoutes);

// Puedes agregar más rutas aquí
// app.use('/api/users', usersRouter);

export default app;
