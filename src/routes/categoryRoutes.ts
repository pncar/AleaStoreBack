import { Router } from 'express';
import { getCategories, getCategory, setParent } from '../controllers/categoryController';

const userRouter = Router();

userRouter.get('/', getCategories);
userRouter.get('/:id', getCategory);
userRouter.post('/setParent', setParent);

export default userRouter;