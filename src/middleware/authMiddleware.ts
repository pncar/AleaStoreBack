import { Request, Response, NextFunction } from "express";
import jwt  from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import User from "../models/userModel";
import Order from "../models/orderModel";

const SECRET = process.env.JWT_SECRET || "your-secret-key";


export const authenticateJWT = (req: Request, res: Response, next: NextFunction): any => {
  console.log(req);
  const token = req.cookies.authToken;
  console.log(`TOKEN:`);
  console.log(token);
  if (!token) {
    console.log(`Unauthorized`,jwtDecode(token));
    return res.status(401).json({ message: "Unauthorized" });
  }
  // LOG USER TOKEN console.log(jwtDecode(token));

  //@ts-ignore
  jwt.verify(token, SECRET, (err, decoded) => {
    if(err || !decoded){ 
      console.error(`Invalid token`);
      return res.status(403).json({ message: "Invalid token" }) 
    };
    req.user = decoded;
    console.log(`JWT working as expected`);
    next();
  });
};

export const verifyIds = (checkType:string = "id") => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const id = req.params.id;
    const token = jwt.verify(req.cookies.authToken, SECRET) as { id: string, role: string };
    switch(checkType){
      case "user":
        const u = await Order.getOrderById(id);
        if(token.role !== "admin" && u.user_id !== Number(token.id)){
          return res.status(403).send({ message: `Forbidden`});
        }
      break;
      case "id":
      default:
        if(token.role !== "admin" && Number(id) !== Number(token.id)){
          return res.status(403).send({ message: `Forbidden`});
        }
      break;
    }
    next();
  };
};

export const verifyRole = (role:string = "admin") => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    if(!req.cookies.authToken){
      return res.status(403).send({message: "Unauthorized"});
    }
    const token = jwt.verify(req.cookies.authToken, SECRET) as { id: string};
    const u = await User.getUserById(token.id);
    const role = u[0].role;
    if(role !== "admin"){
      console.log("Shouldn't have access");
      return res.status(403).send({ message: `Forbidden`});
    }
    next();
  };
};