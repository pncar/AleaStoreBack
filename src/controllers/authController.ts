import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel";

const SECRET = process.env.JWT_SECRET || "your-secret-key";

interface UserT {
  id: number;
  email: string;
  password: string;
}

// bcrypt.hashSync("password", 10)
const mockUsers: UserT[] = [{ id: 1, email: "test@example.com", password: bcrypt.hashSync("password", 1) }];

export const login = async (req: Request, res: Response): Promise<any> => {
    const { id, email, password } = req.body;

    const tempUsers = mockUsers;
    const tempUsers2 = await User.getUsersFull();
    console.log(`Is TempUsers2 an array ? ${Array.isArray(tempUsers2)}`);
    
    const userPool = tempUsers2;
    
    console.log(`${tempUsers[0].password}`);
    console.log(`${(userPool as Array<UserT>)[0].password}`)

    // Check if the user is already logged in
    const authToken = req.cookies.authToken;
    if (authToken) {
        try {
            const decoded = jwt.verify(authToken, SECRET) as JwtPayload;
            return res.json({ message: "Already logged in", email: decoded.email });
        } catch (err) {
            // Invalid token, proceed with login
        }
    }

    // Check if User matches, and decide if invalid or valid

    const directUser = await User.getUserByMail(email);

    console.log("DIRECT USER:");
    console.log(directUser);

    //const user = (userPool as Array<UserT>).find(u => u.email === email);
    const user = directUser;
    if (!user || !bcrypt.compareSync(password, user.password)){// || !bcrypt.compareSync(password, user.password)
      console.log("INVALID CREDENTIALS");
      console.log(user);
      console.log(email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`LOGGED IN USER ${id}, ${email}, ${password}`);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "1h" });
    res.cookie("authToken", token, { httpOnly: true, secure: true }).json({ message: "Logged in" });
};

export const logout = (req: Request, res: Response): any => {
  res.clearCookie("authToken", { httpOnly: true, secure: true }).json({ message: "Logged out" });
};

//Formerly return : Promise<any>
export const protectedRoute = async (req: Request, res: Response) => {
  console.log((req as any).user);
  const user = await User.getUserSessionData((req as any).user.id);
  res.json({ message: `Hello, ${(req as any).user.email}` , user: user || `Couldn't get user ${(req as any).user.id}}` });
};

export const fetchUserData = async (req: Request, res: Response): Promise<any> => {
  const user = await User.getUserSessionData((req as any).user.id);
  //console.log(`TRYING TO FETCH USER ${(req as any).user.id}`);
  if(user){
    res.json({user});
  }else{
    res.json(`Couldn't fetch user ${(req as any).user.id}`);
  }
}