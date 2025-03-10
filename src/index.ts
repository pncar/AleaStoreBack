import express, { Request, Response } from "express";
import path from 'path';
import dotenv from "dotenv";
import {papu} from "./papu";
import db from "./db/database";
import userRouter from './routes/userRoutes';
import productRouter from './routes/productRoutes';
import categoryRouter from './routes/categoryRoutes';
import authRouter from "./routes/authRoutes";
import orderRouter from "./routes/orderRoutes";
import discountRouter from "./routes/discountRoutes";
import sectionRouter from "./routes/sectionRoutes";
import { errorHandler } from './middleware/errorHandler';
import fs from "fs";

import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";


const cors = require('cors');

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));
console.log("Serving static files from:", path.resolve(__dirname, "..", "uploads"));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // Allow cookies
}));

app.use(express.json());
app.use(cookieParser());

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

app.get("/testarossa",(req: Request, res: Response)=>{
  const cats = fs.readFileSync('seeds/categories.yaml', 'utf8');
  const jcats = JSON.parse(fs.readFileSync('seeds/categories.json', 'utf8'));

  res.status(200).send(jcats);
});

app.use("/auth", authRouter);

app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/orders', orderRouter);
app.use('/discounts', discountRouter);
app.use('/sections', sectionRouter);

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