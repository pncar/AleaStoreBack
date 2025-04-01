import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser} from '../controllers/userController';
import { authenticateJWT, verifyIds, verifyRole } from "../middleware/authMiddleware";
import { validateUser, validateSectionUpdate } from "../middleware/validations";

const userRouter = Router();

userRouter.get('/', authenticateJWT, verifyRole("admin"), getUsers);
userRouter.get('/:id', authenticateJWT, verifyIds(), getUserById);
userRouter.post('/', validateUser, createUser);
userRouter.patch('/:id/', authenticateJWT, verifyIds(), validateSectionUpdate, updateUser);
userRouter.delete('/:id/', authenticateJWT, deleteUser);


export default userRouter;