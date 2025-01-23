import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser} from '../controllers/userController';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/create', createUser);
userRouter.post('/:id/update',updateUser);
userRouter.post('/:id/delete',deleteUser);

export default userRouter;