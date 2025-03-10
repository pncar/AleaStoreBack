import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser} from '../controllers/userController';
import { authenticateJWT, verifyIds, verifyRole } from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.get('/', authenticateJWT, verifyRole("admin"), getUsers);
userRouter.get('/:id', authenticateJWT, verifyIds(), getUserById);
userRouter.post('/create', createUser);
userRouter.post('/:id/update', authenticateJWT, verifyRole("admin"), updateUser);
userRouter.post('/:id/delete', authenticateJWT, deleteUser);


export default userRouter;