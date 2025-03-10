import { Router } from 'express';
import { getCategories, getCategory, getCategoriesByTier, getCategoriesByProduct, getChildrenCategories, createCategory, deleteCategory } from '../controllers/categoryController';

const userRouter = Router();

userRouter.get('/', getCategories);
userRouter.get('/tier/:tier',getCategoriesByTier);
userRouter.get('/product/:productId',getCategoriesByProduct);
userRouter.get('/:parent/children',getChildrenCategories);
userRouter.get('/:id', getCategory);
userRouter.post('/create', createCategory);
userRouter.post('/:id/delete',deleteCategory);
// userRouter.post('/setParent', setParent);

export default userRouter;