import express, { Request, Response } from "express";
import dotenv from "dotenv";
import {papu} from "./papu";
import db from "./db/database";
import userRouter from './routes/userRoutes';
import productRouter from './routes/productRoutes';
import categoryRouter from './routes/categoryRoutes';
import { errorHandler } from './middleware/errorHandler';

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => { 
  res.status(200).send(`Hello`);
}); 

app.get("/hello/:name", (req: Request, res: Response) => {
  const {name} = req.params;
  res.status(200).send(`${papu} ${name}`);
});

app.get('/test-error', (req: Request, res: Response) => {
  throw new Error('This is a simulated error!');
});

app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);

app.use(errorHandler); // After routes, before listen

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});

async function testConnection() {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log('Connected to MySQL. Test Query Result:', rows);
  } catch (error) {
    console.error('MySQL connection error:', error);
  }
}