import express, { Request, Response, NextFunction } from "express";
import path from 'path';
import dotenv from "dotenv";
import storeInfoRouter from "./routes/storeRoutes";
import userRouter from './routes/userRoutes';
import productRouter from './routes/productRoutes';
import categoryRouter from './routes/categoryRoutes';
import authRouter from "./routes/authRoutes";
import orderRouter from "./routes/orderRoutes";
import discountRouter from "./routes/discountRoutes";
import sectionRouter from "./routes/sectionRoutes";
import { errorHandler } from './middleware/errorHandler';
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import specs from "./swagger/swagger";
import fs from "fs";
import yaml from "yaml";

const cors = require('cors');
const morgan = require('morgan');


dotenv.config();
const app = express();

const PORT = process.env.PORT;


app.use(morgan(':method :url :status :res[content-length] - :response-time ms',{
  skip: (req:Request, res:Response) => res.statusCode === 304,
}));

const loadDocumentation = () => {
  const docRaw = fs.readFileSync("./src/swagger/documentation.yaml", "utf-8");
  return yaml.parse(docRaw);
};

let documentation = loadDocumentation();

fs.watchFile("./src/swagger/documentation.yaml", () => {
  console.log("Reloading API documentation...");
  documentation = loadDocumentation();
});

//app.use("/api-docs/",swaggerUI.serve,swaggerUI.setup(specs));

app.use("/api-docs/", swaggerUI.serve, async (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore Don't know other way
  return swaggerUI.setup(loadDocumentation(), { cacheControl: false })(req, res, next);
});

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));
//console.log("Serving static files from:", path.resolve(__dirname, "..", "uploads"));

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get("/api/", (req: Request, res: Response) => { 
  res.status(200).send(`MyStore`);
}); 

app.use("/api/auth", authRouter);

app.use('/api/store', storeInfoRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/api/discounts', discountRouter);
app.use('/api/sections', sectionRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(errorHandler); // After Routes, Before Listen


app.listen(Number(PORT), "0.0.0.0", () => { 
  console.log("Server running at PORT: ", PORT || 3000); 
}).on("error", (error) => {
  throw new Error(error.message);
});
