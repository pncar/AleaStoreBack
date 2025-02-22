import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser} from '../controllers/userController';
import { authenticateJWT, verifyIds, verifyRole } from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.get('/', verifyRole(), getUsers);
userRouter.get('/:id', authenticateJWT, verifyIds(), getUserById);
userRouter.post('/create', createUser);
userRouter.post('/:id/update', authenticateJWT, updateUser);
userRouter.post('/:id/delete', authenticateJWT, deleteUser);


export default userRouter;