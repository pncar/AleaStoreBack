import express from "express";
import { login, logout, protectedRoute, fetchUserData } from "../controllers/authController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/protected", authenticateJWT, protectedRoute);
router.post("/fetch-user", authenticateJWT, fetchUserData);

export default router;