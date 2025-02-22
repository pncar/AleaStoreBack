import { Router } from 'express';
import { getCategories, getCategory, getCategoriesByTier } from '../controllers/categoryController';

const userRouter = Router();

userRouter.get('/', getCategories);
userRouter.get('/tier/:tier',getCategoriesByTier);
userRouter.get('/:id', getCategory);
// userRouter.post('/setParent', setParent);

export default userRouter;