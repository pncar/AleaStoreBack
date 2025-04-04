import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel";

const SECRET = process.env.JWT_SECRET || "your-secret-key";

export const login = async (req: Request, res: Response): Promise<any> => {
    const { id, email, password } = req.body;

    const authToken = req.cookies.authToken;
    if (authToken) {
        try {
            const decoded = jwt.verify(authToken, SECRET) as JwtPayload;
            return res.json({ message: "Already logged in", email: decoded.email });
        } catch (err) {
            // Handle this
        }
    }

    const user = await User.getUserByMail(email);

    if (!user || !bcrypt.compareSync(password, user.password)){// || !bcrypt.compareSync(password, user.password)
      //console.log("INVALID CREDENTIALS");
      //console.log(user);
      //console.log(email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //console.log(`LOGGED IN USER ${id}, ${email}, ${password}`);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "1h" });
    console.log("TOKEN: ");
    console.log(token);
    //res.cookie("authToken", token, { httpOnly: true, secure: true }).json({ message: "Logged in" });
    res.cookie("authToken", token, { httpOnly: false, secure: false}).json({message: `Logged in`});
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie("authToken", { httpOnly: true, secure: true }).json({ message: "Logged out" });
};

export const protectedRoute = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized: No user session" });
    return;
  }
  const user = await User.getUserSessionData(req.user.id);
  res.json({ message: `Hello, ${req.user.email}` , user: user || `Couldn't get user ${req.user.id}}` });
};

export const fetchUserData = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized: No user session" });
    return;
  }
  const user = await User.getUserSessionData(req.user.id);
  if(user){
    res.json({user});
  }else{
    res.json(`Couldn't fetch user ${req.user.id}`);
  }
}