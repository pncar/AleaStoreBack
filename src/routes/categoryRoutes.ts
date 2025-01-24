import { Router } from 'express';
import { getCategories, getCategory } from '../controllers/categoryController';

const userRouter = Router();

userRouter.get('/', getCategories);
userRouter.get('/:id', getCategory);
// userRouter.post('/setParent', setParent);

export default userRouter;